import sharp from 'sharp';

const srcPath = 'C:/Users/LENOVO/.gemini/antigravity/brain/d2cf962e-2a97-4152-94ac-3037c9cae3ca/.user_uploaded/media_1794074886967_502c5983.png';

async function analyze() {
  const { data, info } = await sharp(srcPath).raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;
  
  // The image has 5 fountains. 967 / 5 = ~193.4 px each.
  // Fountain 1: x in [0, 193]
  // Fountain 2: x in [193, 386]
  
  // Let's inspect where the dark outlines and water are in Fountain 1 and Fountain 2
  console.log('Analyzing column presence of non-checkerboard pixels...');
  // Let's check water detection: Blue channel noticeably higher than red (e.g. B - R > 15) or dark stone outlines
  
  // Let's sample pixels in Fountain 1 center and Fountain 2 center
  // Center of F1 is around x = 115, Center of F2 is around x = 308
  console.log('Center of F1 bottom basin (y=150..185):');
  for (let y = 140; y < 185; y += 5) {
    const idx = (y * w + 115) * 3;
    console.log(`y=${y}, x=115: RGB(${data[idx]}, ${data[idx+1]}, ${data[idx+2]})`);
  }

  console.log('Bottom rim of F1 (y=170..185, checking x=50..180):');
  let f1MinY = 999, f1MaxY = -1, f1MinX = 999, f1MaxX = -1;
  let f2MinY = 999, f2MaxY = -1, f2MinX = 999, f2MaxX = -1;

  // Let's find checkerboard characteristics:
  // Checkerboard squares: usually 16x16 or 12x12 or similar.
  // In checkerboard, max(R,G,B) - min(R,G,B) is very low (< 10 usually, or < 15 due to jpeg compression)
  // And lightness is either ~130-145 or ~200-225.
}

analyze();
