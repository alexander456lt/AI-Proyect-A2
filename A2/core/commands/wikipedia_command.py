import wikipedia
from core.commands.base_command import BaseCommand

class WikipediaCommand(BaseCommand):
    """Command to search Wikipedia."""
    
    _cache = {}

    def execute(self, text: str):
        """Search Wikipedia for information and return the text."""
        search_term = text.replace('wikipedia', '').replace('busca en wikipedia', '').strip()
        if not search_term:
            self.assistant.speak("¿Qué quieres buscar en Wikipedia?")
            return False
            
        if search_term in self._cache:
            wiki = self._cache[search_term]
            self.assistant.speak(wiki)
            return wiki  # Return the text instead of just True
            
        wikipedia.set_lang("es")
        try:
            wiki = wikipedia.summary(search_term, 2)
            self._cache[search_term] = wiki
            self.assistant.speak(wiki)
            return wiki  # Return the actual Wikipedia text
        except Exception:
            self.assistant.speak("No se encontró información en Wikipedia.")
            return False
            
    def get_description(self) -> str:
        return "Busca información en Wikipedia"
