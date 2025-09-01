// UI components and helpers

export class GameUI {
  constructor(scene) {
    this.scene = scene;
  }

  updateTimer(time) {
    const currentTimeElement = document.getElementById('current-time');
    if (currentTimeElement) {
      currentTimeElement.textContent = time.toFixed(2) + 's';
    }
  }

  updateBestTime(time) {
    const bestTimeElement = document.getElementById('best-time');
    if (bestTimeElement) {
      bestTimeElement.textContent = time > 0 ? time.toFixed(2) + 's' : '--';
    }
  }

  showGameOverScreen() {
    const gameOverScreen = document.getElementById('game-over-screen');
    if (gameOverScreen) {
      gameOverScreen.classList.add('show');
    }
  }

  hideGameOverScreen() {
    const gameOverScreen = document.getElementById('game-over-screen');
    if (gameOverScreen) {
      gameOverScreen.classList.remove('show');
    }
  }
}
