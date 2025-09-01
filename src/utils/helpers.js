// Utility functions for the game

export function formatTime(seconds) {
  return seconds.toFixed(2) + 's';
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

export function loadFromLocalStorage(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Failed to load ${key} from localStorage:`, error);
    return defaultValue;
  }
}

export function saveToLocalStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Failed to save ${key} to localStorage:`, error);
  }
}

// Environment detection
export function isDevelopment() {
  return window.location.hostname === 'localhost' ||
         window.location.hostname === '127.0.0.1' ||
         window.location.hostname === '';
}

// Conditional logging based on environment
export function devLog(...args) {
  if (isDevelopment()) {
    console.log(...args);
  }
}

export function devWarn(...args) {
  if (isDevelopment()) {
    console.warn(...args);
  }
}

export function devError(...args) {
  if (isDevelopment()) {
    console.error(...args);
  }
}

// Development settings manager
class DevSettings {
  constructor() {
    this.settings = {
      ballSpawnRate: 1000, // ms between spawns
      ballSpeed: 200,
      gravity: 0,
      playerSpeed: 400,
      showDebugInfo: false
    };
    this.callbacks = {};
    this.loadSettings();
  }

  // Load settings from localStorage
  loadSettings() {
    const saved = loadFromLocalStorage('devSettings', {});
    Object.assign(this.settings, saved);
    devLog('🔧 Dev settings loaded:', this.settings);
  }

  // Save settings to localStorage
  saveSettings() {
    saveToLocalStorage('devSettings', this.settings);
  }

  // Get a setting value
  get(key) {
    return this.settings[key];
  }

  // Set a setting value and trigger callbacks
  set(key, value) {
    const oldValue = this.settings[key];
    this.settings[key] = value;
    this.saveSettings();

    // Trigger callbacks if value changed
    if (oldValue !== value && this.callbacks[key]) {
      this.callbacks[key].forEach(callback => callback(value, oldValue));
    }

    devLog(`🔧 Dev setting updated: ${key} = ${value}`);
  }

  // Register a callback for when a setting changes
  onChange(key, callback) {
    if (!this.callbacks[key]) {
      this.callbacks[key] = [];
    }
    this.callbacks[key].push(callback);
  }

  // Get all current settings
  getAll() {
    return { ...this.settings };
  }

  // Reset all settings to defaults
  reset() {
    this.settings = {
      ballSpawnRate: 1000,
      ballSpeed: 200,
      gravity: 0,
      playerSpeed: 400,
      showDebugInfo: false
    };
    this.saveSettings();
    devLog('🔄 Dev settings reset to defaults');
  }
}

export const devSettings = new DevSettings();
