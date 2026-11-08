import sharp from 'sharp';

const tilesetPath = 'C:/Users/LENOVO/.gemini/antigravity/brain/d2cf962e-2a97-4152-94ac-3037c9cae3ca/.user_uploaded/media_1794074302907_375c7ec2.png';

async function measureH() {
  // Tile 2 is at { minX: 164, maxX: 288, minY: 28, maxY: 92, w: 125, h: 65 }
  const raw = await sharp(tilesetPath)
    .extract({ left: 164, top: 28, width: 125, height: 65 })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const w = raw.info.width;
  const h = raw.info.height;

  // Let's find dirt at left edge (x=0) and right edge (x=w-1):
  let leftMinY = -1, leftMaxY = -1;
  let rightMinY = -1, rightMaxY = -1;

  for (let y = 0; y < h; y++) {
    const lIdx = (y * w + 0) * 4;
    const rIdx = (y * w + (w - 1)) * 4;
    if (raw.data[lIdx + 3] > 100 && raw.data[lIdx] > 140 && raw.data[lIdx+1] > 110 && raw.data[lIdx+2] < 130) {
      if (leftMinY === -1) leftMinY = y;
      leftMaxY = y;
    }
    if (raw.data[rIdx + 3] > 100 && raw.data[rIdx] > 140 && raw.data[rIdx+1] > 110 && raw.data[rIdx+2] < 130) {
      if (rightMinY === -1) rightMinY = y;
      rightMaxY = y;
    }
  }

  console.log(`Horizontal tile: left dirt y=[${leftMinY}..${leftMaxY}], height=${leftMaxY - leftMinY + 1}`);
  console.log(`Horizontal tile: right dirt y=[${rightMinY}..${rightMaxY}], height=${rightMaxY - rightMinY + 1}`);
}

measureH();
