import sharp from 'sharp';

async function inspectBouquetColors() {
  const p1 = 'C:/Users/LENOVO/.gemini/antigravity/brain/d2cf962e-2a97-4152-94ac-3037c9cae3ca/.user_uploaded/media_1794101917766_b22a486f.png';
  const p2 = 'C:/Users/LENOVO/.gemini/antigravity/brain/d2cf962e-2a97-4152-94ac-3037c9cae3ca/.user_uploaded/media_1794102005307_0171ded7.png';

  const { data: d1, info: i1 } = await sharp(p1).raw().toBuffer({ resolveWithObject: true });
  const { data: d2, info: i2 } = await sharp(p2).raw().toBuffer({ resolveWithObject: true });

  // In Arel frame 2: x in [220..319]
  // Bouquet is around x=280..315, y=100..155
  console.log('--- Arel Frame 2 Bouquet Pixels ---');
  let pinkPixels = [];
  for (let x = 270; x <= 318; x++) {
    for (let y = 100; y <= 155; y++) {
      const idx = (y * i1.width + x) * 4;
      const r = d1[idx], g = d1[idx+1], b = d1[idx+2], a = d1[idx+3];
      // Check pink paper colors: r > 180, g < 150, b in 130..190
      if (a > 100 && r > 160 && g < 150 && b > 100 && r > b) {
        pinkPixels.push({ x, y, r, g, b });
      }
    }
  }
  console.log(`Found ${pinkPixels.length} pink wrapping pixels in Arel Frame 2`);
  // Top 10 unique pink colors
  let uniqueColors = new Map();
  for (const p of pinkPixels) {
    const key = `${p.r},${p.g},${p.b}`;
    uniqueColors.set(key, (uniqueColors.get(key) || 0) + 1);
  }
  console.log('Unique pink colors:', [...uniqueColors.entries()].sort((a,b)=>b[1]-a[1]).slice(0, 10));

  // In Ara Frame 1: x in [31..122]
  // Bouquet is around x=85..122, y=60..110
  console.log('--- Ara Frame 1 Bouquet Pixels ---');
  let araPinkPixels = [];
  for (let x = 80; x <= 122; x++) {
    for (let y = 55; y <= 110; y++) {
      const idx = (y * i2.width + x) * 4;
      const r = d2[idx], g = d2[idx+1], b = d2[idx+2], a = d2[idx+3];
      if (a > 100 && r > 160 && g < 150 && b > 100 && r > b) {
        araPinkPixels.push({ x, y, r, g, b });
      }
    }
  }
  console.log(`Found ${araPinkPixels.length} pink wrapping pixels in Ara Frame 1`);
  let uniqueAraColors = new Map();
  for (const p of araPinkPixels) {
    const key = `${p.r},${p.g},${p.b}`;
    uniqueAraColors.set(key, (uniqueAraColors.get(key) || 0) + 1);
  }
  console.log('Unique Ara pink colors:', [...uniqueAraColors.entries()].sort((a,b)=>b[1]-a[1]).slice(0, 10));
}

inspectBouquetColors();
