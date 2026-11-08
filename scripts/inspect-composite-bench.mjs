import sharp from 'sharp';

async function inspectCompositeBench() {
  const { data, info } = await sharp('public/assets/sprites/test_afternoon_scene_bench.png')
    .extract({ left: 680, top: 320, width: 220, height: 170 })
    .raw()
    .toBuffer({ resolveWithObject: true });

  console.log('--- Composite Area (Ara standing in front of bench) ---');
  for (let y = 0; y < info.height; y += 8) {
    let line = ('00' + (y + 320)).slice(-3) + ' ';
    for (let x = 0; x < info.width; x += 4) {
      const idx = (y * info.width + x) * 4;
      const r = data[idx], g = data[idx+1], b = data[idx+2];
      if (r === 92 && g === 154 && b === 64) line += ' '; // grass
      else if (r < 60 && g < 60 && b < 60) line += '#'; // iron / shoes
      else if (r > 120 && g > 70 && b < 70) line += '='; // wood
      else if (r > 160 && g > 130 && b > 90) line += 'S'; // Ara skirt/blouse
      else line += '.'; // Ara hair/skin or wood highlight
    }
    console.log(line);
  }
}

inspectCompositeBench();
