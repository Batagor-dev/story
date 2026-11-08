import sharp from 'sharp';

// Helper to determine if a pixel is pink paper wrapping
function isPinkPaper(r, g, b, a) {
  if (a < 100) return false;
  return (r >= 180 && g <= 145 && b >= 95 && (r - g) >= 55 && (r - b) >= 45 && b >= g - 25);
}

// Helper to determine if a pixel is the ribbon bow
function isRibbon(r, g, b, a, isRibbonZone) {
  if (!isRibbonZone || a < 100) return false;
  const isRedKnot = (r > 150 && g < 75 && b < 85);
  const isWhiteBow = (r > 200 && g > 180 && b > 180 && Math.abs(r - b) < 40);
  return isRedKnot || isWhiteBow;
}

// Palette mapping for Paper
function getPaperColor(paper, r, g, b) {
  if (paper === 'pink') return [r, g, b];
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  if (paper === 'kraft') {
    const kr = Math.round(50 + lum * 215);
    const kg = Math.round(30 + lum * 195);
    const kb = Math.round(15 + lum * 165);
    return [Math.min(255, kr), Math.min(255, kg), Math.min(255, kb)];
  }

  if (paper === 'white') {
    const wr = Math.round(90 + lum * 205);
    const wg = Math.round(105 + lum * 185);
    const wb = Math.round(125 + lum * 162);
    return [Math.min(255, wr), Math.min(255, wg), Math.min(255, wb)];
  }

  return [r, g, b];
}

// Palette mapping for Ribbon
function getRibbonColor(ribbon, r, g, b) {
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  if (ribbon === 'red') {
    const rr = Math.round(120 + lum * 135);
    const rg = Math.round(15 + lum * 140);
    const rb = Math.round(15 + lum * 140);
    return [Math.min(255, rr), Math.min(255, rg), Math.min(255, rb)];
  }

  if (ribbon === 'yellow') {
    const yr = Math.round(140 + lum * 115);
    const yg = Math.round(70 + lum * 180);
    const yb = Math.round(10 + lum * 100);
    return [Math.min(255, yr), Math.min(255, yg), Math.min(255, yb)];
  }

  if (ribbon === 'blue') {
    const br = Math.round(15 + lum * 160);
    const bg = Math.round(80 + lum * 165);
    const bb = Math.round(140 + lum * 115);
    return [Math.min(255, br), Math.min(255, bg), Math.min(255, bb)];
  }

  return [r, g, b];
}

async function generateAll() {
  const p1 = 'C:/Users/LENOVO/.gemini/antigravity/brain/d2cf962e-2a97-4152-94ac-3037c9cae3ca/.user_uploaded/media_1794101917766_b22a486f.png';
  const p2 = 'C:/Users/LENOVO/.gemini/antigravity/brain/d2cf962e-2a97-4152-94ac-3037c9cae3ca/.user_uploaded/media_1794102005307_0171ded7.png';

  const papers = ['kraft', 'pink', 'white'];
  const ribbons = ['red', 'yellow', 'blue'];

  // ==================== 1. AREL FRAMES ====================
  // Frame 1 (idle/nervous, no bouquet)
  await sharp(p1)
    .extract({ left: 36, top: 46, width: 78, height: 212 })
    .png()
    .toFile('public/assets/sprites/cowo_give_1.png');
  console.log('Saved cowo_give_1.png');

  // Frame 5 (shy head scratching, no bouquet)
  await sharp(p1)
    .extract({ left: 805, top: 46, width: 97, height: 212 })
    .png()
    .toFile('public/assets/sprites/cowo_give_5.png');
  console.log('Saved cowo_give_5.png');

  // Arel bouquet frames: F2, F3, F4
  const arelBouquetConfigs = [
    {
      frameNum: 2,
      extractBox: { left: 220, top: 46, width: 100, height: 212 },
      bouquetArea: { minX: 52, maxX: 98, minY: 65, maxY: 118 },
      ribbonArea: { minX: 68, maxX: 88, minY: 106, maxY: 118 },
    },
    {
      frameNum: 3,
      extractBox: { left: 388, top: 46, width: 150, height: 212 },
      bouquetArea: { minX: 88, maxX: 148, minY: 65, maxY: 108 },
      ribbonArea: { minX: 112, maxX: 132, minY: 94, maxY: 106 },
    },
    {
      frameNum: 4,
      extractBox: { left: 585, top: 46, width: 167, height: 212 },
      bouquetArea: { minX: 105, maxX: 165, minY: 80, maxY: 120 },
      ribbonArea: { minX: 126, maxX: 148, minY: 104, maxY: 116 },
    },
  ];

  for (const cfg of arelBouquetConfigs) {
    const { data, info } = await sharp(p1).extract(cfg.extractBox).raw().toBuffer({ resolveWithObject: true });

    // Save default pink-red frame
    await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
      .png()
      .toFile(`public/assets/sprites/cowo_give_${cfg.frameNum}.png`);

    // If frame 4, also save as cowo_giving_bouquet.png
    if (cfg.frameNum === 4) {
      await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
        .png()
        .toFile('public/assets/sprites/cowo_giving_bouquet.png');
    }

    // Generate 9 palette variants
    for (const paper of papers) {
      for (const ribbon of ribbons) {
        const out = Buffer.from(data);
        for (let y = cfg.bouquetArea.minY; y <= cfg.bouquetArea.maxY; y++) {
          for (let x = cfg.bouquetArea.minX; x <= cfg.bouquetArea.maxX; x++) {
            const idx = (y * info.width + x) * 4;
            const r = data[idx], g = data[idx+1], b = data[idx+2], a = data[idx+3];
            const isRibbonZone = (
              x >= cfg.ribbonArea.minX && x <= cfg.ribbonArea.maxX &&
              y >= cfg.ribbonArea.minY && y <= cfg.ribbonArea.maxY
            );

            if (isRibbon(r, g, b, a, isRibbonZone)) {
              const [nr, ng, nb] = getRibbonColor(ribbon, r, g, b);
              out[idx] = nr; out[idx+1] = ng; out[idx+2] = nb;
            } else if (isPinkPaper(r, g, b, a)) {
              const [nr, ng, nb] = getPaperColor(paper, r, g, b);
              out[idx] = nr; out[idx+1] = ng; out[idx+2] = nb;
            }
          }
        }

        await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
          .png()
          .toFile(`public/assets/sprites/cowo_give_${cfg.frameNum}_${paper}_${ribbon}.png`);
      }
    }
    console.log(`Saved all 9 variants for cowo_give_${cfg.frameNum}`);
  }

  // ==================== 2. ARA FRAMES ====================
  // Frame 4 (hands on cheeks, overjoyed reaction, no bouquet)
  await sharp(p2)
    .extract({ left: 574, top: 5, width: 73, height: 176 })
    .png()
    .toFile('public/assets/sprites/cewe_happy_4.png');
  console.log('Saved cewe_happy_4.png');

  // Ara bouquet frames: F1, F2, F3
  const araBouquetConfigs = [
    {
      frameNum: 1,
      extractBox: { left: 31, top: 5, width: 92, height: 176 },
      bouquetArea: { minX: 52, maxX: 94, minY: 65, maxY: 96 },
      ribbonArea: { minX: 58, maxX: 78, minY: 84, maxY: 94 },
    },
    {
      frameNum: 2,
      extractBox: { left: 204, top: 5, width: 96, height: 176 },
      bouquetArea: { minX: 52, maxX: 96, minY: 65, maxY: 98 },
      ribbonArea: { minX: 58, maxX: 78, minY: 86, maxY: 96 },
    },
    {
      frameNum: 3,
      extractBox: { left: 410, top: 5, width: 83, height: 176 },
      bouquetArea: { minX: 48, maxX: 85, minY: 65, maxY: 94 },
      ribbonArea: { minX: 48, maxX: 68, minY: 82, maxY: 92 },
    },
  ];

  for (const cfg of araBouquetConfigs) {
    const { data, info } = await sharp(p2).extract(cfg.extractBox).raw().toBuffer({ resolveWithObject: true });

    // Save default pink-red frame
    await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
      .png()
      .toFile(`public/assets/sprites/cewe_happy_${cfg.frameNum}.png`);

    // If frame 2, also update cewe_accepting_bouquet.png
    if (cfg.frameNum === 2) {
      await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
        .png()
        .toFile('public/assets/sprites/cewe_accepting_bouquet.png');
    }

    // Generate 9 palette variants
    for (const paper of papers) {
      for (const ribbon of ribbons) {
        const out = Buffer.from(data);
        for (let y = cfg.bouquetArea.minY; y <= cfg.bouquetArea.maxY; y++) {
          for (let x = cfg.bouquetArea.minX; x <= cfg.bouquetArea.maxX; x++) {
            const idx = (y * info.width + x) * 4;
            const r = data[idx], g = data[idx+1], b = data[idx+2], a = data[idx+3];
            const isRibbonZone = (
              x >= cfg.ribbonArea.minX && x <= cfg.ribbonArea.maxX &&
              y >= cfg.ribbonArea.minY && y <= cfg.ribbonArea.maxY
            );

            if (isRibbon(r, g, b, a, isRibbonZone)) {
              const [nr, ng, nb] = getRibbonColor(ribbon, r, g, b);
              out[idx] = nr; out[idx+1] = ng; out[idx+2] = nb;
            } else if (isPinkPaper(r, g, b, a)) {
              const [nr, ng, nb] = getPaperColor(paper, r, g, b);
              out[idx] = nr; out[idx+1] = ng; out[idx+2] = nb;
            }
          }
        }

        await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
          .png()
          .toFile(`public/assets/sprites/cewe_happy_${cfg.frameNum}_${paper}_${ribbon}.png`);
      }
    }
    console.log(`Saved all 9 variants for cewe_happy_${cfg.frameNum}`);
  }

  console.log('All character bouquet sprites generated successfully!');
}

generateAll();
