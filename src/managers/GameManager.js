import { GAME_CONFIG, PLAYER_CONFIG, BALL_CONFIG } from '../config/constants.js';
import { gameEvents, GAME_EVENTS } from '../events/GameEvents.js';

/**
 * GameManager - Central manager for game lifecycle and state
 * Handles Phaser game initialization, configuration, and provides
 * a clean interface for game management operations.
 */
export class GameManager {
  constructor() {
    this.game = null;
    this.isInitialized = false;
    this.isRunning = false;
  }

  /**
   * Initialize the Phaser game with proper error handling
   */
  async initialize() {
    console.log('🎮 Initializing GameManager...');

    try {
      // Dynamic import of Phaser to ensure proper loading
      const PhaserModule = await import('phaser');
      const Phaser = PhaserModule.default || PhaserModule;

      console.log('🎯 Phaser version:', Phaser.VERSION);

      // Game configuration
      const config = this.createGameConfig();

      // Initialize the game with error handling
      this.game = new Phaser.Game(config);
      this.isInitialized = true;

      // Add performance monitoring in development
      this.setupPerformanceMonitoring();

      // Set up global error handling
      this.setupErrorHandling();

      console.log('✅ Game initialized successfully');
      gameEvents.emit(GAME_EVENTS.GAME_START);

      return this.game;

    } catch (error) {
      console.error('❌ Failed to initialize game:', error);
      this.handleInitializationError(error);
      throw error;
    }
  }

  /**
   * Create the Phaser game configuration
   */
  createGameConfig() {
    return {
      type: Phaser.AUTO,
      width: GAME_CONFIG.WIDTH,
      height: GAME_CONFIG.HEIGHT,
      backgroundColor: GAME_CONFIG.BACKGROUND_COLOR,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: GAME_CONFIG.GRAVITY },
          debug: GAME_CONFIG.DEBUG
        }
      },
      scene: [], // Will be set by the Game class
      parent: 'game-container'
    };
  }

  /**
   * Set up performance monitoring for development
   */
  setupPerformanceMonitoring() {
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Performance monitoring enabled');

      let frameCount = 0;
      let lastTime = Date.now();

      this.game.events.on('prestep', () => {
        frameCount++;
        const currentTime = Date.now();
        if (currentTime - lastTime >= 1000) {
          if (frameCount < 60) {
            console.warn(`⚠️ Low FPS detected: ${frameCount} FPS`);
            gameEvents.emit(GAME_EVENTS.PERFORMANCE_LOW_FPS, frameCount);
          } else if (frameCount > 70) {
            gameEvents.emit(GAME_EVENTS.PERFORMANCE_HIGH_FPS, frameCount);
          }
          frameCount = 0;
          lastTime = currentTime;
        }
      });
    }
  }

  /**
   * Set up global error handling for the game
   */
  setupErrorHandling() {
    // Handle Phaser-specific errors
    this.game.events.on('error', (error) => {
      console.error('Phaser game error:', error);
      gameEvents.emit('game:error', error);
    });
  }

  /**
   * Handle initialization errors with user-friendly feedback
   */
  handleInitializationError(error) {
    const container = document.getElementById('game-container');
    if (container) {
      container.innerHTML = `
        <div style="color: red; text-align: center; padding: 50px; font-family: Arial, sans-serif;">
          <h2>🚫 Game failed to load</h2>
          <p>Please refresh the page or check the console for errors.</p>
          <p style="font-size: 12px; margin-top: 20px; color: #666;">
            Error: ${error.message}
          </p>
        </div>
      `;
    }
  }

  /**
   * Get the current game instance
   */
  getGame() {
    return this.game;
  }

  /**
   * Check if the game is initialized and running
   */
  isGameRunning() {
    return this.isInitialized && this.game && !this.game.destroyed;
  }

  /**
   * Pause the entire game
   */
  pause() {
    if (this.isGameRunning()) {
      this.game.scene.pause();
      gameEvents.emit(GAME_EVENTS.GAME_PAUSE);
      console.log('⏸️ Game paused');
    }
  }

  /**
   * Resume the entire game
   */
  resume() {
    if (this.isGameRunning()) {
      this.game.scene.resume();
      gameEvents.emit(GAME_EVENTS.GAME_RESUME);
      console.log('▶️ Game resumed');
    }
  }

  /**
   * Destroy the game and clean up resources
   */
  destroy() {
    if (this.game) {
      console.log('🗑️ Destroying game...');
      this.game.destroy(true);
      this.game = null;
      this.isInitialized = false;
      this.isRunning = false;
    }
  }

  /**
   * Get game statistics for debugging
   */
  getStats() {
    if (!this.isGameRunning()) {
      return { status: 'not_running' };
    }

    return {
      status: 'running',
      scenes: this.game.scene.scenes.map(scene => ({
        key: scene.scene.key,
        active: scene.scene.isActive(),
        visible: scene.scene.isVisible()
      })),
      renderer: {
        type: this.game.renderer.type === Phaser.WEBGL ? 'WebGL' : 'Canvas',
        width: this.game.renderer.width,
        height: this.game.renderer.height
      },
      physics: {
        systems: Object.keys(this.game.physics.world.systems || {})
      }
    };
  }
}

// Export singleton instance
export const gameManager = new GameManager();
