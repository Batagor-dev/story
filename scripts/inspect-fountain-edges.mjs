import sharp from 'sharp';

async function inspectEdges() {
  for (const name of ['fountain_1.png', 'fountain_2.png']) {
    const filePath = `public/assets/sprites/${name}`;
    const { data, info } = await sharp(filePath).raw().toBuffer({ resolveWithObject: true });
    
    // Check y=7..15 for fountain_1 (topmost water)
    console.log(`\n--- ${name} top rows: ---`);
    for (let y = 4; y <= 15; y++) {
      let opaqueX = [];
      for (let x = 0; x < info.width; x++) {
        const idx = (y * info.width + x) * 4;
        if (data[idx + 3] > 0) opaqueX.push(x);
      }
      if (opaqueX.length > 0) {
        const firstIdx = (y * info.width + opaqueX[0]) * 4;
        console.log(`y=${y}: count=${opaqueX.length}, x=[${opaqueX[0]}..${opaqueX[opaqueX.length-1]}], sample=RGB(${data[firstIdx]}, ${data[firstIdx+1]}, ${data[firstIdx+2]})`);
      }
    }
  }
}

inspectEdges();
