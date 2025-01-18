const SPRITE_STATES = {
    IDLE: 0,
    WALKING: 1,
    ATTACKING: 2
};

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 32;
        this.speed = 5;
        this.state = SPRITE_STATES.IDLE;
        this.frameCount = 0;
        this.currentFrame = 0;
        this.direction = 1; // 1 for right, -1 for left
    }

    update() {
        // Handle movement
        if (keys['w']) this.y -= this.speed;
        if (keys['s']) this.y += this.speed;
        if (keys['a']) {
            this.x -= this.speed;
            this.direction = -1;
        }
        if (keys['d']) {
            this.x += this.speed;
            this.direction = 1;
        }

        // Update animation frames
        this.frameCount++;
        if (this.frameCount > 5) {
            this.currentFrame = (this.currentFrame + 1) % 4;
            this.frameCount = 0;
        }
    }

    draw(ctx) {
        // For now, draw a placeholder rectangle
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(this.x - camera.x, this.y - camera.y, this.width, this.height);
    }
}
