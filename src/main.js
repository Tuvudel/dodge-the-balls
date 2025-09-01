/**
 * main.js - Game Entry Point
 *
 * This is the main entry point for the Dodge the Spiked Balls game.
 * It initializes the game system using the modular architecture.
 */

import { game } from './core/Game.js';

// Initialize the game when the page loads
async function initializeGame() {
  try {
    console.log('🎮 Starting Dodge the Spiked Balls...');
    await game.initialize();
    console.log('✅ Game loaded successfully!');
  } catch (error) {
    console.error('❌ Failed to initialize game:', error);
  }
}

// Start the game
initializeGame();
