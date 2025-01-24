export class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.camera = {
            x: 0,
            y: 0,
            zoom: 1
        };
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawWorld(world) {
        // Draw terrain
        world.tiles.forEach(tile => {
            this.ctx.fillStyle = tile.color;
            this.ctx.fillRect(
                tile.x - this.camera.x,
                tile.y - this.camera.y,
                tile.width,
                tile.height
            );
        });
    }

    drawEntities(entities) {
        entities.forEach(entity => {
            this.ctx.fillStyle = entity.color;
            this.ctx.beginPath();
            this.ctx.arc(
                entity.x - this.camera.x,
                entity.y - this.camera.y,
                entity.radius,
                0,
                Math.PI * 2
            );
            this.ctx.fill();
        });
    }
}
