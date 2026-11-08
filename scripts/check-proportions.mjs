import sharp from 'sharp';

const srcPath = 'C:/Users/LENOVO/.gemini/antigravity/brain/d2cf962e-2a97-4152-94ac-3037c9cae3ca/.user_uploaded/media_1794074867787_ed610199.png';

async function buildSeamlessFrames() {
  const { data, info } = await sharp(srcPath).raw().toBuffer({ resolveWithObject: true });

  // Frame 1 is at left: 15, top: 16, width: 218, height: 193.
  const w = 218;
  const h = 193;

  // Let's create frame 1 buffer
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

  // Now for Frame 2:
  // Let's see how Frame 2 is drawn in the original image.
  // In the original image:
  // Left armrest is at x = 268 (in Frame 1 it was at x = 23, so dx = 245).
  // Ara's head is at x = 343 (in Frame 1 it was at x = 85, so dx = 258).
  // Bench right armrest is at x = 427 (in Frame 1 it was at x = 231, so dx = 196).
  // Notice:
  // 343 - 268 = 75px (Ara is 75px from left armrest).
  // In Frame 1: 85 - 23 = 62px (Ara is 62px from left armrest).
  // So in Frame 2, Ara was drawn 13px further to the right on the bench!
  // And the bench right armrest was drawn 35px closer to Ara!
  // In other words, in Frame 2, Ara is sitting in the center of a smaller bench!
  console.log('Frame 1: Ara head to left curl =', 85 - 23, 'Ara head to right curl =', 231 - 85);
  console.log('Frame 2: Ara head to left curl =', 343 - 268, 'Ara head to right curl =', 427 - 343);
}

buildSeamlessFrames();
