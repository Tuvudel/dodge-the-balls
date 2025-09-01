// Main menu scene
export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    // Create menu UI
    const title = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY - 100,
      'Dodge the Spiked Balls',
      {
        fontSize: '32px',
        fill: '#ffffff',
        fontFamily: 'Arial',
        fontWeight: 'bold'
      }
    );
    title.setOrigin(0.5);

    const playButton = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      'Play Game',
      {
        fontSize: '24px',
        fill: '#4ecdc4',
        fontFamily: 'Arial'
      }
    );
    playButton.setOrigin(0.5);
    playButton.setInteractive();

    playButton.on('pointerdown', () => {
      this.scene.start('GameScene');
    });

    playButton.on('pointerover', () => {
      playButton.setScale(1.1);
    });

    playButton.on('pointerout', () => {
      playButton.setScale(1);
    });
  }
}
