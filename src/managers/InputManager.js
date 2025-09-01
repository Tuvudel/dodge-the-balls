import { gameEvents, GAME_EVENTS } from '../events/GameEvents.js';

/**
 * InputManager - Centralized input handling system
 * Manages mouse, keyboard, and touch inputs with event-driven architecture
 */
export class InputManager {
  constructor(scene) {
    this.scene = scene;
    this.enabled = true;
    this.mousePosition = { x: 0, y: 0 };
    this.isMouseDown = false;
    this.keys = {};

    this.setupInputHandlers();
    console.log('🎮 InputManager initialized');
  }

  /**
   * Set up all input event handlers
   */
  setupInputHandlers() {
    // Mouse move handler
    this.scene.input.on('pointermove', (pointer) => {
      if (!this.enabled) return;

      this.mousePosition.x = pointer.x;
      this.mousePosition.y = pointer.y;

      gameEvents.emit(GAME_EVENTS.INPUT_MOUSE_MOVE, {
        x: pointer.x,
        y: pointer.y,
        deltaX: pointer.deltaX,
        deltaY: pointer.deltaY
      });
    });

    // Mouse down handler
    this.scene.input.on('pointerdown', (pointer) => {
      if (!this.enabled) return;

      this.isMouseDown = true;

      gameEvents.emit(GAME_EVENTS.INPUT_MOUSE_DOWN, {
        x: pointer.x,
        y: pointer.y,
        button: pointer.button
      });
    });

    // Mouse up handler
    this.scene.input.on('pointerup', (pointer) => {
      if (!this.enabled) return;

      this.isMouseDown = false;

      gameEvents.emit(GAME_EVENTS.INPUT_MOUSE_UP, {
        x: pointer.x,
        y: pointer.y,
        button: pointer.button
      });
    });

    // Keyboard handlers
    this.scene.input.keyboard.on('keydown', (event) => {
      if (!this.enabled) return;

      this.keys[event.keyCode] = true;

      gameEvents.emit(GAME_EVENTS.INPUT_KEY_PRESS, {
        keyCode: event.keyCode,
        key: event.key,
        shiftKey: event.shiftKey,
        ctrlKey: event.ctrlKey,
        altKey: event.altKey
      });
    });

    this.scene.input.keyboard.on('keyup', (event) => {
      if (!this.enabled) return;

      this.keys[event.keyCode] = false;

      gameEvents.emit(GAME_EVENTS.INPUT_KEY_RELEASE, {
        keyCode: event.keyCode,
        key: event.key
      });
    });

    // Touch handlers for mobile
    this.scene.input.on('pointerdown', (pointer) => {
      if (!this.enabled || !pointer.wasTouch) return;

      gameEvents.emit('input:touch:start', {
        x: pointer.x,
        y: pointer.y,
        id: pointer.id
      });
    });

    this.scene.input.on('pointerup', (pointer) => {
      if (!this.enabled || !pointer.wasTouch) return;

      gameEvents.emit('input:touch:end', {
        x: pointer.x,
        y: pointer.y,
        id: pointer.id
      });
    });
  }

  /**
   * Enable or disable input handling
   */
  setEnabled(enabled) {
    this.enabled = enabled;
    console.log(`🎮 Input ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Get current mouse position
   */
  getMousePosition() {
    return { ...this.mousePosition };
  }

  /**
   * Check if mouse button is pressed
   */
  isMouseButtonDown() {
    return this.isMouseDown;
  }

  /**
   * Check if a specific key is pressed
   */
  isKeyDown(keyCode) {
    return !!this.keys[keyCode];
  }

  /**
   * Check if any key is pressed
   */
  isAnyKeyDown() {
    return Object.values(this.keys).some(pressed => pressed);
  }

  /**
   * Get all currently pressed keys
   */
  getPressedKeys() {
    return Object.entries(this.keys)
      .filter(([keyCode, pressed]) => pressed)
      .map(([keyCode, pressed]) => parseInt(keyCode));
  }

  /**
   * Add a custom input handler
   */
  addHandler(eventType, callback) {
    gameEvents.on(eventType, callback);
  }

  /**
   * Remove a custom input handler
   */
  removeHandler(eventType, callback) {
    gameEvents.off(eventType, callback);
  }

  /**
   * Clear all pressed keys (useful for game state changes)
   */
  clearKeys() {
    this.keys = {};
  }

  /**
   * Get input statistics for debugging
   */
  getStats() {
    return {
      enabled: this.enabled,
      mousePosition: this.getMousePosition(),
      mouseDown: this.isMouseDown,
      pressedKeys: this.getPressedKeys(),
      anyKeyDown: this.isAnyKeyDown()
    };
  }

  /**
   * Clean up resources
   */
  destroy() {
    console.log('🗑️ Cleaning up InputManager');

    // Remove all event listeners
    if (this.scene.input) {
      this.scene.input.off('pointermove');
      this.scene.input.off('pointerdown');
      this.scene.input.off('pointerup');
    }

    if (this.scene.input.keyboard) {
      this.scene.input.keyboard.off('keydown');
      this.scene.input.keyboard.off('keyup');
    }

    // Clear all custom event listeners
    gameEvents.removeAllListeners(GAME_EVENTS.INPUT_MOUSE_MOVE);
    gameEvents.removeAllListeners(GAME_EVENTS.INPUT_MOUSE_DOWN);
    gameEvents.removeAllListeners(GAME_EVENTS.INPUT_MOUSE_UP);
    gameEvents.removeAllListeners(GAME_EVENTS.INPUT_KEY_PRESS);
    gameEvents.removeAllListeners(GAME_EVENTS.INPUT_KEY_RELEASE);
  }
}

// Factory function to create InputManager for a scene
export function createInputManager(scene) {
  return new InputManager(scene);
}
