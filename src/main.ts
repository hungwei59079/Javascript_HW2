import { loadAllAssets } from './assets';
import { Dino } from './dino';
import { Obstacle, createObstacle } from './obstacles';

const canvas = document.getElementById('game') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

const Start_button = document.getElementById("start_button") as HTMLButtonElement;
const Game_over_button = document.getElementById("game_over_button") as HTMLButtonElement;

const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const initial_height = HEIGHT - 80
let game_over = false;

let obstacle_img : HTMLImageElement | null = null;
const existing_obstacles: Obstacle[] = [];
let timeSinceLastObstacle=0;
const obstacleSpawnInterval=1.5;

let last = 0;

const dino = new Dino(50, initial_height, 120, 80);

setInterval(() => {console.log(`game_over : ${game_over}`)}, 1000);
// ----------- Load assets -----------
loadAllAssets()
  .then((assets) => {
    const dino_imgs = assets.dinoImages;
    obstacle_img = assets.obstacleImage;
    dino.setImages(dino_imgs[0], dino_imgs[1], dino_imgs[2]);
    Start_button.addEventListener('click', game_start);
    Game_over_button.addEventListener('click', () => {
      dino.detachControls();
      game_over = true;
      console.log("Game Over clicked - controls detached");
    });
    // Initial draw
    dino.draw(ctx);
    ctx.fillStyle = '#666';
    ctx.fillRect(0, HEIGHT - 20, WIDTH, 20);
  })
  .catch(() => console.error('Failed to load dino images'));

// -----------The call stack ends here----------

// -----------Definitions-----------

function update(dt: number) {
  dino.update(dt);
  if (existing_obstacles.length > 0) {
      for (const obs of existing_obstacles) {
        obs.update(dt);
      }
  }
}

function draw() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  // ground
  ctx.fillStyle = '#666';
  ctx.fillRect(0, HEIGHT - 20, WIDTH, 20);

  // dino 
  dino.draw(ctx);
  if (existing_obstacles.length > 0) {
      for (const obs of existing_obstacles) {
        obs.draw(ctx);
      }
  }
}

function loop(ts: number) {
  const dt = Math.min(1 / 30, (ts - last) / 1000);
  timeSinceLastObstacle += dt;
  update(dt);
  draw();
  
  // Remove obstacles that are off-screen to save memory
  for (let i = existing_obstacles.length - 1; i >= 0; i--) {
    if (existing_obstacles[i].x < -30) {
      existing_obstacles.splice(i, 1);
    }
  }
  
  if (timeSinceLastObstacle >= obstacleSpawnInterval && obstacle_img) {
    const newObstacle = createObstacle(Math.random(), obstacle_img);
    if (newObstacle) {
      existing_obstacles.push(newObstacle);
      timeSinceLastObstacle = 0;
    }
  }
  console.log(`number of obstacles: ${existing_obstacles.length}`);
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