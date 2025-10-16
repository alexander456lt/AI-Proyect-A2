import subprocess as sub
import threading
from core.commands.base_command import BaseCommand

class SearchCommand(BaseCommand):
    """Command to search the web."""
    
    def execute(self, text: str) -> bool:
        """Search the web using Edge browser."""
        query = text.replace('buscar en edge', '').replace('busca', '').strip()
        if query:
            url = f"https://www.bing.com/search?q={query.replace(' ', '+')}"
            def open_browser():
                sub.call(f"start msedge.exe {url}", shell=True)
            threading.Thread(target=open_browser).start()
            self.assistant.speak(f"Buscando {query} en Edge.")
            return True
        else:
            self.assistant.speak("¿Qué quieres buscar?")
            return False
            
    def get_description(self) -> str:
        return "Busca en el navegador"
