import { loadImage } from './assets';

export type DinoOpts = { x: number; y: number; y0:number ; w: number; h: number};

export class Dino {
  x: number;
  y: number;
  y0: number;
  w: number;
  h: number;
  vy = 0;
  onGround = true;
  image_default: HTMLImageElement | null = null;
  image_left_foot : HTMLImageElement | null = null;
  image_right_foot : HTMLImageElement | null = null;

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
    this.y0 = o.y0;
    this.w = o.w;
    this.h = o.h;
    this.image_default = img;
  }

  // Set all three posture images at once
  setImages(imgDefault: HTMLImageElement | null, imgLeft: HTMLImageElement | null, imgRight: HTMLImageElement | null) {
    this.image_default = imgDefault;
    this.image_left_foot = imgLeft;
    this.image_right_foot = imgRight;
  }

  update(dt: number) {
    const GRAVITY = 5000;
    if (!this.onGround) {
      this.vy += GRAVITY * dt;
      this.y += this.vy * dt;
      if (this.y  >= this.y0) {
        this.y = this.y0;
        this.vy = 0;
        this.onGround = true;
      }
    }
  }

  // Optional: pass a triple of images to assign them before drawing
  draw(ctx: CanvasRenderingContext2D, images?: [HTMLImageElement | null, HTMLImageElement | null, HTMLImageElement | null]) {
    if (images) {
      this.setImages(images[0], images[1], images[2]);
    }

    if (this.image_default) {
      ctx.drawImage(this.image_default, this.x, this.y, this.w, this.h);
    } else {
      console.error('image not found');
      ctx.fillStyle = '#222';
      ctx.fillRect(this.x, this.y, this.w, this.h);
    }
  }

  jump() {
    const JUMP_V = -1000;
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

export function loadDinoImage(): Promise<[HTMLImageElement | null, HTMLImageElement | null, HTMLImageElement | null]> {
  const paths = ['/assets/dino_normal.png', '/assets/dino_left_foot.png', '/assets/dino_right_foot.png'];
  return Promise.all(paths.map((p) => loadImage(p).catch(() => null))) as Promise<[HTMLImageElement | null, HTMLImageElement | null, HTMLImageElement | null]>;
}
