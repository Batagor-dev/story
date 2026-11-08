import sharp from 'sharp';

async function inspectRibbon() {
  const p1 = 'C:/Users/LENOVO/.gemini/antigravity/brain/d2cf962e-2a97-4152-94ac-3037c9cae3ca/.user_uploaded/media_1794101917766_b22a486f.png';
  const { data, info } = await sharp(p1).raw().toBuffer({ resolveWithObject: true });

  // Arel Frame 2: look at bottom of bouquet wrapping (y=135..160, x=280..315)
  console.log('--- Arel Frame 2 Bouquet Bottom / Ribbon (y=135..155, x=280..310) ---');
  for (let y = 135; y <= 155; y += 2) {
    let row = `y=${y}: `;
    for (let x = 280; x <= 310; x += 2) {
      const idx = (y * info.width + x) * 4;
      const r = data[idx], g = data[idx+1], b = data[idx+2], a = data[idx+3];
      if (a < 50) row += '   .   ';
      else row += `${String(r).padStart(3)},${String(g).padStart(3)} `;
    }
    console.log(row);
  }
}

inspectRibbon();
