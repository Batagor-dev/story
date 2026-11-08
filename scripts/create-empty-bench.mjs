import sharp from 'sharp';

async function createEmptyBench() {
  const { data, info } = await sharp('public/assets/sprites/ara_bench_1.png').raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;

  // In ara_bench_1.png:
  // w = 218, h = 193
  // Center is at x ≈ 109.
  // Left armrest: x = 0..30
  // Right armrest: x = 188..217
  // Right empty seat: x = 125..190
  // Left side has Ara from x ≈ 45..120.
  // But the left armrest is clear!
  // If we take the empty slats from the right side and mirror them to the left side:
  console.log('Testing empty bench synthesis...');
}

createEmptyBench();
