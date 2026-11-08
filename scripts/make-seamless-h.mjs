import sharp from 'sharp';

const tilesetPath = 'C:/Users/LENOVO/.gemini/antigravity/brain/d2cf962e-2a97-4152-94ac-3037c9cae3ca/.user_uploaded/media_1794074302907_375c7ec2.png';

async function makeSeamlessHorizontalTile() {
  // Tile 2 is at { minX: 164, maxX: 288, minY: 28, maxY: 92, w: 125, h: 65 }
  // Let's extract it with full alpha (opaque background on dirt and grass)
  const raw = await sharp(tilesetPath)
    .extract({ left: 165, top: 28, width: 120, height: 65 })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const w = raw.info.width;
  const h = raw.info.height;
  const data = Buffer.from(raw.data);

  // Ensure fully opaque inside the tile (no semi-transparent edge pixels)
  // Let's check which pixels are transparent: only outside the grass edge
  // But inside the dirt and grass, alpha should be 255.
  // And to make it seamlessly tile horizontally:
  // We can blend the right edge into the left edge over a 12-pixel transition!
  const blendWidth = 12;
  for (let y = 0; y < h; y++) {
    for (let i = 0; i < blendWidth; i++) {
      const leftX = i;
      const rightX = w - blendWidth + i;
      
      const leftIdx = (y * w + leftX) * 4;
      const rightIdx = (y * w + rightX) * 4;

      const t = i / blendWidth; // 0 to 1

      // Blend left pixel with right pixel so left boundary x=0 matches right boundary x=w-1!
      // At x = 0 (left edge): it should match x = w - 1 (right edge)!
      // So at leftX=0 and rightX=w-1, we average them or interpolate!
    }
  }

  // A standard way to make a texture seamlessly tile horizontally:
  // Take the original tile, and for a blend zone of width K:
  // For x in [0..K-1]:
  // lerp between original(x) and original(w - K + x):
  // pixel(x) = (1 - factor) * orig(w - K + x) + factor * orig(x) where factor = x / K
  // And symmetrically at the right edge!
  // That guarantees orig(0) = orig(w-K), or left edge wraps exactly to right edge!
}

makeSeamlessHorizontalTile();
