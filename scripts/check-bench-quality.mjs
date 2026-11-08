import sharp from 'sharp';

async function checkBenchQuality() {
  const { data, info } = await sharp('public/assets/sprites/bench_empty_trimmed.png').raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;

  console.log(`Trimmed bench dimensions: ${w}x${h}`);

  // Let's print ASCII representation of the bench
  for (let y = 0; y < h; y += 4) {
    let line = ('00' + y).slice(-3) + ' ';
    for (let x = 0; x < w; x += 3) {
      const idx = (y * w + x) * 4;
      const r = data[idx], g = data[idx+1], b = data[idx+2], a = data[idx+3];
      if (a < 50) line += ' ';
      else if (r < 75 && g < 75 && b < 75) line += '#';
      else if (r > 120 && g > 70 && b < 70) line += '=';
      else if (r > 160 && g > 120 && b < 100) line += '%';
      else line += '.';
    }
    console.log(line);
  }
}

checkBenchQuality();
