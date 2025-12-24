import { loadDinoImage, Dino } from './dino';

const canvas = document.getElementById('game') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

const Start_button = document.getElementById("start_button") as HTMLButtonElement;
const Game_over_button = document.getElementById("game_over_button") as HTMLButtonElement;

const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const initial_height = HEIGHT - 80
let game_over = false;

let last = 0;

const dino = new Dino({ x: 50, y: initial_height, y0: initial_height, w: 120, h: 80});

setInterval(() => {console.log(`game_over : ${game_over}`)}, 1000);
// ----------- Load assets -----------
loadDinoImage()
  .then((imgs) => {
    dino.setImages(imgs[0],imgs[1],imgs[2]);
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
  // console.log(`On ground: ${dino.onGround}; vy = ${dino.vy}, y = ${dino.y}, dt = ${dt} h = ${dino.h}`)
}

function draw() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  // ground
  ctx.fillStyle = '#666';
  ctx.fillRect(0, HEIGHT - 20, WIDTH, 20);

  // dino 
  dino.draw(ctx);
}

function loop(ts: number) {
  const dt = Math.min(1 / 30, (ts - last) / 1000);
  update(dt);
  draw();
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