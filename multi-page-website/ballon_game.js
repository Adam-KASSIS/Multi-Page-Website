/* Balloon Game - Full Screen, Stick Hero Style */

// Extend array
Array.prototype.last = function () {
    return this[this.length - 1];
  };
  
  // Sin in degrees
  Math.sinus = function (deg) {
    return Math.sin((deg / 180) * Math.PI);
  };
  
  // Canvas setup
  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  // UI elements
  const scoreElement = document.getElementById("score");
  const restartButton = document.getElementById("restart");
  const introductionElement = document.getElementById("introduction");
  const perfectElement = document.getElementById("perfect");
  
  // Game state
  let phase = "waiting"; // waiting | flying | popping | transitioning
  let lastTimestamp;
  let heroY;
  let sceneOffset;
  let score = 0;
  let balloons = [];
  
  // Config
  const heroWidth = 30;
  const heroHeight = 50;
  const balloonRadius = 20;
  const perfectAreaSize = 10;
  const balloonSpeed = 150; // pixels per second
  const backgroundSpeedMultiplier = 0.2;
  
  // Initialize
  resetGame();
  
  // Reset function
  function resetGame() {
    phase = "waiting";
    lastTimestamp = undefined;
    sceneOffset = 0;
    heroY = canvas.height / 2;
    score = 0;
    balloons = [];
  
    scoreElement.innerText = score;
    restartButton.style.display = "none";
    introductionElement.style.opacity = 1;
    perfectElement.style.opacity = 0;
  
    // Generate initial balloons
    generateBalloon();
    generateBalloon();
    generateBalloon();
  
    draw();
  }
  
  // Generate balloon
  function generateBalloon() {
    const x = canvas.width + balloonRadius + Math.random() * 200;
    const y = Math.random() * (canvas.height - balloonRadius * 2) + balloonRadius;
    balloons.push({ x, y, popped: false });
  }
  
  // Event listeners
  window.addEventListener("keydown", (e) => {
    if (e.key === " ") {
      e.preventDefault();
      if (phase === "waiting") {
        phase = "flying";
        introductionElement.style.opacity = 0;
        window.requestAnimationFrame(animate);
      } else if (phase === "popping") {
        resetGame();
      }
    }
  });
  
  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    draw();
  });
  
  restartButton.addEventListener("click", () => {
    resetGame();
  });
  
  // Main loop
  function animate(timestamp) {
    if (!lastTimestamp) {
      lastTimestamp = timestamp;
      window.requestAnimationFrame(animate);
      return;
    }
  
    const delta = (timestamp - lastTimestamp) / 1000; // seconds
    lastTimestamp = timestamp;
  
    switch (phase) {
      case "waiting":
        return;
      case "flying":
        // Move balloons
        balloons.forEach(b => b.x -= balloonSpeed * delta);
  
        // Generate new balloons randomly
        if (Math.random() < 0.02) generateBalloon();
  
        // Collision detection
        balloons.forEach(b => {
          if (!b.popped &&
              b.x - balloonRadius < 50 + heroWidth &&
              heroY + heroHeight / 2 > b.y - balloonRadius &&
              heroY - heroHeight / 2 < b.y + balloonRadius) {
            b.popped = true;
  
            // Check perfect area (center hit)
            const isPerfect = Math.abs(b.y - heroY) < perfectAreaSize;
            score += isPerfect ? 2 : 1;
            scoreElement.innerText = score;
  
            if (isPerfect) {
              perfectElement.style.opacity = 1;
              setTimeout(() => (perfectElement.style.opacity = 0), 1000);
            }
          }
        });
  
        // Hero float up and down (optional, can remove)
        heroY += Math.sinus(timestamp / 5) * 0.5;
  
        draw();
        window.requestAnimationFrame(animate);
        break;
      case "popping":
        break;
      default:
        throw Error("Unknown phase: " + phase);
    }
  }
  
  // Draw everything
  function draw() {
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    // Background
    ctx.fillStyle = "#87CEEB";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  
    // Balloons
    balloons.forEach(b => {
      if (!b.popped) {
        ctx.beginPath();
        ctx.fillStyle = "red";
        ctx.arc(b.x - sceneOffset, b.y, balloonRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  
    // Hero
    ctx.fillStyle = "black";
    ctx.fillRect(50, heroY - heroHeight / 2, heroWidth, heroHeight);
  
    ctx.restore();
  }
  