class Renderer {
    constructor(canvas, worldData, camera) {
        this.ctx = canvas.getContext('2d');
        this.worldData = worldData;
        this.camera = camera;
        this.ctx.imageSmoothingEnabled = false;
    }

    draw() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);

        const startX = Math.floor(this.camera.x / TILE_SIZE);
        const startY = Math.floor(this.camera.y / TILE_SIZE);
        const tilesX = Math.ceil(WINDOW_WIDTH / TILE_SIZE) + 2;
        const tilesY = Math.ceil(WINDOW_HEIGHT / TILE_SIZE) + 2;
        const endX = Math.min(startX + tilesX, MAP_WIDTH);
        const endY = Math.min(startY + tilesY, MAP_HEIGHT);

        for (let y = startY; y < endY; y++) {
            for (let x = startX; x < endX; x++) {
                if (x >= 0 && x < MAP_WIDTH && y >= 0 && y < MAP_HEIGHT) {
                    this.drawTile(x, y);
                }
            }
        }
    }

    drawTile(x, y) {
        const screenX = x * TILE_SIZE - this.camera.x;
        const screenY = y * TILE_SIZE - this.camera.y;
        
        const tile = this.worldData[y][x];
        const biomeColors = COLORS[tile.type];
        
        this.ctx.fillStyle = biomeColors.main;
        this.ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);

        this.drawTileDetails(tile, screenX, screenY, biomeColors);
    }

    drawTileDetails(tile, screenX, screenY, biomeColors) {
        const detailColor = biomeColors.detail[Math.floor(tile.detail * 3)];
        this.ctx.fillStyle = detailColor;
        
        if (tile.type === 'FOREST') {
            this.ctx.fillRect(screenX + TILE_SIZE/4, 
                            screenY + TILE_SIZE/4,
                            TILE_SIZE/2, TILE_SIZE/2);
        } else if (tile.type === 'URBAN' || tile.type === 'RUINS') {
            this.ctx.fillRect(screenX + TILE_SIZE/3,
                            screenY + TILE_SIZE/3,
                            TILE_SIZE/3, TILE_SIZE/3);
        }
    }
}
