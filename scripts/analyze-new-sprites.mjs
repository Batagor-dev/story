import sharp from 'sharp';

async function analyze() {
  const p1 = 'C:/Users/LENOVO/.gemini/antigravity/brain/d2cf962e-2a97-4152-94ac-3037c9cae3ca/.user_uploaded/media_1794101917766_b22a486f.png';
  const p2 = 'C:/Users/LENOVO/.gemini/antigravity/brain/d2cf962e-2a97-4152-94ac-3037c9cae3ca/.user_uploaded/media_1794102005307_0171ded7.png';

  for (const [name, p] of [['Arel', p1], ['Ara', p2]]) {
    const { data, info } = await sharp(p).raw().toBuffer({ resolveWithObject: true });
    console.log(name, info.width, 'x', info.height);

    const colDensity = new Array(info.width).fill(0);
    for (let x = 0; x < info.width; x++) {
      for (let y = 0; y < info.height; y++) {
        if (data[(y * info.width + x) * 4 + 3] > 20) colDensity[x]++;
      }
    }

    let frames = [];
    let inFrame = false, start = 0;
    for (let x = 0; x < info.width; x++) {
      if (colDensity[x] > 0 && !inFrame) {
        inFrame = true;
        start = x;
      } else if (colDensity[x] === 0 && inFrame) {
        inFrame = false;
        frames.push([start, x - 1]);
      }
    }
    if (inFrame) frames.push([start, info.width - 1]);

    console.log(`${name} frames (${frames.length}):`);
    frames.forEach(([s, e], idx) => {
      let minY = info.height, maxY = 0;
      for (let x = s; x <= e; x++) {
        for (let y = 0; y < info.height; y++) {
          if (data[(y * info.width + x) * 4 + 3] > 20) {
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }
      console.log(`  Frame ${idx+1}: x [${s}..${e}] (w=${e-s+1}), y [${minY}..${maxY}] (h=${maxY-minY+1})`);
    });
  }
}

analyze();
