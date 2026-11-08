import sharp from 'sharp';

const srcPath = 'C:/Users/LENOVO/.gemini/antigravity/brain/d2cf962e-2a97-4152-94ac-3037c9cae3ca/.user_uploaded/media_1794074886967_502c5983.png';

async function checkF2Right() {
  const { data, info } = await sharp(srcPath).raw().toBuffer({ resolveWithObject: true });
  const w = info.width;

  console.log('Pixels at y=150, x=370..395:');
  for (let x = 370; x <= 395; x++) {
    const idx = (150 * w + x) * 3;
    const r = data[idx], g = data[idx+1], b = data[idx+2];
    const diff = Math.max(Math.abs(r-g), Math.abs(g-b), Math.abs(b-r));
    console.log(`x=${x}: RGB(${r},${g},${b}), diff=${diff}`);
  }
}

checkF2Right();
