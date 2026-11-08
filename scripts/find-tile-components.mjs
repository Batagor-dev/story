import sharp from 'sharp';

const tilesetPath = 'C:/Users/LENOVO/.gemini/antigravity/brain/d2cf962e-2a97-4152-94ac-3037c9cae3ca/.user_uploaded/media_1794074302907_375c7ec2.png';

async function findTiles() {
  const { data, info } = await sharp(tilesetPath).raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;

  // Let's find connected components of non-white/non-transparent pixels
  // Background in this PNG: let's check what background color is
  console.log(`Tileset info: ${w}x${h}`);
  console.log(`Top-left pixel: RGBA(${data[0]}, ${data[1]}, ${data[2]}, ${data[3]})`);

  const visited = new Uint8Array(w * h);
  const components = [];

  function isOpaque(x, y) {
    const idx = (y * w + x) * 4;
    const a = data[idx + 3];
    const r = data[idx], g = data[idx+1], b = data[idx+2];
    // Background is white or transparent
    if (a < 50) return false;
    if (r > 240 && g > 240 && b > 240) return false;
    return true;
  }

  for (let y = 0; y < h; y += 4) {
    for (let x = 0; x < w; x += 4) {
      const idx = y * w + x;
      if (!visited[idx] && isOpaque(x, y)) {
        // BFS
        const queue = [[x, y]];
        visited[idx] = 1;
        let minX = x, maxX = x, minY = y, maxY = y;
        let count = 0;

        let qHead = 0;
        while (qHead < queue.length) {
          const [cx, cy] = queue[qHead++];
          count++;
          if (cx < minX) minX = cx;
          if (cx > maxX) maxX = cx;
          if (cy < minY) minY = cy;
          if (cy > maxY) maxY = cy;

          for (const [nx, ny] of [[cx+4, cy], [cx-4, cy], [cx, cy+4], [cx, cy-4]]) {
            if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
              const nIdx = ny * w + nx;
              if (!visited[nIdx] && isOpaque(nx, ny)) {
                visited[nIdx] = 1;
                queue.push([nx, ny]);
              }
            }
          }
        }

        if (count > 50) {
          components.push({ minX, maxX, minY, maxY, w: maxX - minX + 1, h: maxY - minY + 1, count });
        }
      }
    }
  }

  console.log('Found components:', components);
}

findTiles();
