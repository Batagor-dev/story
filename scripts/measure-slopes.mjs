import sharp from 'sharp';

async function measureSlopes() {
  const { data, info } = await sharp('public/assets/sprites/ara_bench_1.png').raw().toBuffer({ resolveWithObject: true });
  const w = info.width;

  console.log('--- Measuring Slat 1 Top ---');
  let points = [];
  for (let x = 125; x <= 185; x++) {
    for (let y = 40; y < 75; y++) {
      const idx = (y * w + x) * 4;
      if (data[idx + 3] > 100) {
        points.push({ x, y });
        break;
      }
    }
  }

  // Linear regression on (x, y)
  const n = points.length;
  const sumX = points.reduce((acc, p) => acc + p.x, 0);
  const sumY = points.reduce((acc, p) => acc + p.y, 0);
  const sumXY = points.reduce((acc, p) => acc + p.x * p.y, 0);
  const sumX2 = points.reduce((acc, p) => acc + p.x * p.x, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  console.log(`Fitted line: y = ${slope.toFixed(4)} * x + ${intercept.toFixed(2)}`);
  console.log('Sample points:', points.filter((_, i) => i % 10 === 0));

  // Let's also measure Seat Front Bottom (y ≈ 135)
  let seatBottomPoints = [];
  for (let x = 125; x <= 175; x++) {
    for (let y = 145; y >= 120; y--) {
      const idx = (y * w + x) * 4;
      if (data[idx + 3] > 100) {
        seatBottomPoints.push({ x, y });
        break;
      }
    }
  }
  const n2 = seatBottomPoints.length;
  const sumX_2 = seatBottomPoints.reduce((acc, p) => acc + p.x, 0);
  const sumY_2 = seatBottomPoints.reduce((acc, p) => acc + p.y, 0);
  const sumXY_2 = seatBottomPoints.reduce((acc, p) => acc + p.x * p.y, 0);
  const sumX2_2 = seatBottomPoints.reduce((acc, p) => acc + p.x * p.x, 0);
  const slope2 = (n2 * sumXY_2 - sumX_2 * sumY_2) / (n2 * sumX2_2 - sumX_2 * sumX_2);
  const intercept2 = (sumY_2 - slope2 * sumX_2) / n2;
  console.log(`Seat bottom fitted line: y = ${slope2.toFixed(4)} * x + ${intercept2.toFixed(2)}`);
  console.log('Seat bottom samples:', seatBottomPoints.filter((_, i) => i % 10 === 0));
}

measureSlopes();
