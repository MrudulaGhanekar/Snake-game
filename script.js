const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highScore");
const restartBtn = document.getElementById("restartBtn");
const difficultySelect = document.getElementById("difficulty");

const box = 20;
const canvasSize = 400;
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
highScoreEl.innerText = "High Score: " + highScore;

let snake, direction, food, game, speed = 100;

function init() {
  snake = [{ x: 9 * box, y: 9 * box }];
  direction = "";
  score = 0;
  scoreEl.innerText = "Score: " + score;
  speed = parseInt(difficultySelect.value);
  food = {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box,
  };
  if (game) clearInterval(game);
  game = setInterval(draw, speed);
}

document.addEventListener("keydown", changeDirection);
restartBtn.addEventListener("click", init);
difficultySelect.addEventListener("change", init);

document.getElementById("up").onclick = () => changeDirection({ key: "ArrowUp" });
document.getElementById("down").onclick = () => changeDirection({ key: "ArrowDown" });
document.getElementById("left").onclick = () => changeDirection({ key: "ArrowLeft" });
document.getElementById("right").onclick = () => changeDirection({ key: "ArrowRight" });

let startX, startY;
canvas.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
});

canvas.addEventListener("touchend", (e) => {
  let dx = e.changedTouches[0].clientX - startX;
  let dy = e.changedTouches[0].clientY - startY;
  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 0) changeDirection({ key: "ArrowRight" });
    else changeDirection({ key: "ArrowLeft" });
  } else {
    if (dy > 0) changeDirection({ key: "ArrowDown" });
    else changeDirection({ key: "ArrowUp" });
  }
});

function changeDirection(event) {
  if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  else if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  else if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  else if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
}

function draw() {
  ctx.clearRect(0, 0, canvasSize, canvasSize);

  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "green" : "lightgreen";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
    ctx.strokeStyle = "white";
    ctx.strokeRect(snake[i].x, snake[i].y, box, box);
  }

  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  let headX = snake[0].x;
  let headY = snake[0].y;

  if (direction === "LEFT") headX -= box;
  else if (direction === "RIGHT") headX += box;
  else if (direction === "UP") headY -= box;
  else if (direction === "DOWN") headY += box;

  if (
    headX < 0 || headX >= canvasSize ||
    headY < 0 || headY >= canvasSize ||
    snake.some((s, i) => i > 0 && s.x === headX && s.y === headY)
  ) {
    clearInterval(game);
    setTimeout(() => {
      alert("Game Over! Score: " + score);
    }, 100);
    return;
  }

  if (headX === food.x && headY === food.y) {
    score++;
    scoreEl.innerText = "Score: " + score;
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore);
      highScoreEl.innerText = "High Score: " + highScore;
    }
    food = {
      x: Math.floor(Math.random() * 20) * box,
      y: Math.floor(Math.random() * 20) * box,
    };
  } else {
    snake.pop();
  }

  snake.unshift({ x: headX, y: headY });
}

init();