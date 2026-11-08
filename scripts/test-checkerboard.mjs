import sharp from 'sharp';

const srcPath = 'C:/Users/LENOVO/.gemini/antigravity/brain/d2cf962e-2a97-4152-94ac-3037c9cae3ca/.user_uploaded/media_1794074886967_502c5983.png';

async function checkFloodFill() {
  const { data, info } = await sharp(srcPath).raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;

  // Let's examine checkerboard colors.
  // We know at (10, 10) it's dark top bar or checkerboard.
  // Let's see pixels along the left edge x = 0..10 for y = 10..186
  const bgPixels = new Set();
  for (let y = 12; y < h; y += 4) {
    for (let x = 0; x < 20; x += 4) {
      const idx = (y * w + x) * 3;
      const r = data[idx], g = data[idx+1], b = data[idx+2];
      bgPixels.add(`${r},${g},${b}`);
    }
  }
  console.log('Sample background colors on far left:');
  console.log(Array.from(bgPixels).slice(0, 15));

  // Notice the checkerboard is grey shades:
  // Let's check max diff |R-G|, |G-B|, |B-R|
  let maxDiff = 0;
  for (let y = 12; y < h; y++) {
    for (let x = 0; x < 25; x++) {
      const idx = (y * w + x) * 3;
      const r = data[idx], g = data[idx+1], b = data[idx+2];
      const diff = Math.max(Math.abs(r-g), Math.abs(g-b), Math.abs(b-r));
      if (diff > maxDiff) maxDiff = diff;
    }
  }
  console.log('Max color diff in checkerboard area (x<25, y>12):', maxDiff);
}

checkFloodFill();
