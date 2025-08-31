// Phaser is loaded via CDN in index.html

// Game configuration
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
  scene: [GameScene],
  parent: 'game-container'
};

// Game constants
const PLAYER_SPEED = 400;
const BALL_SPEED = 200;
const BALL_SPAWN_RATE = 1000; // milliseconds
const BALL_SIZE = 20;
const PLAYER_SIZE = 30;

// Initialize the game
const game = new Phaser.Game(config);

// Main game scene
class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    // Create simple geometric shapes as textures
    this.createTextures();
  }

  create() {
    // Initialize game variables
    this.gameStarted = false;
    this.gameOver = false;
    this.startTime = 0;
    this.elapsedTime = 0;
    this.bestTime = this.loadBestTime();

    // Create player
    this.player = this.physics.add.sprite(config.width / 2, config.height - 50, 'player');
    this.player.setCollideWorldBounds(true);
    this.player.setImmovable(true);

    // Create ball group
    this.balls = this.physics.add.group();

    // Create timer event for spawning balls
    this.ballSpawnTimer = this.time.addEvent({
      delay: BALL_SPAWN_RATE,
      callback: this.spawnBall,
      callbackScope: this,
      loop: true
    });

    // Add collision detection
    this.physics.add.overlap(this.player, this.balls, this.gameOverHandler, null, this);

    // Set up mouse controls
    this.input.on('pointermove', this.handleMouseMove, this);

    // Set up restart button
    const restartButton = document.getElementById('restart-button');
    restartButton.addEventListener('click', () => this.restartGame());

    // Update UI
    this.updateUI();

    // Start the game
    this.startGame();
  }

  update(time, delta) {
    if (this.gameStarted && !this.gameOver) {
      this.elapsedTime = (time - this.startTime) / 1000;
      this.updateTimer();

      // Update ball positions (they fall due to gravity)
      this.balls.children.entries.forEach(ball => {
        if (ball.y > config.height + BALL_SIZE) {
          ball.destroy();
        }
      });
    }
  }

  createTextures() {
    // Create player texture (simple colored rectangle)
    const playerGraphics = this.add.graphics();
    playerGraphics.fillStyle(0x4ecdc4);
    playerGraphics.fillRect(0, 0, PLAYER_SIZE, PLAYER_SIZE);
    playerGraphics.generateTexture('player', PLAYER_SIZE, PLAYER_SIZE);
    playerGraphics.destroy();

    // Create ball texture (spiked ball appearance)
    const ballGraphics = this.add.graphics();
    ballGraphics.fillStyle(0xff6b6b);
    ballGraphics.fillCircle(BALL_SIZE / 2, BALL_SIZE / 2, BALL_SIZE / 2);

    // Add spikes
    ballGraphics.lineStyle(2, 0xff4757);
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      const x1 = BALL_SIZE / 2 + Math.cos(angle) * (BALL_SIZE / 2 - 2);
      const y1 = BALL_SIZE / 2 + Math.sin(angle) * (BALL_SIZE / 2 - 2);
      const x2 = BALL_SIZE / 2 + Math.cos(angle) * (BALL_SIZE / 2 + 4);
      const y2 = BALL_SIZE / 2 + Math.sin(angle) * (BALL_SIZE / 2 + 4);
      ballGraphics.lineBetween(x1, y1, x2, y2);
    }

    ballGraphics.generateTexture('ball', BALL_SIZE, BALL_SIZE);
    ballGraphics.destroy();
  }

  handleMouseMove(pointer) {
    if (!this.gameOver) {
      // Move player horizontally with mouse
      this.player.x = Phaser.Math.Clamp(pointer.x, PLAYER_SIZE / 2, config.width - PLAYER_SIZE / 2);
    }
  }

  spawnBall() {
    if (!this.gameOver) {
      const x = Phaser.Math.Between(BALL_SIZE, config.width - BALL_SIZE);
      const ball = this.balls.create(x, -BALL_SIZE, 'ball');
      ball.setVelocityY(BALL_SPEED);
      ball.setBounce(0);
    }
  }

  gameOverHandler(player, ball) {
    this.gameOver = true;
    this.ballSpawnTimer.paused = true;

    // Save best time if this is a new record
    if (this.elapsedTime > this.bestTime) {
      this.bestTime = this.elapsedTime;
      this.saveBestTime(this.bestTime);
    }

    // Show game over screen
    const gameOverScreen = document.getElementById('game-over-screen');
    const finalTimeElement = document.getElementById('final-time');
    const newRecordElement = document.getElementById('new-record');

    finalTimeElement.textContent = this.formatTime(this.elapsedTime);
    newRecordElement.style.display = (this.elapsedTime >= this.bestTime) ? 'block' : 'none';
    gameOverScreen.classList.add('show');

    this.updateUI();
  }

  restartGame() {
    // Hide game over screen
    const gameOverScreen = document.getElementById('game-over-screen');
    gameOverScreen.classList.remove('show');

    // Reset game state
    this.gameOver = false;
    this.elapsedTime = 0;

    // Clear existing balls
    this.balls.clear(true, true);

    // Resume ball spawning
    this.ballSpawnTimer.paused = false;

    // Restart timer
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
    currentTimeElement.textContent = this.formatTime(this.elapsedTime);
  }

  updateUI() {
    const bestTimeElement = document.getElementById('best-time');
    bestTimeElement.textContent = this.bestTime > 0 ? this.formatTime(this.bestTime) : '--';
  }

  formatTime(seconds) {
    return seconds.toFixed(2) + 's';
  }

  loadBestTime() {
    const saved = localStorage.getItem('dodgeBalls_bestTime');
    return saved ? parseFloat(saved) : 0;
  }

  saveBestTime(time) {
    localStorage.setItem('dodgeBalls_bestTime', time.toString());
  }
}

// Make game globally available for debugging
window.game = game;
