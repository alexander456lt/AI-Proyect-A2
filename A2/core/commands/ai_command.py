import os
from core.commands.base_command import BaseCommand
import requests

class AICommand(BaseCommand):
    """Command to interact with Google Gemini AI using REST API."""

    def __init__(self, assistant):
        super().__init__(assistant)
        self.api_key = os.getenv('GOOGLE_API_KEY')
        self.api_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

    def execute(self, text: str) -> bool:
        """Query Google Gemini AI via REST API."""
        if not self.api_key:
            self.assistant.speak("No tengo configurada la clave API de Google Gemini. Por favor, configura GOOGLE_API_KEY.")
            return False

        headers = {
            "Content-Type": "application/json",
            "X-goog-api-key": self.api_key
        }
        data = {
            "contents": [
                {
                    "parts": [
                        {
                            "text": text
                        }
                    ]
                }
            ]
        }

        try:
            response = requests.post(self.api_url, headers=headers, json=data)
            response.raise_for_status()
            result = response.json()
            # Extraer texto de la respuesta
            ai_response = ""
            if "candidates" in result:
                ai_response = result["candidates"][0].get("content", "")
            if not ai_response:
                ai_response = "No obtuve respuesta de la IA."
            self.assistant.speak(ai_response)
            return True
        except Exception as e:
            self.assistant.speak(f"Error al consultar la IA: {str(e)}")
            return False

    def get_description(self) -> str:
        return "Consulta a la IA de Google Gemini"
