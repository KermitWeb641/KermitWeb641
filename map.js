import { createNoise2D } from 'https://cdn.jsdelivr.net/npm/simplex-noise@4.0.1/dist/esm/simplex-noise.js';

class PixelMap {
    constructor(width = 3200, height = 2400, tileSize = 4) {  
        this.canvas = document.getElementById('gameMap');
        this.cameraViewport = document.getElementById('camera-viewport');
        this.debugInfo = document.getElementById('debug-info');
        this.ctx = this.canvas.getContext('2d', { 
            alpha: false, 
            willReadFrequently: true 
        });
        
        this.width = width;
        this.height = height;
        this.tileSize = tileSize;
        
        this.canvas.width = width;
        this.canvas.height = height;
        
        this.tiles = {
            DEEP_WATER: '#1a5f7a',
            SHALLOW_WATER: '#2980b9',
            SAND: '#f1c40f',
            GRASS_LIGHT: '#2ecc71',
            GRASS_DARK: '#27ae60',
            ROCK_LIGHT: '#95a5a6',
            ROCK_DARK: '#7f8c8d',
            MOUNTAIN: '#34495e'
        };
        
        this.viewportWidth = 1200;  
        this.viewportHeight = 900;  
        this.cameraX = 0;
        this.cameraY = 0;
        
        this.playerSize = 24;  
        this.playerX = width / 2 - this.playerSize / 2;
        this.playerY = height / 2 - this.playerSize / 2;
        this.playerSpeed = 2;  
        this.playerHealth = 3;  
        this.isGameOver = false;  
        this.isInvincible = false;
        this.invincibilityStartTime = 0;
        this.invincibilityDuration = 2000; // 2 seconds
        this.blinkInterval = null;
        
        this.keys = {
            ArrowUp: false,
            ArrowDown: false,
            ArrowLeft: false,
            ArrowRight: false,
            w: false,
            s: false,
            a: false,
            d: false
        };
        
        this.frameCount = 0;
        this.lastFrameTime = performance.now();
        
        this.noise = createNoise2D();
        
        this.mapData = this.generateMapData();
        this.offscreenCanvas = this.createOffscreenMap();
        
        this.customCursor = document.getElementById('custom-cursor');
        
        this.customCursor.addEventListener('error', () => {
            console.error('Failed to load custom cursor image');
            this.customCursor.style.display = 'none';
        });
        
        this.customCursor.style.display = 'block';
        
        window.addEventListener('mousemove', this.updateCustomCursor.bind(this));
        
        this.bullets = [];
        this.bulletSpeed = 8;  
        this.bulletRadius = 6;  
    
        this.canvas.addEventListener('click', this.shootBullet.bind(this));
        
        this.zombies = [];
        this.zombieCollisionCooldown = new Map();
        this.spawnZombies(20);  
    
        this.gameOverScreen = document.getElementById('game-over-screen');
        this.restartButton = document.getElementById('restart-button');
        this.restartButton.addEventListener('click', this.restartGame.bind(this));
        
        this.knockbackInProgress = false;
        this.knockbackStartTime = 0;
        this.knockbackDuration = 300; // milliseconds
        
        this.renderMap();
        this.drawPlayer();
        this.setupControls();
        
        this.startGameLoop();
    }
    
    generateMapData() {
        const scale = 0.05;  
        const elevationThresholds = {
            deepWater: -0.3,
            shallowWater: -0.1,
            sand: 0,
            grass: 0.3,
            rock: 0.6,
            mountain: 0.8
        };
        
        const mapData = [];
        const tilesX = Math.ceil(this.width / this.tileSize);
        const tilesY = Math.ceil(this.height / this.tileSize);
        
        for (let x = 0; x < tilesX; x++) {
            mapData[x] = [];
            for (let y = 0; y < tilesY; y++) {
                const noiseVal = this.noise(x * scale, y * scale);
                
                let color;
                if (noiseVal < elevationThresholds.deepWater) {
                    color = this.tiles.DEEP_WATER;
                } else if (noiseVal < elevationThresholds.shallowWater) {
                    color = this.tiles.SHALLOW_WATER;
                } else if (noiseVal < elevationThresholds.sand) {
                    color = this.tiles.SAND;
                } else if (noiseVal < elevationThresholds.grass) {
                    color = Math.random() < 0.5 ? this.tiles.GRASS_LIGHT : this.tiles.GRASS_DARK;
                } else if (noiseVal < elevationThresholds.rock) {
                    color = Math.random() < 0.5 ? this.tiles.ROCK_LIGHT : this.tiles.ROCK_DARK;
                } else {
                    color = this.tiles.MOUNTAIN;
                }
                
                mapData[x][y] = color;
            }
        }
        
        return mapData;
    }
    
    createOffscreenMap() {
        const offscreen = document.createElement('canvas');
        offscreen.width = this.width;
        offscreen.height = this.height;
        const offCtx = offscreen.getContext('2d');
        
        for (let x = 0; x < this.mapData.length; x++) {
            for (let y = 0; y < this.mapData[x].length; y++) {
                offCtx.fillStyle = this.mapData[x][y];
                offCtx.fillRect(
                    x * this.tileSize, 
                    y * this.tileSize, 
                    this.tileSize, 
                    this.tileSize
                );
            }
        }
        
        return offscreen;
    }
    
    renderMap() {
        this.ctx.drawImage(this.offscreenCanvas, 0, 0);
    }
    
    drawPlayer() {
        if (!this.isInvincible) {
            this.ctx.fillStyle = 'red';
            this.ctx.fillRect(
                this.playerX, 
                this.playerY, 
                this.playerSize, 
                this.playerSize
            );
        } else {
            // Blinking effect: alternate between visible and invisible
            this.ctx.fillStyle = 'red';
            if (Math.floor(Date.now() / 200) % 2 === 0) {
                this.ctx.globalAlpha = 1;
            } else {
                this.ctx.globalAlpha = 0.5;
            }
            
            this.ctx.fillRect(
                this.playerX, 
                this.playerY, 
                this.playerSize, 
                this.playerSize
            );
            
            // Reset global alpha
            this.ctx.globalAlpha = 1;
        }
    }
    
    updatePlayerPosition() {
        if (this.keys.ArrowUp || this.keys.w) {
            this.playerY = Math.max(0, this.playerY - this.playerSpeed);
        }
        if (this.keys.ArrowDown || this.keys.s) {
            this.playerY = Math.min(this.height - this.playerSize, this.playerY + this.playerSpeed);
        }
        if (this.keys.ArrowLeft || this.keys.a) {
            this.playerX = Math.max(0, this.playerX - this.playerSpeed);
        }
        if (this.keys.ArrowRight || this.keys.d) {
            this.playerX = Math.min(this.width - this.playerSize, this.playerX + this.playerSpeed);
        }
    }
    
    setupControls() {
        window.addEventListener('keydown', (e) => {
            if (e.key in this.keys) {
                this.keys[e.key] = true;
            }
        });
        
        window.addEventListener('keyup', (e) => {
            if (e.key in this.keys) {
                this.keys[e.key] = false;
            }
        });
    }
    
    shootBullet(event) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        
        const playerCenterX = this.playerX + this.playerSize / 2;
        const playerCenterY = this.playerY + this.playerSize / 2;
        
        const angle = Math.atan2(mouseY - playerCenterY, mouseX - playerCenterX);
        
        const bullet = {
            x: playerCenterX,
            y: playerCenterY,
            dx: Math.cos(angle) * this.bulletSpeed,
            dy: Math.sin(angle) * this.bulletSpeed,
            radius: this.bulletRadius
        };
        
        this.bullets.push(bullet);
    }
    
    updateBullets() {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            
            bullet.x += bullet.dx;
            bullet.y += bullet.dy;
            
            if (bullet.x < 0 || bullet.x > this.width || 
                bullet.y < 0 || bullet.y > this.height) {
                this.bullets.splice(i, 1);
            }
        }
    }
    
    drawBullets() {
        this.ctx.fillStyle = 'yellow';
        this.bullets.forEach(bullet => {
            this.ctx.beginPath();
            this.ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
    
    updateCamera() {
        this.cameraX = this.playerX - this.viewportWidth / 2 + this.playerSize / 2;
        this.cameraY = this.playerY - this.viewportHeight / 2 + this.playerSize / 2;
        
        this.cameraX = Math.max(0, Math.min(this.cameraX, this.width - this.viewportWidth));
        this.cameraY = Math.max(0, Math.min(this.cameraY, this.height - this.viewportHeight));
        
        this.canvas.style.transform = `translate(${-this.cameraX}px, ${-this.cameraY}px)`;
    }
    
    spawnZombies(count) {
        for (let i = 0; i < count; i++) {
            const x = Math.random() * this.width;
            const y = Math.random() * this.height;
            
            const zombieDistance = Math.hypot(x - this.playerX, y - this.playerY);
            if (zombieDistance < 200) continue;
            
            this.zombies.push({
                x: x,
                y: y,
                size: 20,  
                speed: 1,  
                health: 2,  
                color: 'green'
            });
        }
    }
    
    updateZombies() {
        this.zombies.forEach(zombie => {
            const angle = Math.atan2(
                this.playerY - zombie.y, 
                this.playerX - zombie.x
            );
            
            const randomFactor = (Math.random() - 0.5) * 0.5;
            
            zombie.x += Math.cos(angle) * zombie.speed * (1 + randomFactor);
            zombie.y += Math.sin(angle) * zombie.speed * (1 + randomFactor);
            
            zombie.x = Math.max(0, Math.min(zombie.x, this.width));
            zombie.y = Math.max(0, Math.min(zombie.y, this.height));
        });
    }
    
    drawZombies() {
        this.zombies.forEach(zombie => {
            this.ctx.fillStyle = zombie.color;
            this.ctx.fillRect(
                zombie.x, 
                zombie.y, 
                zombie.size, 
                zombie.size
            );
        });
    }
    
    checkBulletZombieCollisions() {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            
            for (let j = this.zombies.length - 1; j >= 0; j--) {
                const zombie = this.zombies[j];
                
                const dx = bullet.x - zombie.x;
                const dy = bullet.y - zombie.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < zombie.size) {
                    zombie.health--;
                    
                    const knockbackDistance = 40;  
                    const angle = Math.atan2(dy, dx);
                    
                    const zombieKnockbackStart = Date.now();
                    const zombieKnockbackDuration = 200;
                    
                    const zombieKnockbackAnimation = () => {
                        const elapsedTime = Date.now() - zombieKnockbackStart;
                        const progress = Math.min(1, elapsedTime / zombieKnockbackDuration);
                        
                        const t = 1 - (1 - progress) * (1 - progress);
                        
                        zombie.x = zombie.x + Math.cos(angle) * knockbackDistance * (1 - t);
                        zombie.y = zombie.y + Math.sin(angle) * knockbackDistance * (1 - t);
                        
                        zombie.color = progress < 0.5 ? 'red' : 'green';
                        
                        if (progress < 1) {
                            requestAnimationFrame(zombieKnockbackAnimation);
                        } else {
                            zombie.color = 'green';
                        }
                    };
                    
                    requestAnimationFrame(zombieKnockbackAnimation);
                    
                    this.bullets.splice(i, 1);
                    
                    if (zombie.health <= 0) {
                        this.zombies.splice(j, 1);
                    }
                    
                    break;
                }
            }
        }
    }
    
    checkZombiePlayerCollisions() {
        if (this.isGameOver || this.isInvincible) return;
        
        const currentTime = Date.now();
        
        this.zombies.forEach(zombie => {
            const dx = zombie.x - this.playerX;
            const dy = zombie.y - this.playerY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            const lastHitTime = this.zombieCollisionCooldown.get(zombie) || 0;
            const canHit = currentTime - lastHitTime > 1000;
            
            if (distance < this.playerSize + zombie.size && canHit) {
                this.playerHealth--;
                
                this.startInvincibility();
                
                const knockbackDistance = 250;  
                const angle = Math.atan2(dy, dx);
                
                this.knockbackInProgress = true;
                this.knockbackStartTime = currentTime;
                
                const originalX = this.playerX;
                const originalY = this.playerY;
                
                const knockbackAnimation = () => {
                    const elapsedTime = Date.now() - this.knockbackStartTime;
                    const progress = Math.min(1, elapsedTime / this.knockbackDuration);
                    
                    const t = 1 - Math.pow(1 - progress, 3);  
                    
                    this.playerX = originalX + Math.cos(angle) * knockbackDistance * (1 - t);
                    this.playerY = originalY + Math.sin(angle) * knockbackDistance * (1 - t);
                    
                    this.playerX = Math.max(0, Math.min(this.playerX, this.width - this.playerSize));
                    this.playerY = Math.max(0, Math.min(this.playerY, this.height - this.playerSize));
                    
                    if (progress < 1) {
                        requestAnimationFrame(knockbackAnimation);
                    } else {
                        this.knockbackInProgress = false;
                    }
                };
                
                requestAnimationFrame(knockbackAnimation);
                
                this.zombieCollisionCooldown.set(zombie, currentTime);
                
                if (this.playerHealth <= 0) {
                    this.gameOver();
                }
            }
        });
    }
    
    startInvincibility() {
        if (this.isInvincible) return;

        this.isInvincible = true;
        this.invincibilityStartTime = Date.now();

        let isVisible = true;
        this.blinkInterval = setInterval(() => {
            isVisible = !isVisible;
        }, 200); 

        setTimeout(() => {
            this.endInvincibility();
        }, this.invincibilityDuration);
    }

    endInvincibility() {
        this.isInvincible = false;
        this.ctx.globalAlpha = 1;
        
        if (this.blinkInterval) {
            clearInterval(this.blinkInterval);
            this.blinkInterval = null;
        }
    }

    gameOver() {
        this.isGameOver = true;
        this.gameOverScreen.classList.remove('hidden');
        
        cancelAnimationFrame(this.animationFrameId);
    }
    
    restartGame() {
        this.playerX = this.width / 2 - this.playerSize / 2;
        this.playerY = this.height / 2 - this.playerSize / 2;
        this.playerHealth = 3;
        this.isGameOver = false;
        this.bullets = [];
        this.zombies = [];
        
        this.gameOverScreen.classList.add('hidden');
        
        this.debugInfo.textContent = '';
        this.debugInfo.style.color = 'white';
        this.debugInfo.style.fontSize = 'inherit';
        
        this.spawnZombies(20);
        
        this.endInvincibility();
        
        this.startGameLoop();
    }
    
    updateCustomCursor(e) {
        const cursorWidth = this.customCursor.width;
        const cursorHeight = this.customCursor.height;
        
        this.customCursor.style.left = `${e.clientX - cursorWidth / 2}px`;
        this.customCursor.style.top = `${e.clientY - cursorHeight / 2}px`;
    }
    
    spawnAdditionalZombies() {
        if (this.zombies.length < 30) {  
            const newZombieCount = Math.max(1, 5 - this.zombies.length);
            this.spawnZombies(newZombieCount);
        }
    }
    
    startGameLoop() {
        const gameLoop = (currentTime) => {
            if (this.isGameOver) return;
            
            this.frameCount++;
            const timeSinceLastFrame = currentTime - this.lastFrameTime;
            
            if (this.frameCount % 30 === 0) {
                const fps = Math.round(1000 / timeSinceLastFrame);
                this.debugInfo.textContent = `FPS: ${fps}`;
            }
            
            this.lastFrameTime = currentTime;
            
            this.renderMap();
            
            this.updatePlayerPosition();
            
            this.updateCamera();
            
            this.drawPlayer();
            
            this.updateBullets();
            this.drawBullets();
            
            this.updateZombies();
            this.drawZombies();
            
            this.checkBulletZombieCollisions();
            this.checkZombiePlayerCollisions();
            
            if (this.frameCount % 300 === 0) {  
                this.spawnAdditionalZombies();
            }
            
            this.animationFrameId = requestAnimationFrame(gameLoop);
        };
        
        this.animationFrameId = requestAnimationFrame(gameLoop);
    }
}

window.addEventListener('load', () => {
    try {
        new PixelMap();
    } catch (error) {
        console.error('Failed to initialize game:', error);
        alert('Game initialization failed. Please reload the page.');
    }
});