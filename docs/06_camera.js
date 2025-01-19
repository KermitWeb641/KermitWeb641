class Camera {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.keys = {};
        this.setupControls();
    }

    setupControls() {
        window.addEventListener('keydown', (e) => this.keys[e.key.toLowerCase()] = true);
        window.addEventListener('keyup', (e) => this.keys[e.key.toLowerCase()] = false);
    }

    update() {
        if (this.keys['a']) this.x -= CAMERA_SPEED;
        if (this.keys['d']) this.x += CAMERA_SPEED;
        if (this.keys['w']) this.y -= CAMERA_SPEED;
        if (this.keys['s']) this.y += CAMERA_SPEED;

        const maxX = MAP_WIDTH * TILE_SIZE - WINDOW_WIDTH;
        const maxY = MAP_HEIGHT * TILE_SIZE - WINDOW_HEIGHT;
        
        this.x = Math.max(0, Math.min(this.x, maxX));
        this.y = Math.max(0, Math.min(this.y, maxY));
    }
}
