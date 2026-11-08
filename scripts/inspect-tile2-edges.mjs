import sharp from 'sharp';

const tilesetPath = 'C:/Users/LENOVO/.gemini/antigravity/brain/d2cf962e-2a97-4152-94ac-3037c9cae3ca/.user_uploaded/media_1794074302907_375c7ec2.png';

async function inspectTile2Edges() {
  const { data, info } = await sharp(tilesetPath).raw().toBuffer({ resolveWithObject: true });

  console.log('Pixels at y=60 across x=160..295:');
  for (let x = 160; x <= 295; x += 5) {
    const idx = (60 * info.width + x) * 4;
    console.log(`x=${x}: RGBA(${data[idx]}, ${data[idx+1]}, ${data[idx+2]}, ${data[idx+3]})`);
  }
}

inspectTile2Edges();
