const canvas = document.getElementById('gameCanvas');
canvas.width = WINDOW_WIDTH;
canvas.height = WINDOW_HEIGHT;

const worldData = generateDetailedWorld();
const camera = new Camera();
const renderer = new Renderer(canvas, worldData, camera);
const player = new Player(WINDOW_WIDTH / 2, WINDOW_HEIGHT / 2);

// Track game state
let gameRunning = true;
let score = 0;

// Add keyboard event listeners for additional controls
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        gameRunning = !gameRunning; // Toggle pause
    }
    if (e.key === ' ') {
        player.attack(); // Space bar for attack
    }
});

function updateGame() {
    camera.update();
    player.update();
    // Add game logic here
    score++;
}

function gameLoop() {
    if (gameRunning) {
        updateGame();
        renderer.draw();
        player.draw(renderer.ctx);
    }
    requestAnimationFrame(gameLoop);
}

gameLoop();
