export const GAME_CONFIG = {
    // World settings
    WORLD_WIDTH: 2000,
    WORLD_HEIGHT: 2000,
    TILE_SIZE: 32,
    
    // Player settings
    PLAYER_SPEED: 5,
    PLAYER_HEALTH: 100,
    PLAYER_DAMAGE: 25,
    PLAYER_RADIUS: 15,
    
    // Zombie settings
    ZOMBIE_SPEED: 2,
    ZOMBIE_HEALTH: 50,
    ZOMBIE_DAMAGE: 10,
    ZOMBIE_RADIUS: 15,
    ZOMBIE_SPAWN_RATE: 3000, // milliseconds
    
    // Weapon settings
    BULLET_SPEED: 10,
    BULLET_DAMAGE: 25,
    FIRE_RATE: 250, // milliseconds
    
    // Game settings
    FPS: 60,
    DEBUG_MODE: true,
    
    // Camera settings
    CAMERA_SMOOTHING: 0.1,
    
    // Colors
    COLORS: {
        PLAYER: '#4287f5',
        ZOMBIE: '#ff4444',
        BULLET: '#ffff00',
        BACKGROUND: '#2c3e50'
    },
    
    // Terrain types
    TERRAIN: {
        GRASS: 'grass',
        DIRT: 'dirt',
        OBSTACLE: 'obstacle'
    }
};
