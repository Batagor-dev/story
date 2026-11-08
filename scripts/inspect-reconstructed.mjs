import sharp from 'sharp';

async function inspectReconstructed() {
  const { data, info } = await sharp('public/assets/sprites/test_bench_reconstructed.png').raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;

  // Let's print ASCII representation of test_bench_reconstructed.png
  for (let y = 50; y < 190; y += 4) {
    let line = ('00' + y).slice(-3) + ' ';
    for (let x = 0; x < w; x += 3) {
      const idx = (y * w + x) * 4;
      const r = data[idx], g = data[idx+1], b = data[idx+2], a = data[idx+3];
      if (a === 0) line += ' ';
      else if (r < 70 && g < 70 && b < 70) line += '#';
      else if (r > 120 && g > 70 && b < 70) line += '=';
      else if (r > 160 && g > 120 && b < 100) line += '%';
      else line += '.';
    }
    console.log(line);
  }
}

inspectReconstructed();
