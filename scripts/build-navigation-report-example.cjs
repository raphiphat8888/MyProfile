const fs = require('fs');
const path = require('path');
const {
  AlignmentType, BorderStyle, Document, Footer, ImageRun, Packer, PageBreak,
  PageNumber, Paragraph, ShadingType, Table, TableCell, TableRow, TextRun,
  VerticalAlign, WidthType,
} = require('C:/tmp/pdf-tools/node_modules/docx');

const root = path.resolve(__dirname, '..');
const out = path.join(root, 'output', 'documents', 'Raphiphat-Navigation-Report.docx');
const BLUE = '2563EB', NAVY = '172033', GRAY = '5F6C82', LINE = 'D9E2F0', PALE = 'F4F7FB', YELLOW = 'F5C518';

const text = (value, o = {}) => new TextRun({ text: value, font: o.code ? 'Consolas' : 'Tahoma', size: o.size || (o.code ? 17 : 21), bold: o.bold, color: o.color || NAVY, break: o.break });
const para = (value, o = {}) => new Paragraph({ children: [text(value, o)], alignment: o.align || AlignmentType.LEFT, spacing: { before: o.before || 0, after: o.after ?? 100, line: o.line || 280 }, keepNext: o.keepNext });
const h1 = (value) => new Paragraph({ children: [text(value, { size: 32, bold: true, color: BLUE })], spacing: { before: 100, after: 140 }, border: { bottom: { style: BorderStyle.SINGLE, size: 10, color: YELLOW, space: 6 } }, keepNext: true });
const h2 = (value) => new Paragraph({ children: [text(value, { size: 25, bold: true })], spacing: { before: 100, after: 100 }, keepNext: true });
const pageBreak = () => new Paragraph({ children: [new PageBreak()] });
const code = (value) => new Paragraph({ children: value.split('\n').map((line, i) => text(`${i ? '\n' : ''}${line}`, { code: true, color: '26364F' })), shading: { type: ShadingType.CLEAR, fill: PALE }, border: { left: { style: BorderStyle.SINGLE, size: 16, color: BLUE, space: 6 } }, indent: { left: 120, right: 100 }, spacing: { after: 110, line: 240 } });

function image(file, width, height) {
  return new Paragraph({ alignment: AlignmentType.CENTER, children: [new ImageRun({ data: fs.readFileSync(file), transformation: { width, height }, type: 'png' })], spacing: { after: 80 } });
}

function cell(children, width, fill = 'FFFFFF') {
  return new TableCell({ children, width: { size: width, type: WidthType.DXA }, verticalAlign: VerticalAlign.TOP, shading: { type: ShadingType.CLEAR, fill }, margins: { top: 120, bottom: 120, left: 140, right: 140 }, borders: { top: { style: BorderStyle.SINGLE, size: 4, color: LINE }, bottom: { style: BorderStyle.SINGLE, size: 4, color: LINE }, left: { style: BorderStyle.SINGLE, size: 4, color: LINE }, right: { style: BorderStyle.SINGLE, size: 4, color: LINE } } });
}

function codeImagePage(title, description, snippets, screenshot, imageSize = [245, 530]) {
  return [h1(title), para(description, { color: GRAY, after: 140 }), new Table({ width: { size: 9360, type: WidthType.DXA }, columnWidths: [5450, 3910], rows: [new TableRow({ children: [cell([para('code', { bold: true, color: BLUE }), ...snippets], 5450), cell([para('รูป', { bold: true, color: BLUE, align: AlignmentType.CENTER }), image(screenshot, ...imageSize)], 3910)] })] }), pageBreak()];
}

function analysisPage(title, paragraphs, figures) {
  const children = [h1(title), ...paragraphs.map((p) => para(p, { line: 300, after: 130 }))];
  if (figures.length === 1) children.push(image(figures[0].file, figures[0].w, figures[0].h));
  else children.push(new Table({ width: { size: 9360, type: WidthType.DXA }, columnWidths: [4680, 4680], rows: [new TableRow({ children: figures.map((f) => cell([image(f.file, f.w, f.h)], 4680)) })] }));
  children.push(pageBreak());
  return children;
}

const own = (name) => path.join(root, 'docs', name);
const ui = (name) => path.join(root, 'docs', 'uizard-reference', name);
const children = [
  para('นายรพีภัทร แสนกล้า 673020236', { align: AlignmentType.RIGHT, size: 20, color: GRAY, after: 700 }),
  para('Display the Top and Bottom', { align: AlignmentType.CENTER, size: 40, bold: true, color: BLUE, after: 80 }),
  para('Navigation Menus', { align: AlignmentType.CENTER, size: 40, bold: true, after: 320 }),
  para('ส่วนหน้าเว็บแอปพลิเคชันของผม', { align: AlignmentType.CENTER, size: 28, bold: true, after: 120 }),
  para('Raphi Card Shop', { align: AlignmentType.CENTER, size: 23, color: GRAY, after: 760 }),
  para('พัฒนาด้วย Expo SDK 54, React Native, Expo Router และ TypeScript', { align: AlignmentType.CENTER, size: 20, color: GRAY, after: 140 }),
  para('GitHub: https://github.com/raphiphat8888', { align: AlignmentType.CENTER, size: 20, color: BLUE }),
  pageBreak(),
  ...codeImagePage('ส่วนหัว (Head)', 'ไฟล์ components/common/Header.tsx ควบคุมเมนูด้านบน ช่องค้นหา ปุ่มเพิ่ม และ Filter', [
    para('บรรทัด 24-38: เมนู ชื่อหน้า และโปรไฟล์', { bold: true }),
    code(`<View style={styles.header}>\n  <Pressable style={styles.menuButton}>\n    <Text>☰</Text>\n  </Pressable>\n  <Text style={styles.headerTitle}>{title}</Text>\n  <Pressable onPress={() => router.push('/admin')}>\n    <Text>{profile.initials}</Text>\n  </Pressable>\n</View>`),
    para('บรรทัด 40-65: ช่องค้นหาและปุ่มคำสั่ง', { bold: true }),
    code(`<TextInput\n  placeholder={searchPlaceholder}\n  style={styles.searchInput}\n/>\n<Pressable onPress={() => router.push(actionHref)}>\n  <Text>{actionLabel}</Text>\n</Pressable>\n<Text>{filterLabel} ▾</Text>`),
  ], own('home-mobile.png')),
  ...codeImagePage('ส่วนตัว (Body) - Dashboard', 'ไฟล์ app/(tabs)/index.tsx คำนวณข้อมูลและสร้างการ์ดสรุปหน้าร้าน', [
    para('บรรทัด 14-15: คำนวณสต็อก', { bold: true }),
    code(`const stockTotal = profile.projects.reduce(\n  (total, product) => total + product.stock, 0\n);\nconst lowStockTotal = profile.projects.filter(\n  (product) => product.stock <= 5\n).length;`),
    para('บรรทัด 45-56: สร้างการ์ดสรุปด้วย map()', { bold: true }),
    code(`{metrics.map((metric) => (\n  <Card key={metric.label}>\n    <MaterialCommunityIcons name={metric.icon} />\n    <Text>{metric.label}</Text>\n    <Text>{metric.value}</Text>\n  </Card>\n))}`),
    para('การ์ดทั้ง 4 ใบแสดงจำนวนสินค้า สต็อกคงเหลือ สินค้าใกล้หมด และหมวดหมู่ โดยปรับเรียงลงอัตโนมัติเมื่อหน้าจอแคบ'),
  ], own('home-mobile.png')),
  ...codeImagePage('หน้าสินค้า (Products)', 'ไฟล์ app/(tabs)/projects.tsx แสดงรายการสินค้าจากข้อมูลกลาง', [
    para('ใช้ .map() วนสร้างการ์ดสินค้า', { bold: true }),
    code(`<View style={styles.grid}>\n  {profile.projects.map((project) => (\n    <ProjectCard\n      key={project.title}\n      project={project}\n    />\n  ))}\n</View>`),
    para('ProjectCard แสดงรูป ชื่อ สถานะ รายละเอียด ราคา สต็อก และประเภทสินค้า การแยกเป็น Component ทำให้แก้รูปแบบสินค้าทุกใบได้จากจุดเดียว'),
  ], own('products-mobile.png')),
  ...codeImagePage('หน้าเพิ่มสินค้า (Add Product)', 'ไฟล์ app/(tabs)/add.tsx รับข้อมูลสินค้าจากแบบฟอร์ม', [
    para('TextInput เชื่อมกับ state ของแบบฟอร์ม', { bold: true }),
    code(`<TextInput\n  value={form.name}\n  onChangeText={(value) =>\n    setForm({ ...form, name: value })\n  }\n/>\n<TextInput\n  value={form.price}\n  keyboardType="numeric"\n/>`),
    para('ผู้ใช้กรอกชื่อ ราคา สต็อก หมวดหมู่ URL รูป และรายละเอียดสินค้า พร้อมพื้นที่ Preview ตรวจสอบรูปก่อนบันทึก'),
  ], own('add-mobile.png')),
  ...codeImagePage('ส่วนหาง (Tail / Bottom)', 'ไฟล์ app/(tabs)/_layout.tsx กำหนดเมนูหลักด้านล่าง 5 รายการ', [
    para('บรรทัด 33-67: กำหนด Tabs.Screen', { bold: true }),
    code(`<Tabs.Screen name="index" title="Home" />\n<Tabs.Screen name="projects" title="Products" />\n<Tabs.Screen name="add" title="Add" />\n<Tabs.Screen name="admin" title="Admin" />\n<Tabs.Screen name="export" title="Export" />`),
    para('เมนูที่กำลังใช้งานเป็นสีน้ำเงิน Electric League ส่วนเมนูอื่นเป็นสีเทา ความสูงแถบ 74 พิกเซลและมี Haptic feedback บนอุปกรณ์ที่รองรับ'),
  ], own('products-mobile.png')),
  h1('ส่วนที่ 2 วิเคราะห์แอปพลิเคชันตัวอย่าง'),
  para('Inventor.io จาก Uizard เป็นแอปจัดการสินค้าคงคลังบนมือถือ ใช้ Top navigation ร่วมกับ Bottom navigation และ Side menu เพื่อเชื่อมหน้าหลักต่าง ๆ', { size: 23, line: 320 }),
  image(ui('page-8-image-1.png'), 240, 422),
  pageBreak(),
  ...analysisPage('Login และ Home Dashboard', [
    'หน้า Login เรียบง่าย มีเพียง Username, Password และปุ่ม Log in จึงเข้าใจได้ทันที แต่ควรเพิ่มปุ่มแสดงรหัสผ่าน Forgot password และข้อความแจ้งเตือนเมื่อเข้าสู่ระบบไม่สำเร็จ',
    'หน้า Home แสดง New Items, New Orders, Refunds, Message และ Groups เป็นการ์ดสรุป พร้อมกราฟ Sales ที่ช่วยเปรียบเทียบสถานะงานได้รวดเร็ว ควรทำให้การ์ดกดดูรายละเอียดได้ เพิ่มตัวเลือกช่วงวันที่ และรองรับ Dark mode',
  ], [{ file: ui('page-8-image-1.png'), w: 190, h: 335 }, { file: ui('page-8-image-2.png'), w: 190, h: 335 }]),
  ...analysisPage('Categories และภาพรวมคลัง', [
    'หน้า Categories ใช้การ์ดขนาดใหญ่ ไอคอน ชื่อหมวด และจำนวนสินค้า ทำให้พื้นที่กดเหมาะกับมือถือ ควรทำให้ทุกหมวดเปิดรายการสินค้าได้จริงและเพิ่มการค้นหาเมื่อมีหมวดจำนวนมาก',
    'ส่วน Top item categories, Low stock items และ Stores list สรุปข้อมูลสำคัญได้ดี แต่ตัวเลขและชื่อสาขาควรกดเปิดรายละเอียดได้ พร้อมแสดงสถานะการโหลดและกรณีไม่มีข้อมูล',
  ], [{ file: ui('page-9-image-1.png'), w: 205, h: 150 }, { file: ui('page-9-image-2.png'), w: 190, h: 285 }]),
  ...analysisPage('Add Product และ Products', [
    'หน้า Add Product มีช่องข้อมูลเรียงตามลำดับและปุ่ม Save product ชัดเจน ควรเพิ่ม validation ระบุช่องที่จำเป็น แสดงภาพ Preview และแจ้งผลหลังบันทึกสำเร็จ',
    'หน้า Products แสดงรูป ชื่อ สต็อก หมวดหมู่ สาขา และสถานะ Active พร้อม Search, Add และ Filter ทำให้ใช้งานได้เร็ว ควรเพิ่มสถานะสินค้าใกล้หมดและแสดงตัวกรองที่กำลังใช้งาน',
  ], [{ file: ui('page-10-image-2.png'), w: 175, h: 315 }, { file: ui('page-11-image-1.png'), w: 175, h: 315 }]),
  ...analysisPage('Product Detail', [
    'หน้ารายละเอียดแสดงชื่อ แบรนด์ ขนาด หมวดหมู่ เพศ รหัสสินค้า QR Code และสาขาที่มีสินค้า ข้อมูลครบสำหรับงานคลังสินค้า แต่ไม่มีปุ่มย้อนกลับที่เห็นชัด ควรเพิ่มลูกศรมุมซ้ายบน รวมถึงปุ่ม Edit และ Delete ตามสิทธิ์ผู้ใช้',
    'การใช้เครื่องหมายถูกและกากบาทช่วยให้ตรวจสอบ Store availability ได้เร็ว แต่ควรมีคำอธิบายสีเพื่อรองรับผู้ใช้ที่มีข้อจำกัดด้านการมองเห็นสี',
  ], [{ file: ui('page-11-image-2.png'), w: 180, h: 278 }, { file: ui('page-11-image-3.png'), w: 180, h: 278 }]),
  ...analysisPage('Settings และ Role', [
    'หน้า Settings แสดงชื่อ อีเมล รหัสผ่าน ร้าน รหัสพนักงาน และบทบาทปัจจุบันในกล่องเดียว ไอคอนดินสอควรเปิดโหมดแก้ไขได้จริง และการเปลี่ยนรหัสผ่านควรแยกเป็นขั้นตอนที่ปลอดภัย',
    'ส่วน Role แสดงบทบาท Manager, Editor, Supplier, Seller, Admin และ Finance แต่การเปลี่ยนบทบาทควรมีผลต่อสิทธิ์และเมนูที่มองเห็นจริง พร้อมกล่องยืนยันก่อนบันทึก',
  ], [{ file: ui('page-12-image-1.png'), w: 180, h: 315 }, { file: ui('page-12-image-2.png'), w: 180, h: 225 }]),
  h1('สรุป'),
  para('Inventor.io มีโครงสร้างเมนูสม่ำเสมอ ใช้ Bottom navigation สำหรับ Home, Add, Products และ Categories ซึ่งเป็นงานที่ใช้บ่อย ส่วน Side menu เหมาะกับ Stores, Finances และ Settings อย่างไรก็ตามมีรายการเมนูซ้ำ บางปุ่มไม่ตรงกับบริบท และหลายหน้าขาดปุ่มย้อนกลับหรือผลตอบรับหลังทำรายการ', { line: 320 }),
  para('แนวทางปรับปรุงสำคัญคือทำให้ทุกปุ่มใช้งานได้จริง เพิ่ม validation และข้อความยืนยัน เพิ่มปุ่มย้อนกลับในหน้ารายละเอียด ปรับชื่อคำสั่งให้ตรงกับหน้าปัจจุบัน เพิ่ม Dark mode และกำหนด Role ให้ส่งผลต่อสิทธิ์ของผู้ใช้จริง', { line: 320 }),
  para('แหล่งอ้างอิง: https://app.uizard.io/templates/z6474wwa9pFKrjOlo0o6/preview', { color: BLUE, before: 240 }),
];

if (children.at(-1) instanceof Paragraph) {
  // Keep the final document free of a trailing blank page break.
}

const doc = new Document({
  creator: 'นายรพีภัทร แสนกล้า', title: 'Display the Top and Bottom Navigation Menus',
  styles: { default: { document: { run: { font: 'Tahoma', size: 21, color: NAVY }, paragraph: { spacing: { after: 100, line: 280 } } } } },
  sections: [{ properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 720, right: 720, bottom: 760, left: 720, header: 400, footer: 420 } } }, footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [text('นายรพีภัทร แสนกล้า  |  ', { size: 17, color: GRAY }), new TextRun({ children: [PageNumber.CURRENT], font: 'Tahoma', size: 17, color: GRAY })] })] }) }, children }],
});

fs.mkdirSync(path.dirname(out), { recursive: true });
Packer.toBuffer(doc).then((buffer) => { fs.writeFileSync(out, buffer); console.log(out); });
