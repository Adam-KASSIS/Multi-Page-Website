(() => {
    const canvas = document.getElementById('snakeCanvas');
    const ctx = canvas.getContext('2d');
    const scoreEl = document.getElementById('snakeScore');
    const gameOverScreen = document.getElementById('snakeGameOverScreen');
    const finalScoreEl = document.getElementById('snakeFinalScore');
    const restartBtn = document.getElementById('snakeRestartBtn');
  
    const box = 20;
    let snake = [];
    let direction = null;
    let food = null;
    let score = 0;
    let bestScore = parseInt(localStorage.getItem('snakeBestScore')) || 0;
    let gameInterval = null;
  
    function collision(head, array) {
      return array.some(segment => segment.x === head.x && segment.y === head.y);
    }
  
    function spawnFood() {
      let newFood;
      do {
        newFood = {
          x: Math.floor(Math.random() * (canvas.width / box)) * box,
          y: Math.floor(Math.random() * (canvas.height / box)) * box
        };
      } while (collision(newFood, snake));
      return newFood;
    }
  
    function updateScore() {
      scoreEl.textContent = `Score: ${score} | Best: ${bestScore}`;
    }
  
    function draw() {
      ctx.fillStyle = '#111822';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
  
      // Draw border
      ctx.strokeStyle = '#0ff';
      ctx.lineWidth = 3;
      ctx.strokeRect(0, 0, canvas.width, canvas.height);
  
      // Draw snake
      for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? '#00ffff' : '#007777';
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = '#003333';
        ctx.lineWidth = 2;
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
      }
  
      // Draw food as circle
      ctx.fillStyle = 'red';
      ctx.beginPath();
      ctx.arc(food.x + box/2, food.y + box/2, box/2 - 2, 0, 2 * Math.PI);
      ctx.fill();
  
      if (!direction) return;
  
      let snakeX = snake[0].x;
      let snakeY = snake[0].y;
  
      if (direction === 'LEFT') snakeX -= box;
      else if (direction === 'UP') snakeY -= box;
      else if (direction === 'RIGHT') snakeX += box;
      else if (direction === 'DOWN') snakeY += box;
  
      // Eat food
      if (snakeX === food.x && snakeY === food.y) {
        score++;
        if(score > bestScore) {
          bestScore = score;
          localStorage.setItem('snakeBestScore', bestScore);
        }
        updateScore();
        food = spawnFood();
        // don't remove tail (grow)
      } else {
        snake.pop();
      }
  
      const newHead = { x: snakeX, y: snakeY };
  
      // Collision with wall or self
      if (
        snakeX < 0 || snakeX >= canvas.width ||
        snakeY < 0 || snakeY >= canvas.height ||
        collision(newHead, snake)
      ) {
        clearInterval(gameInterval);
        gameInterval = null;
        direction = null;
        finalScoreEl.innerHTML = `Game Over!<br>Your Score: ${score}<br>Best Score: ${bestScore}`;
        gameOverScreen.style.display = 'block';
        return;
      }
  
      snake.unshift(newHead);
    }
  
    function startSnakeGame() {
      snake = [{ x: 9 * box, y: 9 * box }];
      direction = 'RIGHT'; // default start direction
      food = spawnFood();
      score = 0;
      updateScore();
      gameOverScreen.style.display = 'none';
  
      if (gameInterval) clearInterval(gameInterval);
      gameInterval = setInterval(draw, 100);
    }
  
    function stopSnakeGame() {
      if (gameInterval) clearInterval(gameInterval);
      gameInterval = null;
      direction = null;
      gameOverScreen.style.display = 'none';
    }
  
    window.addEventListener('keydown', (e) => {
      if (!gameInterval) return; // ignore if game not running
  
      if (e.code === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
      else if (e.code === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
      else if (e.code === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
      else if (e.code === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
    });
  
    restartBtn.addEventListener('click', () => {
      startSnakeGame();
    });
  
    // Expose globally for navigation control
    window.startSnakeGame = startSnakeGame;
    window.stopSnakeGame = stopSnakeGame;
  })();
  