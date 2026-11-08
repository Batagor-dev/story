import sharp from 'sharp';

// Helper to determine if a pixel is pink paper wrapping
function isPinkPaper(r, g, b, a) {
  if (a < 100) return false;
  // Pink paper has distinct high Red and Pinkish hue:
  // r > 180, g in [85..145], b in [100..165]
  // In pink: r is much higher than g (r - g >= 60) and r is higher than b (r - b >= 45)
  // Also b is higher than or close to g (in pink, blue channel is boosted compared to yellow/orange skin)
  return (r >= 180 && g <= 145 && b >= 95 && (r - g) >= 55 && (r - b) >= 45 && b >= g - 25);
}

// Helper to determine if a pixel is the ribbon bow at the cone tip
function isRibbon(r, g, b, a, isRibbonZone) {
  if (!isRibbonZone || a < 100) return false;
  // In the original images, ribbon has white/light pink and deep red shading
  // Or red knot: (r > 160 && g < 60 && b < 60) or white bow (r > 210 && g > 180 && b > 190)
  const isRedKnot = (r > 150 && g < 75 && b < 85);
  const isWhiteBow = (r > 200 && g > 180 && b > 180 && Math.abs(r - b) < 40);
  return isRedKnot || isWhiteBow;
}

// Palette mapping for Paper
function getPaperColor(paper, r, g, b) {
  if (paper === 'pink') return [r, g, b];

  // Brightness factor from original pink: 0.0 to 1.0
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  if (paper === 'kraft') {
    // Warm natural brown kraft paper
    // Highlight (lum ~ 0.8): 225, 190, 150
    // Midtone (lum ~ 0.55): 175, 120, 70
    // Shadow (lum ~ 0.35): 120, 75, 35
    // Deep shadow (lum ~ 0.2): 80, 45, 20
    const kr = Math.round(50 + lum * 215);
    const kg = Math.round(30 + lum * 195);
    const kb = Math.round(15 + lum * 165);
    return [Math.min(255, kr), Math.min(255, kg), Math.min(255, kb)];
  }

  if (paper === 'white') {
    // Translucent elegant white paper with soft cool shading
    // Highlight (lum ~ 0.8): 255, 255, 255
    // Midtone (lum ~ 0.55): 215, 225, 238
    // Shadow (lum ~ 0.35): 165, 180, 200
    // Deep shadow (lum ~ 0.2): 110, 125, 145
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
    // Vibrant warm yellow/gold ribbon
    const yr = Math.round(140 + lum * 115);
    const yg = Math.round(70 + lum * 180);
    const yb = Math.round(10 + lum * 100);
    return [Math.min(255, yr), Math.min(255, yg), Math.min(255, yb)];
  }

  if (ribbon === 'blue') {
    // Soft sky blue ribbon
    const br = Math.round(15 + lum * 160);
    const bg = Math.round(80 + lum * 165);
    const bb = Math.round(140 + lum * 115);
    return [Math.min(255, br), Math.min(255, bg), Math.min(255, bb)];
  }

  return [r, g, b];
}

async function testGenerator() {
  console.log('Testing palette mapping generator...');
  const { data, info } = await sharp('public/assets/sprites/test_arel_f2.png').raw().toBuffer({ resolveWithObject: true });

  const papers = ['kraft', 'pink', 'white'];
  const ribbons = ['red', 'yellow', 'blue'];

  for (const paper of papers) {
    for (const ribbon of ribbons) {
      const out = Buffer.from(data);
      for (let y = 65; y <= 118; y++) {
        for (let x = 52; x <= 98; x++) {
          const idx = (y * info.width + x) * 4;
          const r = data[idx], g = data[idx+1], b = data[idx+2], a = data[idx+3];
          const isRibbonArea = (y >= 106 && y <= 118 && x >= 68 && x <= 88);

          if (isRibbon(r, g, b, a, isRibbonArea)) {
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
        .toFile(`public/assets/sprites/test_cowo_give_2_${paper}_${ribbon}.png`);
    }
  }

  console.log('Successfully generated 9 test variants for Arel F2!');
}

testGenerator();
