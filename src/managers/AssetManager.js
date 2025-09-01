import { PLAYER_CONFIG, BALL_CONFIG } from '../config/constants.js';

/**
 * AssetManager - Handles texture creation, asset loading, and resource management
 * Provides a centralized way to manage game assets and graphics.
 */
export class AssetManager {
  constructor(scene) {
    this.scene = scene;
    this.textures = new Map();
    this.graphics = new Map();
  }

  /**
   * Create all game textures
   */
  createTextures() {
    console.log('🎨 Creating game textures...');

    this.createPlayerTexture();
    this.createBallTexture();

    console.log('✅ All textures created');
  }

  /**
   * Create player texture
   */
  createPlayerTexture() {
    const key = 'player';
    const graphics = this.scene.add.graphics();

    // Create player appearance (cyan rectangle)
    graphics.fillStyle(PLAYER_CONFIG.COLOR);
    graphics.fillRect(0, 0, PLAYER_CONFIG.SIZE, PLAYER_CONFIG.SIZE);

    // Optional: Add a border
    graphics.lineStyle(2, 0x00ffff, 0.8);
    graphics.strokeRect(0, 0, PLAYER_CONFIG.SIZE, PLAYER_CONFIG.SIZE);

    // Generate texture
    graphics.generateTexture(key, PLAYER_CONFIG.SIZE, PLAYER_CONFIG.SIZE);
    graphics.destroy();

    this.textures.set(key, { width: PLAYER_CONFIG.SIZE, height: PLAYER_CONFIG.SIZE });
    console.log('👤 Player texture created');
  }

  /**
   * Create ball texture with spikes
   */
  createBallTexture() {
    const key = 'ball';
    const graphics = this.scene.add.graphics();

    // Create ball base (red circle)
    graphics.fillStyle(BALL_CONFIG.COLOR);
    graphics.fillCircle(BALL_CONFIG.SIZE / 2, BALL_CONFIG.SIZE / 2, BALL_CONFIG.SIZE / 2);

    // Add spikes around the ball
    graphics.lineStyle(2, 0xff4757);
    const spikeCount = 8;
    const spikeLength = BALL_CONFIG.SIZE / 4;

    for (let i = 0; i < spikeCount; i++) {
      const angle = (i * Math.PI * 2) / spikeCount;
      const centerX = BALL_CONFIG.SIZE / 2;
      const centerY = BALL_CONFIG.SIZE / 2;

      // Calculate spike positions
      const innerRadius = BALL_CONFIG.SIZE / 2 - 2;
      const outerRadius = BALL_CONFIG.SIZE / 2 + spikeLength;

      const innerX = centerX + Math.cos(angle) * innerRadius;
      const innerY = centerY + Math.sin(angle) * innerRadius;
      const outerX = centerX + Math.cos(angle) * outerRadius;
      const outerY = centerY + Math.sin(angle) * outerRadius;

      graphics.lineBetween(innerX, innerY, outerX, outerY);
    }

    // Generate texture
    graphics.generateTexture(key, BALL_CONFIG.SIZE, BALL_CONFIG.SIZE);
    graphics.destroy();

    this.textures.set(key, { width: BALL_CONFIG.SIZE, height: BALL_CONFIG.SIZE });
    console.log('⚡ Ball texture created');
  }

  /**
   * Create a simple colored rectangle texture
   */
  createRectangleTexture(key, width, height, color) {
    const graphics = this.scene.add.graphics();
    graphics.fillStyle(color);
    graphics.fillRect(0, 0, width, height);

    graphics.generateTexture(key, width, height);
    graphics.destroy();

    this.textures.set(key, { width, height });
    return key;
  }

  /**
   * Create a circular texture
   */
  createCircleTexture(key, radius, color, borderColor = null, borderWidth = 0) {
    const size = radius * 2;
    const graphics = this.scene.add.graphics();

    graphics.fillStyle(color);
    graphics.fillCircle(radius, radius, radius);

    if (borderColor && borderWidth > 0) {
      graphics.lineStyle(borderWidth, borderColor);
      graphics.strokeCircle(radius, radius, radius);
    }

    graphics.generateTexture(key, size, size);
    graphics.destroy();

    this.textures.set(key, { width: size, height: size });
    return key;
  }

  /**
   * Check if a texture exists
   */
  hasTexture(key) {
    return this.scene.textures.exists(key);
  }

  /**
   * Get texture information
   */
  getTextureInfo(key) {
    if (this.textures.has(key)) {
      return this.textures.get(key);
    }
    return null;
  }

  /**
   * Remove a texture
   */
  removeTexture(key) {
    if (this.scene.textures.exists(key)) {
      this.scene.textures.remove(key);
      this.textures.delete(key);
      console.log(`🗑️ Texture '${key}' removed`);
    }
  }

  /**
   * Clean up all textures
   */
  cleanup() {
    console.log('🧹 Cleaning up assets...');

    for (const [key] of this.textures) {
      this.removeTexture(key);
    }

    // Clean up any cached graphics
    for (const [key, graphics] of this.graphics) {
      if (graphics && graphics.destroy) {
        graphics.destroy();
      }
    }

    this.graphics.clear();
    console.log('✅ Assets cleaned up');
  }

  /**
   * Preload external assets (for future use)
   */
  preloadAssets(assetList = []) {
    console.log('📦 Preloading external assets...');

    // This would handle external images, audio, etc.
    // For now, just log the intention
    if (assetList.length > 0) {
      console.log('External assets to load:', assetList);
    }
  }

  /**
   * Get asset loading progress (for future use)
   */
  getLoadProgress() {
    // This would return loading progress if we had external assets
    return 1.0; // 100% loaded (since we create textures procedurally)
  }

  /**
   * Create particle effect textures
   */
  createParticleTextures() {
    // Create small particle textures for effects
    this.createCircleTexture('particle_small', 2, 0xffffff);
    this.createCircleTexture('particle_medium', 4, 0xffffff);
    this.createCircleTexture('particle_large', 6, 0xffffff);

    console.log('✨ Particle textures created');
  }
}

// Factory function to create AssetManager for a scene
export function createAssetManager(scene) {
  return new AssetManager(scene);
}
