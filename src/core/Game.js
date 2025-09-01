import { gameManager } from '../managers/GameManager.js';
import { scoreService } from '../services/ScoreService.js';
import { createAssetManager } from '../managers/AssetManager.js';
import { gameEvents, GAME_EVENTS } from '../events/GameEvents.js';
import { devSettings, isDevelopment } from '../utils/helpers.js';

/**
 * Game - Main game orchestrator and entry point
 * Coordinates all game systems and provides clean initialization
 */
export class Game {
  constructor() {
    this.gameManager = gameManager;
    this.scoreService = scoreService;
    this.assetManager = null;
    this.isInitialized = false;
  }

  /**
   * Initialize the entire game system
   */
  async initialize() {
    console.log('🚀 Initializing game system...');

    try {
      // Initialize game manager and Phaser
      const phaserGame = await this.gameManager.initialize();

      // Set up game scenes asynchronously
      await this.setupScenes(phaserGame);

      // Set up global event listeners
      this.setupEventListeners();

      // Set up development utilities
      this.setupDevelopmentTools();

      this.isInitialized = true;
      console.log('🎉 Game system initialized successfully!');

      return phaserGame;

    } catch (error) {
      console.error('❌ Failed to initialize game system:', error);
      throw error;
    }
  }

  /**
   * Set up game scenes asynchronously
   */
  async setupScenes(phaserGame) {
    console.log('🎭 Setting up game scenes...');

    try {
      // Dynamically import GameScene after Phaser is available
      const { GameScene } = await import('../scenes/GameScene.js');

      // Add scenes to Phaser game
      phaserGame.scene.add('GameScene', GameScene);

      // Start the main scene
      phaserGame.scene.start('GameScene');

      console.log('✅ Scenes set up successfully');
    } catch (error) {
      console.error('❌ Failed to load GameScene:', error);
      throw error;
    }
  }

  /**
   * Set up global event listeners
   */
  setupEventListeners() {
    console.log('📡 Setting up event listeners...');

    // Listen for game events and coordinate between services
    gameEvents.on(GAME_EVENTS.GAME_START, () => {
      console.log('🎯 Game started event received');
      this.scoreService.startGame();
    });

    gameEvents.on(GAME_EVENTS.GAME_OVER, (data) => {
      console.log('💥 Game over event received:', data);
      // Game over is already handled by GameScene, just log for debugging
    });

    gameEvents.on(GAME_EVENTS.UI_UPDATE_TIMER, (time) => {
      // Timer updates are handled by the UI components
      // This could be extended for additional timer-based logic
    });

    console.log('✅ Event listeners set up');
  }

  /**
   * Set up development and debugging tools
   */
  setupDevelopmentTools() {
    if (typeof window !== 'undefined') {
      // Make core systems available globally for development
      window.gameCore = this;
      window.gameManager = this.gameManager;
      window.scoreService = this.scoreService;
      window.gameEvents = gameEvents;

      // Add development console commands
      window.getGameStats = () => {
        return {
          gameManager: this.gameManager.getStats(),
          scoreService: this.scoreService.getCurrentStats(),
          achievements: this.scoreService.getAchievements(),
          performance: this.scoreService.getPerformanceStats()
        };
      };

      window.resetGame = () => {
        console.log('🔄 Resetting game via development command...');
        this.scoreService.reset();
        this.gameManager.destroy();
        this.initialize();
      };

      // Development settings console commands
      if (isDevelopment()) {
        window.devSettings = {
          // Get all current settings
          get: () => devSettings.getAll(),

          // Set a specific setting
          set: (key, value) => {
            devSettings.set(key, value);
            console.log(`🔧 Dev setting updated: ${key} = ${value}`);
          },

          // Reset all settings to defaults
          reset: () => {
            devSettings.reset();
            console.log('🔄 Dev settings reset to defaults');
          },

          // Quick presets for common testing scenarios
          presets: {
            easy: () => {
              devSettings.set('ballSpawnRate', 2000);
              devSettings.set('ballSpeed', 100);
              devSettings.set('gravity', 0);
              devSettings.set('playerSpeed', 600);
              console.log('🎯 Applied "easy" preset');
            },

            hard: () => {
              devSettings.set('ballSpawnRate', 500);
              devSettings.set('ballSpeed', 300);
              devSettings.set('gravity', 100);
              devSettings.set('playerSpeed', 300);
              console.log('🎯 Applied "hard" preset');
            },

            chaos: () => {
              devSettings.set('ballSpawnRate', 200);
              devSettings.set('ballSpeed', 500);
              devSettings.set('gravity', 200);
              devSettings.set('playerSpeed', 200);
              console.log('🎯 Applied "chaos" preset');
            },

            normal: () => {
              devSettings.set('ballSpawnRate', 1000);
              devSettings.set('ballSpeed', 200);
              devSettings.set('gravity', 0);
              devSettings.set('playerSpeed', 400);
              console.log('🎯 Applied "normal" preset');
            }
          }
        };

        console.log('🎮 Dev commands available:');
        console.log('  devSettings.get() - View all settings');
        console.log('  devSettings.set("key", value) - Change a setting');
        console.log('  devSettings.reset() - Reset to defaults');
        console.log('  devSettings.presets.easy() - Easy mode');
        console.log('  devSettings.presets.hard() - Hard mode');
        console.log('  devSettings.presets.chaos() - Chaos mode');
        console.log('  devSettings.presets.normal() - Normal mode');
      }

      console.log('🛠️ Development tools available:');
      console.log('  - window.gameCore');
      console.log('  - window.gameManager');
      console.log('  - window.scoreService');
      console.log('  - window.gameEvents');
      console.log('  - window.getGameStats()');
      console.log('  - window.resetGame()');
    }
  }

  /**
   * Get the current game instance
   */
  getGame() {
    return this.gameManager.getGame();
  }

  /**
   * Check if game is running
   */
  isRunning() {
    return this.gameManager.isGameRunning();
  }

  /**
   * Pause the game
   */
  pause() {
    this.gameManager.pause();
  }

  /**
   * Resume the game
   */
  resume() {
    this.gameManager.resume();
  }

  /**
   * Get comprehensive game statistics
   */
  getStats() {
    if (!this.isRunning()) {
      return { status: 'not_running' };
    }

    return {
      game: this.gameManager.getStats(),
      score: this.scoreService.getCurrentStats(),
      achievements: this.scoreService.getAchievements(),
      performance: this.scoreService.getPerformanceStats()
    };
  }

  /**
   * Clean shutdown
   */
  destroy() {
    console.log('🗑️ Shutting down game system...');

    // Clean up event listeners
    gameEvents.removeAllListeners();

    // Destroy game manager
    this.gameManager.destroy();

    // Clean up asset manager if it exists
    if (this.assetManager) {
      this.assetManager.cleanup();
    }

    this.isInitialized = false;
    console.log('✅ Game system shut down');
  }
}

// Export singleton instance
export const game = new Game();
