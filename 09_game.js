// Resource loading verification
console.log('Constants loaded:', typeof WINDOW_WIDTH !== 'undefined');
console.log('Colors loaded:', typeof COLORS !== 'undefined');
console.log('World Generator loaded:', typeof generateDetailedWorld !== 'undefined');
console.log('Camera loaded:', typeof Camera !== 'undefined');
console.log('Sprites loaded:', typeof Player !== 'undefined');
console.log('Renderer loaded:', typeof Renderer !== 'undefined');

// Canvas setup
const canvas = document.getElementById('gameCanvas');
canvas.width = WINDOW_WIDTH;
canvas.height = WINDOW_HEIGHT;

// Game initialization
const worldData = generateDetailedWorld();
const camera = new Camera();
const renderer = new Renderer(canvas, worldData, camera);
const player = new Player(WINDOW_WIDTH / 2, WINDOW_HEIGHT / 2);
const zombies = [];

// Game state tracking
let gameRunning = true;
let score = 0;
let killCount = 0;

// Zombie spawning configuration
const ZOMBIE_COUNT = 50;
const SPAWN_INTERVAL = 5000; // New zombie every 5 seconds

// Initial zombie spawn
for (let i = 0; i < ZOMBIE_COUNT; i++) {
    const x = Math.random() * MAP_WIDTH * TILE_SIZE;
    const y = Math.random() * MAP_HEIGHT * TILE_SIZE;
    zombies.push(new Zombie(x, y));
}

// Spawn new zombies periodically
setInterval(() => {
    if (zombies.length < ZOMBIE_COUNT && gameRunning) {
        const x = Math.random() * MAP_WIDTH * TILE_SIZE;
        const y = Math.random() * MAP_HEIGHT * TILE_SIZE;
        zombies.push(new Zombie(x, y));
    }
}, SPAWN_INTERVAL);

// Event listeners
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        gameRunning = !gameRunning; // Toggle pause
    }
    if (e.key === ' ') {
        attackZombies(); // Space bar for attack
    }
});

function attackZombies() {
    const attackRange = 50;
    zombies.forEach((zombie, index) => {
        const dx = zombie.x - player.x;
        const dy = zombie.y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < attackRange) {
            zombies.splice(index, 1);
            killCount++;
            score += 100;
        }
    });
}

function checkCollisions() {
    zombies.forEach(zombie => {
        const dx = player.x - zombie.x;
        const dy = player.y - zombie.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < player.width) {
            player.takeDamage(zombie.damage);
        }
    });
}

function drawHUD() {
    renderer.ctx.fillStyle = '#fff';
    renderer.ctx.font = '20px Arial';
    renderer.ctx.fillText(`Score: ${score}`, 20, 30);
    renderer.ctx.fillText(`Zombies Killed: ${killCount}`, 20, 60);
    renderer.ctx.fillText(`Health: ${player.health}`, 20, 90);
}

function updateGame() {
    camera.update();
    player.update();
    zombies.forEach(zombie => zombie.update(player));
    checkCollisions();
}

function gameLoop() {
    if (gameRunning) {
        updateGame();
        renderer.draw();
        zombies.forEach(zombie => zombie.draw(renderer.ctx));
        player.draw(renderer.ctx);
        drawHUD();
    } else {
        // Game Over screen
        renderer.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        renderer.ctx.fillRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);
        renderer.ctx.fillStyle = '#fff';
        renderer.ctx.font = '48px Arial';
        renderer.ctx.fillText('GAME OVER', WINDOW_WIDTH/2 - 100, WINDOW_HEIGHT/2);
        renderer.ctx.font = '24px Arial';
        renderer.ctx.fillText(`Final Score: ${score}`, WINDOW_WIDTH/2 - 70, WINDOW_HEIGHT/2 + 50);
    }
    requestAnimationFrame(gameLoop);
}

gameLoop();
