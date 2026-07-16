const fs = require('fs');
const path = require('path');
const {
  AlignmentType,
  BorderStyle,
  Document,
  Footer,
  HeadingLevel,
  HyperlinkType,
  Packer,
  PageBreak,
  PageNumber,
  Paragraph,
  ShadingType,
  TextRun,
} = require('C:/tmp/pdf-tools/node_modules/docx');

const root = path.resolve(__dirname, '..');
const sourcePath = path.join(root, 'docs', 'navigation-report-draft.md');
const outputDir = path.join(root, 'output', 'documents');
const outputPath = path.join(outputDir, 'Raphiphat-Navigation-Report.docx');
const lines = fs.readFileSync(sourcePath, 'utf8').split(/\r?\n/);

const BLUE = '2563EB';
const NAVY = '172033';
const MUTED = '5F6C82';
const BORDER = 'DCE4F0';
const CODE_FILL = 'F3F6FA';
const YELLOW = 'F5C518';

function run(text, options = {}) {
  return new TextRun({
    text,
    font: options.code ? 'Consolas' : 'Tahoma',
    size: options.size || (options.code ? 18 : 22),
    color: options.color || NAVY,
    bold: options.bold,
    italics: options.italics,
  });
}

function bodyParagraph(text) {
  const parts = [];
  const regex = /(`[^`]+`|https?:\/\/\S+)/g;
  let cursor = 0;
  for (const match of text.matchAll(regex)) {
    if (match.index > cursor) parts.push(run(text.slice(cursor, match.index)));
    const value = match[0];
    parts.push(run(value.replaceAll('`', ''), {
      code: value.startsWith('`'),
      color: value.startsWith('http') ? BLUE : NAVY,
      bold: value.startsWith('`'),
    }));
    cursor = match.index + value.length;
  }
  if (cursor < text.length) parts.push(run(text.slice(cursor)));
  return new Paragraph({
    children: parts,
    spacing: { after: 120, line: 300 },
  });
}

function heading(text, level) {
  const sizes = { 1: 34, 2: 30, 3: 26 };
  return new Paragraph({
    heading: level === 1 ? HeadingLevel.HEADING_1 : level === 2 ? HeadingLevel.HEADING_2 : HeadingLevel.HEADING_3,
    children: [run(text, { size: sizes[level], bold: true, color: level === 1 ? BLUE : NAVY })],
    spacing: { before: level === 1 ? 320 : 240, after: 140 },
    border: level === 1 ? { bottom: { style: BorderStyle.SINGLE, size: 12, color: YELLOW, space: 7 } } : undefined,
    keepNext: true,
  });
}

function codeParagraph(codeLines) {
  return new Paragraph({
    children: codeLines.map((line, index) => run(`${index ? '\n' : ''}${line}`, { code: true, color: '23324A' })),
    spacing: { before: 80, after: 160, line: 260 },
    indent: { left: 220, right: 220 },
    shading: { type: ShadingType.CLEAR, fill: CODE_FILL, color: 'auto' },
    border: {
      left: { style: BorderStyle.SINGLE, size: 20, color: BLUE, space: 8 },
      top: { style: BorderStyle.SINGLE, size: 4, color: BORDER, space: 8 },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: BORDER, space: 8 },
      right: { style: BorderStyle.SINGLE, size: 4, color: BORDER, space: 8 },
    },
  });
}

const children = [
  new Paragraph({ spacing: { before: 1500, after: 180 }, alignment: AlignmentType.CENTER, children: [run('DISPLAY THE TOP AND BOTTOM', { size: 42, bold: true, color: BLUE })] }),
  new Paragraph({ spacing: { after: 420 }, alignment: AlignmentType.CENTER, children: [run('NAVIGATION MENUS', { size: 42, bold: true, color: NAVY })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 120 }, children: [run('รายงานการออกแบบและวิเคราะห์เมนูนำทาง', { size: 28, bold: true })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 700 }, children: [run('Raphi Card Shop และ Inventor.io', { size: 24, color: MUTED })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [run('นายรพีภัทร แสนกล้า', { size: 28, bold: true })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [run('รหัสนิสิต 673020236', { size: 24 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 520 }, children: [run('GitHub: github.com/raphiphat8888', { size: 20, color: BLUE })] }),
  new Paragraph({ children: [new PageBreak()] }),
];

let inCode = false;
let codeLines = [];
let skippedTitle = false;
for (const line of lines) {
  if (line.startsWith('```')) {
    if (inCode) {
      children.push(codeParagraph(codeLines));
      codeLines = [];
    }
    inCode = !inCode;
    continue;
  }
  if (inCode) {
    codeLines.push(line);
    continue;
  }
  if (!skippedTitle && line.startsWith('# ')) {
    skippedTitle = true;
    continue;
  }
  if (line.startsWith('**นายรพีภัทร') || line.startsWith('GitHub:')) continue;
  if (line.startsWith('### ')) children.push(heading(line.slice(4), 3));
  else if (line.startsWith('## ')) {
    if (children.length > 10) children.push(new Paragraph({ children: [new PageBreak()] }));
    children.push(heading(line.slice(3), 1));
  } else if (line.startsWith('# ')) children.push(heading(line.slice(2), 1));
  else if (/^\*\*.+\*\*$/.test(line)) {
    children.push(new Paragraph({ children: [run(line.slice(2, -2), { bold: true, color: BLUE })], spacing: { before: 100, after: 80 }, keepNext: true }));
  } else if (line.trim()) children.push(bodyParagraph(line));
}

const doc = new Document({
  creator: 'นายรพีภัทร แสนกล้า',
  title: 'Display the Top and Bottom Navigation Menus',
  description: 'รายงานการออกแบบและวิเคราะห์เมนูนำทางของ Raphi Card Shop และ Inventor.io',
  styles: {
    default: { document: { run: { font: 'Tahoma', size: 22, color: NAVY }, paragraph: { spacing: { after: 120, line: 300 } } } },
    paragraphStyles: [
      { id: 'Normal', name: 'Normal', basedOn: 'Normal', next: 'Normal', run: { font: 'Tahoma', size: 22, color: NAVY }, paragraph: { spacing: { after: 120, line: 300 } } },
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { font: 'Tahoma', size: 34, bold: true, color: BLUE }, paragraph: { spacing: { before: 360, after: 160 }, keepNext: true } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { font: 'Tahoma', size: 30, bold: true, color: NAVY }, paragraph: { spacing: { before: 280, after: 140 }, keepNext: true } },
      { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { font: 'Tahoma', size: 26, bold: true, color: NAVY }, paragraph: { spacing: { before: 240, after: 120 }, keepNext: true } },
    ],
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1080, right: 1080, bottom: 1080, left: 1080, header: 600, footer: 600 },
      },
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.RIGHT,
          border: { top: { style: BorderStyle.SINGLE, size: 4, color: BORDER, space: 6 } },
          children: [run('Navigation Report  |  ', { size: 18, color: MUTED }), new TextRun({ children: [PageNumber.CURRENT], font: 'Tahoma', size: 18, color: MUTED })],
        })],
      }),
    },
    children,
  }],
});

fs.mkdirSync(outputDir, { recursive: true });
Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(outputPath, buffer);
  console.log(outputPath);
});
