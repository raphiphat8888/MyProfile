const fs = require('fs');
const path = require('path');
const { PDFParse } = require('C:/tmp/pdf-tools/node_modules/pdf-parse');

(async () => {
  const input = path.resolve(__dirname, '..', 'docs', 'Raphiphat-Navigation-Report-QA.pdf');
  const output = path.resolve(__dirname, '..', 'docs', 'report-qa');
  fs.mkdirSync(output, { recursive: true });
  const parser = new PDFParse({ data: fs.readFileSync(input) });
  const result = await parser.getScreenshot({ desiredWidth: 850 });
  result.pages.forEach((page, index) => fs.writeFileSync(path.join(output, `page-${index + 1}.png`), page.data));
  await parser.destroy();
  console.log(`${result.pages.length} pages`);
})();
