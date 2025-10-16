import subprocess as sub
from core.commands.base_command import BaseCommand

class SpotifyCommand(BaseCommand):
    """Command to search Spotify."""
    
    def execute(self, text: str) -> bool:
        """Search for music on Spotify."""
        musica = text.replace('reproduce en spotify', '').strip()
        if musica:
            url = f"https://open.spotify.com/search/{musica.replace(' ', '%20')}"
            sub.call(f"start msedge.exe {url}", shell=True)
            self.assistant.speak(f"Buscando {musica} en Spotify.")
            return True
        else:
            self.assistant.speak("¿Qué música quieres buscar en Spotify?")
            return False
            
    def get_description(self) -> str:
        return "Busca música en Spotify"
