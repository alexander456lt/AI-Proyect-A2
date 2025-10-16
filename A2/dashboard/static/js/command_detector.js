// Command Detector Functionality
const socket = io(); // Initialize Socket.IO

// Function to send command to the backend
function sendCommand() {
  const input = document.getElementById("commandInput");
  const command = input.value.trim();

  if (command) {
    // Display user message
    addMessage(command, "user-message", "Tú");

    // Send command to backend
    socket.emit("execute_command", {
      command: extractCommandKeyword(command),
      text: command,
    });

    input.value = ""; // Clear input after sending
  }
}

// Extract command keyword from user input
function extractCommandKeyword(text) {
  const commands = [
    "youtube",
    "reproduce",
    "wikipedia",
    "busca en wikipedia",
    "alarma",
    "colores",
    "abre",
    "archivo",
    "escribe",
    "whatsapp",
    "agregarcontacto",
    "spotify",
    "buscar",
    "ai",
  ];

  for (const cmd of commands) {
    if (text.toLowerCase().includes(cmd)) {
      return cmd;
    }
  }
  return "ai"; // Default to AI if no specific command found
}

// Add message to chat box
function addMessage(text, className, sender = "A2") {
  const chatBox = document.getElementById("chatBox");
  const message = document.createElement("div");
  message.classList.add("chat-message", className);

  if (className === "user-message") {
    message.innerHTML = `<strong>${sender}:</strong> ${text}`;
  } else {
    message.innerHTML = `<strong>${sender}:</strong> ${text}`;
  }

  chatBox.appendChild(message);
  chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to bottom
}

// Listen for command results from the backend
socket.on("command_result", (data) => {
  const { command, text, success, result, output } = data;
  const messageClass = success ? "command-success" : "command-error";
  const status = success ? "Comando ejecutado" : "Error en comando";

  // Display command execution status
  addMessage(`${status}: ${command} - ${text}`, messageClass);

  // Display the actual output if available
  if (output && typeof output === "string" && output.trim() !== "") {
    addMessage(output, "output-message", "A2");
  } else if (success) {
    addMessage("Comando ejecutado correctamente", "output-message", "A2");
  }
});

// Listen for command errors
socket.on("command_error", (data) => {
  addMessage(`Error: ${data.error}`, "command-error");
});

// Handle input submission with Enter key
document
  .getElementById("commandInput")
  .addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      sendCommand();
    }
  });

// Handle connection events
socket.on("connect", () => {
  console.log("Connected to A2 dashboard");
  addMessage("Conectado al servidor A2", "bot-message");
});

socket.on("disconnect", () => {
  addMessage("Desconectado del servidor", "command-error");
});

// Existing theme change function assumed to be here
// function changeTheme(themeName) { ... }
