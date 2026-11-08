import sharp from 'sharp';

const srcPath = 'C:/Users/LENOVO/.gemini/antigravity/brain/d2cf962e-2a97-4152-94ac-3037c9cae3ca/.user_uploaded/media_1794074867787_ed610199.png';

async function generateAlignedFrames() {
  const { data, info } = await sharp(srcPath).raw().toBuffer({ resolveWithObject: true });

  // Frame 1 dimensions:
  // left: 15, top: 16, width: 218, height: 193
  const w = 218;
  const h = 193;

  // Frame 1: Exactly as drawn (eyes open)
  const f1 = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const srcIdx = ((16 + y) * info.width + (15 + x)) * 4;
      const dstIdx = (y * w + x) * 4;
      f1[dstIdx] = data[srcIdx];
      f1[dstIdx + 1] = data[srcIdx + 1];
      f1[dstIdx + 2] = data[srcIdx + 2];
      f1[dstIdx + 3] = data[srcIdx + 3];
    }
  }

  await sharp(f1, { raw: { width: w, height: h, channels: 4 } })
    .png()
    .toFile('public/assets/sprites/ara_bench_1.png');
  console.log('Saved ara_bench_1.png');

  // For Frame 2:
  // We want the bench to remain 100% IDENTICAL to Frame 1's bench,
  // but Ara's head, face (closed eyes/blinking), hair, and book hands are updated from Frame 2!
  // Let's see: in Frame 2, where is Ara's head?
  // Frame 2 head top: x=343, y=17.
  // Frame 1 head top: x=85, y=17.
  // Offset: dx = 343 - 85 = 258, dy = 0!
  // So for any pixel in Ara's head and upper reading pose, we can take it from (x + 258, y) in the source image!
  
  // Let's check which pixels belong to Ara in Frame 2:
  // Ara's head and hair: y: 16..72, x: 55..115 (in Frame 1 space) -> srcX = x + 258
  const f2 = Buffer.from(f1); // start with base bench and body

  // Transfer head & face (the blinking eyes, tilted head, and hair movement)
  // Let's check bounding box of head & face
  for (let y = 0; y < 85; y++) {
    for (let x = 45; x < 120; x++) {
      const srcX = 15 + x + 258;
      const srcY = 16 + y;
      if (srcX < info.width && srcY < info.height) {
        const srcIdx = (srcY * info.width + srcX) * 4;
        const dstIdx = (y * w + x) * 4;
        const a = data[srcIdx + 3];
        if (a > 30) {
          f2[dstIdx] = data[srcIdx];
          f2[dstIdx + 1] = data[srcIdx + 1];
          f2[dstIdx + 2] = data[srcIdx + 2];
          f2[dstIdx + 3] = a;
        } else if (f1[dstIdx + 3] > 0 && y < 70 && x > 55 && x < 110) {
          // If source has transparency where head outline slightly shifted, clear it
          // so no double outlines occur
          f2[dstIdx + 3] = 0;
        }
      }
    }
  }

  await sharp(f2, { raw: { width: w, height: h, channels: 4 } })
    .png()
    .toFile('public/assets/sprites/ara_bench_2.png');
  console.log('Saved ara_bench_2.png');
}

generateAlignedFrames();
