import { loadImage } from './assets';

export type DinoOpts = { x: number; y: number; w: number; h: number; groundY: number };

export class Dino {
  x: number;
  y: number;
  w: number;
  h: number;
  vy = 0;
  onGround = true;
  groundY: number;
  image: HTMLImageElement | null = null;

  private keyHandler = (e: KeyboardEvent) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
      e.preventDefault();
      this.jump();
    }
  };

  private touchHandler = (e: TouchEvent) => {
    e.preventDefault();
    this.jump();
  };

  constructor(o: DinoOpts, img: HTMLImageElement | null = null) {
    this.x = o.x;
    this.y = o.y;
    this.w = o.w;
    this.h = o.h;
    this.groundY = o.groundY;
    this.image = img;
  }

  setImage(img: HTMLImageElement | null) {
    this.image = img;
  }

  update(dt: number) {
    const GRAVITY = 0.9;
    if (!this.onGround) {
      this.vy += GRAVITY * dt;
      this.y += this.vy;
      if (this.y + this.h >= this.groundY) {
        this.y = this.groundY - this.h;
        this.vy = 0;
        this.onGround = true;
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.image) {
      ctx.drawImage(this.image, this.x, this.y, this.w, this.h);
    } else {
      console.error("image not found")
      ctx.fillStyle = '#222';
      ctx.fillRect(this.x, this.y, this.w, this.h);
    }
  }

  jump() {
    const JUMP_V = -15;
    if (this.onGround) {
      this.vy = JUMP_V;
      this.onGround = false;
    }
  }

  attachControls(win: Window = window) {
    win.addEventListener('keydown', this.keyHandler);
    // touchstart needs passive: false to allow preventDefault
    win.addEventListener('touchstart', this.touchHandler, { passive: false });
  }

  detachControls(win: Window = window) {
    win.removeEventListener('keydown', this.keyHandler);
    // remove without options is sufficient for most browsers
    win.removeEventListener('touchstart', this.touchHandler as EventListener);
  }

  collidesWith(r: { x: number; y: number; w: number; h: number }) {
    return !(r.x > this.x + this.w || r.x + r.w < this.x || r.y > this.y + this.h || r.y + r.h < this.y);
  }
}

export function loadDinoImage(): Promise<HTMLImageElement | null> {
  return loadImage('/assets/dino_normal.png').catch(() => null);
}
