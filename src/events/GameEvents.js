// Game Events - Centralized event constants for better maintainability
export const GAME_EVENTS = {
  // Game lifecycle events
  GAME_START: 'game:start',
  GAME_OVER: 'game:over',
  GAME_RESTART: 'game:restart',
  GAME_PAUSE: 'game:pause',
  GAME_RESUME: 'game:resume',
  GAME_RESET: 'game:reset',

  // Player events
  PLAYER_MOVE: 'player:move',
  PLAYER_COLLISION: 'player:collision',

  // Ball events
  BALL_SPAWN: 'ball:spawn',
  BALL_DESTROY: 'ball:destroy',

  // UI events
  UI_UPDATE_TIMER: 'ui:update:timer',
  UI_UPDATE_SCORE: 'ui:update:score',
  UI_SHOW_GAME_OVER: 'ui:show:gameover',
  UI_HIDE_GAME_OVER: 'ui:hide:gameover',

  // Input events
  INPUT_MOUSE_MOVE: 'input:mouse:move',
  INPUT_MOUSE_DOWN: 'input:mouse:down',
  INPUT_MOUSE_UP: 'input:mouse:up',
  INPUT_KEY_PRESS: 'input:key:press',
  INPUT_KEY_RELEASE: 'input:key:release',

  // Performance events
  PERFORMANCE_LOW_FPS: 'performance:lowfps',
  PERFORMANCE_HIGH_FPS: 'performance:highfps',

  // Debug events
  DEBUG_STATS_UPDATE: 'debug:stats:update'
};

// Event emitter helper class for game-wide communication
export class GameEventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  off(event, callback) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(cb => cb !== callback);
    }
  }

  emit(event, ...args) {
    if (this.events[event]) {
      this.events[event].forEach(callback => {
        try {
          callback(...args);
        } catch (error) {
          console.error(`Error in event callback for ${event}:`, error);
        }
      });
    }
  }

  removeAllListeners(event) {
    if (event) {
      delete this.events[event];
    } else {
      this.events = {};
    }
  }
}

// Global event emitter instance
export const gameEvents = new GameEventEmitter();
