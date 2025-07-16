/**
 * Conway's Game of Life Background Animation
 * Minimal, aesthetic implementation for static sites
 */

class GameOfLife {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.grid = [];
    this.nextGrid = [];
    this.cellSize = 8;
    this.cols = 0;
    this.rows = 0;
    this.animationId = null;
    this.lastUpdate = 0;
    this.updateInterval = 150; // milliseconds
    this.opacity = 0.08; // More visible purple
    this.generation = 0;
    this.cellColor = "#2a1a3a";
    this.borderColor = "#bb88ff";
    this.maxGenerations = 500; // Reset after this many generations
    this.isRunning = true;
    this.performanceMode = false;

    this.init();

    // Expose instance globally for theme toggle
    window.gameOfLifeInstance = this;
  }

  init() {
    this.createCanvas();
    this.updateTheme();
    this.setupGrid();
    this.seedGrid();
    this.bindEvents();
    this.animate();
  }

  createCanvas() {
    this.canvas = document.createElement("canvas");
    this.canvas.id = "game-of-life";
    this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
            opacity: ${this.opacity};
            mix-blend-mode: normal;
        `;

    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext("2d");
    this.resize();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.cols = Math.floor(this.canvas.width / this.cellSize);
    this.rows = Math.floor(this.canvas.height / this.cellSize);

    this.setupGrid();
    this.seedGrid();
  }

  setupGrid() {
    this.grid = [];
    this.nextGrid = [];

    for (let i = 0; i < this.rows; i++) {
      this.grid[i] = [];
      this.nextGrid[i] = [];
      for (let j = 0; j < this.cols; j++) {
        this.grid[i][j] = 0;
        this.nextGrid[i][j] = 0;
      }
    }
  }

  seedGrid() {
    // Create interesting patterns
    this.clearGrid();

    // Add some gliders
    this.addGliders();

    // Add some oscillators
    this.addOscillators();

    // Add some random noise
    this.addRandomNoise();

    this.generation = 0;
  }

  clearGrid() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.grid[i][j] = 0;
      }
    }
  }

  addGliders() {
    const numGliders = Math.floor((this.cols * this.rows) / 5000);

    for (let g = 0; g < numGliders; g++) {
      const startRow = Math.floor(Math.random() * (this.rows - 5));
      const startCol = Math.floor(Math.random() * (this.cols - 5));

      // Classic glider pattern
      this.setCell(startRow + 1, startCol, 1);
      this.setCell(startRow + 2, startCol + 1, 1);
      this.setCell(startRow, startCol + 2, 1);
      this.setCell(startRow + 1, startCol + 2, 1);
      this.setCell(startRow + 2, startCol + 2, 1);
    }
  }

  addOscillators() {
    const numOscillators = Math.floor((this.cols * this.rows) / 8000);

    for (let o = 0; o < numOscillators; o++) {
      const startRow = Math.floor(Math.random() * (this.rows - 3));
      const startCol = Math.floor(Math.random() * (this.cols - 3));

      // Blinker pattern
      if (Math.random() > 0.5) {
        this.setCell(startRow, startCol, 1);
        this.setCell(startRow, startCol + 1, 1);
        this.setCell(startRow, startCol + 2, 1);
      } else {
        this.setCell(startRow, startCol, 1);
        this.setCell(startRow + 1, startCol, 1);
        this.setCell(startRow + 2, startCol, 1);
      }
    }
  }

  addRandomNoise() {
    const density = 0.002; // Very sparse

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (Math.random() < density) {
          this.grid[i][j] = 1;
        }
      }
    }
  }

  // Performance optimization: only update visible cells
  getVisibleBounds() {
    return {
      startRow: Math.max(0, Math.floor(window.scrollY / this.cellSize) - 10),
      endRow: Math.min(
        this.rows,
        Math.ceil((window.scrollY + window.innerHeight) / this.cellSize) + 10,
      ),
      startCol: 0,
      endCol: this.cols,
    };
  }

  setCell(row, col, value) {
    if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
      this.grid[row][col] = value;
    }
  }

  addGliderAt(row, col) {
    // Add glider pattern at specific location
    this.setCell(row + 1, col, 1);
    this.setCell(row + 2, col + 1, 1);
    this.setCell(row, col + 2, 1);
    this.setCell(row + 1, col + 2, 1);
    this.setCell(row + 2, col + 2, 1);
  }

  countNeighbors(row, col) {
    let count = 0;

    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;

        const newRow = row + i;
        const newCol = col + j;

        if (
          newRow >= 0 &&
          newRow < this.rows &&
          newCol >= 0 &&
          newCol < this.cols
        ) {
          count += this.grid[newRow][newCol];
        }
      }
    }

    return count;
  }

  updateGrid() {
    if (!this.isRunning) return;

    const bounds = this.performanceMode
      ? this.getVisibleBounds()
      : {
          startRow: 0,
          endRow: this.rows,
          startCol: 0,
          endCol: this.cols,
        };

    // Calculate next generation
    for (let i = bounds.startRow; i < bounds.endRow; i++) {
      for (let j = bounds.startCol; j < bounds.endCol; j++) {
        const neighbors = this.countNeighbors(i, j);
        const current = this.grid[i][j];

        // Conway's Game of Life rules
        if (current === 1) {
          // Live cell
          if (neighbors < 2 || neighbors > 3) {
            this.nextGrid[i][j] = 0; // Dies
          } else {
            this.nextGrid[i][j] = 1; // Survives
          }
        } else {
          // Dead cell
          if (neighbors === 3) {
            this.nextGrid[i][j] = 1; // Becomes alive
          } else {
            this.nextGrid[i][j] = 0; // Stays dead
          }
        }
      }
    }

    // Swap grids
    [this.grid, this.nextGrid] = [this.nextGrid, this.grid];
    this.generation++;

    // Reset if too many generations or if grid becomes static
    if (this.generation > this.maxGenerations || this.isGridEmpty()) {
      this.seedGrid();
    }
  }

  isGridEmpty() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (this.grid[i][j] === 1) return false;
      }
    }
    return true;
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const bounds = this.performanceMode
      ? this.getVisibleBounds()
      : {
          startRow: 0,
          endRow: this.rows,
          startCol: 0,
          endCol: this.cols,
        };

    // Only draw visible cells for performance
    for (let i = bounds.startRow; i < bounds.endRow; i++) {
      for (let j = bounds.startCol; j < bounds.endCol; j++) {
        if (this.grid[i][j] === 1) {
          const x = j * this.cellSize;
          const y = i * this.cellSize;
          const size = this.cellSize - 1;

          // Draw darker cell fill
          this.ctx.fillStyle = "#2a1a3a";
          this.ctx.fillRect(x, y, size, size);

          // Draw purple border
          this.ctx.strokeStyle = this.borderColor;
          this.ctx.lineWidth = 0.8;
          this.ctx.globalAlpha = 0.8;
          this.ctx.strokeRect(x, y, size, size);
          this.ctx.globalAlpha = 1.0;
        }
      }
    }
  }

  animate(timestamp = 0) {
    if (timestamp - this.lastUpdate >= this.updateInterval) {
      this.updateGrid();
      this.draw();
      this.lastUpdate = timestamp;
    }

    this.animationId = requestAnimationFrame((ts) => this.animate(ts));
  }

  updateTheme() {
    this.cellColor = "#2a1a3a";
    this.borderColor = "#bb88ff";
    this.canvas.style.opacity = "0.12";
  }

  bindEvents() {
    window.addEventListener("resize", () => {
      this.resize();
    });

    // Pause/resume on visibility change
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        if (this.animationId) {
          cancelAnimationFrame(this.animationId);
          this.animationId = null;
        }
      } else {
        if (!this.animationId) {
          this.animate();
        }
      }
    });
  }

  bindEvents() {
    window.addEventListener("resize", () => {
      this.resize();
    });

    // Pause/resume on visibility change
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        if (this.animationId) {
          cancelAnimationFrame(this.animationId);
          this.animationId = null;
        }
      } else {
        if (!this.animationId) {
          this.animate();
        }
      }
    });

    // Performance monitoring
    let frameCount = 0;
    setInterval(() => {
      if (frameCount < 30) {
        this.performanceMode = true;
        this.updateInterval = 200;
      } else {
        this.performanceMode = false;
        this.updateInterval = 150;
      }
      frameCount = 0;
    }, 1000);

    // Hover interactions
    let hoverTimeout;
    document.addEventListener("mousemove", (e) => {
      clearTimeout(hoverTimeout);
      this.canvas.style.opacity = "0.10";

      hoverTimeout = setTimeout(() => {
        this.canvas.style.opacity = "0.12";
      }, 1000);
    });

    // Scroll interactions
    let scrollTimeout;
    window.addEventListener("scroll", () => {
      clearTimeout(scrollTimeout);
      this.canvas.style.opacity = "0.06";

      scrollTimeout = setTimeout(() => {
        this.canvas.style.opacity = "0.12";
      }, 500);
    });

    // Add some interactivity - click to add life
    document.addEventListener("click", (e) => {
      // Only add life if clicking on empty space
      if (
        e.target === document.body ||
        e.target.classList.contains("wrapper")
      ) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const col = Math.floor(x / this.cellSize);
        const row = Math.floor(y / this.cellSize);

        // Add a glider pattern at click location
        this.addGliderAt(row, col);
      }
    });

    // Keyboard controls
    document.addEventListener("keydown", (e) => {
      switch (e.key) {
        case " ":
          e.preventDefault();
          this.isRunning = !this.isRunning;
          break;
        case "r":
        case "R":
          this.seedGrid();
          break;
        case "c":
        case "C":
          this.clearGrid();
          break;
      }
    });
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  // Only initialize if reduced motion is not preferred
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    new GameOfLife();
  }
});

// Export for potential external use
window.GameOfLife = GameOfLife;
