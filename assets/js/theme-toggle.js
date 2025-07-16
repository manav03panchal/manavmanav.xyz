/**
 * Theme Toggle with Game of Life Integration
 * The toggle button serves as a spawn point for Game of Life patterns
 */

class ThemeToggle {
  constructor() {
    this.isDark =
      localStorage.getItem("theme") === "dark" ||
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    this.gameOfLife = null;
    this.button = null;

    this.init();
  }

  init() {
    this.createToggleButton();
    this.applyTheme();
    this.bindEvents();
    this.waitForGameOfLife();
  }

  createToggleButton() {
    this.button = document.createElement("button");
    this.button.className = "theme-toggle";
    this.button.textContent = this.isDark ? "LIGHT" : "DARK";
    this.button.setAttribute("aria-label", "Toggle theme");
    this.button.setAttribute("title", "Toggle theme (and spawn life!)");
    // Apply styles directly to ensure they override any CSS
    Object.assign(this.button.style, {
      position: "fixed",
      top: "15px",
      right: "15px",
      width: "44px",
      height: "44px",
      border: "1px solid",
      borderColor: "currentColor",
      background: "transparent",
      cursor: "pointer",
      zIndex: "1000",
      transition: "all 0.2s ease",
      fontFamily: "inherit",
      fontSize: "10px",
      textTransform: "uppercase",
      letterSpacing: "0.05em",
      color: "inherit",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0",
      padding: "0",
      outline: "none",
    });

    document.body.appendChild(this.button);
  }

  applyTheme() {
    if (this.isDark) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }

    // Update button text
    if (this.button) {
      this.button.textContent = this.isDark ? "LIGHT" : "DARK";
    }

    // Save preference
    localStorage.setItem("theme", this.isDark ? "dark" : "light");

    // Emit custom event for other components
    document.dispatchEvent(
      new CustomEvent("themeChanged", {
        detail: { isDark: this.isDark },
      }),
    );
  }

  toggle() {
    this.isDark = !this.isDark;
    this.applyTheme();
    this.spawnLifeAtToggle();
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

  spawnLifeAtToggle() {
    if (!this.gameOfLife || !this.button) return;

    const rect = this.button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Convert to grid coordinates
    const col = Math.floor(centerX / this.gameOfLife.cellSize);
    const row = Math.floor(centerY / this.gameOfLife.cellSize);

    // Create an explosion of life patterns around the toggle
    this.createLifeExplosion(row, col);

    // Brief visual feedback
    this.button.style.boxShadow = this.isDark
      ? "0 0 20px #ffff00"
      : "0 0 20px #000000";

    setTimeout(() => {
      this.button.style.boxShadow = "none";
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
    // Toggle button click
    this.button.addEventListener("click", (e) => {
      e.preventDefault();
      this.toggle();
    });

    // Keyboard shortcut
    document.addEventListener("keydown", (e) => {
      if (e.key === "t" || e.key === "T") {
        if (!e.ctrlKey && !e.metaKey && !e.altKey) {
          // Only if not typing in an input
          if (
            document.activeElement.tagName !== "INPUT" &&
            document.activeElement.tagName !== "TEXTAREA"
          ) {
            e.preventDefault();
            this.toggle();
          }
        }
      }
    });

    // System theme change detection
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => {
        if (!localStorage.getItem("theme")) {
          this.isDark = e.matches;
          this.applyTheme();
        }
      });

    // Button hover effects
    this.button.addEventListener("mouseenter", () => {
      Object.assign(this.button.style, {
        transform: "scale(1.05)",
        background: "currentColor",
        color: this.isDark ? "#0a0a0a" : "#ffffff",
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
        background: "transparent",
        color: "inherit",
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
  new ThemeToggle();
});

// Add CSS animation for chaos mode
const style = document.createElement("style");
style.textContent = `
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.2); }
  }
`;
document.head.appendChild(style);
