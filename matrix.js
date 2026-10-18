/* ============================================================
   FOYSAL TOOLS - MATRIX & CYBER BACKGROUND CANVAS ENGINE
   Author: Foysal Tools Admin System
   ============================================================ */

class MatrixBackground {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.animationId = null;
    this.enabled = true;
    this.characters = '01ABCDEFGHIJKLMNOPQRSTUVWXYZアイウエオカキクケコサシスセソタチツテト0123456789<>/$#&*+=';
    this.fontSize = 14;
    this.columns = 0;
    this.drops = [];

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.start();
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.columns = Math.floor(this.canvas.width / this.fontSize);
    this.drops = [];
    for (let i = 0; i < this.columns; i++) {
      this.drops[i] = Math.floor(Math.random() * -50);
    }
  }

  draw() {
    if (!this.enabled || !this.ctx) return;

    // Fade background gradually to create cyber trail
    this.ctx.fillStyle = 'rgba(6, 9, 19, 0.08)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    const style = getComputedStyle(document.body);
    const primaryColor = style.getPropertyValue('--primary').trim() || '#00f0ff';

    this.ctx.fillStyle = primaryColor;
    this.ctx.font = `${this.fontSize}px 'JetBrains Mono', monospace`;

    for (let i = 0; i < this.drops.length; i++) {
      const char = this.characters.charAt(Math.floor(Math.random() * this.characters.length));
      const x = i * this.fontSize;
      const y = this.drops[i] * this.fontSize;

      // Occasional bright head character
      if (Math.random() > 0.85) {
        this.ctx.fillStyle = '#ffffff';
      } else {
        this.ctx.fillStyle = primaryColor;
      }

      this.ctx.fillText(char, x, y);

      if (y > this.canvas.height && Math.random() > 0.975) {
        this.drops[i] = 0;
      }
      this.drops[i]++;
    }

    this.animationId = requestAnimationFrame(() => this.draw());
  }

  start() {
    if (!this.animationId && this.enabled) {
      this.draw();
    }
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  toggle(state) {
    this.enabled = state;
    if (this.enabled) {
      this.start();
    } else {
      this.stop();
    }
  }
}

// Global initialization
window.matrixBg = null;
document.addEventListener('DOMContentLoaded', () => {
  window.matrixBg = new MatrixBackground('bg-canvas');
});
