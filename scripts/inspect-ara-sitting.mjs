import sharp from 'sharp';

const srcPath = 'C:/Users/LENOVO/.gemini/antigravity/brain/d2cf962e-2a97-4152-94ac-3037c9cae3ca/.user_uploaded/media_1794074867787_ed610199.png';

async function inspect() {
  const { data, info } = await sharp(srcPath).raw().toBuffer({ resolveWithObject: true });
  console.log(`Dimensions: ${info.width}x${info.height}, channels: ${info.channels}`);

  // Check top-left corner pixel
  console.log(`(0,0): RGBA(${data[0]}, ${data[1]}, ${data[2]}, ${data[3]})`);
  console.log(`(10,10): RGBA(${data[(10*info.width+10)*4]}, ${data[(10*info.width+10)*4+1]}, ${data[(10*info.width+10)*4+2]}, ${data[(10*info.width+10)*4+3]})`);

  // Find bounding box of opaque/non-white pixels on left half and right half
  const midX = Math.floor(info.width / 2); // ~227

  function getBounds(startX, endX) {
    let minX = 999, maxX = -1, minY = 999, maxY = -1;
    for (let y = 0; y < info.height; y++) {
      for (let x = startX; x < endX; x++) {
        const idx = (y * info.width + x) * 4;
        const r = data[idx], g = data[idx+1], b = data[idx+2], a = data[idx+3];
        // If not transparent and not white
        const isBg = a < 20 || (r > 250 && g > 250 && b > 250);
        if (!isBg) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }
    return { minX, maxX, minY, maxY, w: maxX - minX + 1, h: maxY - minY + 1 };
  }

  console.log('Left figure bounds:', getBounds(0, midX));
  console.log('Right figure bounds:', getBounds(midX, info.width));
}

inspect();
