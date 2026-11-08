import sharp from 'sharp';

const srcPath = 'C:/Users/LENOVO/.gemini/antigravity/brain/d2cf962e-2a97-4152-94ac-3037c9cae3ca/.user_uploaded/media_1794074867787_ed610199.png';

async function inspectRightEnd() {
  const { data, info } = await sharp(srcPath).raw().toBuffer({ resolveWithObject: true });

  console.log('Right edge of Frame 2 at x=415..428:');
  for (let y = 100; y < 160; y += 4) {
    for (let x = 415; x <= 428; x += 2) {
      const idx = (y * info.width + x) * 4;
      if (data[idx + 3] > 10) {
        console.log(`x=${x}, y=${y}: RGBA(${data[idx]}, ${data[idx+1]}, ${data[idx+2]}, ${data[idx+3]})`);
      }
    }
  }
}

inspectRightEnd();
