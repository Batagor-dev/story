import sharp from 'sharp';

const srcPath = 'C:/Users/LENOVO/.gemini/antigravity/brain/d2cf962e-2a97-4152-94ac-3037c9cae3ca/.user_uploaded/media_1794074867787_ed610199.png';

async function checkSplit() {
  const { data, info } = await sharp(srcPath).raw().toBuffer({ resolveWithObject: true });

  console.log('Scanning column opacity around x=215..245:');
  for (let x = 215; x <= 245; x++) {
    let opaque = 0;
    for (let y = 0; y < info.height; y++) {
      const a = data[(y * info.width + x) * 4 + 3];
      if (a > 10) opaque++;
    }
    console.log(`x=${x}: opaque count = ${opaque}`);
  }
}

checkSplit();
