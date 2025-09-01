import { loadFromLocalStorage, saveToLocalStorage } from '../utils/helpers.js';
import { gameEvents, GAME_EVENTS } from '../events/GameEvents.js';

/**
 * ScoreService - Handles all scoring logic, persistence, and statistics
 * Provides a clean interface for managing game scores and achievements.
 */
export class ScoreService {
  constructor() {
    this.currentScore = 0;
    this.bestScore = 0;
    this.sessionStats = {
      gamesPlayed: 0,
      totalTime: 0,
      averageTime: 0,
      bestStreak: 0,
      currentStreak: 0
    };

    this.loadPersistentData();
  }

  /**
   * Load persistent score data from localStorage
   */
  loadPersistentData() {
    this.bestScore = loadFromLocalStorage('dodgeBalls_bestTime', 0);
    this.sessionStats = loadFromLocalStorage('dodgeBalls_sessionStats', this.sessionStats);

    console.log('📊 Loaded score data:', {
      bestScore: this.bestScore,
      sessionStats: this.sessionStats
    });
  }

  /**
   * Save persistent score data to localStorage
   */
  savePersistentData() {
    saveToLocalStorage('dodgeBalls_bestTime', this.bestScore);
    saveToLocalStorage('dodgeBalls_sessionStats', this.sessionStats);
  }

  /**
   * Start a new game session
   */
  startGame() {
    this.currentScore = 0;
    this.gameEnded = false; // Reset flag for new game
    console.log('🎯 Game started - Score reset to 0');
  }

  /**
   * Update the current score (time-based scoring)
   */
  updateScore(time) {
    this.currentScore = time;

    // Emit score update event
    gameEvents.emit(GAME_EVENTS.UI_UPDATE_TIMER, this.currentScore);
  }

  /**
   * End the current game and process final score
   */
  endGame(finalTime) {
    // Prevent multiple endGame calls
    if (this.gameEnded) {
      return this.getCurrentStats();
    }
    this.gameEnded = true;

    this.currentScore = finalTime;
    this.sessionStats.gamesPlayed++;
    this.sessionStats.totalTime += finalTime;

    // Update average time
    this.sessionStats.averageTime = this.sessionStats.totalTime / this.sessionStats.gamesPlayed;

    // Check for new best score
    if (finalTime > this.bestScore) {
      this.bestScore = finalTime;
      this.sessionStats.bestStreak = Math.max(this.sessionStats.bestStreak, ++this.sessionStats.currentStreak);

      console.log('🏆 New best time achieved!');
      gameEvents.emit(GAME_EVENTS.UI_UPDATE_SCORE, this.bestScore);

      // Save immediately when new record is set
      this.savePersistentData();
    } else {
      // Reset current streak on non-record
      this.sessionStats.currentStreak = 0;
    }

    // Save session stats
    this.savePersistentData();

    console.log('📊 Game ended - Final time:', finalTime, 'Best:', this.bestScore);
    gameEvents.emit(GAME_EVENTS.GAME_OVER, {
      finalTime,
      bestTime: this.bestScore,
      isNewRecord: finalTime >= this.bestScore
    });

    return {
      finalTime,
      bestTime: this.bestScore,
      isNewRecord: finalTime >= this.bestScore
    };
  }

  /**
   * Reset the game (for development/testing)
   */
  reset() {
    console.log('🔄 Resetting all scores...');

    this.currentScore = 0;
    this.bestScore = 0;
    this.sessionStats = {
      gamesPlayed: 0,
      totalTime: 0,
      averageTime: 0,
      bestStreak: 0,
      currentStreak: 0
    };

    this.savePersistentData();
    console.log('✅ All scores reset');
  }

  /**
   * Get current game statistics
   */
  getCurrentStats() {
    return {
      currentScore: this.currentScore,
      bestScore: this.bestScore,
      sessionStats: { ...this.sessionStats }
    };
  }

  /**
   * Get formatted time string
   */
  formatTime(seconds) {
    return `${seconds.toFixed(2)}s`;
  }

  /**
   * Check if current score is a new record
   */
  isNewRecord(time) {
    return time > this.bestScore;
  }

  /**
   * Get achievement progress
   */
  getAchievements() {
    return {
      firstGame: this.sessionStats.gamesPlayed > 0,
      fiveGames: this.sessionStats.gamesPlayed >= 5,
      tenSeconds: this.bestScore >= 10,
      thirtySeconds: this.bestScore >= 30,
      minuteMark: this.bestScore >= 60,
      streakMaster: this.sessionStats.bestStreak >= 3
    };
  }

  /**
   * Get performance statistics
   */
  getPerformanceStats() {
    return {
      averageTime: this.sessionStats.averageTime,
      totalGames: this.sessionStats.gamesPlayed,
      totalTime: this.sessionStats.totalTime,
      bestStreak: this.sessionStats.bestStreak,
      currentStreak: this.sessionStats.currentStreak
    };
  }
}

// Export singleton instance
export const scoreService = new ScoreService();
