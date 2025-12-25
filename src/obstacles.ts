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

export class ObstacleManager {
    obstacle_img: HTMLImageElement;
    existing_obstacles: Obstacle[] = [];
    timeSinceLastObstacle: number = 0;
    OBSTACLE_SPAWN_INTERVAL: number = 2; // seconds

    constructor(obstacle_img: HTMLImageElement, OBSTACLE_SPAWN_INTERVAL: number) {
        this.obstacle_img = obstacle_img;
        this.existing_obstacles = [];
        this.OBSTACLE_SPAWN_INTERVAL =  OBSTACLE_SPAWN_INTERVAL; 
    }
    createObstacle(random_number : number): Obstacle | null {
        if (random_number < 0.01 && this.obstacle_img !== null) {
            // Create a cactus obstacle
            console.log("Creating new obstacle");
            return new Obstacle(800, 150, 20, 30, this.obstacle_img); //Fix me: adjust y position as needed
        }
        else {
            return null;
        }
    }
}