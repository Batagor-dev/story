import sharp from 'sharp';
import fs from 'fs';

async function removeCheckerboardStrict(inputPath, outputPath, colorA, colorB, tolerance = 35) {
  const image = sharp(inputPath);
  const { data, info } = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;

  // Let's also do a flood fill starting from borders so we only eliminate background connected to outside
  const visited = new Uint8Array(width * height);
  const queue = new Int32Array(width * height);
  let head = 0;
  let tail = 0;

  function dist(r1, g1, b1, r2, g2, b2) {
    const dr = r1 - r2;
    const dg = g1 - g2;
    const db = b1 - b2;
    return Math.sqrt(dr * dr + dg * dg + db * db);
  }

  function matchesCheckerboard(x, y, r, g, b) {
    const tile = (Math.floor(x / 46) + Math.floor(y / 46)) % 2;
    const expected = tile === 0 ? colorA : colorB;
    const d = dist(r, g, b, expected[0], expected[1], expected[2]);
    // Also check if near the other tile color (for edge transitions between 46px squares)
    const other = tile === 0 ? colorB : colorA;
    const dOther = dist(r, g, b, other[0], other[1], other[2]);
    return d <= tolerance || (dOther <= tolerance && (x % 46 < 2 || x % 46 > 44 || y % 46 < 2 || y % 46 > 44));
  }

  function push(x, y) {
    const idx = y * width + x;
    if (visited[idx] === 0) {
      visited[idx] = 1;
      queue[tail++] = idx;
    }
  }

  // Seed borders
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

    if (matchesCheckerboard(x, y, r, g, b)) {
      data[pIdx + 3] = 0; // Transparent

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

  console.log(`Saved: ${outputPath}`);
}

async function run() {
  fs.mkdirSync('public/assets/clean', { recursive: true });

  await removeCheckerboardStrict(
    'public/assets/karakter/karakter_cowo.jpeg',
    'public/assets/clean/karakter_cowo.png',
    [186, 193, 203],
    [225, 228, 233],
    40
  );

  await removeCheckerboardStrict(
    'public/assets/karakter/karakter_cewe.jpeg',
    'public/assets/clean/karakter_cewe.png',
    [177, 186, 193],
    [222, 226, 229],
    40
  );

  await removeCheckerboardStrict(
    'public/assets/componet/bunga.jpeg',
    'public/assets/clean/bunga.png',
    [87, 87, 87],
    [150, 150, 150],
    35
  );

  await removeCheckerboardStrict(
    'public/assets/componet/buklet_bungan.jpeg',
    'public/assets/clean/buklet_bungan.png',
    [176, 183, 193],
    [220, 224, 227],
    40
  );

  await removeCheckerboardStrict(
    'public/assets/componet/pohon.jpeg',
    'public/assets/clean/pohon.png',
    [134, 134, 134],
    [204, 204, 204],
    38
  );

  await removeCheckerboardStrict(
    'public/assets/componet/semak.jpeg',
    'public/assets/clean/semak.png',
    [137, 137, 137],
    [207, 207, 207],
    38
  );
}

run();
