const PDFDocument = require('pdfkit');
const fs = require('fs');

// Create a new PDF document
const doc = new PDFDocument();
doc.pipe(fs.createWriteStream('test_chapters_simple.pdf'));

// Example chapters for LMS testing
const chapters = [
  { title: "Chapter 1: Introduction to Biology", text: "Biology is the study of living organisms. It covers topics such as cells, genetics, and evolution." },
  { title: "Chapter 2: Cell Structure", text: "Cells are the basic unit of life. They contain structures such as the nucleus, mitochondria, and ribosomes." },
  { title: "Chapter 3: Genetics", text: "Genetics is the study of heredity and variation in organisms. DNA carries genetic information." },
  { title: "Chapter 4: Photosynthesis", text: "Photosynthesis is the process by which plants use sunlight to make food. The main pigment involved is chlorophyll." },
  { title: "Chapter 5: The Calvin Cycle", text: "The Calvin Cycle occurs in the stroma of chloroplasts and is part of photosynthesis." }
];

// Write chapters into PDF
chapters.forEach(ch => {
  doc.fontSize(14).text(ch.title, { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(11).text(ch.text);
  doc.moveDown(1.5);
});

// Finalize the PDF file
doc.end();
