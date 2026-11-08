import sharp from 'sharp';

async function perfectClean(inputPath, outputPath, isBg) {
  const image = sharp(inputPath);
  const { data, info } = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;

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

    if (isBg(x, y, r, g, b)) {
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

  console.log(`Cleaned: ${outputPath}`);
}

async function run() {
  // Karakter cowo & cewe & buklet:
  // Checkerboard is cool gray (b >= r - 8), avg brightness 165-245, saturation diff <= 25
  const bgHuman = (x, y, r, g, b) => {
    const avg = (r + g + b) / 3;
    const diff = Math.max(r, g, b) - Math.min(r, g, b);
    return avg >= 160 && avg <= 245 && diff <= 28 && b >= r - 10;
  };

  await perfectClean('public/assets/karakter/karakter_cowo.jpeg', 'public/assets/clean/karakter_cowo.png', bgHuman);
  await perfectClean('public/assets/karakter/karakter_cewe.jpeg', 'public/assets/clean/karakter_cewe.png', bgHuman);
  await perfectClean('public/assets/componet/buklet_bungan.jpeg', 'public/assets/clean/buklet_bungan.png', bgHuman);

  // Pohon & Semak:
  // Green vegetation has g > r && g > b.
  // Checkerboard has diff <= 15, avg brightness 115-225.
  const bgTree = (x, y, r, g, b) => {
    const avg = (r + g + b) / 3;
    const diff = Math.max(r, g, b) - Math.min(r, g, b);
    // Wood/soil trunk is warm brownish (r > g > b, diff > 15) or green leaves (g > r)
    return diff <= 12 && avg >= 115 && avg <= 225;
  };

  await perfectClean('public/assets/componet/pohon.jpeg', 'public/assets/clean/pohon.png', bgTree);
  await perfectClean('public/assets/componet/semak.jpeg', 'public/assets/clean/semak.png', bgTree);

  // Bunga:
  // Checkerboard is dark-mid gray ~85-160, diff <= 12
  const bgFlower = (x, y, r, g, b) => {
    const avg = (r + g + b) / 3;
    const diff = Math.max(r, g, b) - Math.min(r, g, b);
    return diff <= 12 && avg >= 70 && avg <= 165;
  };
  await perfectClean('public/assets/componet/bunga.jpeg', 'public/assets/clean/bunga.png', bgFlower);
}

run();
