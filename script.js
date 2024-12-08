// Get Canvas Elements
const gameCanvas = document.getElementById('gameCanvas');
const particleCanvas = document.getElementById('particleCanvas');
const ctx = gameCanvas.getContext('2d');
const pCtx = particleCanvas.getContext('2d');

// Set Canvas Size
function resizeCanvas() {
  gameCanvas.width = window.innerWidth;
  gameCanvas.height = window.innerHeight;
  particleCanvas.width = window.innerWidth;
  particleCanvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Game Variables
const paddleWidth = 20;
const paddleHeight = 100;
const ballRadius = 10;

let leftPaddle = {
  x: 30,
  y: gameCanvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  dy: 0
};

let rightPaddle = {
  x: gameCanvas.width - 30 - paddleWidth,
  y: gameCanvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  dy: 0
};

let ball = {
  x: gameCanvas.width / 2,
  y: gameCanvas.height / 2,
  radius: ballRadius,
  speed: 5,
  dx: 5,
  dy: 5
};

let leftScore = 0;
let rightScore = 0;

// Particle Array for Effects
let particles = [];

// Handle Keyboard Input
const keys = {};

window.addEventListener('keydown', function(e) {
  keys[e.key] = true;
});

window.addEventListener('keyup', function(e) {
  keys[e.key] = false;
});

// Update Paddle Positions
function movePaddles() {
  const paddleSpeed = 7;
  
  // Left Paddle Controls (W and S)
  if (keys['w'] && leftPaddle.y > 0) {
    leftPaddle.dy = -paddleSpeed;
  } else if (keys['s'] && leftPaddle.y + leftPaddle.height < gameCanvas.height) {
    leftPaddle.dy = paddleSpeed;
  } else {
    leftPaddle.dy = 0;
  }
  
  // Right Paddle Controls (Arrow Up and Arrow Down)
  if (keys['ArrowUp'] && rightPaddle.y > 0) {
    rightPaddle.dy = -paddleSpeed;
  } else if (keys['ArrowDown'] && rightPaddle.y + rightPaddle.height < gameCanvas.height) {
    rightPaddle.dy = paddleSpeed;
  } else {
    rightPaddle.dy = 0;
  }
  
  leftPaddle.y += leftPaddle.dy;
  rightPaddle.y += rightPaddle.dy;
}

// Draw Paddles
function drawPaddles() {
  ctx.fillStyle = '#fff';
  ctx.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
  ctx.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);
}

// Draw Ball
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = '#fff';
  ctx.fill();
  ctx.closePath();
}

// Move Ball
function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;
  
  // Top and Bottom Collision
  if (ball.y + ball.radius > gameCanvas.height || ball.y - ball.radius < 0) {
    ball.dy *= -1;
    createParticles(ball.x, ball.y, 'blue');
  }
  
  // Left Paddle Collision
  if (ball.x - ball.radius < leftPaddle.x + leftPaddle.width &&
      ball.y > leftPaddle.y &&
      ball.y < leftPaddle.y + leftPaddle.height) {
    ball.dx *= -1;
    ball.x = leftPaddle.x + leftPaddle.width + ball.radius; // Prevent sticking
    createParticles(ball.x, ball.y, 'green');
  }
  
  // Right Paddle Collision
  if (ball.x + ball.radius > rightPaddle.x &&
      ball.y > rightPaddle.y &&
      ball.y < rightPaddle.y + rightPaddle.height) {
    ball.dx *= -1;
    ball.x = rightPaddle.x - ball.radius; // Prevent sticking
    createParticles(ball.x, ball.y, 'red');
  }
  
  // Score Update
  if (ball.x - ball.radius < 0) {
    rightScore++;
    resetBall();
  } else if (ball.x + ball.radius > gameCanvas.width) {
    leftScore++;
    resetBall();
  }
}

// Reset Ball Position
function resetBall() {
  ball.x = gameCanvas.width / 2;
  ball.y = gameCanvas.height / 2;
  ball.dx = -ball.dx;
  ball.dy = 5;
}

// Draw Score
function drawScore() {
  ctx.fillStyle = '#fff';
  ctx.font = '48px Arial';
  ctx.fillText(leftScore, gameCanvas.width / 4, 50);
  ctx.fillText(rightScore, 3 * gameCanvas.width / 4, 50);
}

// Particle Effects
function createParticles(x, y, color) {
  for (let i = 0; i < 20; i++) {
    particles.push(new Particle(x, y, color));
  }
}

class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.radius = Math.random() * 3 + 2;
    this.color = color;
    this.speedX = (Math.random() - 0.5) * 4;
    this.speedY = (Math.random() - 0.5) * 4;
    this.alpha = 1;
  }
  
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.alpha -= 0.02;
  }
  
  draw() {
    pCtx.save();
    pCtx.globalAlpha = this.alpha;
    pCtx.beginPath();
    pCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    pCtx.fillStyle = this.color;
    pCtx.fill();
    pCtx.closePath();
    pCtx.restore();
  }
}

// Update Particles
function updateParticles() {
  particles.forEach((particle, index) => {
    particle.update();
    particle.draw();
    if (particle.alpha <= 0) {
      particles.splice(index, 1);
    }
  });
}

// Game Loop
function gameLoop() {
  ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
  pCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
  
  movePaddles();
  drawPaddles();
  moveBall();
  drawBall();
  drawScore();
  updateParticles();
  
  requestAnimationFrame(gameLoop);
}

gameLoop();
