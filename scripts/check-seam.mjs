import sharp from 'sharp';

async function checkSeam() {
  const { data, info } = await sharp('public/assets/sprites/test_path_h_3x.png').raw().toBuffer({ resolveWithObject: true });
  console.log(`Checking seam at boundary x=95 vs x=96 across middle y=25..45:`);

  let maxDiff = 0;
  for (let y = 20; y < 50; y++) {
    const idxA = (y * info.width + 95) * 4;
    const idxB = (y * info.width + 96) * 4;
    const d = Math.max(
      Math.abs(data[idxA] - data[idxB]),
      Math.abs(data[idxA+1] - data[idxB+1]),
      Math.abs(data[idxA+2] - data[idxB+2])
    );
    if (d > maxDiff) maxDiff = d;
  }
  console.log(`Max color diff across seam: ${maxDiff}`);

  // Check if any pixels in the dirt road have alpha < 200
  let lowAlphaCount = 0;
  for (let y = 20; y < 50; y++) {
    for (let x = 0; x < info.width; x++) {
      const a = data[(y * info.width + x) * 4 + 3];
      if (a < 200) lowAlphaCount++;
    }
  }
  console.log(`Low alpha pixels in dirt road: ${lowAlphaCount}`);
}

checkSeam();
