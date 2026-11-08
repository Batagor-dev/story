import sharp from 'sharp';

const srcPath = 'C:/Users/LENOVO/.gemini/antigravity/brain/d2cf962e-2a97-4152-94ac-3037c9cae3ca/.user_uploaded/media_1794074867787_ed610199.png';

async function testHeadTransfer() {
  const { data, info } = await sharp(srcPath).raw().toBuffer({ resolveWithObject: true });

  // In Frame 1:
  // Ara's head is at x ≈ 60..110, y ≈ 16..75
  // Let's crop Frame 1 exactly:
  // minX = 15, minY = 16, width = 218, height = 193
  const f1Width = 218;
  const f1Height = 193;
  const f1CropX = 15;
  const f1CropY = 16;

  // Extract Frame 1 clean
  const f1Buffer = Buffer.alloc(f1Width * f1Height * 4);
  for (let y = 0; y < f1Height; y++) {
    for (let x = 0; x < f1Width; x++) {
      const srcIdx = ((f1CropY + y) * info.width + (f1CropX + x)) * 4;
      const dstIdx = (y * f1Width + x) * 4;
      f1Buffer[dstIdx] = data[srcIdx];
      f1Buffer[dstIdx + 1] = data[srcIdx + 1];
      f1Buffer[dstIdx + 2] = data[srcIdx + 2];
      f1Buffer[dstIdx + 3] = data[srcIdx + 3];
    }
  }

  await sharp(f1Buffer, { raw: { width: f1Width, height: f1Height, channels: 4 } })
    .png()
    .toFile('public/assets/sprites/ara_seated_1.png');
  console.log('Saved ara_seated_1.png');

  // Now let's examine Frame 2:
  // In Frame 2, what is Ara's exact bounding box (Ara herself, without bench)?
  // Let's find Ara's pixels in Frame 2:
  // Head at x=343, y=17.
  // In Frame 1, head at x=85, y=17.
  // So Ara in Frame 2 is offset by x = 343 - 85 = 258 from Frame 1!
  // In Frame 1 coordinates (relative to f1CropX = 15):
  // Ara's head is at x = 85 - 15 = 70.
  // In Frame 2, head is at 343. So (srcX = dstX + 15 + 258 = dstX + 273).
  // Let's check what differs between Frame 1 Ara and Frame 2 Ara:
  console.log('Comparing pixels of Ara between Frame 1 and Frame 2:');
  for (let y = 16; y < 90; y++) {
    for (let x = 60; x < 115; x++) {
      const f1Idx = (y * info.width + x) * 4;
      const f2X = x + 258;
      const f2Idx = (y * info.width + f2X) * 4;
      const dr = Math.abs(data[f1Idx] - data[f2Idx]);
      const dg = Math.abs(data[f1Idx+1] - data[f2Idx+1]);
      const db = Math.abs(data[f1Idx+2] - data[f2Idx+2]);
      if (dr > 15 || dg > 15 || db > 15) {
        // print a few sample lines
        if (y === 30 || y === 35 || y === 40) {
          console.log(`y=${y}, x=${x}: F1=RGB(${data[f1Idx]},${data[f1Idx+1]},${data[f1Idx+2]}) vs F2=RGB(${data[f2Idx]},${data[f2Idx+1]},${data[f2Idx+2]})`);
        }
      }
    }
  }
}

testHeadTransfer();
