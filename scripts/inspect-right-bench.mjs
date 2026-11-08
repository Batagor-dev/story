import sharp from 'sharp';

const srcPath = 'C:/Users/LENOVO/.gemini/antigravity/brain/d2cf962e-2a97-4152-94ac-3037c9cae3ca/.user_uploaded/media_1794074867787_ed610199.png';

async function inspectRightBench() {
  const { data, info } = await sharp(srcPath).raw().toBuffer({ resolveWithObject: true });

  // Let's check the right armrest of Left bench:
  // Left bench: minX=15, maxX=232.
  // Right armrest of left bench: around x=200..232.
  // Right armrest of right bench: around x=395..428.
  // 428 - 232 = 196.
  // Left armrest of left bench: x=23.
  // Left armrest of right bench: x=268.
  // 268 - 23 = 245.
  
  console.log('Left bench width:', 232 - 15 + 1);
  console.log('Right bench width:', 428 - 260 + 1);

  // Look at the right armrest of both benches:
  // Let's see if the right armrest curl is the EXACT same drawing in both:
  // In Left bench, right armrest curl:
  function findRightCurl(minX, maxX) {
    for (let x = maxX; x >= minX; x--) {
      for (let y = 120; y < 145; y++) {
        const idx = (y * info.width + x) * 4;
        if (data[idx + 3] > 200) {
          return { x, y };
        }
      }
    }
  }

  const rCurl1 = findRightCurl(190, 232);
  const rCurl2 = findRightCurl(390, 428);
  console.log('Frame 1 right armrest curl:', rCurl1);
  console.log('Frame 2 right armrest curl:', rCurl2);
}

inspectRightBench();
