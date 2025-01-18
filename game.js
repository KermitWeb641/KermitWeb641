const canvas = document.getElementById('gameCanvas');
canvas.width = WINDOW_WIDTH;
canvas.height = WINDOW_HEIGHT;

const worldData = generateDetailedWorld();
const camera = new Camera();
const renderer = new Renderer(canvas, worldData, camera);

function gameLoop() {
    camera.update();
    renderer.draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
