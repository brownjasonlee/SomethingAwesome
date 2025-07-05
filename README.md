# 🌌 Interactive Fractal Explorer

An awesome web-based fractal visualization tool that lets you explore the infinite beauty of mathematical fractals in real-time! This project has evolved from a simple ASCII Mandelbrot generator to a fully interactive fractal explorer with stunning visuals.

## ✨ Features

- **Multiple Fractal Types**: Mandelbrot Set, Julia Sets, Burning Ship, and Tricorn fractals
- **Interactive Navigation**: Click to zoom, right-click to zoom out, drag to pan, mouse wheel support
- **Beautiful Color Schemes**: Hot, Cool, Rainbow, Monochrome, and Electric palettes
- **Real-time Animation**: Animated Julia sets with smooth parameter transitions
- **Mobile Friendly**: Touch support for mobile devices
- **Image Export**: Save your favorite fractals as PNG images
- **Keyboard Shortcuts**: Quick access to all features
- **Responsive Design**: Works on all screen sizes

## 🚀 Getting Started

Simply open `index.html` in your web browser - no installation required! The application runs entirely in the browser using modern web technologies.

### Controls

- **Mouse**: 
  - Left click: Zoom in
  - Right click: Zoom out
  - Shift + drag: Pan around
  - Mouse wheel: Smooth zoom
- **Touch** (Mobile):
  - Tap: Zoom in
  - Double tap: Zoom in faster
  - Drag: Pan around
- **Keyboard**:
  - `R`: Reset view
  - `S`: Save image
  - `A`: Toggle Julia animation (when viewing Julia sets)
  - `1-4`: Switch between fractal types

## 🎨 Fractal Types

1. **Mandelbrot Set**: The classic fractal that started it all
2. **Julia Set**: Beautiful variations with customizable parameters
3. **Burning Ship**: A dramatic variation with absolute values
4. **Tricorn**: The "broken" Mandelbrot with complex conjugates

## 🔧 Technical Details

Built with:
- Pure JavaScript (ES6+)
- HTML5 Canvas for high-performance rendering
- CSS3 with advanced animations and gradients
- Responsive design using CSS Grid and Flexbox

## 🎯 Advanced Features

- **Smooth Coloring**: Uses escape time algorithm with continuous coloring
- **Progressive Rendering**: Non-blocking computation for smooth UI
- **Optimized Math**: Fast complex number arithmetic
- **Color Interpolation**: Smooth color transitions
- **Touch Gestures**: Full mobile support

## 📱 Legacy ASCII Version

The original command-line ASCII version is still available:

```bash
python3 mandelbrot.py --width 120 --height 60 --max-iter 50
```

## 🌟 Future Enhancements

- [ ] WebGL acceleration
- [ ] 3D fractal rendering
- [ ] Custom color scheme editor
- [ ] Fractal parameter presets
- [ ] Video export functionality
- [ ] WebWorkers for background computation

Dive into the infinite world of fractals and discover the mathematical beauty that emerges from simple equations! 🎭✨
