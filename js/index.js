window.onload = () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  document.getElementById("start-button").onclick = () => {
    startGame();
  };

  //Road
  const road = new Image();
  road.src = "/images/road.png";

  // Car
  const car = new Image();
  car.src = "/images/car.png";
  let carX = canvas.width / 2 - 25;
  let carY = canvas.height - 100;
  const carWidth = 50;
  const carHeight = 100;

  //Obstacles
  class obstacle {
    constructor(ctx, canvas) {
      this.x = Math.random() * canvas.width;
      this.y = 0;
      this.width = Math.floor(Math.random() * 100) + 70;
      this.height = 20;
      this.color = "#8B0000";
      this.ctx = ctx;
    }

    draw() {
      this.ctx.fillStyle = this.color;
      this.ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    move() {
      this.y += 10;
    }
  }

  //Global variables
  const obstacles = [];
  let intervalID;
  let counter = 0;
  let scoreCount = 0;

  // Game functions
  function startGame() {
    draw();
    document.addEventListener("keydown", moveCar);
    intervalID = setInterval(update, 1000 / 20);
  }

  function draw() {
    ctx.drawImage(road, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(car, carX, carY, carWidth, carHeight);
  }

  function update() {
    draw();
    if (counter % 20 === 0) {
      obstacles.push(new obstacle(ctx, canvas));
    }
    obstacles.forEach((obstacle) => {
      obstacle.draw();
      obstacle.move();
      if (
        detectCollision(
          carX,
          carY,
          carWidth,
          carHeight,
          obstacle.x,
          obstacle.y,
          obstacle.width,
          obstacle.height
        )
      ) {
        gameOver();
      } else if (obstacle.y > canvas.height) {
        obstacles.splice(obstacle.index, 1);
        scoreCount++;
      }
      counter++;
    });
    drawScore();
  }

  function moveCar(event) {
    const speed = 30;
    if (carX > 30 && event.keyCode === 37) {
      carX -= speed;
    } else if (carX < canvas.width - 20 - carWidth && event.keyCode === 39) {
      carX += speed;
    }
  }

  function detectCollision(
    rect1X,
    rect1Y,
    rect1Width,
    rect1Height,
    rect2X,
    rect2Y,
    rect2Width,
    rect2Height
  ) {
    return (
      rect1X < rect2X + rect2Width &&
      rect1X + rect1Width > rect2X &&
      rect1Y < rect2Y + rect2Height &&
      rect1Y + rect1Height > rect2Y
    );
  }

  function drawScore() {
    ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Score: " + scoreCount, 70, 40);
  }

  function gameOver() {
    clearInterval(intervalID);
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#8B0000";
    ctx.font = "50px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText("Game Over!", canvas.width / 2, canvas.height / 2);
    ctx.font = "40px Arial";
    ctx.fillStyle = "#fff";
    ctx.fillText("Your final score", canvas.width / 2, canvas.height / 2 + 60);
    ctx.fillText(scoreCount, canvas.width / 2, canvas.height / 2 + 110);
  }
};
