import sharp from 'sharp';

async function measureFeet() {
  for (let i = 1; i <= 5; i++) {
    const { data, info } = await sharp(`public/assets/sprites/test_arel_f${i}.png`).raw().toBuffer({ resolveWithObject: true });
    // Inspect bottom 15 rows: y from info.height - 15 to info.height - 1
    let footXs = [];
    for (let y = info.height - 15; y < info.height; y++) {
      for (let x = 0; x < info.width; x++) {
        const idx = (y * info.width + x) * 4;
        if (data[idx + 3] > 100) {
          footXs.push(x);
        }
      }
    }
    const minFootX = Math.min(...footXs);
    const maxFootX = Math.max(...footXs);
    console.log(`Arel F${i}: w=${info.width}, foot X range = [${minFootX}..${maxFootX}]`);
  }

  for (let i = 1; i <= 4; i++) {
    const { data, info } = await sharp(`public/assets/sprites/test_ara_f${i}.png`).raw().toBuffer({ resolveWithObject: true });
    let footXs = [];
    for (let y = info.height - 15; y < info.height; y++) {
      for (let x = 0; x < info.width; x++) {
        const idx = (y * info.width + x) * 4;
        if (data[idx + 3] > 100) {
          footXs.push(x);
        }
      }
    }
    const minFootX = Math.min(...footXs);
    const maxFootX = Math.max(...footXs);
    console.log(`Ara F${i}: w=${info.width}, foot X range = [${minFootX}..${maxFootX}]`);
  }
}

measureFeet();
