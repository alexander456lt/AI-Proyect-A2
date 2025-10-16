from typing import Dict, Callable, Any
from core.commands import (
    YouTubeCommand, WikipediaCommand, AlarmCommand,
    ColorCommand, OpenCommand, FileCommand,
    WriteCommand, WhatsAppCommand, ContactCommand,
    SpotifyCommand, SearchCommand, AICommand
)

class CommandHandler:
    """Handles all available commands and their execution."""
    
    def __init__(self, assistant):
        self.assistant = assistant
        self.commands: Dict[str, Callable] = {}
        self._register_commands()
        
    def _register_commands(self):
        """Register all available commands."""
        # YouTube
        self.commands['youtube'] = YouTubeCommand(self.assistant)
        self.commands['reproduce'] = YouTubeCommand(self.assistant)
        
        # Wikipedia
        self.commands['wikipedia'] = WikipediaCommand(self.assistant)
        self.commands['busca en wikipedia'] = WikipediaCommand(self.assistant)
        
        # Alarm
        self.commands['alarma'] = AlarmCommand(self.assistant)
        
        # Colors
        self.commands['colores'] = ColorCommand(self.assistant)
        
        # Open sites/programs
        self.commands['abre'] = OpenCommand(self.assistant)
        
        # Files
        self.commands['archivo'] = FileCommand(self.assistant)
        
        # Write
        self.commands['escribe'] = WriteCommand(self.assistant)
        
        # WhatsApp
        self.commands['whatsapp'] = WhatsAppCommand(self.assistant)
        
        # Contacts
        self.commands['agregarcontacto'] = ContactCommand(self.assistant)
        
        # Spotify
        self.commands['spotify'] = SpotifyCommand(self.assistant)
        
        # Search
        self.commands['buscar'] = SearchCommand(self.assistant)

        # AI
        self.commands['ai'] = AICommand(self.assistant)
        
    def execute(self, keyword: str, text: str):
        """Execute a specific command."""
        if keyword in self.commands:
            return self.commands[keyword].execute(text)
        return False
        
    def get_available_commands(self) -> Dict[str, str]:
        """Get list of available commands with descriptions."""
        return {
            'youtube': 'Reproduce videos de YouTube',
            'wikipedia': 'Busca información en Wikipedia',
            'alarma': 'Configura una alarma',
            'colores': 'Detecta colores con la cámara',
            'abre': 'Abre sitios web o programas',
            'archivo': 'Abre archivos',
            'escribe': 'Escribe en un archivo de texto',
            'whatsapp': 'Envía mensajes por WhatsApp',
            'agregarcontacto': 'Agrega nuevos contactos',
            'spotify': 'Busca música en Spotify',
            'buscar': 'Busca en el navegador',
            'ai': 'Consulta a la IA de Google Gemini'
        }
