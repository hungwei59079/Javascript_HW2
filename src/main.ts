import { loadImage } from '../assets';

const canvas = document.getElementById('game') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

type Player = {
  x: number;
  y: number;
  w: number;
  h: number;
  vy: number;
  onGround: boolean;
};

const player: Player = { x: 50, y: HEIGHT - 50, w: 40, h: 40, vy: 0, onGround: true };

const GRAVITY = 0.9;
const JUMP_V = -15;

let last = 0;

function resizeCanvas() {
  // keep fixed logical size (we set width/height in HTML)
}

function update(dt: number) {
  // physics
  if (!player.onGround) {
    player.vy += GRAVITY * dt;
    player.y += player.vy;
    if (player.y + player.h >= HEIGHT - 20) {
      player.y = HEIGHT - 20 - player.h;
      player.vy = 0;
      player.onGround = true;
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  // ground
  ctx.fillStyle = '#666';
  ctx.fillRect(0, HEIGHT - 20, WIDTH, 20);

  // player
  ctx.fillStyle = '#222';
  ctx.fillRect(player.x, player.y, player.w, player.h);
}

function loop(ts: number) {
  const dt = Math.min(1 / 30, (ts - last) / 1000);
  update(dt);
  draw();
  last = ts;
  requestAnimationFrame(loop);
}

function jump() {
  if (player.onGround) {
    player.vy = JUMP_V;
    player.onGround = false;
  }
}

window.addEventListener('keydown', (e) => {
  if (e.code === 'Space' || e.code === 'ArrowUp') {
    e.preventDefault();
    jump();
  }
});

// touch support
window.addEventListener('touchstart', (e) => {
  e.preventDefault();
  jump();
}, { passive: false });

// load assets (placeholder) then start loop
Promise.resolve()
  .then(() => loadImage('/assets/dino.png').catch(() => null))
  .then(() => {
    last = performance.now();
    requestAnimationFrame(loop);
  });
