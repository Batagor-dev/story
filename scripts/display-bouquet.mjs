import sharp from 'sharp';

async function displayBouquetArea() {
  console.log('=== Arel F2 bouquet region (x=50..98, y=60..130) ===');
  const { data: d2, info: i2 } = await sharp('public/assets/sprites/test_arel_f2.png').raw().toBuffer({ resolveWithObject: true });
  for (let y = 60; y <= 130; y += 4) {
    let line = ('00' + y).slice(-3) + ' ';
    for (let x = 50; x < i2.width; x += 2) {
      const idx = (y * i2.width + x) * 4;
      const r = d2[idx], g = d2[idx+1], b = d2[idx+2], a = d2[idx+3];
      if (a < 50) line += ' ';
      else if (r > 190 && g < 130 && b > 110) line += 'P'; // pink paper
      else if (r > 180 && g > 180 && b > 180) line += 'W'; // white flower
      else if (r > 180 && g > 160 && b < 100) line += 'Y'; // yellow flower
      else if (r > 160 && g < 80 && b < 80) line += 'R'; // red flower
      else if (r < 70 && g < 70 && b < 70) line += '#'; // dark outline / shirt
      else line += '.';
    }
    console.log(line);
  }
}

displayBouquetArea();
