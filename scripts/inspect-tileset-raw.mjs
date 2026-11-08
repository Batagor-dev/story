import sharp from 'sharp';

const tilesetPath = 'C:/Users/LENOVO/.gemini/antigravity/brain/d2cf962e-2a97-4152-94ac-3037c9cae3ca/.user_uploaded/media_1794074302907_375c7ec2.png';

async function inspectTileset() {
  const meta = await sharp(tilesetPath).metadata();
  console.log('Tileset metadata:', meta);
}

inspectTileset();
