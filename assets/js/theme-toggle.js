/**
 * Life Spawner for Game of Life
 * A random positioned button that spawns life patterns when clicked
 */

class LifeSpawner {
  constructor() {
    this.gameOfLife = null;
    this.button = null;
    this.cellSize = 8; // Match the Game of Life cell size

    this.init();
  }

  init() {
    this.createSpawnButton();
    this.bindEvents();
    this.waitForGameOfLife();
  }

  createSpawnButton() {
    this.button = document.createElement("button");
    this.button.className = "life-spawner";
    this.button.setAttribute("aria-label", "Spawn life");
    this.button.setAttribute("title", "Click to spawn life!");

    // Random position on the screen
    const randomX = Math.random() * (window.innerWidth - this.cellSize);
    const randomY = Math.random() * (window.innerHeight - this.cellSize);

    // Apply styles directly to ensure they override any CSS
    Object.assign(this.button.style, {
      position: "fixed",
      top: `${randomY}px`,
      left: `${randomX}px`,
      width: `${this.cellSize}px`,
      height: `${this.cellSize}px`,
      border: "none",
      background: "#333333",
      cursor: "pointer",
      zIndex: "1000",
      transition: "all 0.2s ease",
      margin: "0",
      padding: "0",
      outline: "none",
      opacity: "0.8",
    });

    document.body.appendChild(this.button);
  }

  spawnLife() {
    this.spawnLifeAtButton();
  }

  waitForGameOfLife() {
    // Wait for Game of Life to be initialized
    const checkGameOfLife = () => {
      if (window.gameOfLifeInstance) {
        this.gameOfLife = window.gameOfLifeInstance;
      } else {
        setTimeout(checkGameOfLife, 100);
      }
    };
    checkGameOfLife();
  }

  spawnLifeAtButton() {
    if (!this.gameOfLife || !this.button) return;

    const rect = this.button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Convert to grid coordinates
    const col = Math.floor(centerX / this.gameOfLife.cellSize);
    const row = Math.floor(centerY / this.gameOfLife.cellSize);

    // Create an explosion of life patterns around the button
    this.createLifeExplosion(row, col);

    // Brief visual feedback
    this.button.style.boxShadow = "0 0 20px #bb88ff";
    this.button.style.background = "#bb88ff";

    setTimeout(() => {
      this.button.style.boxShadow = "none";
      this.button.style.background = "#333333";
    }, 300);
  }

  createLifeExplosion(centerRow, centerCol) {
    if (!this.gameOfLife) return;

    // Create multiple patterns radiating outward
    const patterns = [
      // Gliders in four directions
      { type: "glider", offset: [-8, -8] },
      { type: "glider", offset: [8, 8] },
      { type: "glider", offset: [-8, 8] },
      { type: "glider", offset: [8, -8] },

      // Some oscillators
      { type: "blinker", offset: [0, -12] },
      { type: "blinker", offset: [0, 12] },
      { type: "blinker", offset: [-12, 0] },
      { type: "blinker", offset: [12, 0] },

      // Pulsars for dramatic effect
      { type: "pulsar", offset: [0, 0] },
    ];

    patterns.forEach((pattern) => {
      const row = centerRow + pattern.offset[0];
      const col = centerCol + pattern.offset[1];

      switch (pattern.type) {
        case "glider":
          this.gameOfLife.addGliderAt(row, col);
          break;
        case "blinker":
          this.addBlinkerAt(row, col);
          break;
        case "pulsar":
          this.addPulsarAt(row, col);
          break;
      }
    });
  }

  addBlinkerAt(row, col) {
    if (!this.gameOfLife) return;

    // Vertical blinker
    this.gameOfLife.setCell(row - 1, col, 1);
    this.gameOfLife.setCell(row, col, 1);
    this.gameOfLife.setCell(row + 1, col, 1);
  }

  addPulsarAt(centerRow, centerCol) {
    if (!this.gameOfLife) return;

    // Simplified pulsar pattern
    const pattern = [
      [-6, -4],
      [-6, -3],
      [-6, -2],
      [-6, 2],
      [-6, 3],
      [-6, 4],
      [-4, -6],
      [-4, -1],
      [-4, 1],
      [-4, 6],
      [-3, -6],
      [-3, -1],
      [-3, 1],
      [-3, 6],
      [-2, -6],
      [-2, -1],
      [-2, 1],
      [-2, 6],
      [-1, -4],
      [-1, -3],
      [-1, -2],
      [-1, 2],
      [-1, 3],
      [-1, 4],
      [1, -4],
      [1, -3],
      [1, -2],
      [1, 2],
      [1, 3],
      [1, 4],
      [2, -6],
      [2, -1],
      [2, 1],
      [2, 6],
      [3, -6],
      [3, -1],
      [3, 1],
      [3, 6],
      [4, -6],
      [4, -1],
      [4, 1],
      [4, 6],
      [6, -4],
      [6, -3],
      [6, -2],
      [6, 2],
      [6, 3],
      [6, 4],
    ];

    pattern.forEach(([dRow, dCol]) => {
      this.gameOfLife.setCell(centerRow + dRow, centerCol + dCol, 1);
    });
  }

  bindEvents() {
    // Spawn button click
    this.button.addEventListener("click", (e) => {
      e.preventDefault();
      this.spawnLife();
    });

    // Button hover effects
    this.button.addEventListener("mouseenter", () => {
      Object.assign(this.button.style, {
        transform: "scale(1.2)",
        background: "#443355",
        opacity: "1.0",
      });

      // Subtle life spawn on hover
      if (this.gameOfLife && Math.random() > 0.7) {
        const rect = this.button.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const col = Math.floor(centerX / this.gameOfLife.cellSize);
        const row = Math.floor(centerY / this.gameOfLife.cellSize);

        // Add a small random pattern
        for (let i = -2; i <= 2; i++) {
          for (let j = -2; j <= 2; j++) {
            if (Math.random() > 0.8) {
              this.gameOfLife.setCell(row + i, col + j, 1);
            }
          }
        }
      }
    });

    this.button.addEventListener("mouseleave", () => {
      Object.assign(this.button.style, {
        transform: "scale(1)",
        background: "#333333",
        opacity: "0.8",
      });
    });

    // Double-click for chaos mode
    let clickTimeout;
    let clickCount = 0;

    this.button.addEventListener("click", () => {
      clickCount++;

      if (clickCount === 1) {
        clickTimeout = setTimeout(() => {
          clickCount = 0;
        }, 300);
      } else if (clickCount === 2) {
        clearTimeout(clickTimeout);
        clickCount = 0;
        this.chaosMode();
      }
    });

    // Reposition button on window resize
    window.addEventListener("resize", () => {
      const randomX = Math.random() * (window.innerWidth - this.cellSize);
      const randomY = Math.random() * (window.innerHeight - this.cellSize);
      this.button.style.left = `${randomX}px`;
      this.button.style.top = `${randomY}px`;
    });
  }

  chaosMode() {
    if (!this.gameOfLife) return;

    // Create chaos across the entire screen
    for (let i = 0; i < 20; i++) {
      const row = Math.floor(Math.random() * this.gameOfLife.rows);
      const col = Math.floor(Math.random() * this.gameOfLife.cols);

      if (Math.random() > 0.5) {
        this.gameOfLife.addGliderAt(row, col);
      } else {
        this.addBlinkerAt(row, col);
      }
    }

    // Visual feedback
    this.button.style.animation = "pulse 0.5s ease-in-out";
    setTimeout(() => {
      this.button.style.animation = "";
    }, 500);
  }
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  new LifeSpawner();
});

// Add CSS animation for chaos mode
const style = document.createElement("style");
style.textContent = `
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.5); }
  }
`;
document.head.appendChild(style);
