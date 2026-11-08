import sharp from 'sharp';
import fs from 'fs';

async function generateAssets() {
  const outDir = 'public/assets/sprites';
  fs.mkdirSync(outDir, { recursive: true });

  const cowo = 'public/assets/clean/karakter_cowo.png';
  const cewe = 'public/assets/clean/karakter_cewe.png';
  const bunga = 'public/assets/clean/bunga.png';
  const buklet = 'public/assets/clean/buklet_bungan.png';
  const button = 'public/assets/clean/button.png';

  // 1. Boy Busts (Badan ke Kepala saja! Chest to head)
  // Talking bust (head + chest + black shirt)
  await sharp(cowo)
    .extract({ left: 1080, top: 930, width: 290, height: 350 })
    .png()
    .toFile(`${outDir}/cowo_bust_talking.png`);

  // Shy / scratching head bust
  await sharp(cowo)
    .extract({ left: 2150, top: 80, width: 230, height: 240 })
    .png()
    .toFile(`${outDir}/cowo_bust_scratch.png`);

  // Smiling bust
  await sharp(cowo)
    .extract({ left: 1690, top: 85, width: 195, height: 235 })
    .png()
    .toFile(`${outDir}/cowo_bust_smiling.png`);

  // Cheering bust
  await sharp(cowo)
    .extract({ left: 2170, top: 1060, width: 245, height: 260 })
    .png()
    .toFile(`${outDir}/cowo_bust_cheering.png`);

  // 2. Girl Busts (Badan ke Kepala saja)
  await sharp(cewe)
    .extract({ left: 1080, top: 930, width: 290, height: 340 })
    .png()
    .toFile(`${outDir}/cewe_bust_talking.png`);

  await sharp(cewe)
    .extract({ left: 1690, top: 85, width: 195, height: 235 })
    .png()
    .toFile(`${outDir}/cewe_bust_smiling.png`);

  await sharp(cewe)
    .extract({ left: 1940, top: 85, width: 195, height: 235 })
    .png()
    .toFile(`${outDir}/cewe_bust_winking.png`);

  await sharp(cewe)
    .extract({ left: 2170, top: 1060, width: 250, height: 260 })
    .png()
    .toFile(`${outDir}/cewe_bust_cheering.png`);

  // 3. Girl Sitting on Bench (Full seated pose)
  await sharp(cewe)
    .extract({ left: 2438, top: 1140, width: 238, height: 344 })
    .png()
    .toFile(`${outDir}/cewe_sitting.png`);

  // 4. Drooping / Wilting Rose (for rejection / bad choice)
  await sharp(bunga)
    .extract({ left: 1190, top: 180, width: 340, height: 460 })
    .png()
    .toFile(`${outDir}/flower_wilting.png`);

  // 5. Rare Blue Tulip (Hue rotated from blooming rose!)
  const bloomBuffer = await sharp(bunga)
    .extract({ left: 688, top: 160, width: 286, height: 490 })
    .modulate({ hue: 200, saturation: 1.3 })
    .png()
    .toFile(`${outDir}/flower_blue_tulip.png`);

  // 6. Real Pixel Buttons from button.png
  // Left arrow green button
  await sharp(button)
    .extract({ left: 132, top: 1292, width: 428, height: 428 })
    .resize(72, 72, { kernel: 'nearest' })
    .png()
    .toFile(`${outDir}/btn_arrow_left.png`);

  // Right arrow green button
  await sharp(button)
    .extract({ left: 1332, top: 1292, width: 428, height: 428 })
    .resize(72, 72, { kernel: 'nearest' })
    .png()
    .toFile(`${outDir}/btn_arrow_right.png`);

  // 7. Boy Giving Flower Composite (Arel holding bouquet)
  // Base: cowo standing pose with hands gesturing (scaled)
  const cowoBase = await sharp(cowo)
    .extract({ left: 1080, top: 930, width: 290, height: 570 })
    .toBuffer();

  const bouquetSmall = await sharp(`${outDir}/bouquet_full.png`)
    .resize(180, 240, { fit: 'inside', kernel: 'nearest' })
    .toBuffer();

  await sharp(cowoBase)
    .composite([
      { input: bouquetSmall, top: 160, left: 120 }
    ])
    .png()
    .toFile(`${outDir}/cowo_giving_bouquet.png`);

  // 8. Girl Accepting Flower Composite (Ara holding bouquet happily)
  const ceweBase = await sharp(cewe)
    .extract({ left: 1080, top: 930, width: 290, height: 570 })
    .toBuffer();

  await sharp(ceweBase)
    .composite([
      { input: bouquetSmall, top: 140, left: 60 }
    ])
    .png()
    .toFile(`${outDir}/cewe_accepting_bouquet.png`);

  // 9. Girl Rejecting Flower (Ara troubled / declining politely)
  await sharp(cewe)
    .extract({ left: 1434, top: 980, width: 200, height: 440 })
    .png()
    .toFile(`${outDir}/cewe_rejecting.png`);

  // 10. Pixel Wooden Park Bench
  // Let's draw an authentic retro 16-bit wooden park bench
  const benchSvg = `
  <svg width="180" height="90" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
    <!-- Backrest Slats -->
    <rect x="10" y="8" width="160" height="10" fill="#854d0e" stroke="#451a03" stroke-width="2"/>
    <rect x="10" y="22" width="160" height="10" fill="#a16207" stroke="#451a03" stroke-width="2"/>
    <!-- Bench Seat -->
    <rect x="6" y="38" width="168" height="14" fill="#ca8a04" stroke="#451a03" stroke-width="2"/>
    <rect x="8" y="52" width="164" height="6" fill="#854d0e" stroke="#451a03" stroke-width="2"/>
    <!-- Iron/Wood Legs -->
    <rect x="18" y="12" width="10" height="68" fill="#292524" stroke="#1c1917" stroke-width="2"/>
    <rect x="152" y="12" width="10" height="68" fill="#292524" stroke="#1c1917" stroke-width="2"/>
    <rect x="12" y="78" width="22" height="6" fill="#1c1917"/>
    <rect x="146" y="78" width="22" height="6" fill="#1c1917"/>
    <!-- Armrests -->
    <rect x="12" y="28" width="16" height="8" fill="#451a03"/>
    <rect x="152" y="28" width="16" height="8" fill="#451a03"/>
  </svg>`;
  await sharp(Buffer.from(benchSvg))
    .png()
    .toFile(`${outDir}/pixel_bench.png`);

  // 11. Pixel Art Clouds
  const cloudSvg = `
  <svg width="160" height="60" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
    <rect x="20" y="20" width="120" height="30" fill="#ffffff" rx="4"/>
    <rect x="40" y="10" width="60" height="30" fill="#ffffff" rx="4"/>
    <rect x="80" y="6" width="40" height="30" fill="#ffffff" rx="4"/>
    <rect x="10" y="28" width="140" height="20" fill="#f1f5f9" rx="4"/>
  </svg>`;
  await sharp(Buffer.from(cloudSvg))
    .png()
    .toFile(`${outDir}/pixel_cloud.png`);

  console.log('Generated all pixel game assets successfully!');
}

generateAssets();
