function goToPage(pageNumber) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

  // Show selected page
  const selectedPage = document.getElementById(`page${pageNumber}`);
  if (selectedPage) selectedPage.classList.add('active');

  // Snake game
  if (pageNumber === 2) {
    if (typeof startSnakeGame === 'function') startSnakeGame();
  } else {
    if (typeof stopSnakeGame === 'function') stopSnakeGame();
  }

  // Stick Hero game
  if (pageNumber === 4) {
    if (typeof startStickHeroGame === 'function') startStickHeroGame();
  } else {
    if (typeof stopStickHeroGame === 'function') stopStickHeroGame();
  }

  // Shooting game
  if (pageNumber === 3) {
    if (typeof startShootingGame === 'function') startShootingGame();
  } else {
    if (typeof stopShootingGame === 'function') stopShootingGame();
  }
}

function showtime() {
  alert("Current Time: " + new Date().toLocaleTimeString());
}
