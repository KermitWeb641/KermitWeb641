const canvas = document.getElementById('gameCanvas');
canvas.width = WINDOW_WIDTH;
canvas.height = WINDOW_HEIGHT;

const worldData = generateDetailedWorld();
const camera = new Camera();
const renderer = new Renderer(canvas, worldData, camera);
const player = new Character(WINDOW_WIDTH / 2, WINDOW_HEIGHT / 2);

function gameLoop() {
    camera.update();
    player.update();
    renderer.draw();
    player.draw(renderer.ctx, camera.x, camera.y);
    requestAnimationFrame(gameLoop);
}

gameLoop();
