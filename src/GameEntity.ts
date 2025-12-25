
export interface Renderable {
  x: number;
  y: number;
  w: number;
  h: number;
  image_default: HTMLImageElement | null;
  
  update(dt: number): void;
  draw(ctx: CanvasRenderingContext2D): void;
  collidesWith(r: { x: number; y: number; w: number; h: number }): boolean;
}

export abstract class GameEntity implements Renderable {
  x: number;
  y: number;
  w: number;
  h: number;
  image_default: HTMLImageElement | null = null;

  constructor(x: number, y: number, w: number, h: number, image_default?: HTMLImageElement | null) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.image_default = image_default ?? null;
  }

  abstract update(dt: number): void;
  
  draw(ctx: CanvasRenderingContext2D) {
    if (this.image_default) {
      ctx.drawImage(this.image_default, this.x, this.y, this.w, this.h);
    } else {
      console.error('image_default not found');
      ctx.fillStyle = '#222';
      ctx.fillRect(this.x, this.y, this.w, this.h);
    }
  }

  setImage(img: HTMLImageElement | null) {
    this.image_default = img;
  }

  collidesWith(r: { x: number; y: number; w: number; h: number }): boolean {
    return !(r.x > this.x + this.w || r.x + r.w < this.x || r.y > this.y + this.h || r.y + r.h < this.y);
  }
}