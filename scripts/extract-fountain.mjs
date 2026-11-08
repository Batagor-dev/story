import sharp from 'sharp';

const srcPath = 'C:/Users/LENOVO/.gemini/antigravity/brain/d2cf962e-2a97-4152-94ac-3037c9cae3ca/.user_uploaded/media_1794074886967_502c5983.png';

async function extractFountains() {
  const { data, info } = await sharp(srcPath).raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;

  function processRegion(cropX, cropY, cropW, cropH) {
    const rgba = Buffer.alloc(cropW * cropH * 4);
    
    for (let cy = 0; cy < cropH; cy++) {
      for (let cx = 0; cx < cropW; cx++) {
        const srcX = cropX + cx;
        const srcY = cropY + cy;
        const srcIdx = (srcY * w + srcX) * 3;
        const dstIdx = (cy * cropW + cx) * 4;
        
        rgba[dstIdx] = data[srcIdx];
        rgba[dstIdx + 1] = data[srcIdx + 1];
        rgba[dstIdx + 2] = data[srcIdx + 2];
        rgba[dstIdx + 3] = 255;
      }
    }

    function isBgCandidate(cx, cy) {
      if (cx < 0 || cx >= cropW || cy < 0 || cy >= cropH) return false;
      const idx = (cy * cropW + cx) * 4;
      const r = rgba[idx], g = rgba[idx+1], b = rgba[idx+2];
      const diff = Math.max(Math.abs(r - g), Math.abs(g - b), Math.abs(b - r));
      
      // Water is blue/cyan (b noticeably higher than r)
      if (b - r >= 14 || b - g >= 14) return false;
      
      // Stone is warm brown/grey (r noticeably higher than b)
      if (r > 60 && r - b >= 14) return false;
      
      // Dark outlines of stone: very dark (e.g. RGB < 45) but ONLY if part of the basin/structure
      // Top bar is dark at y < 10, so if cy < 12 and r < 55, it's definitely background top bar
      if (cy < 12 && r < 60) return true;

      // Checkerboard tiles:
      if (diff <= 12) return true;
      if (diff <= 14 && (r >= 120 && r <= 165 || r >= 180 && r <= 245)) return true;

      return false;
    }

    // Flood fill from all 4 borders
    const visited = new Uint8Array(cropW * cropH);
    const queue = [];

    function push(cx, cy) {
      const idx = cy * cropW + cx;
      if (!visited[idx]) {
        visited[idx] = 1;
        queue.push(cx, cy);
      }
    }

    for (let x = 0; x < cropW; x++) {
      if (isBgCandidate(x, 0)) push(x, 0);
      if (isBgCandidate(x, cropH - 1)) push(x, cropH - 1);
    }
    for (let y = 0; y < cropH; y++) {
      if (isBgCandidate(0, y)) push(0, y);
      if (isBgCandidate(cropW - 1, y)) push(cropW - 1, y);
    }

    let head = 0;
    while (head < queue.length) {
      const cx = queue[head++];
      const cy = queue[head++];

      const dstIdx = (cy * cropW + cx) * 4;
      rgba[dstIdx + 3] = 0;

      const neighbors = [
        [cx + 1, cy],
        [cx - 1, cy],
        [cx, cy + 1],
        [cx, cy - 1]
      ];

      for (const [nx, ny] of neighbors) {
        if (nx >= 0 && nx < cropW && ny >= 0 && ny < cropH) {
          const nIdx = ny * cropW + nx;
          if (!visited[nIdx] && isBgCandidate(nx, ny)) {
            visited[nIdx] = 1;
            queue.push(nx, ny);
          }
        }
      }
    }

    // Secondary pass: remove tiny floating islands of <= 5 pixels (compression noise)
    const opaqueVisited = new Uint8Array(cropW * cropH);
    for (let cy = 0; cy < cropH; cy++) {
      for (let cx = 0; cx < cropW; cx++) {
        const idx = cy * cropW + cx;
        if (rgba[idx * 4 + 3] > 0 && !opaqueVisited[idx]) {
          // BFS component
          const comp = [[cx, cy]];
          opaqueVisited[idx] = 1;
          let cHead = 0;
          while (cHead < comp.length) {
            const [curX, curY] = comp[cHead++];
            for (const [nx, ny] of [[curX+1, curY], [curX-1, curY], [curX, curY+1], [curX, curY-1]]) {
              if (nx >= 0 && nx < cropW && ny >= 0 && ny < cropH) {
                const nIdx = ny * cropW + nx;
                if (rgba[nIdx * 4 + 3] > 0 && !opaqueVisited[nIdx]) {
                  opaqueVisited[nIdx] = 1;
                  comp.push([nx, ny]);
                }
              }
            }
          }
          // If this isolated component is tiny (< 8 pixels) and far from the center (e.g. at the top or edges), remove it
          if (comp.length < 8) {
            for (const [px, py] of comp) {
              rgba[(py * cropW + px) * 4 + 3] = 0;
            }
          }
        }
      }
    }

    return rgba;
  }

  const cropW = 160;
  const cropH = 150;
  const cropY = 30;

  const f1Data = processRegion(37, cropY, cropW, cropH);
  await sharp(f1Data, { raw: { width: cropW, height: cropH, channels: 4 } })
    .png()
    .toFile('public/assets/sprites/fountain_1.png');
  console.log('Saved public/assets/sprites/fountain_1.png');

  const f2Data = processRegion(225, cropY, cropW, cropH);
  await sharp(f2Data, { raw: { width: cropW, height: cropH, channels: 4 } })
    .png()
    .toFile('public/assets/sprites/fountain_2.png');
  console.log('Saved public/assets/sprites/fountain_2.png');
}

extractFountains();
