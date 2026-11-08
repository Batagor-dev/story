import sharp from 'sharp';

async function verifyRecoloringMask() {
  const { data, info } = await sharp('public/assets/sprites/test_arel_f2.png').raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;

  let pinkPixels = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      const r = data[idx], g = data[idx+1], b = data[idx+2], a = data[idx+3];
      if (a > 100 && r > 170 && g < 150 && b > 90 && (r - g) > 60 && (r - b) > 50) {
        pinkPixels.push({ x, y });
      }
    }
  }

  const minX = Math.min(...pinkPixels.map(p => p.x));
  const maxX = Math.max(...pinkPixels.map(p => p.x));
  const minY = Math.min(...pinkPixels.map(p => p.y));
  const maxY = Math.max(...pinkPixels.map(p => p.y));

  console.log(`Pink mask in F2: x [${minX}..${maxX}], y [${minY}..${maxY}], count = ${pinkPixels.length}`);
}

verifyRecoloringMask();
