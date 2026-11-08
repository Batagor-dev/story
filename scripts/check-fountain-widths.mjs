import sharp from 'sharp';

const srcPath = 'C:/Users/LENOVO/.gemini/antigravity/brain/d2cf962e-2a97-4152-94ac-3037c9cae3ca/.user_uploaded/media_1794074886967_502c5983.png';

async function checkWidths() {
  const { data, info } = await sharp(srcPath).raw().toBuffer({ resolveWithObject: true });
  const w = info.width;

  // Let's check y = 150 across x = 0..400
  // Background has max(|r-g|, |g-b|, |b-r|) <= 9 and (r in [120..155] or r in [190..235])
  function isCheckerboard(r, g, b) {
    const diff = Math.max(Math.abs(r-g), Math.abs(g-b), Math.abs(b-r));
    if (diff <= 8 && ((r >= 120 && r <= 155) || (r >= 190 && r <= 235))) return true;
    return false;
  }

  // Scan F1 at y = 150
  let f1Left = -1, f1Right = -1;
  for (let x = 20; x < 193; x++) {
    const idx = (150 * w + x) * 3;
    if (!isCheckerboard(data[idx], data[idx+1], data[idx+2])) {
      if (f1Left === -1) f1Left = x;
      f1Right = x;
    }
  }

  let f2Left = -1, f2Right = -1;
  for (let x = 193; x < 386; x++) {
    const idx = (150 * w + x) * 3;
    if (!isCheckerboard(data[idx], data[idx+1], data[idx+2])) {
      if (f2Left === -1) f2Left = x;
      f2Right = x;
    }
  }

  console.log(`F1 at y=150: left=${f1Left}, right=${f1Right}, width=${f1Right - f1Left + 1}, center=${(f1Left + f1Right) / 2}`);
  console.log(`F2 at y=150: left=${f2Left}, right=${f2Right}, width=${f2Right - f2Left + 1}, center=${(f2Left + f2Right) / 2}`);
}

checkWidths();
