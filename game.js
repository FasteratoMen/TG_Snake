const tg = window.Telegram.WebApp;
tg.expand(); // Разворачиваем на весь экран

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const startBtn = document.getElementById("startBtn");

const gridSize = 20;
let tileCount;
let snake = [];
let food = { x: 5, y: 5 };
let dx = 0;
let dy = 0;
let score = 0;
let gameInterval;
let isRunning = false;

// Подстройка размера канваса
function resizeCanvas() {
    const width = Math.min(window.innerWidth * 0.9, 400);
    canvas.width = Math.floor(width / gridSize) * gridSize;
    canvas.height = canvas.width;
    tileCount = canvas.width / gridSize;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function resetGame() {
    snake = [{ x: 10, y: 10 }];
    dx = 1; dy = 0;
    score = 0;
    scoreEl.innerText = "Счет: 0";
    isRunning = true;
    startBtn.innerText = "Заново";
}

function startGame() {
    if (gameInterval) clearInterval(gameInterval);
    resetGame();
    gameInterval = setInterval(draw, 150);
}

function draw() {
    moveSnake();
    if (checkGameOver()) {
        clearInterval(gameInterval);
        tg.HapticFeedback.notificationOccurred('error'); // Вибрация при проигрыше
        alert("Конец игры! Счет: " + score);
        isRunning = false;
        return;
    }

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Змейка
    ctx.fillStyle = "#3390ec";
    snake.forEach(part => ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 2, gridSize - 2));

    // Еда
    ctx.fillStyle = "red";
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreEl.innerText = "Счет: " + score;
        tg.HapticFeedback.impactOccurred('medium'); // Вибрация при поедании
        placeFood();
    } else {
        snake.pop();
    }
}

function placeFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);
}

function checkGameOver() {
    const head = snake[0];
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) return true;
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) return true;
    }
    return false;
}

// Управление
function changeDir(nx, ny) {
    if ((nx !== 0 && dx === -nx) || (ny !== 0 && dy === -ny)) return;
    dx = nx; dy = ny;
}

document.getElementById("up").onclick = () => changeDir(0, -1);
document.getElementById("down").onclick = () => changeDir(0, 1);
document.getElementById("left").onclick = () => changeDir(-1, 0);
document.getElementById("right").onclick = () => changeDir(1, 0);
startBtn.onclick = startGame;

// Клавиатура для десктопа
window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") changeDir(0, -1);
    if (e.key === "ArrowDown") changeDir(0, 1);
    if (e.key === "ArrowLeft") changeDir(-1, 0);
    if (e.key === "ArrowRight") changeDir(1, 0);
});
