const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const data = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../src/assets/ed.json'), 'utf-8')
);

const outputPath = path.join(__dirname, '../src/assets/Efstathios_Daras_Resume.pdf');

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 40, bottom: 40, left: 50, right: 50 },
});

const stream = fs.createWriteStream(outputPath);
doc.pipe(stream);

// Colors
const PRIMARY = '#1a1a2e';
const ACCENT = '#16213e';
const MUTED = '#555555';
const LINK_COLOR = '#2563eb';
const DIVIDER = '#cccccc';

const PAGE_WIDTH = doc.page.width - doc.page.margins.left - doc.page.margins.right;

function drawDivider(y) {
  doc
    .moveTo(doc.page.margins.left, y)
    .lineTo(doc.page.width - doc.page.margins.right, y)
    .strokeColor(DIVIDER)
    .lineWidth(0.5)
    .stroke();
}

function sectionTitle(title) {
  checkPageBreak(30);
  doc.moveDown(0.6);
  doc.fontSize(13).fillColor(PRIMARY).font('Helvetica-Bold').text(title.toUpperCase(), { characterSpacing: 1.5 });
  const y = doc.y + 2;
  drawDivider(y);
  doc.y = y + 8;
}

function checkPageBreak(needed) {
  const bottom = doc.page.height - doc.page.margins.bottom;
  if (doc.y + needed > bottom) {
    doc.addPage();
  }
}

// ─── Header ───
doc.fontSize(22).fillColor(PRIMARY).font('Helvetica-Bold').text(data.name, { align: 'center' });
doc.moveDown(0.15);
doc.fontSize(11).fillColor(ACCENT).font('Helvetica').text(data.title, { align: 'center' });
doc.moveDown(0.3);

// Contact line
const contactParts = [];
if (data.email) contactParts.push(data.email);
if (data.phone) contactParts.push(data.phone);
const linkedIn = data.socials.find((s) => s.name === 'LinkedIn');
if (linkedIn) contactParts.push(linkedIn.url.replace('https://www.', ''));
const github = data.socials.find((s) => s.name === 'GitHub');
if (github) contactParts.push(github.url.replace('https://', ''));

doc.fontSize(9).fillColor(MUTED).font('Helvetica').text(contactParts.join('  |  '), { align: 'center' });
doc.moveDown(0.2);
drawDivider(doc.y);
doc.y += 6;

// ─── Profile ───
sectionTitle('Profile');
doc.fontSize(10).fillColor('#333333').font('Helvetica').text(data.briefProfile, {
  lineGap: 3,
  width: PAGE_WIDTH,
});

// ─── Work Experience ───
sectionTitle('Work Experience');

data.workExperiences.forEach((exp, i) => {
  checkPageBreak(70);
  if (i > 0) doc.moveDown(0.5);

  // Company + dates on same line
  const dateText = `${exp.startDate} – ${exp.endDate}`;
  const dateWidth = doc.font('Helvetica').fontSize(9).widthOfString(dateText);

  doc.fontSize(11).fillColor(PRIMARY).font('Helvetica-Bold').text(exp.position, doc.page.margins.left, doc.y, {
    width: PAGE_WIDTH - dateWidth - 10,
    continued: false,
  });
  // Date on the right, same line
  doc.fontSize(9).fillColor(MUTED).font('Helvetica').text(dateText, doc.page.margins.left, doc.y - doc.currentLineHeight() - 2, {
    width: PAGE_WIDTH,
    align: 'right',
  });

  doc.fontSize(10).fillColor(ACCENT).font('Helvetica-BoldOblique').text(exp.company);
  doc.moveDown(0.15);

  doc.fontSize(9.5).fillColor('#333333').font('Helvetica').text(exp.description, {
    lineGap: 2,
    width: PAGE_WIDTH,
  });

  // Tech stack
  if (exp.techStack && exp.techStack.length > 0) {
    doc.moveDown(0.15);
    doc.fontSize(8.5).fillColor(MUTED).font('Helvetica-Oblique').text('Tech: ' + exp.techStack.join(', '), {
      width: PAGE_WIDTH,
    });
  }
});

// ─── Education ───
sectionTitle('Education');

data.education.forEach((edu) => {
  checkPageBreak(50);
  const dateText = `${edu.startDate} – ${edu.endDate}`;
  const dateWidth = doc.font('Helvetica').fontSize(9).widthOfString(dateText);

  doc.fontSize(11).fillColor(PRIMARY).font('Helvetica-Bold').text(edu.degree, doc.page.margins.left, doc.y, {
    width: PAGE_WIDTH - dateWidth - 10,
    continued: false,
  });
  doc.fontSize(9).fillColor(MUTED).font('Helvetica').text(dateText, doc.page.margins.left, doc.y - doc.currentLineHeight() - 2, {
    width: PAGE_WIDTH,
    align: 'right',
  });

  doc.fontSize(10).fillColor(ACCENT).font('Helvetica-BoldOblique').text(edu.institution);

  if (edu.thesis) {
    doc.moveDown(0.15);
    doc.fontSize(9.5).fillColor('#333333').font('Helvetica').text(`Thesis: ${edu.thesis}`, {
      width: PAGE_WIDTH,
    });
  }
});

// ─── Skills ───
sectionTitle('Skills');

data.skills.forEach((skillGroup) => {
  checkPageBreak(20);
  doc.fontSize(9.5).font('Helvetica-Bold').fillColor(PRIMARY).text(skillGroup.category + ': ', {
    continued: true,
  });
  doc.font('Helvetica').fillColor('#333333').text(skillGroup.items.join(', '));
});

// ─── Certifications ───
sectionTitle('Certifications');

data.certifications.forEach((cert) => {
  checkPageBreak(20);
  doc.fontSize(9.5).font('Helvetica-Bold').fillColor(PRIMARY).text(cert.certificationName, {
    continued: true,
  });
  doc.font('Helvetica').fillColor(MUTED).text('  –  ' + cert.institution);
});

// ─── Languages ───
sectionTitle('Languages');

const langLine = data.languages
  .map((l) => `${l.name} (${l.proficiency})`)
  .join('  |  ');
doc.fontSize(9.5).fillColor('#333333').font('Helvetica').text(langLine);

// ─── Interests ───
sectionTitle('Interests');
doc.fontSize(9.5).fillColor('#333333').font('Helvetica').text(data.interests.join('  |  '));

// Finalize
doc.end();

stream.on('finish', () => {
  console.log(`PDF generated: ${outputPath}`);
});
