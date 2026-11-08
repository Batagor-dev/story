import sharp from 'sharp';

async function verifyComposite() {
  const f1 = await sharp('public/assets/sprites/test_ara_left.png').raw().toBuffer({ resolveWithObject: true });
  const f2 = await sharp('public/assets/sprites/test_composite_f2.png').raw().toBuffer({ resolveWithObject: true });

  console.log(`F1: ${f1.info.width}x${f1.info.height}, F2: ${f2.info.width}x${f2.info.height}`);

  // Let's count differing pixels
  let diffs = 0;
  let minDiffX = 999, maxDiffX = -1, minDiffY = 999, maxDiffY = -1;
  for (let y = 0; y < f1.info.height; y++) {
    for (let x = 0; x < f1.info.width; x++) {
      const idx = (y * f1.info.width + x) * 4;
      const dr = Math.abs(f1.data[idx] - f2.data[idx]);
      const dg = Math.abs(f1.data[idx+1] - f2.data[idx+1]);
      const db = Math.abs(f1.data[idx+2] - f2.data[idx+2]);
      const da = Math.abs(f1.data[idx+3] - f2.data[idx+3]);
      if (dr > 10 || dg > 10 || db > 10 || da > 10) {
        diffs++;
        if (x < minDiffX) minDiffX = x;
        if (x > maxDiffX) maxDiffX = x;
        if (y < minDiffY) minDiffY = y;
        if (y > maxDiffY) maxDiffY = y;
      }
    }
  }

  console.log(`Total differing pixels: ${diffs}`);
  console.log(`Diff bounding box: x=[${minDiffX}..${maxDiffX}], y=[${minDiffY}..${maxDiffY}]`);
}

verifyComposite();
