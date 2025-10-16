import threading
import speech_recognition as sr
import pyttsx3
from typing import Dict, Callable, Any
import os
import requests

class Assistant:
    """Main assistant class that handles voice recognition and command processing."""
    
    def __init__(self, name: str = "A2"):
        self.name = name
        self.recognizer = sr.Recognizer()
        self.engine = pyttsx3.init()
        self._setup_voice()
        self.commands: Dict[str, Callable] = {}
        self.running = False
        self.speak_lock = threading.Lock()
        
        # Configure Google AI
        self.api_key = os.environ.get('GOOGLE_API_KEY')
        self.api_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
        if not self.api_key:
            self.model = None
        
    def _setup_voice(self):
        """Configure the text-to-speech engine."""
        voices = self.engine.getProperty('voices')
        self.engine.setProperty('voice', voices[0].id)
        self.engine.setProperty('rate', 145)
        
    def speak(self, text: str):
        """Make the assistant speak."""
        print(f"A2: {text}")
        self.engine.say(text)
        with self.speak_lock:
            self.engine.runAndWait()
        
    def listen(self) -> str:
        """Listen for voice commands."""
        with sr.Microphone() as source:
            self.recognizer.adjust_for_ambient_noise(source, duration=0.2)
            print("Escuchando...")
            try:
                audio = self.recognizer.listen(source, timeout=5, phrase_time_limit=5)
                text = self.recognizer.recognize_google(audio, language='es-ES')
                return text.lower()
            except sr.UnknownValueError:
                self.speak("No he entendido lo que has dicho.")
                return ""
            except sr.RequestError:
                self.speak("Error de conexión con el servicio de reconocimiento.")
                return ""
                
    def register_command(self, keyword: str, function: Callable):
        """Register a new command."""
        self.commands[keyword] = function
        
    def process_command(self, text: str):
        """Process a voice command.""" 
        import time
        if not text:
            return
            
        # Remove assistant name if present
        if self.name.lower() in text:
            text = text.replace(self.name.lower(), "").strip()
            
        # Check if command is for AI chat
        if "chatai" in text or "inteligencia artificial" in text or "consulta ai" in text:
            def run_ai():
                try:
                    response = self.query_ai(text)
                    if response:
                        self.speak(response)
                    else:
                        self.speak("No obtuve respuesta de la IA.")
                except Exception as e:
                    self.speak(f"Error al consultar la IA: {str(e)}")
            threading.Thread(target=run_ai).start()
            return
            
        # Find matching command
        for keyword, function in self.commands.items():
            if keyword in text:
                def run_command():
                    try:
                        start_time = time.time()
                        function(text)
                        duration = time.time() - start_time
                        print(f"Command '{keyword}' executed in {duration:.2f} seconds")
                    except Exception as e:
                        self.speak(f"Error al ejecutar el comando: {str(e)}")
                threading.Thread(target=run_command).start()
                return
                
        # If no command matches, try AI
        def run_ai():
            try:
                response = self.query_ai(text)
                if response:
                    self.speak(response)
                else:
                    self.speak("No obtuve respuesta de la IA.")
            except Exception as e:
                self.speak(f"Error al consultar la IA: {str(e)}")
        threading.Thread(target=run_ai).start()
        
    def query_ai(self, prompt: str) -> str:
        """Query the AI model for a response."""
        if not self.api_key:
            return "API key no configurada para Google AI."
        headers = {
            "Content-Type": "application/json",
            "X-goog-api-key": self.api_key
        }
        data = {
            "contents": [
                {
                    "parts": [
                        {
                            "text": prompt
                        }
                    ]
                }
            ]
        }
        try:
            response = requests.post(self.api_url, headers=headers, json=data)
            response.raise_for_status()
            result = response.json()
            ai_response = ""
            if "candidates" in result:
                ai_response = result["candidates"][0].get("content", "")
            if not ai_response:
                ai_response = "No obtuve respuesta de la IA."
            return ai_response
        except Exception as e:
            return f"Error al consultar la IA: {str(e)}"
        
    def start(self):
        """Start the assistant."""
        if self.running:
            self.speak("Error: run loop already started")
            return
        self.running = True
        self.speak(f"Hola, soy {self.name}. ¿En qué puedo ayudarte?")
        
        while self.running:
            command = self.listen()
            if command:
                if "salir" in command or "terminar" in command:
                    self.speak("Hasta luego.")
                    self.running = False
                else:
                    self.process_command(command)
                    
    def stop(self):
        """Stop the assistant."""
        self.running = False

    def start_chatbox(self):
        """Start the assistant in chatbox mode (text input)."""
        self.running = True
        print(f"{self.name} - Modo chatbox activado. Escribe 'salir' para terminar.")
        while self.running:
            command = input(">> ").strip().lower()
            if not command:
                continue
            if "salir" in command or "terminar" in command:
                print("Hasta luego.")
                self.running = False
            else:
                self.process_command(command)
