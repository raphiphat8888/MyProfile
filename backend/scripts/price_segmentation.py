"""Create price segments from the products stored in Cloud MySQL.

Run from backend after opening the SSH tunnel:
    python scripts/price_segmentation.py --clusters 4
"""

from __future__ import annotations

import argparse
import json
import os
from pathlib import Path
from urllib.request import urlopen

import numpy as np
import pandas as pd
import pymysql
from dotenv import load_dotenv
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler


STRATEGIES = {
    3: [
        ("Economy", "รักษาราคาให้แข่งขันได้ และใช้โปรโมชันกระตุ้นยอดขาย"),
        ("Standard", "เน้นกำไรสมดุล พร้อม bundle หรือส่วนลดตามช่วงเวลา"),
        ("Premium", "สื่อสารคุณค่า รักษาภาพลักษณ์ และลดการลดราคาโดยไม่จำเป็น"),
    ],
    4: [
        ("Entry", "ใช้เป็นสินค้าดึงลูกค้าและควบคุมราคาให้แข่งขันได้"),
        ("Value", "เน้นความคุ้มค่าและจัดโปรโมชันเพื่อเพิ่ม conversion"),
        ("Core", "รักษาราคาและกำไร เป็นกลุ่มสินค้าหลักของธุรกิจ"),
        ("Premium", "สื่อสารคุณค่าและความแตกต่าง หลีกเลี่ยงส่วนลดสูง"),
    ],
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--clusters", type=int, choices=(3, 4), default=4)
    parser.add_argument("--output", default="price_segments_result.csv")
    parser.add_argument(
        "--source",
        choices=("api", "mysql"),
        default="api",
        help="Read from the Cloud API (recommended) or connect to MySQL directly.",
    )
    parser.add_argument(
        "--no-log",
        action="store_true",
        help="Do not use log1p even when the price distribution is strongly skewed.",
    )
    return parser.parse_args()


def load_products_from_api() -> pd.DataFrame:
    env_path = Path(__file__).resolve().parents[1] / ".env"
    load_dotenv(env_path)
    api_url = os.getenv("PRICE_SEGMENTATION_API_URL", "http://119.59.102.161:3037/api/products")

    try:
        with urlopen(api_url, timeout=15) as response:
            payload = json.load(response)
    except Exception as error:
        raise RuntimeError(
            f"Could not read Cloud API at {api_url}. Check that the cloud backend is running."
        ) from error

    if not isinstance(payload, list):
        raise ValueError("Cloud API did not return a product list.")
    return pd.DataFrame(payload)[["id", "name", "price"]].rename(
        columns={"id": "product_id", "name": "product_name"}
    )


def load_products_from_mysql() -> pd.DataFrame:
    env_path = Path(__file__).resolve().parents[1] / ".env"
    load_dotenv(env_path)

    required = ("DB_HOST", "DB_PORT", "DB_USER", "DB_PASSWORD", "DB_NAME")
    missing = [name for name in required if not os.getenv(name)]
    if missing:
        raise RuntimeError(f"Missing database settings in {env_path}: {', '.join(missing)}")

    query = """
        SELECT id AS product_id, name AS product_name, price
        FROM products
        WHERE is_active = 1
        ORDER BY id
    """
    connection = pymysql.connect(
        host=os.environ["DB_HOST"],
        port=int(os.environ["DB_PORT"]),
        user=os.environ["DB_USER"],
        password=os.environ["DB_PASSWORD"],
        database=os.environ["DB_NAME"],
        charset="utf8mb4",
        cursorclass=pymysql.cursors.DictCursor,
        connect_timeout=10,
    )
    try:
        return pd.read_sql(query, connection)
    finally:
        connection.close()


def prepare_prices(products: pd.DataFrame) -> tuple[pd.DataFrame, pd.Series]:
    prepared = products.copy()
    prepared["price"] = pd.to_numeric(prepared["price"], errors="coerce")
    prepared = prepared.dropna(subset=["price"])
    prepared = prepared[prepared["price"] > 0].copy()
    if prepared.empty:
        raise ValueError("No active products with a positive numeric price were found.")

    skewness = prepared["price"].skew()
    return prepared, skewness


def build_segments(products: pd.DataFrame, cluster_count: int, use_log: bool) -> tuple[pd.DataFrame, pd.DataFrame]:
    if len(products) < cluster_count:
        raise ValueError(f"Need at least {cluster_count} valid products, found {len(products)}.")

    prices = products[["price"]].to_numpy(dtype=float)
    transformed = np.log1p(prices) if use_log else prices
    scaled = StandardScaler().fit_transform(transformed)

    model = KMeans(n_clusters=cluster_count, random_state=42, n_init=20)
    products = products.copy()
    products["cluster"] = model.fit_predict(scaled)

    centroid_transformed = model.cluster_centers_.reshape(-1, 1)
    scaler = StandardScaler().fit(transformed)
    centroid_values = scaler.inverse_transform(centroid_transformed).ravel()
    if use_log:
        centroid_values = np.expm1(centroid_values)

    ordered_clusters = np.argsort(centroid_values)
    names = STRATEGIES[cluster_count]
    cluster_to_segment = {
        cluster: {"name": names[index][0], "strategy": names[index][1], "centroid": float(centroid_values[cluster])}
        for index, cluster in enumerate(ordered_clusters)
    }
    products["segment"] = products["cluster"].map(lambda cluster: cluster_to_segment[cluster]["name"])

    summary = (
        products.groupby("segment", as_index=False)
        .agg(
            product_count=("product_id", "count"),
            min_price=("price", "min"),
            max_price=("price", "max"),
            median_price=("price", "median"),
        )
    )
    summary["centroid"] = summary["segment"].map(
        {details["name"]: details["centroid"] for details in cluster_to_segment.values()}
    )
    summary["recommended_strategy"] = summary["segment"].map(
        {details["name"]: details["strategy"] for details in cluster_to_segment.values()}
    )
    summary["segment_order"] = summary["centroid"]
    summary = summary.sort_values("segment_order").drop(columns="segment_order")
    return products, summary


def main() -> None:
    args = parse_args()
    products = load_products_from_api() if args.source == "api" else load_products_from_mysql()
    products, skewness = prepare_prices(products)
    use_log = not args.no_log and bool(skewness > 1)
    segmented, summary = build_segments(products, args.clusters, use_log)

    output_path = Path(args.output)
    segmented.to_csv(output_path, index=False)
    summary.to_csv(output_path.with_name(f"{output_path.stem}_summary.csv"), index=False)

    print(f"Loaded {len(segmented)} products from Cloud MySQL")
    print(f"Price skewness: {skewness:.3f}; log1p used: {use_log}")
    print(f"Saved product-level results to {output_path}")
    print("\nPrice segment summary:")
    print(summary.to_string(index=False, formatters={
        "min_price": "{:.2f}".format,
        "max_price": "{:.2f}".format,
        "median_price": "{:.2f}".format,
        "centroid": "{:.2f}".format,
    }))


if __name__ == "__main__":
    main()