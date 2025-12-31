import { loadAllAssets } from './assets';
import { Dino } from './dino';
import { ObstacleManager } from './obstacles';
import { Score_manager } from './score';

// ----------- Canvas & Rendering -----------
const canvas = document.getElementById('game') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// ----------- UI Elements -----------
const Start_button = document.getElementById("start_button") as HTMLButtonElement;
const Game_over_button = document.getElementById("game_over_button") as HTMLButtonElement;

// ----------- Game Constants -----------
const floor_thickness = 20;
const dino_width = 50;
const dino_height = 50; 
const OBSTACLE_SPAWN_INTERVAL = 0.5; // seconds
const dino_animation_interval = 0.1; // seconds

// ----------- Game State -----------
let game_over = false;
let last = 0;

// ----------- Game Entities -----------
const dino = new Dino(100, HEIGHT - floor_thickness - dino_height, dino_width, dino_height, null, dino_animation_interval);
let obstacle_manager: ObstacleManager;
const score_counter = new Score_manager(100); // 100 points per second

// ----------- Debug -----------
const DEBUG_MODE = false; // Set to false to hide grid ticks
const DEBUG_TICK_INTERVAL = 50; // Pixels between tick marks
if (DEBUG_MODE){
  setInterval(() => { console.log(`game_over : ${game_over}`); }, 1000);
}

// ----------- Initialization -----------
loadAllAssets()
  .then((assets) => {
    const dino_imgs = assets.dinoImages;
    obstacle_manager = new ObstacleManager(assets.obstacleImage, OBSTACLE_SPAWN_INTERVAL);
    dino.setImages(dino_imgs[0], dino_imgs[1], dino_imgs[2]);
    Start_button.addEventListener('click', game_start);
    if (DEBUG_MODE) {
      Game_over_button.addEventListener('click', () => {
      game_over_func();
      console.log("Game Over clicked - controls detached");
    })
  } else {
      Game_over_button.style.display = 'none';
    }
    ;
    // Initial draw
    ctx.fillStyle = '#cacacaff';
    ctx.fillRect(0, HEIGHT - 20, WIDTH, 20);
    dino.draw(ctx);
  })
  .catch(() => console.error('Failed to load dino images'));

// ----------- The call stack ends here -----------

// ----------- Function Definitions -----------

function update(dt: number) {
  dino.update(dt);
  if (obstacle_manager.existing_obstacles.length > 0) {
      for (const obs of obstacle_manager.existing_obstacles) {
        obs.update(dt);
      }
  }
  score_counter.update(dt);
}

function draw() {
  // Clear entire canvas
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  
  // Debug: draw grid ticks
  if (DEBUG_MODE) {
    drawDebugTicks();
  }
  
  // ground
  ctx.fillStyle = '#cacacaff';
  ctx.fillRect(0, HEIGHT - 20, WIDTH, 20);

  // dino 
  dino.draw(ctx);

  // obstacles
  if (obstacle_manager.existing_obstacles.length > 0) {
      for (const obs of obstacle_manager.existing_obstacles) {
        obs.draw(ctx);
      }
  }
  // score
  score_counter.draw(ctx);
}

function loop(ts: number) {
  const dt = Math.min(1 / 30, (ts - last) / 1000);
  obstacle_manager.timeSinceLastObstacle += dt;
  update(dt);
  draw();
  
  // Remove obstacles that are off-screen to save memory
  for (let i = obstacle_manager.existing_obstacles.length - 1; i >= 0; i--) {
    if (obstacle_manager.existing_obstacles[i].x < -30) {
      obstacle_manager.existing_obstacles.splice(i, 1);
    }
  }
  // Spawn new obstacles
  if (obstacle_manager.timeSinceLastObstacle >= OBSTACLE_SPAWN_INTERVAL && obstacle_manager.obstacle_img) {
    const newObstacle = obstacle_manager.createObstacle(Math.random());
    if (newObstacle) {
      obstacle_manager.existing_obstacles.push(newObstacle);
      obstacle_manager.timeSinceLastObstacle = 0;
    }
  }
  console.log(`number of obstacles: ${obstacle_manager.existing_obstacles.length}`);
  // Check for collisions
  for (const obs of obstacle_manager.existing_obstacles) {
    if (dino.collidesWith(obs)) {
      console.log("Collision detected! Game Over.");
      game_over_func();
      break;
    }
  }
  // Continue or stop the loop
  if (!game_over) {
    last = ts;
    requestAnimationFrame(loop);
  } else {
    console.log("Game Over - loop stopped");
  }
}

function game_start() {
  Start_button.textContent = "Retry";
  Start_button.disabled = true;
  game_over = false;
  score_counter.reset();
  obstacle_manager.existing_obstacles = [];
  dino.y = dino.y0;
  dino.attachControls();
  last = performance.now();
  requestAnimationFrame(loop);
}

function game_over_func() {
  game_over = true;
  dino.detachControls();
  Start_button.disabled = false;
}

function drawDebugTicks() {
  ctx.save();
  ctx.strokeStyle = '#ddd';
  ctx.fillStyle = '#999';
  ctx.font = '10px monospace';
  ctx.lineWidth = 1;

  // Vertical lines and X-axis labels
  for (let x = 0; x <= WIDTH; x += DEBUG_TICK_INTERVAL) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, HEIGHT);
    ctx.stroke();
    // Label every tick
    ctx.fillText(x.toString(), x + 2, 12);
  }

  // Horizontal lines and Y-axis labels
  for (let y = 0; y <= HEIGHT; y += DEBUG_TICK_INTERVAL) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(WIDTH, y);
    ctx.stroke();
    // Label every tick (skip 0 since X already labeled there)
    if (y > 0) {
      ctx.fillText(y.toString(), 2, y - 2);
    }
  }

  ctx.restore();
}