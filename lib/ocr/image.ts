import sharp from 'sharp';

export async function optimizeLedgerImage(buffer: Buffer): Promise<string> {
  const processedBuffer = await sharp(buffer)
    .rotate()
    .resize({ width: 2000, fit: 'inside', withoutEnlargement: true })
    .grayscale()
    .linear(1.2, -10)
    .sharpen()
    .jpeg({ quality: 98 })
    .toBuffer();

  return processedBuffer.toString('base64');
}