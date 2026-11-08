import sharp from 'sharp';

const srcPath = 'C:/Users/LENOVO/.gemini/antigravity/brain/d2cf962e-2a97-4152-94ac-3037c9cae3ca/.user_uploaded/media_1794074886967_502c5983.png';

async function checkOutline() {
  const { data, info } = await sharp(srcPath).raw().toBuffer({ resolveWithObject: true });
  const w = info.width;

  // Let's scan horizontally across Fountain 1 at y = 140 (middle of the outer stone basin)
  // from x = 30 to 70
  console.log('Horizontal scan at y=140, x=35..65 (left rim of F1):');
  for (let x = 35; x <= 65; x++) {
    const idx = (140 * w + x) * 3;
    const r = data[idx], g = data[idx+1], b = data[idx+2];
    const diff = Math.max(Math.abs(r-g), Math.abs(g-b), Math.abs(b-r));
    console.log(`x=${x}: RGB(${r},${g},${b}), diff=${diff}`);
  }
}

checkOutline();
