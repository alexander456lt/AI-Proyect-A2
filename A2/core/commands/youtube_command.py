import pywhatkit
from core.commands.base_command import BaseCommand

class YouTubeCommand(BaseCommand):
    """Command to play YouTube videos."""
    
    def execute(self, text: str) -> bool:
        """Play a YouTube video based on the search query."""
        music = text.replace('reproduce en youtube', '').replace('youtube', '').strip()
        if music:
            print(f"Reproduciendo {music}")
            self.assistant.speak(f"Reproduciendo {music}")
            pywhatkit.playonyt(music)
            return True
        else:
            self.assistant.speak("¿Qué quieres reproducir en YouTube?")
            return False
            
    def get_description(self) -> str:
        return "Reproduce videos de YouTube"
