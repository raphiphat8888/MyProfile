# Cloud deploy guide for `ip_std6730202386`

This guide shows how to connect the Expo app to your cloud MySQL + PHP/Node backend.

## 1) Import the SQL schema

Open phpMyAdmin for your database:

`http://119.59.102.161/nindamdb`

Then:

1. Click database `ip_std6730202386`
2. Open the `Import` tab
3. Import these files in order:
   - `backend/database/schema.sql`
   - `backend/database/seed-products-from-json.sql`
   - `backend/database/seed-profile-from-json.sql`
   - `backend/database/seed-auth-users.sql`
   - `backend/database/seed-all.sql` (optional demo admin/customer accounts and order history)

If tables already exist, the `seed-all.sql` file is safe to run again because it uses `ON DUPLICATE KEY UPDATE`.
If you only want the catalog/profile from the old JSON, import `seed-products-from-json.sql` and `seed-profile-from-json.sql`, then skip `seed-all.sql`.

Default login accounts from `seed-auth-users.sql`:

- Admin: `admin@pokemon-takt.shop` / `Admin@1234`
- User: `user@pokemon-takt.shop` / `User@1234`

The JSON migration seed files move:

- `products.json` -> `categories` and `products`
- `data/profile.json` -> `app_profiles`, `profile_links`, `profile_skill_groups`, and `profile_skill_items`

## 2) Configure backend environment

Create `backend/.env` on the server with values like:

```env
NODE_ENV=production
PORT=3037
DB_HOST=localhost
DB_PORT=3306
DB_USER=std6730202386
DB_PASSWORD=your_database_password_here
DB_NAME=ip_std6730202386
DB_CONNECTION_LIMIT=10
JWT_SECRET=replace_with_a_long_random_secret_at_least_32_characters
JWT_EXPIRES_IN=8h
CORS_ORIGINS=*
LOW_STOCK_THRESHOLD=5
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=200
```

## 3) Run the backend

From the backend folder:

```bash
npm install
npm start
```

The API should listen on:

`http://119.59.102.161:3037`

## 4) Point the Expo app to the API

Set this in Expo env or your local `.env`:

```env
EXPO_PUBLIC_API_URL=http://119.59.102.161:3037
```

Then restart Expo so it picks up the new env value.

## 5) Verify endpoints

Try these URLs in a browser or curl:

- `http://119.59.102.161:3037/api/health`
- `http://119.59.102.161:3037/api/products`
- `http://119.59.102.161:3037/api/categories`
- `http://119.59.102.161:3037/api/profile`

For command-line imports on a server with `backend/.env` configured:

```bash
npm run seed:json
```

## 6) What the app uses

- Shop screen → `/api/products`
- Category filters → `/api/categories`
- Profile/Admin screen → `/api/profile`
- Orders / cart flows → `/api/orders`

## 7) If something does not show up

Check these first:

- Database name is exactly `ip_std6730202386`
- `DB_USER` and `DB_PASSWORD` are correct
- Port `3037` is open
- `EXPO_PUBLIC_API_URL` is set and Expo restarted
- `products` rows have `is_active = 1`
