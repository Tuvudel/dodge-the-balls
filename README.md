# 🎮 Dodge the Spiked Balls

A thrilling web-based game built with Phaser.js where you must dodge falling spiked balls using mouse controls. Challenge yourself to beat your best survival time!

## 🎯 Game Features

- **Mouse Controls**: Move your character left and right with your mouse
- **Dynamic Difficulty**: Balls spawn at increasing rates
- **Real-time Timer**: Track your survival time
- **Best Time Persistence**: Your best score is saved locally
- **Responsive Design**: Works on desktop and mobile devices
- **Smooth Gameplay**: 60 FPS with optimized physics
- **Visual Effects**: Modern UI with gradients and blur effects

## Play!

**[Play!](https://tuvudel.github.io/dodge-the-balls/)**


## 🎮 How to Play

1. **Move**: Use your mouse to move the cyan character left and right
2. **Survive**: Avoid the falling red spiked balls
3. **Score**: Try to beat your best survival time
4. **Restart**: Click "Play Again" when you get hit

## 🛠️ Development

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd dodge-the-spiked-balls

# Install dependencies
npm install
```

### Development Scripts

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Build and serve locally
npm start

# Clean build directory
npm run clean

# Rebuild from scratch
npm run rebuild
```

### Project Structure

```
dodge-the-spiked-balls/
├── src/
│   ├── main.js              # Main game entry point
│   ├── index.html           # HTML template
│   ├── config/
│   │   └── constants.js     # Game configuration constants
│   ├── scenes/
│   │   └── menu.js          # Additional game scenes
│   ├── components/
│   │   └── ui.js            # Reusable UI components
│   └── utils/
│       └── helpers.js       # Utility functions
├── assets/                  # Game assets (images, audio)
├── dist/                    # Built files (generated)
├── node_modules/            # Dependencies
├── package.json             # Dependencies and scripts
├── webpack.config.js        # Build configuration
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

## 🎨 Customization

### Changing Game Parameters

Edit the constants in `src/config/constants.js`:

```javascript
export const GAME_CONFIG = {
  WIDTH: 800,                  // Game canvas width
  HEIGHT: 600,                 // Game canvas height
  BACKGROUND_COLOR: '#1a1a2e', // Background color
  GRAVITY: 0,                  // Physics gravity
  DEBUG: false                 // Debug mode
};

export const PLAYER_CONFIG = {
  SPEED: 400,                  // How fast the player moves
  SIZE: 30,                    // Size of player character
  COLOR: 0x4ecdc4             // Player color (hex)
};

export const BALL_CONFIG = {
  SPEED: 200,                  // How fast balls fall
  SPAWN_RATE: 6000,           // Milliseconds between ball spawns
  SIZE: 20,                    // Size of spiked balls
  COLOR: 0xff6b6b             // Ball color (hex)
};
```

### Adding New Features

The project is now organized for easy expansion:

- **Scenes**: Add new game scenes in `src/scenes/`
- **Components**: Create reusable UI components in `src/components/`
- **Utils**: Add utility functions in `src/utils/`
- **Config**: Modify game settings in `src/config/`

**Enjoy the game! 🎯**
