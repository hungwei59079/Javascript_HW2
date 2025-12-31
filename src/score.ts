export class Score_manager {
    score: number = 0;
    score_per_second: number = 100; // points per second

    constructor(score_per_second: number) {
        this.score_per_second = score_per_second;
        this.score = 0;
    }

    update(dt: number) {
        this.score += this.score_per_second * dt;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = 'black';
        ctx.font = '20px Arial';
        ctx.fillText(`Score: ${Math.floor(this.score)}`, 600, 30);
    }

    reset() {
        this.score = 0;
    }
}