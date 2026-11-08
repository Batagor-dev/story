import fs from 'fs';

let content = fs.readFileSync('bunga-untuk-perkenalan.html', 'utf8');

// Replace all tile_grass background-size to 140px 76px
content = content.replaceAll('background-size: 48px 48px;', 'background-size: 140px 76px;');

// Replace Babak 2 paths in HTML
const oldBabak2Paths = `            <!-- Cobblestone Trail -->
            <div style="position: absolute; top: 320px; left: 0; width: 440px; height: 56px; background-image: url(/assets/sprites/tile_path.png); background-size: 48px 48px; border-top: 3px solid #b8a381; border-bottom: 3px solid #b8a381;"></div>
            <div style="position: absolute; top: 160px; left: 380px; width: 56px; height: 180px; background-image: url(/assets/sprites/tile_path.png); background-size: 48px 48px; border-left: 3px solid #b8a381; border-right: 3px solid #b8a381;"></div>
            <div style="position: absolute; top: 160px; left: 380px; width: 480px; height: 56px; background-image: url(/assets/sprites/tile_path.png); background-size: 48px 48px; border-top: 3px solid #b8a381; border-bottom: 3px solid #b8a381;"></div>`;

const newBabak2Paths = `            <!-- Authentic RPG Dirt Path Network -->
            <!-- 1. West Entrance Path -->
            <div style="position: absolute; top: 320px; left: 0; width: 420px; height: 66px; background-image: url(/assets/sprites/path_straight_h.png); background-repeat: repeat-x; background-size: 129px 66px; pointer-events: none;"></div>
            
            <!-- 2. Central 4-Way Crossroad (with Rocks) -->
            <div style="position: absolute; top: 256px; left: 418px; width: 171px; height: 194px; pointer-events: none;">
              <img src="/assets/sprites/path_crossroad.png" class="pixelated" style="width: 100%; height: 100%; object-fit: contain;" />
            </div>

            <!-- 3. East Path to Shop -->
            <div style="position: absolute; top: 320px; left: 585px; width: 380px; height: 66px; background-image: url(/assets/sprites/path_straight_h.png); background-repeat: repeat-x; background-size: 129px 66px; pointer-events: none;"></div>

            <!-- 4. North Path to Ara Gazebo -->
            <div style="position: absolute; top: 170px; left: 470px; width: 66px; height: 90px; background-image: url(/assets/sprites/path_straight_v.png); background-repeat: repeat-y; background-size: 66px 129px; pointer-events: none;"></div>
            <div style="position: absolute; top: 110px; left: 460px; width: 105px; height: 106px; pointer-events: none;">
              <img src="/assets/sprites/path_corner_bottom_left.png" class="pixelated" style="width: 100%; height: 100%; object-fit: contain;" />
            </div>
            <div style="position: absolute; top: 130px; left: 555px; width: 320px; height: 66px; background-image: url(/assets/sprites/path_straight_h.png); background-repeat: repeat-x; background-size: 129px 66px; pointer-events: none;"></div>`;

content = content.replace(oldBabak2Paths, newBabak2Paths);

// Replace Babak 5 path in HTML if any
content = content.replace(
  `<!-- Pixel Grass Ground -->
          <div style="position: absolute; bottom: 0; inset-x: 0; height: 45%; background-image: url(/assets/sprites/tile_grass.png); background-size: 48px 48px;">`,
  `<!-- Pixel Grass Ground -->
          <div style="position: absolute; bottom: 0; inset-x: 0; height: 45%; background-image: url(/assets/sprites/tile_grass.png); background-size: 140px 76px;">
            <div style="position: absolute; bottom: 25px; inset-x: 0; height: 66px; background-image: url(/assets/sprites/path_straight_h.png); background-repeat: repeat-x; background-size: 129px 66px;"></div>`
);

fs.writeFileSync('bunga-untuk-perkenalan.html', content);
fs.writeFileSync('public/bunga-untuk-perkenalan.html', content);

console.log('Successfully updated HTML files with authentic grass and path network!');
