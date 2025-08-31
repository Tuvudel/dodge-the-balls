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

**[Play!] (https://tuvudel.github.io/dodge-the-spiked-balls)**

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/dodge-the-spiked-balls.git
cd dodge-the-spiked-balls
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment.

## 🎮 How to Play

1. **Move**: Use your mouse to move the cyan character left and right
2. **Survive**: Avoid the falling red spiked balls
3. **Score**: Try to beat your best survival time
4. **Restart**: Click "Play Again" when you get hit

## 🛠️ Development

### Project Structure

```
dodge-the-spiked-balls/
├── src/
│   ├── main.js          # Main game logic and Phaser scene
│   └── index.html       # HTML template
├── assets/              # Game assets (images, audio)
├── dist/                # Built files (generated)
├── package.json         # Dependencies and scripts
├── webpack.config.js    # Build configuration
└── README.md           # This file
```

### Available Scripts

- `npm start` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run dev` - Build and watch for changes
- `npm run serve` - Serve built files locally

## 🌐 Deployment to GitHub Pages

1. Build the project:
```bash
npm run build
```

2. Commit and push your changes:
```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

3. In your GitHub repository settings:
   - Go to "Pages" section
   - Set source to "Deploy from a branch"
   - Select "main" branch and "/dist" folder
   - Save

Your game will be available at: `https://yourusername.github.io/dodge-the-spiked-balls`

## 🎨 Customization

### Changing Game Parameters

Edit the constants in `src/main.js`:

```javascript
const PLAYER_SPEED = 400;      // How fast the player moves
const BALL_SPEED = 200;        // How fast balls fall
const BALL_SPAWN_RATE = 1000;  // Milliseconds between ball spawns
const BALL_SIZE = 20;          // Size of spiked balls
const PLAYER_SIZE = 30;        // Size of player character
```

### Styling

Modify the CSS in `src/index.html` to change:
- Colors and gradients
- UI layout and positioning
- Font styles and sizes
- Responsive breakpoints

### Adding Assets

Place your custom assets in the `assets/` folder:
- `assets/images/` - Custom sprites and backgrounds
- `assets/audio/` - Sound effects and music

## 🧪 Testing

The game has been tested on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Phaser.js](https://phaser.io/phaser3) - The best HTML5 game framework
- Inspired by classic arcade games
- Thanks to the web gaming community for inspiration

## 🎮 Game Tips

- **Stay Calm**: Sudden movements can be your downfall
- **Predict Patterns**: Watch for ball spawn patterns
- **Edge Strategy**: Use screen edges strategically
- **Practice**: Your reflexes will improve with practice
- **Beat Records**: Challenge yourself to beat your previous best time

---

**Enjoy the game! 🎯**
