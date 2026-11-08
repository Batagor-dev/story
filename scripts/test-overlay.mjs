import sharp from 'sharp';

const srcPath = 'C:/Users/LENOVO/.gemini/antigravity/brain/d2cf962e-2a97-4152-94ac-3037c9cae3ca/.user_uploaded/media_1794074867787_ed610199.png';

async function testOverlay() {
  const { data, info } = await sharp(srcPath).raw().toBuffer({ resolveWithObject: true });

  // Let's create an image of Ara from Frame 1 (wide bench)
  // And an image of Ara from Frame 2 overlaid on the wide bench!
  // In Frame 1:
  // Ara's bounding box:
  // x: 60..155, y: 15..205
  // Bench left: x=15, Bench right: x=232. Total width = 230, height = 210.
  
  // Crop Frame 1:
  const f1 = await sharp(srcPath)
    .extract({ left: 10, top: 10, width: 225, height: 200 })
    .png()
    .toBuffer();

  // Now, what if we take Ara from Frame 2:
  // In Frame 2: Ara is at x ≈ 318..413 (centered at 343).
  // Ara in Frame 1 is at x ≈ 60..155 (centered at 85).
  // dx = 343 - 85 = 258!
  // What happens if we copy Ara's head/face/upper body from Frame 2 onto Frame 1 at (x - 258)?
  // Let's check!
  const compositeBuffer = Buffer.from(await sharp(srcPath).extract({ left: 10, top: 10, width: 225, height: 200 }).raw().toBuffer());
  const f2Raw = await sharp(srcPath).raw().toBuffer({ resolveWithObject: true });

  // For y from 16 to 80 (head, face, eyes, hair):
  for (let y = 16; y < 75; y++) {
    for (let x = 60; x < 115; x++) {
      const srcX = x + 258;
      const srcY = y;
      const srcIdx = (srcY * info.width + srcX) * 4;
      const dstIdx = ((y - 10) * 225 + (x - 10)) * 4;

      if (f2Raw.data[srcIdx + 3] > 50) {
        compositeBuffer[dstIdx] = f2Raw.data[srcIdx];
        compositeBuffer[dstIdx + 1] = f2Raw.data[srcIdx + 1];
        compositeBuffer[dstIdx + 2] = f2Raw.data[srcIdx + 2];
        compositeBuffer[dstIdx + 3] = f2Raw.data[srcIdx + 3];
      }
    }
  }

  await sharp(compositeBuffer, { raw: { width: 225, height: 200, channels: 4 } })
    .png()
    .toFile('public/assets/sprites/test_composite_f2.png');
  console.log('Saved test_composite_f2.png');
}

testOverlay();
