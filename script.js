const canvas = document.getElementById("snakeGame");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const startButton = document.getElementById("startButton");

const gameWrapper = document.querySelector('.game-wrapper');
const gameOverScreen = document.getElementById("gameOverScreen");
const gameOverMessage = document.getElementById("gameOverMessage");
const finalScoreElement = document.getElementById("finalScore");
const restartButton = document.getElementById("restartButton");
const prisonArt = document.getElementById("prisonArt"); // Image element

const grid = 20;
let count = 0;
let score = 0;
let gameStarted = false;

let snake = {
    x: 160,
    y: 160,
    dx: grid,
    dy: 0,
    cells: [],
    maxCells: 4
};

let food = {
    x: 320,
    y: 320
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function drawGrid() {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;

    for (let i = 0; i < canvas.width / grid; i++) {
        for (let j = 0; j < canvas.height / grid; j++) {
            ctx.strokeRect(i * grid, j * grid, grid, grid);
        }
    }
}

function resetGame() {
    gameStarted = false;
    
    // 显示游戏结束画面并隐藏游戏主界面
    gameWrapper.classList.add('hidden');
    gameOverScreen.classList.remove('hidden');

    // 更新游戏结束信息和最终分数
    gameOverMessage.textContent = "蒋智深蒋智你被捕了！";
    finalScoreElement.textContent = score;
    


    // 重置蛇和分数以备下一局游戏
    snake.x = 160;
    snake.y = 160;
    snake.cells = [];
    snake.maxCells = 4;
    snake.dx = grid; // 默认向右移动
    snake.dy = 0;
    score = 0;
    scoreElement.innerHTML = score;

    // 重置食物位置
    food.x = getRandomInt(0, 20) * grid;
    food.y = getRandomInt(0, 20) * grid;

    startButton.textContent = "开始游戏"; // 更新按钮文本
}

function loop() {
    requestAnimationFrame(loop);

    if (!gameStarted) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawGrid();
        // 在暂停状态下绘制初始的蛇和食物，以便玩家看到游戏初始布局
        ctx.fillStyle = '#e74c3c'; // 食物颜色
        ctx.fillRect(food.x, food.y, grid - 1, grid - 1);
        ctx.fillStyle = '#2ecc71'; // 蛇的颜色
        snake.cells.forEach(function(cell) {
             ctx.fillRect(cell.x, cell.y, grid - 1, grid - 1);
        });
        return;
    }

    if (++count < 6) return; // 控制游戏速度
    count = 0;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid(); // 绘制网格

    snake.x += snake.dx;
    snake.y += snake.dy;

    // 边界检测 (撞墙死亡)
    if (snake.x < 0 || snake.x >= canvas.width || snake.y < 0 || snake.y >= canvas.height) {
        resetGame();
    }

    snake.cells.unshift({x: snake.x, y: snake.y});

    if (snake.cells.length > snake.maxCells) {
        snake.cells.pop();
    }

    // 绘制食物
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(food.x, food.y, grid - 1, grid - 1);

    // 绘制蛇
    ctx.fillStyle = '#2ecc71';
    snake.cells.forEach(function(cell, index) {
        ctx.fillRect(cell.x, cell.y, grid - 1, grid - 1);

        // 检测是否吃到食物
        if (cell.x === food.x && cell.y === food.y) {
            snake.maxCells++;
            score += 10;
            scoreElement.innerHTML = score;
            // 重新随机生成食物位置
            food.x = getRandomInt(0, 20) * grid;
            food.y = getRandomInt(0, 20) * grid;
        }

        // 检测是否撞到自己
        for (let i = index + 1; i < snake.cells.length; i++) {
            if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
                resetGame();
            }
        }
    });
}

// “开始游戏”按钮的事件监听器
startButton.addEventListener('click', function() {
    gameStarted = !gameStarted; // 切换游戏状态
    startButton.textContent = gameStarted ? "暂停游戏" : "开始游戏"; // 更新按钮文本
});

// “再玩一次”按钮的事件监听器
restartButton.addEventListener('click', function() {
    gameOverScreen.classList.add('hidden'); // 隐藏游戏结束画面
    gameWrapper.classList.remove('hidden'); // 显示游戏主界面
    // 游戏状态和数据已经在resetGame()中重置，只需让游戏循环重新绘制即可
});


// 键盘事件监听器
document.addEventListener('keydown', function(e) {
    if (e.key === ' ' || e.code === 'Space') { // 按空格键开始/暂停
        e.preventDefault(); // 阻止空格键的默认行为（如滚动页面）
        // 仅在游戏结束画面未显示时切换游戏状态
        if (gameOverScreen.classList.contains('hidden')) {
             gameStarted = !gameStarted;
             startButton.textContent = gameStarted ? "暂停游戏" : "开始游戏";
        } else { // 如果在游戏结束画面，则点击“再玩一次”按钮
            restartButton.click();
        }
    }

    if (!gameStarted) return; // 只有在游戏运行时才处理移动按键

    // 控制蛇的移动方向，并防止立即掉头
    if (e.key === 'ArrowLeft' && snake.dx === 0) {
        snake.dx = -grid; snake.dy = 0;
    } else if (e.key === 'ArrowUp' && snake.dy === 0) {
        snake.dy = -grid; snake.dx = 0;
    } else if (e.key === 'ArrowRight' && snake.dx === 0) {
        snake.dx = grid; snake.dy = 0;
    } else if (e.key === 'ArrowDown' && snake.dy === 0) {
        snake.dy = grid; snake.dx = 0;
    }
});

requestAnimationFrame(loop); // 启动游戏循环以绘制初始状态