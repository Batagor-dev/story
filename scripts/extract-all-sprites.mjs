import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function crop(src, dest, x, y, w, h, pad = 0) {
  const meta = await sharp(src).metadata();
  const left = Math.max(0, x - pad);
  const top = Math.max(0, y - pad);
  const width = Math.min(meta.width - left, w + pad * 2);
  const height = Math.min(meta.height - top, h + pad * 2);

  await sharp(src)
    .extract({ left, top, width, height })
    .png()
    .toFile(dest);
}

async function run() {
  const outDir = 'public/assets/sprites';
  fs.mkdirSync(outDir, { recursive: true });

  const cowo = 'public/assets/clean/karakter_cowo.png';
  const cewe = 'public/assets/clean/karakter_cewe.png';
  const bunga = 'public/assets/clean/bunga.png';
  const buklet = 'public/assets/clean/buklet_bungan.png';
  const pohon = 'public/assets/clean/pohon.png';
  const semak = 'public/assets/clean/semak.png';
  const button = 'public/assets/clean/button.png';

  // Cowo sprites
  // Idle
  await crop(cowo, `${outDir}/cowo_idle_1.png`, 98, 64, 146, 388);
  await crop(cowo, `${outDir}/cowo_idle_2.png`, 332, 64, 148, 388);

  // Walk frames (facing right; flip for left)
  await crop(cowo, `${outDir}/cowo_walk_1.png`, 86, 494, 176, 362);
  await crop(cowo, `${outDir}/cowo_walk_2.png`, 334, 494, 188, 360);
  await crop(cowo, `${outDir}/cowo_walk_3.png`, 574, 496, 184, 362);
  await crop(cowo, `${outDir}/cowo_walk_4.png`, 812, 496, 162, 356);

  // Cowo Dialogue Busts / Portraits (for retro dialogue box)
  await crop(cowo, `${outDir}/cowo_bust_talk.png`, 1450, 85, 200, 235);
  await crop(cowo, `${outDir}/cowo_bust_smile.png`, 1690, 85, 195, 235);
  await crop(cowo, `${outDir}/cowo_bust_wink.png`, 1930, 90, 200, 230);
  await crop(cowo, `${outDir}/cowo_bust_shy.png`, 2150, 80, 230, 240);

  // Cowo Full-body Portraits (like in VN dialog on right!)
  await crop(cowo, `${outDir}/cowo_portrait_talk.png`, 1080, 930, 290, 570);
  await crop(cowo, `${outDir}/cowo_portrait_cheer.png`, 2170, 1060, 245, 430);

  // Cewe sprites
  // Idle standing
  await crop(cewe, `${outDir}/cewe_idle_1.png`, 90, 70, 150, 390);
  await crop(cewe, `${outDir}/cewe_idle_2.png`, 320, 70, 150, 390);

  // Cewe Dialogue Busts
  await crop(cewe, `${outDir}/cewe_bust_talk.png`, 1450, 90, 200, 235);
  await crop(cewe, `${outDir}/cewe_bust_smile.png`, 1700, 90, 190, 235);
  await crop(cewe, `${outDir}/cewe_bust_wink.png`, 1940, 90, 190, 235);
  await crop(cewe, `${outDir}/cewe_bust_happy.png`, 2140, 80, 230, 240);

  // Cewe Full-body Portraits
  await crop(cewe, `${outDir}/cewe_portrait_talk.png`, 1080, 930, 290, 570);
  await crop(cewe, `${outDir}/cewe_portrait_cheer.png`, 2170, 1060, 250, 440);

  // Flowers
  await crop(bunga, `${outDir}/flower_red.png`, 194, 180, 288, 470);
  await crop(bunga, `${outDir}/flower_blooming.png`, 688, 160, 286, 490);
  await crop(bunga, `${outDir}/flower_pink.png`, 194, 840, 286, 520);
  await crop(bunga, `${outDir}/flower_white.png`, 688, 820, 286, 540);
  await crop(bunga, `${outDir}/flower_yellow.png`, 1204, 830, 286, 530);

  // Bouquet
  await crop(buklet, `${outDir}/bouquet_full.png`, 110, 95, 290, 405);
  await crop(buklet, `${outDir}/bouquet_side.png`, 530, 95, 360, 370);
  await crop(buklet, `${outDir}/bouquet_icon.png`, 2280, 240, 205, 260);

  // Trees and Bushes
  await crop(pohon, `${outDir}/tree_large.png`, 150, 90, 1150, 1370);
  await crop(pohon, `${outDir}/tree_medium.png`, 1450, 170, 550, 650);
  await crop(semak, `${outDir}/bush_large.png`, 150, 310, 1180, 1060);
  await crop(semak, `${outDir}/bush_small_1.png`, 1460, 210, 480, 440);
  await crop(semak, `${outDir}/bush_small_2.png`, 1680, 800, 550, 490);

  // Button
  await crop(button, `${outDir}/btn_left.png`, 200, 180, 450, 450);
  await crop(button, `${outDir}/btn_right.png`, 750, 180, 450, 450);

  console.log('All individual sprites cropped and exported successfully!');
}

run();
