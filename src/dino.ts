import { GameEntity } from './GameEntity';

export class Dino extends GameEntity {
  y0: number;
  vy: number = 0;
  onGround: boolean= true;
  image_left_foot : HTMLImageElement | null = null;
  image_right_foot : HTMLImageElement | null = null;
  animation_interval: number  = 0.1; // seconds

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

  constructor(x: number, y: number, w: number, h: number, image_default?: HTMLImageElement | null, animation_interval?: number) {
    super(x, y, w, h, image_default);
    this.y0 = y;
    this.animation_interval = animation_interval ?? 0.1;
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

  override draw(ctx: CanvasRenderingContext2D) {
    if (this.onGround && this.image_left_foot && this.image_right_foot) {
      const time = performance.now() / 1000; // time in seconds
      const phase = Math.floor(time / this.animation_interval) % 2;
      if (phase === 0) {
        ctx.drawImage(this.image_left_foot, this.x, this.y, this.w, this.h);
      } else {
        ctx.drawImage(this.image_right_foot, this.x, this.y, this.w, this.h);
      }
    } else if (this.image_default) {
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

