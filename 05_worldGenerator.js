function generateDetailedWorld() {
    const world = new Array(MAP_HEIGHT);
    
    // Initialize 2D array
    for (let y = 0; y < MAP_HEIGHT; y++) {
        world[y] = new Array(MAP_WIDTH);
    }
    
    // Generate base terrain using noise
    for (let y = 0; y < MAP_HEIGHT; y++) {
        for (let x = 0; x < MAP_WIDTH; x++) {
            const noise = Math.random();
            let type;
            
            if (noise < 0.3) {
                type = 'GRASS';
            } else if (noise < 0.5) {
                type = 'FOREST';
            } else if (noise < 0.6) {
                type = 'URBAN';
            } else if (noise < 0.7) {
                type = 'DESERT';
            } else if (noise < 0.8) {
                type = 'MOUNTAIN';
            } else if (noise < 0.85) {
                type = 'WATER';
            } else if (noise < 0.9) {
                type = 'WASTELAND';
            } else if (noise < 0.95) {
                type = 'RUINS';
            } else {
                type = 'BEACH';
            }
            
            world[y][x] = {
                type: type,
                detail: Math.random()
            };
        }
    }
    
    // Add roads connecting urban areas
    for (let y = 0; y < MAP_HEIGHT; y += 50) {
        for (let x = 0; x < MAP_WIDTH; x++) {
            if (Math.random() < 0.7) {
                world[y][x] = {
                    type: 'ROAD',
                    detail: Math.random()
                };
            }
        }
    }
    
    return world;
}
