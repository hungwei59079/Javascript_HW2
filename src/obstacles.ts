import { GameEntity } from "./GameEntity";
export class Obstacle extends GameEntity {
  horizontalSpeed: number = 300;
  constructor(x: number, y: number, w: number, h: number, image_default?: HTMLImageElement | null) {
    super(x, y, w, h, image_default);
  }

  update(dt: number){
    this.x -= this.horizontalSpeed * dt;
  }

  // draw method inherited from GameEntity
  // collidesWith method inherited from GameEntity
  // setImage method inherited from GameEntity
}

export function createObstacle(random_number : number, obstacle_img: HTMLImageElement): Obstacle | null {
    if (random_number < 0.01) {
        // Create a cactus obstacle
        console.log("Creating new obstacle");
        return new Obstacle(800, 120, 40, 60, obstacle_img); //Fix me: adjust y position as needed
    }
    else {
        return null;
    }
}