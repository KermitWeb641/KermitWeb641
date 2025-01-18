function improvedNoise(x, y) {
    return Math.sin(x * 0.05) * Math.cos(y * 0.05) * 
           Math.sin((x + y) * 0.05) +
           Math.sin(x * 0.1) * Math.cos(y * 0.1) * 0.5;
}

function generateDetailedWorld() {
    let worldData = [];
    for (let y = 0; y < MAP_HEIGHT; y++) {
        let row = [];
        for (let x = 0; x < MAP_WIDTH; x++) {
            let value = improvedNoise(x, y);
            let elevation = (improvedNoise(x * 2, y * 2) + 1) * 0.5;
            
            let biome;
            if (elevation < 0.2) {
                biome = 'WATER';
            } else if (elevation < 0.25) {
                biome = 'BEACH';
            } else if (value < -0.5) {
                biome = 'DESERT';
            } else if (value < -0.2) {
                biome = 'WASTELAND';
            } else if (value < 0) {
                biome = 'GRASS';
            } else if (value < 0.2) {
                biome = 'FOREST';
            } else if (value < 0.4) {
                biome = 'URBAN';
            } else if (value < 0.6) {
                biome = 'RUINS';
            } else {
                biome = 'MOUNTAIN';
            }

            if (((x % 100 === 0 || y % 100 === 0) && elevation > 0.25) ||
                ((x + 50) % 100 === 0 && (y + 50) % 100 === 0 && elevation > 0.25)) {
                biome = 'ROAD';
            }

            row.push({
                type: biome,
                detail: Math.random()
            });
        }
        worldData.push(row);
    }
    return worldData;
}
