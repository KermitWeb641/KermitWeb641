class Renderer {
    constructor(canvas, worldData, camera) {
        this.ctx = canvas.getContext('2d');
        this.worldData = worldData;
        this.camera = camera;
    }

    draw() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);

        const effectiveTileSize = TILE_SIZE * this.camera.zoomLevel;
        const startX = Math.floor(this.camera.x / effectiveTileSize);
        const startY = Math.floor(this.camera.y / effectiveTileSize);
        const endX = startX + Math.ceil(WINDOW_WIDTH / effectiveTileSize) + 1;
        const endY = startY + Math.ceil(WINDOW_HEIGHT / effectiveTileSize) + 1;

        for (let y = startY; y < endY; y++) {
            for (let x = startX; x < endX; x++) {
                if (x >= 0 && x < MAP_WIDTH && y >= 0 && y < MAP_HEIGHT) {
                    this.drawTile(x, y, effectiveTileSize);
                }
            }
        }
    }

    drawTile(x, y, effectiveTileSize) {
        const screenX = x * effectiveTileSize - this.camera.x;
        const screenY = y * effectiveTileSize - this.camera.y;
        
        const tile = this.worldData[y][x];
        const biomeColors = COLORS[tile.type];
        
        this.ctx.fillStyle = biomeColors.main;
        this.ctx.fillRect(screenX, screenY, effectiveTileSize, effectiveTileSize);

        if (this.camera.zoomLevel > 0.8) {
            this.drawTileDetails(tile, screenX, screenY, effectiveTileSize, biomeColors);
        }
    }

    drawTileDetails(tile, screenX, screenY, effectiveTileSize, biomeColors) {
        const detailColor = biomeColors.detail[Math.floor(tile.detail * 3)];
        this.ctx.fillStyle = detailColor;
        
        if (tile.type === 'FOREST') {
            this.ctx.fillRect(screenX + effectiveTileSize/4, 
                            screenY + effectiveTileSize/4,
                            effectiveTileSize/2, effectiveTileSize/2);
        } else if (tile.type === 'URBAN' || tile.type === 'RUINS') {
            this.ctx.fillRect(screenX + effectiveTileSize/3,
                            screenY + effectiveTileSize/3,
                            effectiveTileSize/3, effectiveTileSize/3);
        }
    }
}
