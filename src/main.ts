import { loadAllAssets } from './assets';
import { Dino } from './dino';
import { Obstacle, ObstacleManager } from './obstacles';

// ----------- Canvas & Rendering -----------
const canvas = document.getElementById('game') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// ----------- UI Elements -----------
const Start_button = document.getElementById("start_button") as HTMLButtonElement;
const Game_over_button = document.getElementById("game_over_button") as HTMLButtonElement;

// ----------- Game Constants -----------
const INITIAL_HEIGHT = HEIGHT - 80;
const OBSTACLE_SPAWN_INTERVAL = 0.5; // seconds
const dino_animation_interval = 0.1; // seconds

// ----------- Game State -----------
let game_over = false;
let last = 0;

// ----------- Obstacle State -----------
let obstacle_manager: ObstacleManager;

// ----------- Game Entities -----------
const dino = new Dino(50, INITIAL_HEIGHT, 140, 80, null, dino_animation_interval);

// ----------- Debug -----------
setInterval(() => { console.log(`game_over : ${game_over}`); }, 1000);

// ----------- Initialization -----------
loadAllAssets()
  .then((assets) => {
    const dino_imgs = assets.dinoImages;
    obstacle_manager = new ObstacleManager(assets.obstacleImage, OBSTACLE_SPAWN_INTERVAL);
    dino.setImages(dino_imgs[0], dino_imgs[1], dino_imgs[2]);
    Start_button.addEventListener('click', game_start);
    Game_over_button.addEventListener('click', () => {
      dino.detachControls();
      game_over = true;
      console.log("Game Over clicked - controls detached");
    });
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
}

function draw() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  // ground
  ctx.fillStyle = '#cacacaff';
  ctx.fillRect(0, HEIGHT - 20, WIDTH, 20);

  // dino 
  dino.draw(ctx);
  if (obstacle_manager.existing_obstacles.length > 0) {
      for (const obs of obstacle_manager.existing_obstacles) {
        obs.draw(ctx);
      }
  }
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
  
  if (obstacle_manager.timeSinceLastObstacle >= OBSTACLE_SPAWN_INTERVAL && obstacle_manager.obstacle_img) {
    const newObstacle = obstacle_manager.createObstacle(Math.random());
    if (newObstacle) {
      obstacle_manager.existing_obstacles.push(newObstacle);
      obstacle_manager.timeSinceLastObstacle = 0;
    }
  }
  console.log(`number of obstacles: ${obstacle_manager.existing_obstacles.length}`);
  if (!game_over) {
    last = ts;
    requestAnimationFrame(loop);
  } else {
    console.log("Game Over - loop stopped");
  }
}

function game_start() {
  Start_button.textContent = "Retry";
  game_over = false;
  dino.attachControls();
  last = performance.now();
  requestAnimationFrame(loop);
}