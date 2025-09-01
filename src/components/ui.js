// UI components and helpers
import { devSettings, isDevelopment, devLog } from '../utils/helpers.js';

export class GameUI {
  constructor(scene) {
    this.scene = scene;

    // Initialize dev panel if in development
    if (isDevelopment()) {
      this.createDevPanel();
    }
  }

  updateTimer(time) {
    const currentTimeElement = document.getElementById('current-time');
    if (currentTimeElement) {
      currentTimeElement.textContent = time.toFixed(2) + 's';
    }
  }

  updateBestTime(time) {
    const bestTimeElement = document.getElementById('best-time');
    if (bestTimeElement) {
      bestTimeElement.textContent = time > 0 ? time.toFixed(2) + 's' : '--';
    }
  }

  showGameOverScreen() {
    const gameOverScreen = document.getElementById('game-over-screen');
    if (gameOverScreen) {
      gameOverScreen.classList.add('show');
    }
  }

  hideGameOverScreen() {
    const gameOverScreen = document.getElementById('game-over-screen');
    if (gameOverScreen) {
      gameOverScreen.classList.remove('show');
    }
  }

  // Development panel for real-time settings adjustment
  createDevPanel() {
    // Create dev panel container
    const devPanel = document.createElement('div');
    devPanel.id = 'dev-panel';
    devPanel.innerHTML = `
      <div id="dev-panel-header">
        <h3>🎮 Dev Settings</h3>
        <button id="dev-toggle-btn">▼</button>
      </div>
      <div id="dev-panel-content">
        <div class="dev-setting">
          <label>Ball Spawn Rate (ms):</label>
          <input type="range" id="spawn-rate-slider" min="100" max="3000" step="100" value="${devSettings.get('ballSpawnRate')}">
          <span id="spawn-rate-value">${devSettings.get('ballSpawnRate')}</span>
        </div>
        <div class="dev-setting">
          <label>Ball Speed:</label>
          <input type="range" id="ball-speed-slider" min="50" max="500" step="10" value="${devSettings.get('ballSpeed')}">
          <span id="ball-speed-value">${devSettings.get('ballSpeed')}</span>
        </div>
        <div class="dev-setting">
          <label>Gravity:</label>
          <input type="range" id="gravity-slider" min="-200" max="200" step="10" value="${devSettings.get('gravity')}">
          <span id="gravity-value">${devSettings.get('gravity')}</span>
        </div>
        <div class="dev-setting">
          <label>Player Speed:</label>
          <input type="range" id="player-speed-slider" min="100" max="800" step="20" value="${devSettings.get('playerSpeed')}">
          <span id="player-speed-value">${devSettings.get('playerSpeed')}</span>
        </div>
        <div class="dev-setting">
          <label>
            <input type="checkbox" id="debug-info-checkbox" ${devSettings.get('showDebugInfo') ? 'checked' : ''}>
            Show Debug Info
          </label>
        </div>
        <div class="dev-actions">
          <button id="reset-settings-btn">Reset to Defaults</button>
          <button id="save-preset-btn">Save Preset</button>
          <button id="load-preset-btn">Load Preset</button>
        </div>
      </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      #dev-panel {
        position: fixed;
        top: 10px;
        right: 10px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 10px;
        border-radius: 8px;
        font-family: Arial, sans-serif;
        font-size: 12px;
        z-index: 1000;
        min-width: 250px;
        max-width: 300px;
      }
      #dev-panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
      }
      #dev-panel-header h3 {
        margin: 0;
        font-size: 14px;
      }
      #dev-toggle-btn {
        background: #444;
        color: white;
        border: none;
        padding: 4px 8px;
        border-radius: 4px;
        cursor: pointer;
      }
      #dev-panel-content {
        display: block;
      }
      #dev-panel-content.collapsed {
        display: none;
      }
      .dev-setting {
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .dev-setting label {
        flex: 1;
        white-space: nowrap;
      }
      .dev-setting input[type="range"] {
        flex: 2;
      }
      .dev-setting span {
        min-width: 40px;
        text-align: right;
      }
      .dev-actions {
        margin-top: 10px;
        display: flex;
        gap: 5px;
        flex-wrap: wrap;
      }
      .dev-actions button {
        background: #666;
        color: white;
        border: none;
        padding: 4px 8px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 11px;
      }
      .dev-actions button:hover {
        background: #888;
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(devPanel);

    // Set up event listeners
    this.setupDevPanelEvents();
    devLog('🎮 Dev panel created');
  }

  setupDevPanelEvents() {
    // Toggle panel visibility
    const toggleBtn = document.getElementById('dev-toggle-btn');
    const content = document.getElementById('dev-panel-content');

    if (toggleBtn && content) {
      toggleBtn.addEventListener('click', () => {
        const isCollapsed = content.classList.contains('collapsed');
        content.classList.toggle('collapsed');
        toggleBtn.textContent = isCollapsed ? '▼' : '▶';
      });
    }

    // Ball spawn rate
    const spawnRateSlider = document.getElementById('spawn-rate-slider');
    const spawnRateValue = document.getElementById('spawn-rate-value');

    if (spawnRateSlider && spawnRateValue) {
      spawnRateSlider.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        spawnRateValue.textContent = value;
        devSettings.set('ballSpawnRate', value);
      });
    }

    // Ball speed
    const ballSpeedSlider = document.getElementById('ball-speed-slider');
    const ballSpeedValue = document.getElementById('ball-speed-value');

    if (ballSpeedSlider && ballSpeedValue) {
      ballSpeedSlider.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        ballSpeedValue.textContent = value;
        devSettings.set('ballSpeed', value);
      });
    }

    // Gravity
    const gravitySlider = document.getElementById('gravity-slider');
    const gravityValue = document.getElementById('gravity-value');

    if (gravitySlider && gravityValue) {
      gravitySlider.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        gravityValue.textContent = value;
        devSettings.set('gravity', value);
      });
    }

    // Player speed
    const playerSpeedSlider = document.getElementById('player-speed-slider');
    const playerSpeedValue = document.getElementById('player-speed-value');

    if (playerSpeedSlider && playerSpeedValue) {
      playerSpeedSlider.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        playerSpeedValue.textContent = value;
        devSettings.set('playerSpeed', value);
      });
    }

    // Debug info checkbox
    const debugCheckbox = document.getElementById('debug-info-checkbox');

    if (debugCheckbox) {
      debugCheckbox.addEventListener('change', (e) => {
        devSettings.set('showDebugInfo', e.target.checked);
      });
    }

    // Reset button
    const resetBtn = document.getElementById('reset-settings-btn');

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        devSettings.reset();
        this.updateDevPanelValues();
        devLog('🔄 Dev settings reset');
      });
    }

    // Save preset button
    const savePresetBtn = document.getElementById('save-preset-btn');

    if (savePresetBtn) {
      savePresetBtn.addEventListener('click', () => {
        const presetName = prompt('Enter preset name:');
        if (presetName) {
          const presets = JSON.parse(localStorage.getItem('devPresets') || '{}');
          presets[presetName] = devSettings.getAll();
          localStorage.setItem('devPresets', JSON.stringify(presets));
          devLog(`💾 Preset "${presetName}" saved`);
        }
      });
    }

    // Load preset button
    const loadPresetBtn = document.getElementById('load-preset-btn');

    if (loadPresetBtn) {
      loadPresetBtn.addEventListener('click', () => {
        const presets = JSON.parse(localStorage.getItem('devPresets') || '{}');
        const presetNames = Object.keys(presets);

        if (presetNames.length === 0) {
          alert('No presets saved yet');
          return;
        }

        const presetName = prompt(`Available presets: ${presetNames.join(', ')}\nEnter preset name to load:`);
        if (presetName && presets[presetName]) {
          Object.entries(presets[presetName]).forEach(([key, value]) => {
            devSettings.set(key, value);
          });
          this.updateDevPanelValues();
          devLog(`📂 Preset "${presetName}" loaded`);
        }
      });
    }
  }

  updateDevPanelValues() {
    // Update slider values from devSettings
    const spawnRateSlider = document.getElementById('spawn-rate-slider');
    const spawnRateValue = document.getElementById('spawn-rate-value');
    if (spawnRateSlider && spawnRateValue) {
      const value = devSettings.get('ballSpawnRate');
      spawnRateSlider.value = value;
      spawnRateValue.textContent = value;
    }

    const ballSpeedSlider = document.getElementById('ball-speed-slider');
    const ballSpeedValue = document.getElementById('ball-speed-value');
    if (ballSpeedSlider && ballSpeedValue) {
      const value = devSettings.get('ballSpeed');
      ballSpeedSlider.value = value;
      ballSpeedValue.textContent = value;
    }

    const gravitySlider = document.getElementById('gravity-slider');
    const gravityValue = document.getElementById('gravity-value');
    if (gravitySlider && gravityValue) {
      const value = devSettings.get('gravity');
      gravitySlider.value = value;
      gravityValue.textContent = value;
    }

    const playerSpeedSlider = document.getElementById('player-speed-slider');
    const playerSpeedValue = document.getElementById('player-speed-value');
    if (playerSpeedSlider && playerSpeedValue) {
      const value = devSettings.get('playerSpeed');
      playerSpeedSlider.value = value;
      playerSpeedValue.textContent = value;
    }

    const debugCheckbox = document.getElementById('debug-info-checkbox');
    if (debugCheckbox) {
      debugCheckbox.checked = devSettings.get('showDebugInfo');
    }
  }
}
