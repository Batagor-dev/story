import sharp from 'sharp';

async function findButtonBoxes() {
  const { data, info } = await sharp('public/assets/clean/button.png').raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const visited = new Uint8Array(width * height);
  const boxes = [];

  for (let y = 0; y < height; y += 8) {
    for (let x = 0; x < width; x += 8) {
      const idx = y * width + x;
      if (visited[idx] === 0 && data[idx * 4 + 3] > 20) {
        let minX = x, maxX = x, minY = y, maxY = y;
        const q = [idx];
        visited[idx] = 1;
        let head = 0;

        while (head < q.length) {
          const curr = q[head++];
          const cx = curr % width;
          const cy = Math.floor(curr / width);

          if (cx < minX) minX = cx;
          if (cx > maxX) maxX = cx;
          if (cy < minY) minY = cy;
          if (cy > maxY) maxY = cy;

          const step = 4;
          const neighbors = [
            cy > step ? curr - step * width : -1,
            cy < height - step ? curr + step * width : -1,
            cx > step ? curr - step : -1,
            cx < width - step ? curr + step : -1
          ];

          for (const n of neighbors) {
            if (n >= 0 && visited[n] === 0 && data[n * 4 + 3] > 20) {
              visited[n] = 1;
              q.push(n);
            }
          }
        }

        const w = maxX - minX;
        const h = maxY - minY;
        if (w * h > 3000 && w > 40 && h > 40) {
          boxes.push({ minX, minY, maxX, maxY, w, h });
        }
      }
    }
  }

  boxes.forEach((b, i) => console.log(`Button ${i}: x=${b.minX}, y=${b.minY}, w=${b.w}, h=${b.h}`));
}

findButtonBoxes();
