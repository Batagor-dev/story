import sharp from 'sharp';

async function locateBouquetInFrames() {
  // We can look at where the flowers are: flowers have yellow (g > 180, r > 180), red, white
  for (let f = 2; f <= 4; f++) {
    const { data, info } = await sharp(`public/assets/sprites/test_arel_f${f}.png`).raw().toBuffer({ resolveWithObject: true });
    // Find flower colors or pink paper directly adjacent to flowers
    console.log(`--- Arel F${f} (${info.width}x${info.height}) ---`);
    let flowerPoints = [];
    for (let y = 0; y < info.height; y++) {
      for (let x = 0; x < info.width; x++) {
        const idx = (y * info.width + x) * 4;
        const r = data[idx], g = data[idx+1], b = data[idx+2], a = data[idx+3];
        // Yellow flowers: r > 200, g > 180, b < 100
        if (a > 100 && r > 200 && g > 180 && b < 100) {
          flowerPoints.push({ x, y });
        }
      }
    }
    if (flowerPoints.length > 0) {
      const minX = Math.min(...flowerPoints.map(p => p.x));
      const maxX = Math.max(...flowerPoints.map(p => p.x));
      const minY = Math.min(...flowerPoints.map(p => p.y));
      const maxY = Math.max(...flowerPoints.map(p => p.y));
      console.log(`  Yellow flowers: x [${minX}..${maxX}], y [${minY}..${maxY}]`);
    }
  }

  for (let f = 1; f <= 3; f++) {
    const { data, info } = await sharp(`public/assets/sprites/test_ara_f${f}.png`).raw().toBuffer({ resolveWithObject: true });
    let flowerPoints = [];
    for (let y = 0; y < info.height; y++) {
      for (let x = 0; x < info.width; x++) {
        const idx = (y * info.width + x) * 4;
        const r = data[idx], g = data[idx+1], b = data[idx+2], a = data[idx+3];
        if (a > 100 && r > 200 && g > 180 && b < 100) {
          flowerPoints.push({ x, y });
        }
      }
    }
    if (flowerPoints.length > 0) {
      const minX = Math.min(...flowerPoints.map(p => p.x));
      const maxX = Math.max(...flowerPoints.map(p => p.x));
      const minY = Math.min(...flowerPoints.map(p => p.y));
      const maxY = Math.max(...flowerPoints.map(p => p.y));
      console.log(`  Ara F${f} yellow flowers: x [${minX}..${maxX}], y [${minY}..${maxY}]`);
    }
  }
}

locateBouquetInFrames();
