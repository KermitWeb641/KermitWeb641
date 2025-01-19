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
        this.health = 100;
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

    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            gameRunning = false;
        }
    }

    draw(ctx) {
        // Draw player
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(this.x - camera.x, this.y - camera.y, this.width, this.height);
        
        // Draw health bar
        ctx.fillStyle = '#00FF00';
        ctx.fillRect(this.x - camera.x, this.y - camera.y - 10, 
                    (this.width * this.health) / 100, 5);
    }
}

class Zombie {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 32;
        this.speed = 2;
        this.health = 100;
        this.damage = 10;
        this.detectionRange = 200;
        this.state = 'wandering';
        this.frameCount = 0;
        this.currentFrame = 0;
    }

    update(player) {
        // Chase player if within range
        const distance = Math.sqrt(
            Math.pow(this.x - player.x, 2) + 
            Math.pow(this.y - player.y, 2)
        );
        if (distance < this.detectionRange) {
            this.state = 'chasing';
            const angle = Math.atan2(player.y - this.y, player.x - this.x);
            this.x += Math.cos(angle) * this.speed;
            this.y += Math.sin(angle) * this.speed;
        } else {
            this.state = 'wandering';
            // Random wandering behavior
            this.x += Math.cos(this.frameCount * 0.05) * this.speed * 0.5;
            this.y += Math.sin(this.frameCount * 0.05) * this.speed * 0.5;
        }

        // Animation update
        this.frameCount++;
        if (this.frameCount > 5) {
            this.currentFrame = (this.currentFrame + 1) % 4;
            this.frameCount = 0;
        }
    }

    draw(ctx) {
        ctx.fillStyle = '#00FF00';  // Zombie color
        ctx.fillRect(this.x - camera.x, this.y - camera.y, this.width, this.height);
    }
}
