// Efecto de escritura en el input
const input = document.querySelector(".search-input");
const placeholders = [
  "Pregunta lo que quieras",
  "Explícame la relatividad",
  "Escribe un poema",
  "¿Cómo funciona la IA?",
  "Ayúdame con mi código",
];
let currentIndex = 0;

function rotatePlaceholder() {
  input.placeholder = placeholders[currentIndex];
  currentIndex = (currentIndex + 1) % placeholders.length;
}

setInterval(rotatePlaceholder, 3000);

// Configuración de temas
const themes = {
  purple: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
  ocean: "linear-gradient(135deg, #2E8B57 0%, #20B2AA 50%, #00CED1 100%)",
  sunset: "linear-gradient(135deg, #ff7e5f 0%, #feb47b 50%, #ff6b6b 100%)",
  forest: "linear-gradient(135deg, #134e5e 0%, #71b280 50%, #a8e6cf 100%)",
  cosmic: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
  aurora: "linear-gradient(135deg, #00d2ff 0%, #3a7bd5 50%, #00d2ff 100%)",
  teal: "linear-gradient(135deg, #2d5a5a 0%, #4a7c7c 50%, #7dd3d3 100%)",
  white: "linear-gradient(135deg, #ffffff 0%, #f0f0f0 50%, #dcdcdc 100%)",
  black: "linear-gradient(135deg, #000000 0%, #2c2c2c 50%, #4d4d4d 100%)",
};

// Funciones del sidebar expandido
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const sidebarExpanded = document.getElementById("sidebarExpanded");
  const themeSelector = document.getElementById("themeSelector");

  sidebar.classList.add("collapsed");
  sidebarExpanded.classList.add("active");
  // Ocultar selector de temas al abrir sidebar
  themeSelector.style.display = "none";
}

function closeSidebar() {
  const sidebar = document.getElementById("sidebar");
  const sidebarExpanded = document.getElementById("sidebarExpanded");
  const themeSelector = document.getElementById("themeSelector");

  sidebarExpanded.classList.remove("active");
  themeSelector.style.display = "none";
  setTimeout(() => {
    sidebar.classList.remove("collapsed");
  }, 200);
}

function showThemeSelector() {
  const themeSelector = document.getElementById("themeSelector");
  const isVisible = themeSelector.style.display === "block";

  if (isVisible) {
    themeSelector.style.display = "none";
  } else {
    themeSelector.style.display = "block";
    // Pequeña animación de aparición
    themeSelector.style.opacity = "0";
    setTimeout(() => {
      themeSelector.style.opacity = "1";
    }, 50);
  }
}

function changeTheme(themeName) {
  // Cambiar el fondo del body
  document.body.style.background = themes[themeName];

  // Actualizar tema activo en ambos selectores
  document.querySelectorAll(".theme-option").forEach((option) => {
    option.classList.remove("active");
  });

  // Marcar como activo en el selector del sidebar
  const sidebarThemeOption = document.querySelector(
    `#themeSelector [onclick="changeTheme('${themeName}')"]`
  );
  if (sidebarThemeOption) {
    sidebarThemeOption.classList.add("active");
  }

  // Guardar tema en localStorage
  localStorage.setItem("selectedTheme", themeName);
}

// Cargar tema guardado al inicio
function loadSavedTheme() {
  const savedTheme = localStorage.getItem("selectedTheme");
  if (savedTheme && themes[savedTheme]) {
    document.body.style.background = themes[savedTheme];

    // Marcar tema como activo en el selector del sidebar
    document.querySelectorAll(".theme-option").forEach((option) => {
      option.classList.remove("active");
    });
    const savedThemeOption = document.querySelector(
      `#themeSelector [onclick="changeTheme('${savedTheme}')"]`
    );
    if (savedThemeOption) {
      savedThemeOption.classList.add("active");
    }
  }
}

// Cerrar paneles al hacer clic fuera
document.addEventListener("click", (event) => {
  const sidebarExpanded = document.getElementById("sidebarExpanded");
  const sidebar = document.getElementById("sidebar");

  // Cerrar sidebar expandido
  if (
    !sidebarExpanded.contains(event.target) &&
    !sidebar.contains(event.target)
  ) {
    if (sidebarExpanded.classList.contains("active")) {
      closeSidebar();
    }
  }
});

// Cargar tema al cargar la página
window.addEventListener("load", loadSavedTheme);

// Efecto de focus en el input
input.addEventListener("focus", () => {
  input.parentElement.style.transform = "scale(1.02)";
});

input.addEventListener("blur", () => {
  input.parentElement.style.transform = "scale(1)";
});

// Animación de partículas
function createParticle() {
  const particle = document.createElement("div");
  particle.style.position = "absolute";
  particle.style.width = Math.random() * 3 + 2 + "px";
  particle.style.height = particle.style.width;
  particle.style.background = `rgba(255, 255, 255, ${
    Math.random() * 0.6 + 0.2
  })`;
  particle.style.borderRadius = "50%";
  particle.style.left = Math.random() * 100 + "%";
  particle.style.top = "100%";
  particle.style.pointerEvents = "none";
  particle.style.boxShadow = "0 0 10px rgba(255, 255, 255, 0.5)";

  document.querySelector(".floating-elements").appendChild(particle);

  const duration = Math.random() * 4000 + 3000;
  const drift = (Math.random() - 0.5) * 100;

  particle.animate(
    [
      {
        transform: "translateY(0) translateX(0) scale(0)",
        opacity: 0,
      },
      {
        transform: `translateY(-20vh) translateX(${drift * 0.3}px) scale(1)`,
        opacity: 1,
        offset: 0.1,
      },
      {
        transform: `translateY(-100vh) translateX(${drift}px) scale(0.5)`,
        opacity: 0,
      },
    ],
    {
      duration: duration,
      easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    }
  ).onfinish = () => particle.remove();
}

setInterval(createParticle, 400);

function createSparkle() {
  const sparkle = document.createElement("div");
  sparkle.className = "sparkle";
  sparkle.style.left = Math.random() * 100 + "%";
  sparkle.style.top = Math.random() * 100 + "%";

  document.querySelector(".floating-elements").appendChild(sparkle);

  setTimeout(() => sparkle.remove(), 3000);
}

// Create sparkles periodically
setInterval(createSparkle, 800);

// Settings Panel functionality
function openSettingsModal() {
  console.log("openSettingsModal called");
  const modal = document.getElementById("settingsModal");
  console.log("Modal element:", modal);

  if (modal) {
    modal.style.display = "block";
    modal.classList.add("active");
    document.body.style.overflow = "hidden";

    // Show the personalization tab by default
    openTab(null, "personalization");
    console.log("Settings modal opened successfully");
  } else {
    console.error("Settings modal element not found");
  }
}

function closeSettingsModal() {
  const modal = document.getElementById("settingsModal");
  modal.classList.remove("active");
  document.body.style.overflow = "auto";

  setTimeout(() => {
    modal.style.display = "none";
  }, 300);
}

function openTab(event, tabName) {
  // Hide all tab contents
  const tabContents = document.getElementsByClassName("settings-tab-content");
  for (let i = 0; i < tabContents.length; i++) {
    tabContents[i].classList.remove("active");
  }

  // Remove active class from all nav items
  const navItems = document.getElementsByClassName("settings-nav-item");
  for (let i = 0; i < navItems.length; i++) {
    navItems[i].classList.remove("active");
  }

  // Show the specific tab content
  const tabContent = document.getElementById(tabName);
  if (tabContent) {
    tabContent.classList.add("active");
  }

  // Add active class to clicked nav item
  if (event && event.currentTarget) {
    event.currentTarget.classList.add("active");
  } else {
    // For default tab opening
    const defaultNavItem = document.querySelector(
      `[onclick="openTab(event, '${tabName}')"]`
    );
    if (defaultNavItem) {
      defaultNavItem.classList.add("active");
    }
  }
}

const configButton = document.querySelector(".config-button");

// Close settings panel when clicking outside, but ignore clicks on config button or modal itself
document.addEventListener("click", (event) => {
  const modal = document.getElementById("settingsModal");
  const panel = document.querySelector(".settings-panel");

  if (
    modal &&
    modal.style.display === "block" &&
    panel &&
    !panel.contains(event.target) &&
    event.target !== configButton &&
    !configButton.contains(event.target)
  ) {
    closeSettingsModal();
  }
});

// Prevent click on config button from bubbling up and triggering document click listener
if (configButton) {
  configButton.addEventListener("click", (event) => {
    event.stopPropagation();
  });
}

// Close settings panel on Escape key
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    const modal = document.getElementById("settingsModal");
    if (modal && modal.style.display === "block") {
      closeSettingsModal();
    }
  }
});

// Matrix Rain functionality
let matrixRainActive = false;
let matrixAnimationId = null;

function toggleMatrixRain() {
  const canvas = document.getElementById("matrixCanvas");
  const mainContent = document.querySelector(".main-content");

  if (!matrixRainActive) {
    canvas.style.display = "block";
    canvas.classList.add("active");
    mainContent.style.opacity = "0.1";
    startMatrixRain();
    matrixRainActive = true;
  } else {
    canvas.style.display = "none";
    canvas.classList.remove("active");
    mainContent.style.opacity = "1";
    stopMatrixRain();
    matrixRainActive = false;
  }
  closeSidebar();
}

function startMatrixRain() {
  const canvas = document.getElementById("matrixCanvas");
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const japaneseChars = [
    "ア",
    "イ",
    "ウ",
    "エ",
    "オ",
    "カ",
    "キ",
    "ク",
    "ケ",
    "コ",
    "サ",
    "シ",
    "ス",
    "セ",
    "ソ",
    "タ",
    "チ",
    "ツ",
    "テ",
    "ト",
    "ナ",
    "ニ",
    "ヌ",
    "ネ",
    "ノ",
    "ハ",
    "ヒ",
    "フ",
    "ヘ",
    "ホ",
    "マ",
    "ミ",
    "ム",
    "メ",
    "モ",
    "ヤ",
    "ユ",
    "ヨ",
    "ラ",
    "リ",
    "ル",
    "レ",
    "ロ",
    "ワ",
    "ヲ",
    "ン",
    "日",
    "月",
    "火",
    "水",
  ];

  const fontSize = 16;
  const columns = canvas.width / fontSize;
  const drops = Array(Math.floor(columns)).fill(1);

  function draw() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#0F0";
    ctx.font = fontSize + "px monospace";

    for (let i = 0; i < drops.length; i++) {
      const text =
        japaneseChars[Math.floor(Math.random() * japaneseChars.length)];
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);

      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }

    matrixAnimationId = requestAnimationFrame(draw);
  }

  draw();

  // Click to exit
  canvas.addEventListener("click", toggleMatrixRain);
}

function stopMatrixRain() {
  if (matrixAnimationId) {
    cancelAnimationFrame(matrixAnimationId);
    matrixAnimationId = null;
  }
}

window.addEventListener("resize", () => {
  if (matrixRainActive) {
    const canvas = document.getElementById("matrixCanvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
});

// Tetris game functionality
let tetrisGame = null;

function showTetris() {
  document.getElementById("tetrisModal").style.display = "flex";
  closeSidebar();
}

function closeTetris() {
  document.getElementById("tetrisModal").style.display = "none";
  if (tetrisGame) {
    tetrisGame.stop();
  }
}

function startTetris() {
  if (tetrisGame) {
    tetrisGame.stop();
  }
  tetrisGame = new TetrisGame();
  tetrisGame.start();
}

function pauseTetris() {
  if (tetrisGame) {
    tetrisGame.togglePause();
  }
}

class TetrisGame {
  constructor() {
    this.canvas = document.getElementById("tetrisCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.blockSize = 30;
    this.boardWidth = 10;
    this.boardHeight = 20;
    this.board = this.createBoard();
    this.currentPiece = null;
    this.score = 0;
    this.level = 1;
    this.lines = 0;
    this.dropTime = 800;
    this.lastTime = 0;
    this.paused = false;
    this.gameOver = false;
    this.animationId = null;

    this.pieces = [
      { shape: [[1, 1, 1, 1]], color: "#00f0f0" }, // I
      {
        shape: [
          [1, 0, 0],
          [1, 1, 1],
        ],
        color: "#0000f0",
      }, // J
      {
        shape: [
          [0, 0, 1],
          [1, 1, 1],
        ],
        color: "#f0a000",
      }, // L
      {
        shape: [
          [1, 1],
          [1, 1],
        ],
        color: "#f0f000",
      }, // O
      {
        shape: [
          [0, 1, 1],
          [1, 1, 0],
        ],
        color: "#00f000",
      }, // S
      {
        shape: [
          [0, 1, 0],
          [1, 1, 1],
        ],
        color: "#a000f0",
      }, // T
      {
        shape: [
          [1, 1, 0],
          [0, 1, 1],
        ],
        color: "#f00000",
      }, // Z
    ];

    this.setupControls();
  }

  createBoard() {
    return Array.from({ length: this.boardHeight }, () =>
      Array(this.boardWidth).fill(0)
    );
  }

  setupControls() {
    document.addEventListener("keydown", (e) => {
      if (!this.currentPiece || this.paused || this.gameOver) return;

      switch (e.key) {
        case "ArrowLeft":
          this.movePiece(-1, 0);
          break;
        case "ArrowRight":
          this.movePiece(1, 0);
          break;
        case "ArrowDown":
          this.movePiece(0, 1);
          break;
        case "ArrowUp":
          this.rotatePiece();
          break;
        case " ":
          this.togglePause();
          break;
      }
    });
  }

  spawnPiece() {
    const piece = this.pieces[Math.floor(Math.random() * this.pieces.length)];
    this.currentPiece = {
      shape: piece.shape.map((row) => [...row]),
      color: piece.color,
      x:
        Math.floor(this.boardWidth / 2) - Math.floor(piece.shape[0].length / 2),
      y: 0,
    };

    if (
      this.checkCollision(
        this.currentPiece.x,
        this.currentPiece.y,
        this.currentPiece.shape
      )
    ) {
      this.gameOver = true;
    }
  }

  checkCollision(x, y, shape) {
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const newX = x + col;
          const newY = y + row;

          if (newX < 0 || newX >= this.boardWidth || newY >= this.boardHeight) {
            return true;
          }

          if (newY >= 0 && this.board[newY][newX]) {
            return true;
          }
        }
      }
    }
    return false;
  }

  movePiece(dx, dy) {
    if (
      !this.checkCollision(
        this.currentPiece.x + dx,
        this.currentPiece.y + dy,
        this.currentPiece.shape
      )
    ) {
      this.currentPiece.x += dx;
      this.currentPiece.y += dy;
      return true;
    }
    return false;
  }

  rotatePiece() {
    const rotated = this.currentPiece.shape[0].map((_, i) =>
      this.currentPiece.shape.map((row) => row[i]).reverse()
    );

    if (
      !this.checkCollision(this.currentPiece.x, this.currentPiece.y, rotated)
    ) {
      this.currentPiece.shape = rotated;
    }
  }

  placePiece() {
    for (let row = 0; row < this.currentPiece.shape.length; row++) {
      for (let col = 0; col < this.currentPiece.shape[row].length; col++) {
        if (this.currentPiece.shape[row][col]) {
          const boardY = this.currentPiece.y + row;
          const boardX = this.currentPiece.x + col;
          if (boardY >= 0) {
            this.board[boardY][boardX] = this.currentPiece.color;
          }
        }
      }
    }

    this.clearLines();
    this.spawnPiece();
  }

  clearLines() {
    let linesCleared = 0;
    for (let row = this.boardHeight - 1; row >= 0; row--) {
      if (this.board[row].every((cell) => cell !== 0)) {
        this.board.splice(row, 1);
        this.board.unshift(Array(this.boardWidth).fill(0));
        linesCleared++;
        row++; // Check the same row again
      }
    }

    if (linesCleared > 0) {
      this.lines += linesCleared;
      this.score += linesCleared * 100 * this.level;
      this.level = Math.floor(this.lines / 10) + 1;
      this.dropTime = Math.max(100, 800 - (this.level - 1) * 50);
      this.updateDisplay();
    }
  }

  updateDisplay() {
    document.getElementById("score").textContent = this.score;
    document.getElementById("level").textContent = this.level;
    document.getElementById("lines").textContent = this.lines;
  }

  draw() {
    // Clear canvas
    this.ctx.fillStyle = "#000";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw board
    for (let row = 0; row < this.boardHeight; row++) {
      for (let col = 0; col < this.boardWidth; col++) {
        if (this.board[row][col]) {
          this.ctx.fillStyle = this.board[row][col];
          this.ctx.fillRect(
            col * this.blockSize,
            row * this.blockSize,
            this.blockSize - 1,
            this.blockSize - 1
          );
        }
      }
    }

    // Draw current piece
    if (this.currentPiece) {
      this.ctx.fillStyle = this.currentPiece.color;
      for (let row = 0; row < this.currentPiece.shape.length; row++) {
        for (let col = 0; col < this.currentPiece.shape[row].length; col++) {
          if (this.currentPiece.shape[row][col]) {
            const x = (this.currentPiece.x + col) * this.blockSize;
            const y = (this.currentPiece.y + row) * this.blockSize;
            this.ctx.fillRect(x, y, this.blockSize - 1, this.blockSize - 1);
          }
        }
      }
    }

    // Draw game over text
    if (this.gameOver) {
      this.ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.fillStyle = "#fff";
      this.ctx.font = "24px Arial";
      this.ctx.textAlign = "center";
      this.ctx.fillText(
        "GAME OVER",
        this.canvas.width / 2,
        this.canvas.height / 2
      );
      this.ctx.fillText(
        "Presiona Iniciar para jugar de nuevo",
        this.canvas.width / 2,
        this.canvas.height / 2 + 30
      );
    }
  }

  gameLoop(currentTime) {
    if (this.paused || this.gameOver) {
      this.animationId = requestAnimationFrame((time) => this.gameLoop(time));
      return;
    }

    const deltaTime = currentTime - this.lastTime;

    if (deltaTime > this.dropTime) {
      if (!this.movePiece(0, 1)) {
        this.placePiece();
      }
      this.lastTime = currentTime;
    }

    this.draw();
    this.animationId = requestAnimationFrame((time) => this.gameLoop(time));
  }

  start() {
    this.board = this.createBoard();
    this.score = 0;
    this.level = 1;
    this.lines = 0;
    this.gameOver = false;
    this.paused = false;
    this.updateDisplay();
    this.spawnPiece();

    document.getElementById("startButton").style.display = "none";
    document.getElementById("pauseButton").style.display = "block";

    this.animationId = requestAnimationFrame((time) => this.gameLoop(time));
  }

  togglePause() {
    this.paused = !this.paused;
    document.getElementById("pauseButton").textContent = this.paused
      ? "Reanudar"
      : "Pausar";
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    document.getElementById("startButton").style.display = "block";
    document.getElementById("pauseButton").style.display = "none";
  }
}
