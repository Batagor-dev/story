import sharp from 'sharp';
import fs from 'fs';

// Flood fill algorithm to remove outer checkerboard background
async function removeCheckerboard(inputPath, outputPath, options = {}) {
  const image = sharp(inputPath);
  const { data, info } = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info; // channels should be 4 (RGBA)

  // Identify sample background colors from corners
  const corners = [
    [0, 0],
    [width - 1, 0],
    [0, height - 1],
    [width - 1, height - 1],
    [46, 0],
    [0, 46],
  ];

  // Helper to get color distance
  function isBgPixel(r, g, b) {
    // Check saturation (checkerboards are almost pure grayscale/desaturated)
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;
    const avg = (r + g + b) / 3;

    if (options.customIsBg) {
      return options.customIsBg(r, g, b, diff, avg);
    }

    // Typical checkerboard has low saturation diff <= 25
    // And brightness is usually either light gray/white or mid gray
    // For cowo/cewe: ~180-205 and ~220-240, diff <= 22
    // For bunga: ~80-95 and ~140-155, diff <= 12
    return diff <= 25;
  }

  // BFS / Queue flood fill from all perimeter pixels
  const visited = new Uint8Array(width * height);
  const queue = new Int32Array(width * height);
  let head = 0;
  let tail = 0;

  function push(x, y) {
    const idx = y * width + x;
    if (visited[idx] === 0) {
      visited[idx] = 1;
      queue[tail++] = idx;
    }
  }

  // Seed with outer border
  for (let x = 0; x < width; x++) {
    push(x, 0);
    push(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    push(0, y);
    push(width - 1, y);
  }

  while (head < tail) {
    const idx = queue[head++];
    const x = idx % width;
    const y = Math.floor(idx / width);
    const pIdx = idx * 4;

    const r = data[pIdx];
    const g = data[pIdx + 1];
    const b = data[pIdx + 2];

    if (isBgPixel(r, g, b)) {
      data[pIdx + 3] = 0; // Make transparent!

      // Check 4 neighbors
      if (x > 0 && visited[idx - 1] === 0) push(x - 1, y);
      if (x < width - 1 && visited[idx + 1] === 0) push(x + 1, y);
      if (y > 0 && visited[idx - width] === 0) push(x, y - 1);
      if (y < height - 1 && visited[idx + width] === 0) push(x, y + 1);
    }
  }

  await sharp(data, {
    raw: {
      width,
      height,
      channels: 4,
    }
  }).png().toFile(outputPath);

  console.log(`Saved transparent image: ${outputPath}`);
}

async function run() {
  fs.mkdirSync('public/assets/processed', { recursive: true });
  await removeCheckerboard('public/assets/karakter/karakter_cowo.jpeg', 'public/assets/processed/karakter_cowo.png');
  await removeCheckerboard('public/assets/karakter/karakter_cewe.jpeg', 'public/assets/processed/karakter_cewe.png');
  await removeCheckerboard('public/assets/componet/bunga.jpeg', 'public/assets/processed/bunga.png');
  await removeCheckerboard('public/assets/componet/buklet_bungan.jpeg', 'public/assets/processed/buklet_bungan.png');
  await removeCheckerboard('public/assets/componet/pohon.jpeg', 'public/assets/processed/pohon.png');
  await removeCheckerboard('public/assets/componet/semak.jpeg', 'public/assets/processed/semak.png');
}

run();
