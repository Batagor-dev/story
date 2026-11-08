import sharp from 'sharp';

async function checkFountainSprites() {
  for (const name of ['fountain_1.png', 'fountain_2.png']) {
    const filePath = `public/assets/sprites/${name}`;
    const { data, info } = await sharp(filePath).raw().toBuffer({ resolveWithObject: true });
    
    let opaqueCount = 0;
    let transparentCount = 0;
    let minX = 999, maxX = -1, minY = 999, maxY = -1;

    for (let y = 0; y < info.height; y++) {
      for (let x = 0; x < info.width; x++) {
        const idx = (y * info.width + x) * 4;
        const a = data[idx + 3];
        if (a > 0) {
          opaqueCount++;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        } else {
          transparentCount++;
        }
      }
    }

    console.log(`=== ${name} ===`);
    console.log(`Dimensions: ${info.width}x${info.height}`);
    console.log(`Opaque pixels: ${opaqueCount}, Transparent: ${transparentCount}`);
    console.log(`Opaque bounds: x=[${minX}..${maxX}] (w=${maxX-minX+1}), y=[${minY}..${maxY}] (h=${maxY-minY+1})`);
    
    // Check top 5 lines of opaque pixels
    console.log(`Topmost opaque pixel is at y=${minY}`);
    // Check bottommost opaque pixel
    console.log(`Bottommost opaque pixel is at y=${maxY}`);
  }
}

checkFountainSprites();
