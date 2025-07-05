/**
 * Fractal Engine - High-performance fractal computation
 * Supports multiple fractal types with various color schemes
 */

class FractalEngine {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        this.imageData = this.ctx.createImageData(this.width, this.height);
        this.data = this.imageData.data;
        
        // Default view parameters
        this.centerX = -0.5;
        this.centerY = 0;
        this.zoom = 1;
        this.maxIterations = 100;
        
        // Julia set parameters
        this.juliaReal = -0.7;
        this.juliaImag = 0.27015;
        
        // Animation parameters
        this.animationId = null;
        this.isAnimating = false;
    }
    
    /**
     * Calculate the bounds of the current view
     */
    getBounds() {
        const aspectRatio = this.width / this.height;
        const range = 3 / this.zoom;
        
        return {
            xMin: this.centerX - range * aspectRatio / 2,
            xMax: this.centerX + range * aspectRatio / 2,
            yMin: this.centerY - range / 2,
            yMax: this.centerY + range / 2
        };
    }
    
    /**
     * Convert screen coordinates to complex plane coordinates
     */
    screenToComplex(x, y) {
        const bounds = this.getBounds();
        const real = bounds.xMin + (x / this.width) * (bounds.xMax - bounds.xMin);
        const imag = bounds.yMin + (y / this.height) * (bounds.yMax - bounds.yMin);
        return { real, imag };
    }
    
    /**
     * Mandelbrot set calculation
     */
    mandelbrot(x, y) {
        const complex = this.screenToComplex(x, y);
        let zReal = 0;
        let zImag = 0;
        let iterations = 0;
        
        while (iterations < this.maxIterations && zReal * zReal + zImag * zImag < 4) {
            const tempReal = zReal * zReal - zImag * zImag + complex.real;
            zImag = 2 * zReal * zImag + complex.imag;
            zReal = tempReal;
            iterations++;
        }
        
        // Smooth coloring
        if (iterations < this.maxIterations) {
            const log_zn = Math.log(zReal * zReal + zImag * zImag) / 2;
            const nu = Math.log(log_zn / Math.log(2)) / Math.log(2);
            iterations = iterations + 1 - nu;
        }
        
        return iterations;
    }
    
    /**
     * Julia set calculation
     */
    julia(x, y) {
        const complex = this.screenToComplex(x, y);
        let zReal = complex.real;
        let zImag = complex.imag;
        let iterations = 0;
        
        while (iterations < this.maxIterations && zReal * zReal + zImag * zImag < 4) {
            const tempReal = zReal * zReal - zImag * zImag + this.juliaReal;
            zImag = 2 * zReal * zImag + this.juliaImag;
            zReal = tempReal;
            iterations++;
        }
        
        // Smooth coloring
        if (iterations < this.maxIterations) {
            const log_zn = Math.log(zReal * zReal + zImag * zImag) / 2;
            const nu = Math.log(log_zn / Math.log(2)) / Math.log(2);
            iterations = iterations + 1 - nu;
        }
        
        return iterations;
    }
    
    /**
     * Burning Ship fractal calculation
     */
    burningShip(x, y) {
        const complex = this.screenToComplex(x, y);
        let zReal = 0;
        let zImag = 0;
        let iterations = 0;
        
        while (iterations < this.maxIterations && zReal * zReal + zImag * zImag < 4) {
            const tempReal = zReal * zReal - zImag * zImag + complex.real;
            zImag = 2 * Math.abs(zReal * zImag) + complex.imag;
            zReal = tempReal;
            iterations++;
        }
        
        // Smooth coloring
        if (iterations < this.maxIterations) {
            const log_zn = Math.log(zReal * zReal + zImag * zImag) / 2;
            const nu = Math.log(log_zn / Math.log(2)) / Math.log(2);
            iterations = iterations + 1 - nu;
        }
        
        return iterations;
    }
    
    /**
     * Tricorn fractal calculation
     */
    tricorn(x, y) {
        const complex = this.screenToComplex(x, y);
        let zReal = 0;
        let zImag = 0;
        let iterations = 0;
        
        while (iterations < this.maxIterations && zReal * zReal + zImag * zImag < 4) {
            const tempReal = zReal * zReal - zImag * zImag + complex.real;
            zImag = -2 * zReal * zImag + complex.imag;
            zReal = tempReal;
            iterations++;
        }
        
        // Smooth coloring
        if (iterations < this.maxIterations) {
            const log_zn = Math.log(zReal * zReal + zImag * zImag) / 2;
            const nu = Math.log(log_zn / Math.log(2)) / Math.log(2);
            iterations = iterations + 1 - nu;
        }
        
        return iterations;
    }
    
    /**
     * Color schemes for fractal visualization
     */
    getColorSchemes() {
        return {
            hot: (t) => {
                const r = Math.min(255, Math.floor(255 * Math.min(1, t * 3)));
                const g = Math.min(255, Math.floor(255 * Math.max(0, Math.min(1, t * 3 - 1))));
                const b = Math.min(255, Math.floor(255 * Math.max(0, Math.min(1, t * 3 - 2))));
                return [r, g, b];
            },
            
            cool: (t) => {
                const r = Math.floor(255 * t);
                const g = Math.floor(255 * (1 - t));
                const b = 255;
                return [r, g, b];
            },
            
            rainbow: (t) => {
                const frequency = 6.28318; // 2 * PI
                const r = Math.floor(255 * (Math.sin(frequency * t + 0) * 127 + 128) / 255);
                const g = Math.floor(255 * (Math.sin(frequency * t + 2.094) * 127 + 128) / 255);
                const b = Math.floor(255 * (Math.sin(frequency * t + 4.188) * 127 + 128) / 255);
                return [r, g, b];
            },
            
            monochrome: (t) => {
                const intensity = Math.floor(255 * t);
                return [intensity, intensity, intensity];
            },
            
            electric: (t) => {
                const r = Math.floor(255 * Math.pow(t, 0.5));
                const g = Math.floor(255 * Math.pow(t, 2));
                const b = Math.floor(255 * Math.pow(Math.sin(t * Math.PI), 2));
                return [r, g, b];
            }
        };
    }
    
    /**
     * Generate fractal with specified type and color scheme
     */
    generateFractal(type = 'mandelbrot', colorScheme = 'hot', onProgress = null) {
        const fractalFunctions = {
            mandelbrot: this.mandelbrot.bind(this),
            julia: this.julia.bind(this),
            'burning-ship': this.burningShip.bind(this),
            tricorn: this.tricorn.bind(this)
        };
        
        const fractalFunction = fractalFunctions[type];
        const colorFunction = this.getColorSchemes()[colorScheme];
        
        if (!fractalFunction) {
            throw new Error(`Unknown fractal type: ${type}`);
        }
        
        // Use Web Worker for heavy computation in real implementation
        // For now, we'll use a simple progressive rendering approach
        return new Promise((resolve) => {
            let y = 0;
            const renderBatch = () => {
                const batchSize = 4; // Process 4 rows at a time
                const startY = y;
                const endY = Math.min(y + batchSize, this.height);
                
                for (let row = startY; row < endY; row++) {
                    for (let x = 0; x < this.width; x++) {
                        const iterations = fractalFunction(x, row);
                        const t = iterations / this.maxIterations;
                        
                        let color;
                        if (iterations >= this.maxIterations) {
                            color = [0, 0, 0]; // Black for points in the set
                        } else {
                            color = colorFunction(t);
                        }
                        
                        const pixelIndex = (row * this.width + x) * 4;
                        this.data[pixelIndex] = color[0];     // R
                        this.data[pixelIndex + 1] = color[1]; // G
                        this.data[pixelIndex + 2] = color[2]; // B
                        this.data[pixelIndex + 3] = 255;      // A
                    }
                }
                
                // Update progress
                if (onProgress) {
                    onProgress(endY / this.height);
                }
                
                // Continue rendering or finish
                y = endY;
                if (y < this.height) {
                    requestAnimationFrame(renderBatch);
                } else {
                    this.ctx.putImageData(this.imageData, 0, 0);
                    resolve();
                }
            };
            
            renderBatch();
        });
    }
    
    /**
     * Zoom into a specific point
     */
    zoomIn(x, y, factor = 2) {
        const complex = this.screenToComplex(x, y);
        this.centerX = complex.real;
        this.centerY = complex.imag;
        this.zoom *= factor;
    }
    
    /**
     * Zoom out from a specific point
     */
    zoomOut(x, y, factor = 2) {
        const complex = this.screenToComplex(x, y);
        this.centerX = complex.real;
        this.centerY = complex.imag;
        this.zoom /= factor;
    }
    
    /**
     * Pan the view by screen coordinates
     */
    pan(deltaX, deltaY) {
        const bounds = this.getBounds();
        const realDelta = (deltaX / this.width) * (bounds.xMax - bounds.xMin);
        const imagDelta = (deltaY / this.height) * (bounds.yMax - bounds.yMin);
        
        this.centerX -= realDelta;
        this.centerY -= imagDelta;
    }
    
    /**
     * Reset to default view
     */
    resetView() {
        this.centerX = -0.5;
        this.centerY = 0;
        this.zoom = 1;
    }
    
    /**
     * Set Julia set parameters
     */
    setJuliaParams(real, imag) {
        this.juliaReal = real;
        this.juliaImag = imag;
    }
    
    /**
     * Start Julia set animation
     */
    startJuliaAnimation() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        let angle = 0;
        const radius = 0.7885;
        
        const animate = () => {
            if (!this.isAnimating) return;
            
            this.juliaReal = radius * Math.cos(angle);
            this.juliaImag = radius * Math.sin(angle);
            
            angle += 0.02;
            
            // Trigger regeneration (this will be handled by the main app)
            if (window.fractalApp) {
                window.fractalApp.regenerateFractal();
            }
            
            this.animationId = requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    /**
     * Stop Julia set animation
     */
    stopJuliaAnimation() {
        this.isAnimating = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    /**
     * Get current view information
     */
    getViewInfo() {
        return {
            centerX: this.centerX,
            centerY: this.centerY,
            zoom: this.zoom,
            maxIterations: this.maxIterations
        };
    }
}

// Export for use in other files
window.FractalEngine = FractalEngine;