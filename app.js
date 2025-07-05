/**
 * Interactive Fractal Explorer - Main Application
 * Handles UI interactions and coordinates fractal generation
 */

class FractalApp {
    constructor() {
        this.canvas = document.getElementById('fractalCanvas');
        this.engine = new FractalEngine(this.canvas);
        this.isGenerating = false;
        this.isDragging = false;
        this.lastMouseX = 0;
        this.lastMouseY = 0;
        
        // UI elements
        this.elements = {
            fractalType: document.getElementById('fractalType'),
            iterations: document.getElementById('iterations'),
            iterationsValue: document.getElementById('iterationsValue'),
            colorScheme: document.getElementById('colorScheme'),
            juliaReal: document.getElementById('juliaReal'),
            juliaImg: document.getElementById('juliaImg'),
            juliaControls: document.querySelector('.julia-controls'),
            resetView: document.getElementById('resetView'),
            saveImage: document.getElementById('saveImage'),
            animateJulia: document.getElementById('animateJulia'),
            loadingOverlay: document.getElementById('loadingOverlay'),
            zoomInfo: document.getElementById('zoomInfo')
        };
        
        this.setupEventListeners();
        this.updateUI();
        
        // Generate initial fractal
        this.generateFractal();
        
        // Make this globally accessible for the engine
        window.fractalApp = this;
    }
    
    setupEventListeners() {
        // Fractal type change
        this.elements.fractalType.addEventListener('change', (e) => {
            this.showJuliaControls(e.target.value === 'julia');
            this.generateFractal();
        });
        
        // Iterations slider
        this.elements.iterations.addEventListener('input', (e) => {
            this.engine.maxIterations = parseInt(e.target.value);
            this.elements.iterationsValue.textContent = e.target.value;
            this.generateFractal();
        });
        
        // Color scheme change
        this.elements.colorScheme.addEventListener('change', () => {
            this.generateFractal();
        });
        
        // Julia parameters
        this.elements.juliaReal.addEventListener('input', (e) => {
            this.engine.setJuliaParams(parseFloat(e.target.value), this.engine.juliaImag);
            this.generateFractal();
        });
        
        this.elements.juliaImg.addEventListener('input', (e) => {
            this.engine.setJuliaParams(this.engine.juliaReal, parseFloat(e.target.value));
            this.generateFractal();
        });
        
        // Action buttons
        this.elements.resetView.addEventListener('click', () => {
            this.engine.resetView();
            this.updateUI();
            this.generateFractal();
        });
        
        this.elements.saveImage.addEventListener('click', () => {
            this.saveImage();
        });
        
        this.elements.animateJulia.addEventListener('click', () => {
            this.toggleJuliaAnimation();
        });
        
        // Canvas interactions
        this.setupCanvasEvents();
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });
        
        // Window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }
    
    setupCanvasEvents() {
        // Mouse events
        this.canvas.addEventListener('mousedown', (e) => {
            this.handleMouseDown(e);
        });
        
        this.canvas.addEventListener('mousemove', (e) => {
            this.handleMouseMove(e);
        });
        
        this.canvas.addEventListener('mouseup', (e) => {
            this.handleMouseUp(e);
        });
        
        this.canvas.addEventListener('wheel', (e) => {
            this.handleWheel(e);
        });
        
        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
        
        // Touch events for mobile
        this.canvas.addEventListener('touchstart', (e) => {
            this.handleTouchStart(e);
        });
        
        this.canvas.addEventListener('touchmove', (e) => {
            this.handleTouchMove(e);
        });
        
        this.canvas.addEventListener('touchend', (e) => {
            this.handleTouchEnd(e);
        });
    }
    
    handleMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (e.button === 0) { // Left click
            if (e.shiftKey) {
                // Shift + click to pan
                this.isDragging = true;
                this.lastMouseX = x;
                this.lastMouseY = y;
                this.canvas.style.cursor = 'grabbing';
            } else {
                // Regular click to zoom in
                this.engine.zoomIn(x, y, 2);
                this.updateUI();
                this.generateFractal();
            }
        } else if (e.button === 2) { // Right click
            e.preventDefault();
            this.engine.zoomOut(x, y, 2);
            this.updateUI();
            this.generateFractal();
        }
    }
    
    handleMouseMove(e) {
        if (!this.isDragging) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const deltaX = x - this.lastMouseX;
        const deltaY = y - this.lastMouseY;
        
        this.engine.pan(deltaX, deltaY);
        this.lastMouseX = x;
        this.lastMouseY = y;
        
        this.updateUI();
        this.generateFractal();
    }
    
    handleMouseUp(e) {
        this.isDragging = false;
        this.canvas.style.cursor = 'crosshair';
    }
    
    handleWheel(e) {
        e.preventDefault();
        
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
        
        if (e.deltaY > 0) {
            this.engine.zoomOut(x, y, 1.1);
        } else {
            this.engine.zoomIn(x, y, 1.1);
        }
        
        this.updateUI();
        this.generateFractal();
    }
    
    handleTouchStart(e) {
        e.preventDefault();
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            const rect = this.canvas.getBoundingClientRect();
            this.lastMouseX = touch.clientX - rect.left;
            this.lastMouseY = touch.clientY - rect.top;
            this.isDragging = true;
        }
    }
    
    handleTouchMove(e) {
        e.preventDefault();
        if (e.touches.length === 1 && this.isDragging) {
            const touch = e.touches[0];
            const rect = this.canvas.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            
            const deltaX = x - this.lastMouseX;
            const deltaY = y - this.lastMouseY;
            
            this.engine.pan(deltaX, deltaY);
            this.lastMouseX = x;
            this.lastMouseY = y;
            
            this.updateUI();
            this.generateFractal();
        }
    }
    
    handleTouchEnd(e) {
        e.preventDefault();
        this.isDragging = false;
        
        if (e.changedTouches.length === 1) {
            const touch = e.changedTouches[0];
            const rect = this.canvas.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            
            // Double tap to zoom
            if (this.lastTapTime && Date.now() - this.lastTapTime < 300) {
                this.engine.zoomIn(x, y, 2);
                this.updateUI();
                this.generateFractal();
            }
            this.lastTapTime = Date.now();
        }
    }
    
    handleKeyboardShortcuts(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
        
        switch (e.key) {
            case 'r':
            case 'R':
                this.engine.resetView();
                this.updateUI();
                this.generateFractal();
                break;
            case 's':
            case 'S':
                this.saveImage();
                break;
            case 'a':
            case 'A':
                if (this.elements.fractalType.value === 'julia') {
                    this.toggleJuliaAnimation();
                }
                break;
            case '1':
                this.elements.fractalType.value = 'mandelbrot';
                this.showJuliaControls(false);
                this.generateFractal();
                break;
            case '2':
                this.elements.fractalType.value = 'julia';
                this.showJuliaControls(true);
                this.generateFractal();
                break;
            case '3':
                this.elements.fractalType.value = 'burning-ship';
                this.showJuliaControls(false);
                this.generateFractal();
                break;
            case '4':
                this.elements.fractalType.value = 'tricorn';
                this.showJuliaControls(false);
                this.generateFractal();
                break;
        }
    }
    
    handleResize() {
        // Implement responsive canvas resizing if needed
        this.updateUI();
    }
    
    async generateFractal() {
        if (this.isGenerating) return;
        
        this.isGenerating = true;
        this.showLoading(true);
        
        try {
            const fractalType = this.elements.fractalType.value;
            const colorScheme = this.elements.colorScheme.value;
            
            await this.engine.generateFractal(fractalType, colorScheme, (progress) => {
                // Update progress if needed
            });
            
            this.updateUI();
        } catch (error) {
            console.error('Error generating fractal:', error);
        } finally {
            this.isGenerating = false;
            this.showLoading(false);
        }
    }
    
    regenerateFractal() {
        // Called by animation loops
        if (!this.isGenerating) {
            this.generateFractal();
        }
    }
    
    showJuliaControls(show) {
        this.elements.juliaControls.style.display = show ? 'block' : 'none';
    }
    
    showLoading(show) {
        this.elements.loadingOverlay.style.display = show ? 'block' : 'none';
    }
    
    updateUI() {
        const info = this.engine.getViewInfo();
        const zoomText = `Zoom: ${info.zoom.toFixed(2)}x`;
        const centerText = `Center: (${info.centerX.toFixed(6)}, ${info.centerY.toFixed(6)})`;
        
        this.elements.zoomInfo.innerHTML = `<span>${zoomText}</span><span>${centerText}</span>`;
        
        // Update Julia parameter displays
        this.elements.juliaReal.value = this.engine.juliaReal;
        this.elements.juliaImg.value = this.engine.juliaImag;
    }
    
    saveImage() {
        try {
            const link = document.createElement('a');
            link.download = `fractal_${this.elements.fractalType.value}_${Date.now()}.png`;
            link.href = this.canvas.toDataURL();
            link.click();
        } catch (error) {
            console.error('Error saving image:', error);
            alert('Could not save image. Please try again.');
        }
    }
    
    toggleJuliaAnimation() {
        if (this.engine.isAnimating) {
            this.engine.stopJuliaAnimation();
            this.elements.animateJulia.textContent = 'Animate Julia';
            this.elements.animateJulia.classList.remove('pulse');
        } else {
            this.engine.startJuliaAnimation();
            this.elements.animateJulia.textContent = 'Stop Animation';
            this.elements.animateJulia.classList.add('pulse');
        }
    }
    
    // Utility methods
    showNotification(message, type = 'info') {
        // Create a simple notification system
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'error' ? '#ff6b6b' : '#4ecdc4'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FractalApp();
    
    // Add some helpful CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
});