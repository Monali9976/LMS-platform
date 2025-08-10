function chunkText(text, maxChars = 1200) {
  const chunks = [];
  let i = 0;
  while (i < text.length) {
    chunks.push(text.slice(i, i + maxChars));
    i += maxChars;
  }
  return chunks;
}

module.exports = { chunkText };
