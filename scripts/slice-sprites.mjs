import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// Helper to find bounding boxes of separated objects in an alpha image
async function findComponents(imagePath, minArea = 1000) {
  const { data, info } = await sharp(imagePath).raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const visited = new Uint8Array(width * height);
  const boxes = [];

  for (let y = 0; y < height; y += 4) {
    for (let x = 0; x < width; x += 4) {
      const idx = y * width + x;
      if (visited[idx] === 0 && data[idx * 4 + 3] > 20) {
        // Flood fill to get bounding box
        let minX = x, maxX = x, minY = y, maxY = y;
        let pixelCount = 0;
        const q = [idx];
        visited[idx] = 1;
        let head = 0;

        while (head < q.length) {
          const curr = q[head++];
          const cx = curr % width;
          const cy = Math.floor(curr / width);
          pixelCount++;

          if (cx < minX) minX = cx;
          if (cx > maxX) maxX = cx;
          if (cy < minY) minY = cy;
          if (cy > maxY) maxY = cy;

          // Check step neighbors
          const step = 2;
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
        if (w * h > minArea && w > 20 && h > 20) {
          boxes.push({ minX, minY, maxX, maxY, w, h, pixelCount });
        }
      }
    }
  }

  // Sort by Y then X
  boxes.sort((a, b) => {
    if (Math.abs(a.minY - b.minY) > 80) return a.minY - b.minY;
    return a.minX - b.minX;
  });

  return boxes;
}

async function run() {
  const cowoBoxes = await findComponents('public/assets/clean/karakter_cowo.png', 2000);
  console.log(`Cowo components: ${cowoBoxes.length}`);
  cowoBoxes.forEach((b, i) => console.log(`Cowo ${i}: x=${b.minX}, y=${b.minY}, w=${b.w}, h=${b.h}`));

  const flowerBoxes = await findComponents('public/assets/clean/bunga.png', 1000);
  console.log(`Bunga components: ${flowerBoxes.length}`);
  flowerBoxes.forEach((b, i) => console.log(`Flower ${i}: x=${b.minX}, y=${b.minY}, w=${b.w}, h=${b.h}`));

  const bouquetBoxes = await findComponents('public/assets/clean/buklet_bungan.png', 1500);
  console.log(`Bouquet components: ${bouquetBoxes.length}`);
  bouquetBoxes.forEach((b, i) => console.log(`Bouquet ${i}: x=${b.minX}, y=${b.minY}, w=${b.w}, h=${b.h}`));
}

run();
