class Renderer {
    constructor(canvas, worldData, camera) {
        this.ctx = canvas.getContext('2d');
        this.worldData = worldData;
        this.camera = camera;
        this.ctx.imageSmoothingEnabled = false; // Keeps pixels sharp when zoomed
    }

    draw() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);

        const effectiveTileSize = TILE_SIZE * this.camera.zoomLevel;
        const startX = Math.floor(this.camera.x / effectiveTileSize);
        const startY = Math.floor(this.camera.y / effectiveTileSize);
        const tilesX = Math.ceil(WINDOW_WIDTH / effectiveTileSize) + 2;
        const tilesY = Math.ceil(WINDOW_HEIGHT / effectiveTileSize) + 2;
        const endX = Math.min(startX + tilesX, MAP_WIDTH);
        const endY = Math.min(startY + tilesY, MAP_HEIGHT);

        for (let y = startY; y < endY; y++) {
            for (let x = startX; x < endX; x++) {
                if (x >= 0 && x < MAP_WIDTH && y >= 0 && y < MAP_HEIGHT) {
                    this.drawTile(x, y, effectiveTileSize);
                }
            }
        }
    }

    // Rest of the renderer code remains the same
}
