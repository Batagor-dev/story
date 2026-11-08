import sharp from 'sharp';

const srcPath = 'C:/Users/LENOVO/.gemini/antigravity/brain/d2cf962e-2a97-4152-94ac-3037c9cae3ca/.user_uploaded/media_1794074886967_502c5983.png';

async function checkF2Bottom() {
  const { data, info } = await sharp(srcPath).raw().toBuffer({ resolveWithObject: true });
  const w = info.width;

  console.log('Fountain 2 bottom scan at x=308, y=165..185:');
  for (let y = 165; y <= 185; y++) {
    const idx = (y * w + 308) * 3;
    const r = data[idx], g = data[idx+1], b = data[idx+2];
    console.log(`y=${y}: RGB(${r},${g},${b})`);
  }
}

checkF2Bottom();
