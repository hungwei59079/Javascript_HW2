import { loadDinoImage, Dino } from './dino';

const canvas = document.getElementById('game') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

let last = 0;

const dino = new Dino({ x: 50, y: HEIGHT - 50, w: 40, h: 40, groundY: HEIGHT - 20 });

// attach controls managed by Dino
dino.attachControls();

// load dino image then start loop
loadDinoImage()
  .then((img) => {
    dino.setImage(img);
    last = performance.now();
    requestAnimationFrame(loop);
  })
  .catch(() => {
    last = performance.now();
    requestAnimationFrame(loop);
  });

  function update(dt: number) {
  dino.update(dt);
}

// -----------Definitions-----------

function draw() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  // ground
  ctx.fillStyle = '#666';
  ctx.fillRect(0, HEIGHT - 20, WIDTH, 20);

  // dino (draws image if available)
  dino.draw(ctx);
}

function loop(ts: number) {
  const dt = Math.min(1 / 30, (ts - last) / 1000);
  update(dt);
  draw();
  last = ts;
  requestAnimationFrame(loop);
}
