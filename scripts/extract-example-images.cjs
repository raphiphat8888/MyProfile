const fs = require('fs');
const path = require('path');
const { PDFParse } = require('C:/tmp/pdf-tools/node_modules/pdf-parse');

const input = 'C:/Users/takt/Downloads/นายศุภสิน หนองใหญ่ Display the Top and Bottom Navigation Menus.pdf';
const output = path.resolve(__dirname, '..', 'docs', 'uizard-reference');

(async () => {
  fs.mkdirSync(output, { recursive: true });
  const parser = new PDFParse({ data: fs.readFileSync(input) });
  const result = await parser.getImage({ partial: [8, 9, 10, 11, 12], imageThreshold: 120 });
  for (const [pageIndex, page] of result.pages.entries()) {
    page.images.forEach((image, index) => {
      fs.writeFileSync(path.join(output, `page-${pageIndex + 8}-image-${index + 1}.png`), image.data);
    });
  }
  await parser.destroy();
  console.log(`Extracted ${result.pages.reduce((sum, page) => sum + page.images.length, 0)} images`);
})();
