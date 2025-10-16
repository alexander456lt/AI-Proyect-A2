/**
 * Enhanced A2 Dashboard JavaScript
 * Modern, responsive, and feature-rich interface
 */

class A2Dashboard {
  constructor() {
    this.socket = null;
    this.isListening = false;
    this.currentTheme = "dark";
    this.commands = {};
    this.history = [];
    this.stats = {
      totalCommands: 0,
      successfulCommands: 0,
      failedCommands: 0,
      aiQueries: 0,
      startTime: new Date(),
    };

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initializeSocket();
    this.loadCommands();
    this.loadHistory();
    this.updateStats();
    this.setupTheme();
    this.hideLoadingScreen();

    // Start uptime counter
    this.startUptimeCounter();

    // Auto-save settings
    this.setupAutoSave();
  }

  setupEventListeners() {
    // Sidebar toggle
    document.getElementById("sidebarToggle").addEventListener("click", () => {
      this.toggleSidebar();
    });

    // Menu navigation
    document.querySelectorAll(".menu-item").forEach((item) => {
      item.addEventListener("click", (e) => {
        const section = e.currentTarget.dataset.section;
        this.showSection(section);
        this.updateActiveMenuItem(e.currentTarget);
      });
    });

    // Chat functionality
    const messageInput = document.getElementById("messageInput");
    const sendBtn = document.getElementById("sendBtn");
    const voiceBtn = document.getElementById("voiceBtn");

    messageInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.sendMessage();
      }
    });

    sendBtn.addEventListener("click", () => {
      this.sendMessage();
    });

    voiceBtn.addEventListener("click", () => {
      this.toggleVoiceListening();
    });

    // Quick commands
    document.querySelectorAll(".quick-cmd").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const command = e.currentTarget.dataset.command;
        this.executeQuickCommand(command);
      });
    });

    // Voice controls
    document.getElementById("startListening").addEventListener("click", () => {
      this.startVoiceListening();
    });

    document.getElementById("stopListening").addEventListener("click", () => {
      this.stopVoiceListening();
    });

    // Settings
    this.setupSettingsListeners();

    // Games
    this.setupGameListeners();

    // History controls
    document.getElementById("clearHistory").addEventListener("click", () => {
      this.clearHistory();
    });

    document.getElementById("exportHistory").addEventListener("click", () => {
      this.exportHistory();
    });

    // Theme toggle
    document.getElementById("themeToggle").addEventListener("click", () => {
      this.toggleTheme();
    });

    // AI chat
    const aiInput = document.getElementById("aiInput");
    const aiSend = document.getElementById("aiSend");

    aiInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.sendAIMessage();
      }
    });

    aiSend.addEventListener("click", () => {
      this.sendAIMessage();
    });
  }

  initializeSocket() {
    this.socket = io();

    this.socket.on("connect", () => {
      this.showNotification("Conectado al servidor", "success");
      this.updateConnectionStatus(true);
    });

    this.socket.on("disconnect", () => {
      this.showNotification("Desconectado del servidor", "warning");
      this.updateConnectionStatus(false);
    });

    this.socket.on("command_result", (data) => {
      this.handleCommandResult(data);
    });

    this.socket.on("command_error", (data) => {
      this.showNotification(`Error: ${data.error}`, "error");
    });
  }

  setupSettingsListeners() {
    // Settings tabs
    document.querySelectorAll(".settings-tab").forEach((tab) => {
      tab.addEventListener("click", (e) => {
        const tabId = e.currentTarget.dataset.tab;
        this.showSettingsTab(tabId);
        this.updateActiveSettingsTab(e.currentTarget);
      });
    });

    // Settings inputs
    const settingsInputs = [
      "assistantName",
      "language",
      "autoStart",
      "voiceRate",
      "voiceVolume",
      "voiceEnabled",
      "apiKey",
      "aiModel",
      "aiEnabled",
      "theme",
      "primaryColor",
      "animations",
    ];

    settingsInputs.forEach((inputId) => {
      const input = document.getElementById(inputId);
      if (input) {
        input.addEventListener("change", () => {
          this.saveSettings();
        });
      }
    });

    // Range inputs with live updates
    const rangeInputs = ["voiceRate", "voiceVolume"];
    rangeInputs.forEach((inputId) => {
      const input = document.getElementById(inputId);
      const valueDisplay = document.getElementById(`${inputId}Value`);

      if (input && valueDisplay) {
        input.addEventListener("input", (e) => {
          valueDisplay.textContent = e.target.value;
        });
      }
    });
  }

  setupGameListeners() {
    document.querySelectorAll(".game-card").forEach((card) => {
      card.addEventListener("click", (e) => {
        const game = e.currentTarget.dataset.game;
        this.openGame(game);
      });
    });

    document.getElementById("closeGame").addEventListener("click", () => {
      this.closeGame();
    });
  }

  toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("collapsed");
  }

  showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll(".content-section").forEach((section) => {
      section.classList.remove("active");
    });

    // Show selected section
    const section = document.getElementById(sectionId);
    if (section) {
      section.classList.add("active");
      this.updatePageTitle(sectionId);
    }
  }

  updateActiveMenuItem(activeItem) {
    document.querySelectorAll(".menu-item").forEach((item) => {
      item.classList.remove("active");
    });
    activeItem.classList.add("active");
  }

  updatePageTitle(sectionId) {
    const titles = {
      dashboard: "Dashboard",
      commands: "Comandos",
      history: "Historial",
      settings: "Configuración",
      voice: "Control de Voz",
      ai: "Inteligencia Artificial",
      games: "Minijuegos",
    };

    const title = titles[sectionId] || "Dashboard";
    document.querySelector(".page-title").textContent = title;
  }

  async loadCommands() {
    try {
      const response = await fetch("/api/commands");
      const data = await response.json();
      this.commands = data.commands;
      this.renderCommands();
    } catch (error) {
      console.error("Error loading commands:", error);
      this.showNotification("Error al cargar comandos", "error");
    }
  }

  renderCommands() {
    const commandsGrid = document.getElementById("commandsGrid");
    commandsGrid.innerHTML = "";

    Object.entries(this.commands).forEach(([key, description]) => {
      const commandCard = document.createElement("div");
      commandCard.className = "command-card";
      commandCard.innerHTML = `
                <div class="command-header">
                    <div class="command-icon">
                        <i class="fas fa-terminal"></i>
                    </div>
                    <div class="command-title">${key}</div>
                </div>
                <div class="command-description">${description}</div>
                <div class="command-keywords">
                    <span class="keyword">${key}</span>
                </div>
            `;

      commandCard.addEventListener("click", () => {
        this.executeCommand(key, "");
      });

      commandsGrid.appendChild(commandCard);
    });
  }

  async loadHistory() {
    try {
      const response = await fetch("/api/history");
      const data = await response.json();
      this.history = data.history || [];
      this.renderHistory();
    } catch (error) {
      console.error("Error loading history:", error);
    }
  }

  renderHistory() {
    const historyList = document.getElementById("historyList");
    historyList.innerHTML = "";

    if (this.history.length === 0) {
      historyList.innerHTML =
        '<div class="no-history">No hay historial disponible</div>';
      return;
    }

    this.history.forEach((item) => {
      const historyItem = document.createElement("div");
      historyItem.className = "history-item";
      historyItem.innerHTML = `
                <div class="history-header">
                    <div class="history-command">${item.command}</div>
                    <div class="history-time">${this.formatTime(
                      item.timestamp
                    )}</div>
                </div>
                <div class="history-status ${item.result}">${item.result}</div>
                <div class="history-text">${item.text || "Sin texto"}</div>
                ${
                  item.output
                    ? `<div class="history-output">${item.output}</div>`
                    : ""
                }
            `;
      historyList.appendChild(historyItem);
    });
  }

  async sendMessage() {
    const messageInput = document.getElementById("messageInput");
    const message = messageInput.value.trim();

    if (!message) return;

    // Add user message to chat
    this.addMessageToChat(message, "user");
    messageInput.value = "";

    // Execute command
    await this.executeCommand("ai", message);
  }

  addMessageToChat(message, type, output = null) {
    const chatMessages = document.getElementById("chatMessages");
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${type}-message`;

    const avatar = type === "user" ? "fas fa-user" : "fas fa-robot";
    const time = new Date().toLocaleTimeString();

    messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="${avatar}"></i>
            </div>
            <div class="message-content">
                <div class="message-text">${message}</div>
                <div class="message-time">${time}</div>
            </div>
        `;

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  async executeCommand(command, text) {
    try {
      const response = await fetch("/api/commands", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          command: command,
          text: text,
        }),
      });

      const result = await response.json();

      if (result.success) {
        this.stats.totalCommands++;
        this.stats.successfulCommands++;
        this.updateStats();

        if (command === "ai") {
          this.stats.aiQueries++;
          this.addMessageToChat(result.output || "Comando ejecutado", "bot");
        } else {
          this.addMessageToChat(
            `Comando '${command}' ejecutado`,
            "bot",
            result.output
          );
        }
      } else {
        this.stats.totalCommands++;
        this.stats.failedCommands++;
        this.updateStats();
        this.addMessageToChat(`Error ejecutando '${command}'`, "bot");
      }

      // Reload history
      this.loadHistory();
    } catch (error) {
      console.error("Error executing command:", error);
      this.showNotification("Error al ejecutar comando", "error");
    }
  }

  executeQuickCommand(command) {
    const messageInput = document.getElementById("messageInput");
    messageInput.value = command;
    messageInput.focus();
  }

  handleCommandResult(data) {
    if (data.success) {
      this.addMessageToChat(data.output || "Comando ejecutado", "bot");
    } else {
      this.addMessageToChat(`Error: ${data.output}`, "bot");
    }
  }

  toggleVoiceListening() {
    if (this.isListening) {
      this.stopVoiceListening();
    } else {
      this.startVoiceListening();
    }
  }

  startVoiceListening() {
    // This would integrate with the actual voice recognition
    this.isListening = true;
    this.updateVoiceUI(true);
    this.showNotification("Escuchando...", "info");

    // Simulate voice recognition for demo
    setTimeout(() => {
      this.stopVoiceListening();
      this.addMessageToChat("Comando de voz reconocido", "user");
    }, 3000);
  }

  stopVoiceListening() {
    this.isListening = false;
    this.updateVoiceUI(false);
    this.showNotification("Escucha detenida", "info");
  }

  updateVoiceUI(listening) {
    const voiceBtn = document.getElementById("voiceBtn");
    const voiceCircle = document.getElementById("voiceCircle");
    const voiceStatus = document.querySelector(".voice-status");

    if (listening) {
      voiceBtn.classList.add("listening");
      voiceCircle.classList.add("listening");
      voiceStatus.textContent = "Escuchando...";
    } else {
      voiceBtn.classList.remove("listening");
      voiceCircle.classList.remove("listening");
      voiceStatus.textContent = "Presiona para hablar";
    }
  }

  async sendAIMessage() {
    const aiInput = document.getElementById("aiInput");
    const message = aiInput.value.trim();

    if (!message) return;

    // Add user message
    this.addAIMessage(message, "user");
    aiInput.value = "";

    // Send to AI
    await this.executeCommand("ai", message);
  }

  addAIMessage(message, type) {
    const aiMessages = document.getElementById("aiMessages");
    const messageDiv = document.createElement("div");
    messageDiv.className = `ai-message ${type}-message`;

    const avatar = type === "user" ? "fas fa-user" : "fas fa-brain";

    messageDiv.innerHTML = `
            <div class="ai-avatar">
                <i class="${avatar}"></i>
            </div>
            <div class="ai-content">
                <div class="ai-text">${message}</div>
            </div>
        `;

    aiMessages.appendChild(messageDiv);
    aiMessages.scrollTop = aiMessages.scrollHeight;
  }

  openGame(gameName) {
    const gameModal = document.getElementById("gameModal");
    const gameTitle = document.getElementById("gameTitle");
    const gameContent = document.getElementById("gameContent");

    gameTitle.textContent =
      gameName.charAt(0).toUpperCase() + gameName.slice(1);

    // Load game content based on game type
    switch (gameName) {
      case "tetris":
        this.loadTetrisGame(gameContent);
        break;
      case "snake":
        this.loadSnakeGame(gameContent);
        break;
      case "pong":
        this.loadPongGame(gameContent);
        break;
    }

    gameModal.classList.add("active");
  }

  loadTetrisGame(container) {
    container.innerHTML = `
            <canvas id="tetrisCanvas" width="300" height="600"></canvas>
            <div class="game-controls">
                <div class="score">Puntuación: <span id="score">0</span></div>
                <div class="level">Nivel: <span id="level">1</span></div>
                <button id="startGame">Iniciar</button>
                <button id="pauseGame">Pausar</button>
            </div>
        `;

    // Initialize Tetris game
    this.initTetris();
  }

  loadSnakeGame(container) {
    container.innerHTML = `
            <canvas id="snakeCanvas" width="400" height="400"></canvas>
            <div class="game-controls">
                <div class="score">Puntuación: <span id="snakeScore">0</span></div>
                <button id="startSnake">Iniciar</button>
            </div>
        `;

    // Initialize Snake game
    this.initSnake();
  }

  loadPongGame(container) {
    container.innerHTML = `
            <canvas id="pongCanvas" width="600" height="400"></canvas>
            <div class="game-controls">
                <div class="score">Jugador: <span id="playerScore">0</span> | IA: <span id="aiScore">0</span></div>
                <button id="startPong">Iniciar</button>
            </div>
        `;

    // Initialize Pong game
    this.initPong();
  }

  closeGame() {
    const gameModal = document.getElementById("gameModal");
    gameModal.classList.remove("active");
  }

  initTetris() {
    // Tetris game implementation would go here
    console.log("Tetris game initialized");
  }

  initSnake() {
    // Snake game implementation would go here
    console.log("Snake game initialized");
  }

  initPong() {
    // Pong game implementation would go here
    console.log("Pong game initialized");
  }

  showSettingsTab(tabId) {
    // Hide all settings panels
    document.querySelectorAll(".settings-panel").forEach((panel) => {
      panel.classList.remove("active");
    });

    // Show selected panel
    const panel = document.getElementById(tabId);
    if (panel) {
      panel.classList.add("active");
    }
  }

  updateActiveSettingsTab(activeTab) {
    document.querySelectorAll(".settings-tab").forEach((tab) => {
      tab.classList.remove("active");
    });
    activeTab.classList.add("active");
  }

  saveSettings() {
    const settings = {
      assistantName: document.getElementById("assistantName").value,
      language: document.getElementById("language").value,
      autoStart: document.getElementById("autoStart").checked,
      voiceRate: document.getElementById("voiceRate").value,
      voiceVolume: document.getElementById("voiceVolume").value,
      voiceEnabled: document.getElementById("voiceEnabled").checked,
      apiKey: document.getElementById("apiKey").value,
      aiModel: document.getElementById("aiModel").value,
      aiEnabled: document.getElementById("aiEnabled").checked,
      theme: document.getElementById("theme").value,
      primaryColor: document.getElementById("primaryColor").value,
      animations: document.getElementById("animations").checked,
    };

    localStorage.setItem("a2Settings", JSON.stringify(settings));
    this.showNotification("Configuración guardada", "success");
  }

  loadSettings() {
    const savedSettings = localStorage.getItem("a2Settings");
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);

      Object.entries(settings).forEach(([key, value]) => {
        const element = document.getElementById(key);
        if (element) {
          if (element.type === "checkbox") {
            element.checked = value;
          } else {
            element.value = value;
          }
        }
      });
    }
  }

  setupAutoSave() {
    // Auto-save settings every 30 seconds
    setInterval(() => {
      this.saveSettings();
    }, 30000);
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === "dark" ? "light" : "dark";
    document.body.setAttribute("data-theme", this.currentTheme);

    const themeIcon = document.querySelector("#themeToggle i");
    themeIcon.className =
      this.currentTheme === "dark" ? "fas fa-moon" : "fas fa-sun";

    this.showNotification(`Tema cambiado a ${this.currentTheme}`, "info");
  }

  setupTheme() {
    const savedTheme = localStorage.getItem("a2Theme") || "dark";
    this.currentTheme = savedTheme;
    document.body.setAttribute("data-theme", this.currentTheme);

    const themeIcon = document.querySelector("#themeToggle i");
    themeIcon.className =
      this.currentTheme === "dark" ? "fas fa-moon" : "fas fa-sun";
  }

  updateStats() {
    document.getElementById("totalCommands").textContent =
      this.stats.totalCommands;
    document.getElementById("successRate").textContent =
      this.calculateSuccessRate();
    document.getElementById("aiQueries").textContent = this.stats.aiQueries;
  }

  calculateSuccessRate() {
    if (this.stats.totalCommands === 0) return "0%";
    const rate =
      (this.stats.successfulCommands / this.stats.totalCommands) * 100;
    return `${Math.round(rate)}%`;
  }

  startUptimeCounter() {
    setInterval(() => {
      const now = new Date();
      const uptime = now - this.stats.startTime;
      const hours = Math.floor(uptime / 3600000);
      const minutes = Math.floor((uptime % 3600000) / 60000);
      const seconds = Math.floor((uptime % 60000) / 1000);

      document.getElementById("uptime").textContent = `${hours
        .toString()
        .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    }, 1000);
  }

  updateConnectionStatus(connected) {
    const statusDot = document.querySelector(".status-dot");
    const statusText = document.querySelector(".status-indicator span");

    if (connected) {
      statusDot.classList.add("online");
      statusText.textContent = "Conectado";
    } else {
      statusDot.classList.remove("online");
      statusText.textContent = "Desconectado";
    }
  }

  showNotification(message, type = "info") {
    const notifications = document.getElementById("notifications");
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;

    notifications.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      notification.remove();
    }, 5000);
  }

  formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString();
  }

  async clearHistory() {
    if (confirm("¿Estás seguro de que quieres limpiar el historial?")) {
      try {
        await fetch("/api/history", { method: "DELETE" });
        this.history = [];
        this.renderHistory();
        this.showNotification("Historial limpiado", "success");
      } catch (error) {
        console.error("Error clearing history:", error);
        this.showNotification("Error al limpiar historial", "error");
      }
    }
  }

  exportHistory() {
    const dataStr = JSON.stringify(this.history, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `a2-history-${new Date().toISOString().split("T")[0]}.json`;
    link.click();

    URL.revokeObjectURL(url);
    this.showNotification("Historial exportado", "success");
  }

  hideLoadingScreen() {
    setTimeout(() => {
      const loadingScreen = document.getElementById("loadingScreen");
      loadingScreen.classList.add("hidden");
    }, 2000);
  }
}

// Initialize dashboard when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new A2Dashboard();
});

// Service Worker registration for offline support
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered: ", registration);
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError);
      });
  });
}
