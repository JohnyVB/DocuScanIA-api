import sharp from "sharp";

async function optimizeForOCR(fileBuffer: Buffer) {
  const optimized = await sharp(fileBuffer)
    .resize({ width: 1500 }) // tamaño ideal OCR
    .grayscale() // mejora reconocimiento
    .normalize() // mejora contraste
    .jpeg({ quality: 85 }) // compresión ideal
    .toBuffer();

  return optimized;
}

export default optimizeForOCR;
