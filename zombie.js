import { GAME_CONFIG } from './config.js';
import { utils } from './utils.js';

export class Zombie {
    constructor(x, y) {
        // Position and movement
        this.x = x;
        this.y = y;
        this.velocity = { x: 0, y: 0 };
        this.speed = GAME_CONFIG.ZOMBIE_SPEED;
        this.radius = GAME_CONFIG.ZOMBIE_RADIUS;
        
        // Stats
        this.health = GAME_CONFIG.ZOMBIE_HEALTH;
        this.damage = GAME_CONFIG.ZOMBIE_DAMAGE;
        
        // State
        this.id = utils.generateId();
        this.lastAttackTime = 0;
        this.attackCooldown = 1000; // 1 second between attacks
        
        // Behavior
        this.detectionRange = 300;
        this.aggroRange = 200;
    }

    update(deltaTime, player) {
        // Calculate direction to player
        const angle = utils.angle(this.x, this.y, player.x, player.y);
        const distanceToPlayer = utils.distance(this.x, this.y, player.x, player.y);

        // Move towards player if in range
        if (distanceToPlayer <= this.detectionRange) {
            // Calculate velocity
            this.velocity.x = Math.cos(angle) * this.speed;
            this.velocity.y = Math.sin(angle) * this.speed;

            // Update position
            this.x += this.velocity.x;
            this.y += this.velocity.y;
        }

        // Keep zombie in bounds
        this.x = utils.clamp(this.x, this.radius, GAME_CONFIG.WORLD_WIDTH - this.radius);
        this.y = utils.clamp(this.y, this.radius, GAME_CONFIG.WORLD_HEIGHT - this.radius);

        return this.checkAttack(player, distanceToPlayer);
    }

    checkAttack(player, distance) {
        const currentTime = Date.now();
        if (distance <= this.radius + player.radius && 
            currentTime - this.lastAttackTime >= this.attackCooldown) {
            this.lastAttackTime = currentTime;
            return true;
        }
        return false;
    }

    takeDamage(amount) {
        this.health -= amount;
        return this.health <= 0;
    }

    getState() {
        return {
            x: this.x,
            y: this.y,
            health: this.health,
            id: this.id
        };
    }

    static spawn(worldWidth, worldHeight, playerPos, minDistance = 300) {
        let x, y;
        do {
            x = utils.randomInt(0, worldWidth);
            y = utils.randomInt(0, worldHeight);
        } while (utils.distance(x, y, playerPos.x, playerPos.y) < minDistance);

        return new Zombie(x, y);
    }
}
