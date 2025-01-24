export class WorldGenerator {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.tiles = [];
    }

    generate() {
        // Generate terrain
        for (let x = 0; x < this.width; x += 32) {
            for (let y = 0; y < this.height; y += 32) {
                this.tiles.push({
                    x: x,
                    y: y,
                    width: 32,
                    height: 32,
                    color: this.getTerrainColor(),
                    type: this.getTerrainType()
                });
            }
        }
        return this.tiles;
    }

    getTerrainColor() {
        const colors = ['#567d46', '#4a6d3c', '#628952'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    getTerrainType() {
        const types = ['grass', 'dirt', 'obstacle'];
        return types[Math.floor(Math.random() * types.length)];
    }

    generateObstacles() {
        const obstacles = [];
        // Add trees, rocks, buildings
        return obstacles;
    }
}
