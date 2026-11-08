import sharp from 'sharp';

const srcPath = 'C:/Users/LENOVO/.gemini/antigravity/brain/d2cf962e-2a97-4152-94ac-3037c9cae3ca/.user_uploaded/media_1794074886967_502c5983.png';

async function checkDroplets() {
  const { data, info } = await sharp(srcPath).raw().toBuffer({ resolveWithObject: true });
  const w = info.width;

  console.log('F1 top area at x=118..121, y=35..45:');
  for (let y = 35; y <= 45; y++) {
    for (let x = 117; x <= 121; x++) {
      const idx = (y * w + x) * 3;
      const r = data[idx], g = data[idx+1], b = data[idx+2];
      const diff = Math.max(Math.abs(r-g), Math.abs(g-b), Math.abs(b-r));
      console.log(`x=${x}, y=${y}: RGB(${r},${g},${b}), diff=${diff}`);
    }
  }
}

checkDroplets();
