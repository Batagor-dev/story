import sharp from 'sharp';

async function mapAllBouquetBoxes() {
  // Arel F3:
  const { data: d3, info: i3 } = await sharp('public/assets/sprites/test_arel_f3.png').raw().toBuffer({ resolveWithObject: true });
  console.log('=== Arel F3 ===');
  for (let y = 45; y <= 110; y += 4) {
    let line = ('00' + y).slice(-3) + ' ';
    for (let x = 80; x < i3.width; x += 2) {
      const idx = (y * i3.width + x) * 4;
      const r = d3[idx], g = d3[idx+1], b = d3[idx+2], a = d3[idx+3];
      if (a < 50) line += ' ';
      else if (r > 190 && g < 130 && b > 110) line += 'P';
      else if (r < 70 && g < 70 && b < 70) line += '#';
      else line += '.';
    }
    console.log(line);
  }

  // Arel F4:
  const { data: d4, info: i4 } = await sharp('public/assets/sprites/test_arel_f4.png').raw().toBuffer({ resolveWithObject: true });
  console.log('=== Arel F4 ===');
  for (let y = 55; y <= 125; y += 4) {
    let line = ('00' + y).slice(-3) + ' ';
    for (let x = 100; x < i4.width; x += 2) {
      const idx = (y * i4.width + x) * 4;
      const r = d4[idx], g = d4[idx+1], b = d4[idx+2], a = d4[idx+3];
      if (a < 50) line += ' ';
      else if (r > 190 && g < 130 && b > 110) line += 'P';
      else if (r < 70 && g < 70 && b < 70) line += '#';
      else line += '.';
    }
    console.log(line);
  }

  // Ara F1, F2, F3:
  for (let f = 1; f <= 3; f++) {
    const { data: da, info: ia } = await sharp(`public/assets/sprites/test_ara_f${f}.png`).raw().toBuffer({ resolveWithObject: true });
    console.log(`=== Ara F${f} ===`);
    for (let y = 40; y <= 100; y += 4) {
      let line = ('00' + y).slice(-3) + ' ';
      for (let x = 30; x < ia.width; x += 2) {
        const idx = (y * ia.width + x) * 4;
        const r = da[idx], g = da[idx+1], b = da[idx+2], a = da[idx+3];
        if (a < 50) line += ' ';
        else if (r > 190 && g < 130 && b > 110) line += 'P';
        else if (r < 70 && g < 70 && b < 70) line += '#';
        else line += '.';
      }
      console.log(line);
    }
  }
}

mapAllBouquetBoxes();
