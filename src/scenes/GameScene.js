import { GAME_CONFIG, PLAYER_CONFIG, BALL_CONFIG } from '../config/constants.js';
import { formatTime, devSettings, devLog, isDevelopment } from '../utils/helpers.js';
import { GameUI } from '../components/ui.js';
import { scoreService } from '../services/ScoreService.js';
import { gameEvents, GAME_EVENTS } from '../events/GameEvents.js';
import { createInputManager } from '../managers/InputManager.js';

// Game states for better state management
export const GAME_STATES = {
  LOADING: 'loading',
  READY: 'ready',
  PLAYING: 'playing',
  GAME_OVER: 'game_over',
  PAUSED: 'paused'
};

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    console.log('GameScene constructor called');
  }

  preload() {
    console.log('🎯 Preloading assets...');
    this.createTextures();
  }

  create() {
    console.log('🎮 Creating game scene...');

    // Initialize game state
    this.gameState = GAME_STATES.READY;
    this.gameStarted = false;
    this.gameOver = false;
    this.startTime = 0;
    this.elapsedTime = 0;
    this.collisionHandled = false; // Prevent multiple collision triggers

    // Initialize performance tracking
    this.frameCount = 0;
    this.lastFrameTime = 0;

    // Initialize UI components
    this.ui = new GameUI(this);

    // Initialize input manager
    this.inputManager = createInputManager(this);

    // Set up physics world gravity (use dev settings if in development)
    const gravity = isDevelopment() ? devSettings.get('gravity') : GAME_CONFIG.GRAVITY;
    this.physics.world.gravity.y = gravity;

    // Start score tracking
    scoreService.startGame();

    // Create player
    this.player = this.physics.add.sprite(GAME_CONFIG.WIDTH / 2, GAME_CONFIG.HEIGHT - 50, 'player');
    this.player.setCollideWorldBounds(true);
    this.player.setImmovable(true);
    devLog('👤 Player created');

    // Create ball group
    this.balls = this.physics.add.group();

    // Create timer event for spawning balls (use dev settings if available)
    const spawnRate = isDevelopment() ? devSettings.get('ballSpawnRate') : BALL_CONFIG.SPAWN_RATE;
    this.ballSpawnTimer = this.time.addEvent({
      delay: spawnRate,
      callback: this.spawnBall,
      callbackScope: this,
      loop: true
    });

    // Set up dev settings listeners if in development
    if (isDevelopment()) {
      this.setupDevSettingsListeners();
    }

    // Add collision detection
    this.physics.add.overlap(this.player, this.balls, this.gameOverHandler, null, this);

    // Set up restart button
    const restartButton = document.getElementById('restart-button');
    if (restartButton) {
      restartButton.addEventListener('click', () => this.restartGame());
    }

    // Set up input event listeners
    this.setupInputListeners();

    // Update UI - don't start game automatically
    this.updateUI();

    // Make scene available globally for development
    if (typeof window !== 'undefined') {
      window.gameScene = this;
    }

    console.log('🎉 Game ready to play! (Move mouse to start)');
  }

  update(time, delta) {
    // Update performance metrics
    this.updatePerformanceMetrics(time);

    if (this.gameState === GAME_STATES.PLAYING) {
      this.elapsedTime = (time - this.startTime) / 1000;
      scoreService.updateScore(this.elapsedTime);
      this.updateTimer();
      this.updateBalls();
    }
  }

  updatePerformanceMetrics(time) {
    this.frameCount++;
    if (time - this.lastFrameTime >= 1000) {
      // Log performance every second in development
      if (process.env.NODE_ENV === 'development' && this.frameCount < 60) {
        console.warn(`⚠️ Low FPS detected: ${this.frameCount} FPS`);
      }
      this.frameCount = 0;
      this.lastFrameTime = time;
    }
  }

  updateBalls() {
    // Remove balls that fall off screen (with object pooling for performance)
    const ballsToDestroy = [];
    this.balls.children.entries.forEach(ball => {
      if (ball.y > GAME_CONFIG.HEIGHT + BALL_CONFIG.SIZE) {
        ballsToDestroy.push(ball);
      }
    });

    // Batch destroy for better performance
    ballsToDestroy.forEach(ball => ball.destroy());
  }

  createTextures() {
    // Create player texture
    const playerGraphics = this.add.graphics();
    playerGraphics.fillStyle(PLAYER_CONFIG.COLOR);
    playerGraphics.fillRect(0, 0, PLAYER_CONFIG.SIZE, PLAYER_CONFIG.SIZE);
    playerGraphics.generateTexture('player', PLAYER_CONFIG.SIZE, PLAYER_CONFIG.SIZE);
    playerGraphics.destroy();

    // Create ball texture
    const ballGraphics = this.add.graphics();
    ballGraphics.fillStyle(BALL_CONFIG.COLOR);
    ballGraphics.fillCircle(BALL_CONFIG.SIZE / 2, BALL_CONFIG.SIZE / 2, BALL_CONFIG.SIZE / 2);

    // Add spikes
    ballGraphics.lineStyle(2, 0xff4757);
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      const x1 = BALL_CONFIG.SIZE / 2 + Math.cos(angle) * (BALL_CONFIG.SIZE / 2 - 2);
      const y1 = BALL_CONFIG.SIZE / 2 + Math.sin(angle) * (BALL_CONFIG.SIZE / 2 - 2);
      const x2 = BALL_CONFIG.SIZE / 2 + Math.cos(angle) * (BALL_CONFIG.SIZE / 2 + 4);
      const y2 = BALL_CONFIG.SIZE / 2 + Math.sin(angle) * (BALL_CONFIG.SIZE / 2 + 4);
      ballGraphics.lineBetween(x1, y1, x2, y2);
    }

    ballGraphics.generateTexture('ball', BALL_CONFIG.SIZE, BALL_CONFIG.SIZE);
    ballGraphics.destroy();
  }

  setupInputListeners() {
    // Listen for mouse movement through the input manager
    this.inputManager.addHandler(GAME_EVENTS.INPUT_MOUSE_MOVE, (data) => {
      this.handleMouseMove(data);
    });

    // Listen for mouse clicks
    this.inputManager.addHandler(GAME_EVENTS.INPUT_MOUSE_DOWN, (data) => {
      // Handle mouse clicks if needed
    });
  }

  handleMouseMove(data) {
    if (this.gameOver) return; // Don't handle input during game over

    if (this.player) {
      this.player.x = Phaser.Math.Clamp(data.x, PLAYER_CONFIG.SIZE / 2, GAME_CONFIG.WIDTH - PLAYER_CONFIG.SIZE / 2);

      // Start the game on first mouse movement if not already started
      if (this.gameState === GAME_STATES.READY) {
        this.startGame();
      }
    }
  }

  spawnBall() {
    if (this.gameState === GAME_STATES.PLAYING) {
      const x = Phaser.Math.Between(BALL_CONFIG.SIZE, GAME_CONFIG.WIDTH - BALL_CONFIG.SIZE);
      const ball = this.balls.create(x, -BALL_CONFIG.SIZE, 'ball');

      // Use dev settings for ball speed if in development
      const ballSpeed = isDevelopment() ? devSettings.get('ballSpeed') : BALL_CONFIG.SPEED;
      ball.setVelocityY(ballSpeed);
      ball.setBounce(0);
    }
  }

  gameOverHandler(player, ball) {
    // Prevent multiple game over triggers
    if (this.gameState === GAME_STATES.GAME_OVER || this.gameState === GAME_STATES.READY || this.collisionHandled) {
      return;
    }

    devLog('💥 Game Over! Final time:', formatTime(this.elapsedTime));
    this.collisionHandled = true;

    this.gameState = GAME_STATES.GAME_OVER;
    this.gameOver = true;
    this.ballSpawnTimer.paused = true;
    this.inputManager.setEnabled(false);

    // End game and get results from score service
    const gameResult = scoreService.endGame(this.elapsedTime);

    // Emit game over event
    gameEvents.emit(GAME_EVENTS.GAME_OVER, gameResult);

    // Show game over screen
    this.ui.showGameOverScreen();
    const finalTimeElement = document.getElementById('final-time');
    const newRecordElement = document.getElementById('new-record');

    if (finalTimeElement) {
      finalTimeElement.textContent = formatTime(this.elapsedTime);
    }
    if (newRecordElement) {
      newRecordElement.style.display = gameResult.isNewRecord ? 'block' : 'none';
    }

    this.updateUI();
  }

  restartGame() {
    console.log('🔄 Restarting game...');

    // Prevent restart if already restarting
    if (this.gameState === GAME_STATES.READY) {
      console.log('⚠️ Game already restarting');
      return;
    }

    // Reset game state
    this.gameState = GAME_STATES.READY;
    this.gameOver = false;
    this.gameStarted = false;
    this.elapsedTime = 0;
    this.collisionHandled = false; // Reset collision flag

    // Hide game over screen
    this.ui.hideGameOverScreen();

    // Clear existing balls (this should prevent collision issues)
    this.balls.clear(true, true);

    // Pause ball spawning until player starts moving
    this.ballSpawnTimer.paused = true;

    // Don't reset timer here - it will be set when game actually starts

    // Re-enable input
    this.inputManager.setEnabled(true);

    // Reset score service for new game
    scoreService.startGame();

    this.updateUI();
    console.log('✅ Game restarted');
  }

  startGame() {
    console.log('🎯 Starting game...');
    this.gameState = GAME_STATES.PLAYING;
    this.gameStarted = true;
    this.startTime = this.time.now;

    // Start ball spawning now that game has begun
    this.ballSpawnTimer.paused = false;

    // Ensure input is enabled
    this.inputManager.setEnabled(true);

    this.updateUI();
  }

  // Utility methods for future development
  pauseGame() {
    if (this.gameState === GAME_STATES.PLAYING) {
      this.gameState = GAME_STATES.PAUSED;
      this.ballSpawnTimer.paused = true;
      this.inputManager.setEnabled(false);
      console.log('⏸️ Game paused');
    }
  }

  resumeGame() {
    if (this.gameState === GAME_STATES.PAUSED) {
      this.gameState = GAME_STATES.PLAYING;
      this.ballSpawnTimer.paused = false;
      this.inputManager.setEnabled(true);
      console.log('▶️ Game resumed');
    }
  }

  resetGame() {
    console.log('🔄 Resetting game completely...');
    this.restartGame();
    // Reset scores (for development/testing)
    scoreService.reset();
    console.log('✅ Game completely reset');
  }

  updateTimer() {
    this.ui.updateTimer(this.elapsedTime);
  }

  updateUI() {
    const stats = scoreService.getCurrentStats();
    this.ui.updateBestTime(stats.bestScore);
  }

  // Development and debugging utilities
  getGameStats() {
    const scoreStats = scoreService.getCurrentStats();
    const inputStats = this.inputManager ? this.inputManager.getStats() : null;

    return {
      state: this.gameState,
      elapsedTime: this.elapsedTime,
      scoreStats: scoreStats,
      inputStats: inputStats,
      ballsActive: this.balls ? this.balls.children.size : 0,
      playerPosition: this.player ? { x: this.player.x, y: this.player.y } : null,
      fps: this.frameCount
    };
  }

  // Set up listeners for development settings changes
  setupDevSettingsListeners() {
    // Ball spawn rate changes
    devSettings.onChange('ballSpawnRate', (newRate) => {
      if (this.ballSpawnTimer) {
        this.ballSpawnTimer.delay = newRate;
        devLog(`🔧 Ball spawn rate updated to ${newRate}ms`);
      }
    });

    // Ball speed changes
    devSettings.onChange('ballSpeed', (newSpeed) => {
      // Update existing balls
      this.balls.getChildren().forEach(ball => {
        ball.setVelocityY(newSpeed);
      });
      devLog(`🔧 Ball speed updated to ${newSpeed}`);
    });

    // Gravity changes
    devSettings.onChange('gravity', (newGravity) => {
      this.physics.world.gravity.y = newGravity;
      devLog(`🔧 Gravity updated to ${newGravity}`);
    });

    // Player speed changes
    devSettings.onChange('playerSpeed', (newSpeed) => {
      // Player speed will be applied on next movement
      devLog(`🔧 Player speed updated to ${newSpeed}`);
    });
  }

  // Clean up resources when scene is destroyed
  destroy() {
    console.log('🗑️ Cleaning up GameScene');

    // Clean up input manager
    if (this.inputManager) {
      this.inputManager.destroy();
    }

    // Clean up UI components
    if (this.ui) {
      // UI cleanup if needed
    }

    // Clean up timers
    if (this.ballSpawnTimer) {
      this.ballSpawnTimer.destroy();
    }

    // Reset flags
    this.collisionHandled = false;
    this.gameEnded = false;

    // Call parent destroy
    super.destroy();
  }
}
