var blockSize = 25;
var rows = 20;
var cols = 20;
var board;
var context;

var snakeX = blockSize * 5;
var snakeY = blockSize * 5;

var velocityX = 0;
var velocityY = 0;

var snakeBody = [];

var foodX;
var foodY;

var score = 0;
var highscore = 0;

var gameOver = false;

var restartButton;
var touchStartX = null;
var touchStartY = null;

window.onload = function () {
    board = document.getElementById("board");
    board.height = rows * blockSize;
    board.width = cols * blockSize;
    context = board.getContext("2d");

    restartButton = document.getElementById("restartButton");
    restartButton.addEventListener("click", restartGame);

    document.addEventListener("keydown", changeDirection);
    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchmove", handleTouchMove, { passive: false });

    restartGame(); // Call restartGame to set up the initial game state
    setInterval(update, 1000 / 10);
};

function update() {
    if (gameOver) {
        return;
    }
    context.fillStyle = "black";
    context.fillRect(0, 0, board.width, board.height);

    context.fillStyle = "red";
    context.fillRect(foodX, foodY, blockSize, blockSize);

    if (snakeX == foodX && snakeY == foodY) {
        snakeBody.push([foodX, foodY]);
        placeFood();
        score += 1;
        if (score > highscore) {
            highscore = score;
        }
    }

    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    if (snakeBody.length) {
        snakeBody[0] = [snakeX, snakeY];
    }

    context.fillStyle = "lime";
    snakeX += velocityX * blockSize;
    snakeY += velocityY * blockSize;
    context.fillRect(snakeX, snakeY, blockSize, blockSize);
    for (let i = 0; i < snakeBody.length; i++) {
        context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
    }

    context.fillStyle = "white";
    context.font = "20px Courier New";

    // Position Score and Highscore text outside the canvas
    context.fillText("Score: " + score, 10, board.height + 30);
    context.fillText("Highscore: " + highscore, 10, board.height + 60);

    if (snakeX < 0 || snakeX > cols * blockSize || snakeY < 0 || snakeY > rows * blockSize) {
        gameOver = true;
        if (score > highscore) {
            highscore = score;
        }
        context.fillText("Game Over", board.width / 2 - 40, board.height / 2 - 20);
        context.fillText("Score: " + score, board.width / 2 - 40, board.height / 2 + 10);
        context.fillText("Highscore: " + highscore, board.width / 2 - 40, board.height / 2 + 40);
    }

    for (let i = 0; i < snakeBody.length; i++) {
        if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]) {
            gameOver = true;
            context.fillText("Game Over", board.width / 2 - 40, board.height / 2 - 20);
            context.fillText("Score: " + score, board.width / 2 - 40, board.height / 2 + 10);
            context.fillText("Highscore: " + highscore, board.width / 2 - 40, board.height / 2 + 40);
        }
    }
}

function changeDirection(e) {
    switch (e.code) {
        case "ArrowUp":
            if (velocityY !== 1) {
                velocityX = 0;
                velocityY = -1;
            }
            break;
        case "ArrowDown":
            if (velocityY !== -1) {
                velocityX = 0;
                velocityY = 1;
            }
            break;
        case "ArrowLeft":
            if (velocityX !== 1) {
                velocityX = -1;
                velocityY = 0;
            }
            break;
        case "ArrowRight":
            if (velocityX !== -1) {
                velocityX = 1;
                velocityY = 0;
            }
            break;
    }
}

function placeFood() {
    foodX = Math.floor(Math.random() * cols) * blockSize;
    foodY = Math.floor(Math.random() * rows) * blockSize;
}

function restartGame() {
    gameOver = false;
    snakeX = blockSize * 5;
    snakeY = blockSize * 5;
    velocityX = 0;
    velocityY = 0;
    snakeBody = [];
    score = 0;
    placeFood();
}

function handleTouchStart(event) {
    var touch = event.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
}

function handleTouchMove(event) {
    if (!touchStartX || !touchStartY) {
        return;
    }

    var touch = event.touches[0];
    var touchEndX = touch.clientX;
    var touchEndY = touch.clientY;

    var deltaX = touchEndX - touchStartX;
    var deltaY = touchEndY - touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (deltaX > 0) {
            // Right swipe
            changeDirection({ code: "ArrowRight" });
        } else {
            // Left swipe
            changeDirection({ code: "ArrowLeft" });
        }
    } else {
        // Vertical swipe
        if (deltaY > 0) {
            // Down swipe
            changeDirection({ code: "ArrowDown" });
        } else {
            // Up swipe
            changeDirection({ code: "ArrowUp" });
        }
    }

    // Reset touch start coordinates
    touchStartX = null;
    touchStartY = null;

    // Prevent default touch event behavior (e.g., scrolling)
    event.preventDefault();
}


document.addEventListener("touchmove", function (e) {
    e.preventDefault();
}, { passive: false });

