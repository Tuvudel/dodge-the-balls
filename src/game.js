import Phaser from 'phaser';

// Working Dodge the Spiked Balls Game
class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  create() {
    // Initialize game state
    this.gameStarted = false;
    this.gameOver = false;
    this.startTime = 0;
    this.elapsedTime = 0;
    this.bestTime = parseFloat(localStorage.getItem('dodgeBalls_bestTime') || '0');

    // Create player
    this.player = this.add.rectangle(400, 550, 30, 30, 0x4ecdc4);
    this.physics.add.existing(this.player);
    this.player.body.setCollideWorldBounds(true);
    this.player.body.setImmovable(true);

    // Create balls group
    this.balls = this.physics.add.group();

    // Ball spawning timer
    this.ballSpawnTimer = this.time.addEvent({
      delay: 1000,
      callback: this.spawnBall,
      callbackScope: this,
      loop: true
    });

    // Collision detection
    this.physics.add.overlap(this.player, this.balls, this.gameOverHandler, null, this);

    // Mouse controls
    this.input.on('pointermove', (pointer) => {
      if (!this.gameOver) {
        this.player.x = Phaser.Math.Clamp(pointer.x, 15, 785);
      }
    });

    // Restart button
    document.getElementById('restart-button').addEventListener('click', () => this.restartGame());

    // Start the game
    this.startGame();
  }

  update(time) {
    if (this.gameStarted && !this.gameOver) {
      this.elapsedTime = (time - this.startTime) / 1000;
      this.updateTimer();

      // Remove balls that fall off screen
      this.balls.children.entries.forEach(ball => {
        if (ball.y > 620) ball.destroy();
      });
    }
  }

  spawnBall() {
    if (!this.gameOver) {
      const x = Phaser.Math.Between(20, 780);
      const ball = this.balls.create(x, -20, 'ball');
      ball.setVelocityY(200);
      ball.setBounce(0);
    }
  }

  gameOverHandler() {
    this.gameOver = true;
    this.ballSpawnTimer.paused = true;

    if (this.elapsedTime > this.bestTime) {
      this.bestTime = this.elapsedTime;
      localStorage.setItem('dodgeBalls_bestTime', this.bestTime.toString());
    }

    const gameOverScreen = document.getElementById('game-over-screen');
    const finalTimeElement = document.getElementById('final-time');
    const newRecordElement = document.getElementById('new-record');

    finalTimeElement.textContent = this.elapsedTime.toFixed(2) + 's';
    newRecordElement.style.display = this.elapsedTime >= this.bestTime ? 'block' : 'none';
    gameOverScreen.classList.add('show');

    this.updateUI();
  }

  restartGame() {
    const gameOverScreen = document.getElementById('game-over-screen');
    gameOverScreen.classList.remove('show');

    this.gameOver = false;
    this.elapsedTime = 0;
    this.balls.clear(true, true);
    this.ballSpawnTimer.paused = false;
    this.startTime = this.time.now;

    this.updateUI();
  }

  startGame() {
    this.gameStarted = true;
    this.startTime = this.time.now;
    this.updateUI();
  }

  updateTimer() {
    const currentTimeElement = document.getElementById('current-time');
    if (currentTimeElement) {
      currentTimeElement.textContent = this.elapsedTime.toFixed(2) + 's';
    }
  }

  updateUI() {
    const bestTimeElement = document.getElementById('best-time');
    if (bestTimeElement) {
      bestTimeElement.textContent = this.bestTime > 0 ? this.bestTime.toFixed(2) + 's' : '--';
    }
  }
}

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#1a1a2e',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: GameScene,
  parent: 'game-container'
};

const game = new Phaser.Game(config);
window.game = game;
