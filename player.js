import { GAME_CONFIG } from './config.js';
import { utils } from './utils.js';

export class Player {
    constructor(x, y) {
        // Position and movement
        this.x = x;
        this.y = y;
        this.velocity = { x: 0, y: 0 };
        this.speed = GAME_CONFIG.PLAYER_SPEED;
        this.radius = GAME_CONFIG.PLAYER_RADIUS;
        
        // Stats
        this.health = GAME_CONFIG.PLAYER_HEALTH;
        this.damage = GAME_CONFIG.PLAYER_DAMAGE;
        
        // Combat
        this.lastShootTime = 0;
        this.isReloading = false;
        
        // Input state
        this.keys = {
            up: false,
            down: false,
            left: false,
            right: false
        };
        
        // Mouse position
        this.mouseX = 0;
        this.mouseY = 0;
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('keyup', (e) => this.handleKeyUp(e));
        window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    }

    handleKeyDown(e) {
        switch(e.key.toLowerCase()) {
            case 'w': this.keys.up = true; break;
            case 's': this.keys.down = true; break;
            case 'a': this.keys.left = true; break;
            case 'd': this.keys.right = true; break;
        }
    }

    handleKeyUp(e) {
        switch(e.key.toLowerCase()) {
            case 'w': this.keys.up = false; break;
            case 's': this.keys.down = false; break;
            case 'a': this.keys.left = false; break;
            case 'd': this.keys.right = false; break;
        }
    }

    handleMouseMove(e) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
    }

    update(deltaTime) {
        // Movement
        this.velocity.x = 0;
        this.velocity.y = 0;

        if (this.keys.up) this.velocity.y -= 1;
        if (this.keys.down) this.velocity.y += 1;
        if (this.keys.left) this.velocity.x -= 1;
        if (this.keys.right) this.velocity.x += 1;

        // Normalize diagonal movement
        if (this.velocity.x !== 0 && this.velocity.y !== 0) {
            this.velocity = utils.vector.normalize(this.velocity);
        }

        // Apply speed
        this.velocity = utils.vector.multiply(this.velocity, this.speed);

        // Update position
        this.x += this.velocity.x;
        this.y += this.velocity.y;

        // Keep player in bounds
        this.x = utils.clamp(this.x, this.radius, GAME_CONFIG.WORLD_WIDTH - this.radius);
        this.y = utils.clamp(this.y, this.radius, GAME_CONFIG.WORLD_HEIGHT - this.radius);
    }

    shoot() {
        const currentTime = Date.now();
        if (currentTime - this.lastShootTime >= GAME_CONFIG.FIRE_RATE && !this.isReloading) {
            this.lastShootTime = currentTime;
            return true;
        }
        return false;
    }

    takeDamage(amount) {
        this.health -= amount;
        return this.health <= 0;
    }

    heal(amount) {
        this.health = Math.min(this.health + amount, GAME_CONFIG.PLAYER_HEALTH);
    }

    getRotation() {
        return utils.angle(this.x, this.y, this.mouseX, this.mouseY);
    }
}
