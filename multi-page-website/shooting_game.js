let shootingGameRunning = false;
let shootingGameAnimationFrame = null;

function startShootingGame() {
  if (shootingGameRunning) return;
  shootingGameRunning = true;

  const canvas = document.getElementById('shootingCanvas');
  const ctx = canvas.getContext('2d');
  const scoreEl = document.getElementById('shootingScore');
  const gameOverScreen = document.getElementById('shootingGameOverScreen');
  const finalScoreEl = document.getElementById('shootingFinalScore');
  const restartBtn = document.getElementById('shootingRestartBtn');

  if (!canvas || !ctx || !scoreEl || !gameOverScreen || !finalScoreEl || !restartBtn) {
    console.error('Missing HTML elements.');
    return;
  }

  const player = { x: canvas.width / 2, y: canvas.height - 60, width: 40, height: 40, speed: 350 };
  const bullets = [];
  const enemies = [];
  let score = 0;
  let bestScore = parseInt(localStorage.getItem('shootingBestScore')) || 0;
  let gameOver = false;

  const keys = { left: false, right: false, space: false };
  let lastShotTime = 0;
  const shotInterval = 150;
  let lastEnemySpawn = 0;
  const enemySpawnInterval = 1000;

  function updateScore() {
    scoreEl.textContent = `Score: ${score} | Best: ${bestScore}`;
  }

  function createEnemy() {
    const type = Math.random() < 0.15 ? 2 : Math.random() < 0.3 ? 1 : 0;
    let width = 40, height = 40, speed = 120 + Math.random() * 40, horizontalSpeed = (Math.random() * 40) - 20;
    if (type === 1) { width = 25; height = 25; speed = 180 + Math.random() * 80; horizontalSpeed = (Math.random() * 60) - 30; }
    if (type === 2) { width = 60; height = 60; speed = 80 + Math.random() * 40; horizontalSpeed = (Math.random() * 20) - 10; }
    return { x: Math.random() * (canvas.width - width), y: -height, width, height, speed, horizontalSpeed, horizontalDirection: 1 };
  }

  function drawPlayer() {
    const grad = ctx.createLinearGradient(player.x, player.y, player.x + player.width, player.y + player.height);
    grad.addColorStop(0, '#0ff'); grad.addColorStop(1, '#005577');
    ctx.fillStyle = grad;
    ctx.fillRect(player.x, player.y, player.width, player.height);
    ctx.strokeStyle = '#00ccff'; ctx.lineWidth = 2;
    ctx.strokeRect(player.x, player.y, player.width, player.height);
  }

  function drawBullets() {
    ctx.fillStyle = '#0ff';
    bullets.forEach(b => ctx.fillRect(b.x, b.y, b.width, b.height));
  }

  function drawEnemies() {
    enemies.forEach(e => {
      const grad = ctx.createRadialGradient(e.x + e.width/2, e.y + e.height/2, e.width/4, e.x + e.width/2, e.y + e.height/2, e.width);
      grad.addColorStop(0, '#ff4444'); grad.addColorStop(1, '#660000');
      ctx.fillStyle = grad;
      ctx.fillRect(e.x, e.y, e.width, e.height);
      ctx.strokeStyle = '#cc0000'; ctx.lineWidth = 2;
      ctx.strokeRect(e.x, e.y, e.width, e.height);
    });
  }

  function updateBullets(delta) {
    for (let i = bullets.length-1; i>=0; i--) { bullets[i].y -= bullets[i].speed * delta; if(bullets[i].y + bullets[i].height<0) bullets.splice(i,1); }
  }

  function updateEnemies(delta) {
    for (let i = enemies.length-1; i>=0; i--) {
      let e = enemies[i];
      e.y += e.speed * delta;
      e.x += e.horizontalSpeed * e.horizontalDirection * delta;
      if (e.x <= 0) e.horizontalDirection = 1;
      else if (e.x + e.width >= canvas.width) e.horizontalDirection = -1;
      if (e.y > canvas.height) { enemies.splice(i,1); gameOver = true; showGameOver(); }
    }
  }

  function checkCollisions() {
    for (let e=enemies.length-1; e>=0; e--) {
      for (let b=bullets.length-1; b>=0; b--) {
        let enemy = enemies[e], bullet = bullets[b];
        if (bullet.x < enemy.x+enemy.width && bullet.x+bullet.width > enemy.x &&
            bullet.y < enemy.y+enemy.height && bullet.y+bullet.height > enemy.y) {
          enemies.splice(e,1); bullets.splice(b,1); score++;
          if(score>bestScore){ bestScore=score; localStorage.setItem('shootingBestScore', bestScore); }
          updateScore(); break;
        }
      }
    }
  }

  function spawnEnemy(){ if(!gameOver) enemies.push(createEnemy()); }
  function shootBullet(){ bullets.push({x: player.x+player.width/2-5, y: player.y, width:10, height:20, speed:400}); }
  function showGameOver(){ finalScoreEl.innerHTML=`Game Over!<br>Your Score: ${score}<br>Best Score: ${bestScore}`; gameOverScreen.style.display='block'; }

  function resetGame(){
    score=0; updateScore(); bullets.length=0; enemies.length=0; gameOver=false; gameOverScreen.style.display='none';
    player.x = canvas.width/2; lastShotTime=0; lastEnemySpawn=0; lastFrameTime=performance.now();
    shootingGameAnimationFrame=requestAnimationFrame(gameLoop);
  }

  function handleKeyDown(e){ if(!shootingGameRunning) return; if(e.code==='ArrowLeft') keys.left=true; else if(e.code==='ArrowRight') keys.right=true; else if(e.code==='Space') keys.space=true; }
  function handleKeyUp(e){ if(!shootingGameRunning) return; if(e.code==='ArrowLeft') keys.left=false; else if(e.code==='ArrowRight') keys.right=false; else if(e.code==='Space') keys.space=false; }

  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);
  restartBtn.addEventListener('click', resetGame);

  let lastFrameTime = performance.now();

  function gameLoop(time=performance.now()){
    if(gameOver || !shootingGameRunning) return;
    const delta = (time-lastFrameTime)/1000; lastFrameTime=time;

    ctx.fillStyle = ctx.createLinearGradient(0,0,0,canvas.height);
    ctx.fillStyle.addColorStop?.(0,'#001f3f'); ctx.fillStyle.addColorStop?.(1,'#000814');
    ctx.fillRect(0,0,canvas.width,canvas.height);

    if(keys.left) player.x -= player.speed * delta;
    if(keys.right) player.x += player.speed * delta;
    if(player.x<0) player.x=0;
    if(player.x+player.width>canvas.width) player.x=canvas.width-player.width;

    if(keys.space && time-lastShotTime>shotInterval){ shootBullet(); lastShotTime=time; }
    if(time-lastEnemySpawn>enemySpawnInterval){ spawnEnemy(); lastEnemySpawn=time; }

    updateBullets(delta); updateEnemies(delta); checkCollisions();
    drawPlayer(); drawBullets(); drawEnemies();

    shootingGameAnimationFrame=requestAnimationFrame(gameLoop);
  }

  resetGame();
}

function stopShootingGame() {
  shootingGameRunning=false;
  if(shootingGameAnimationFrame) cancelAnimationFrame(shootingGameAnimationFrame);
  window.removeEventListener('keydown', handleKeyDown);
  window.removeEventListener('keyup', handleKeyUp);
  const gameOverScreen = document.getElementById('shootingGameOverScreen');
  if(gameOverScreen) gameOverScreen.style.display='none';
}
