import subprocess as sub
from core.commands.base_command import BaseCommand

class OpenCommand(BaseCommand):
    """Command to open websites and programs."""
    
    def __init__(self, assistant):
        super().__init__(assistant)
        self.sites = {
            'youtube': 'https://www.youtube.com',
            'google': 'https://www.google.com',
            'twitch': 'https://www.twitch.tv',
            'chatgpt': 'https://chat.openai.com',
            'github': 'https://github.com',
            'gmail': 'https://mail.google.com',
            'twitter': 'https://twitter.com',
            'outlook': 'https://outlook.live.com',
            'chesscom': 'https://www.chess.com',
            'duolingo': 'https://www.duolingo.com',
            'instagram': 'https://www.instagram.com',
            'facebook': 'https://www.facebook.com',
            'bluesky': 'https://blueskyweb.com',
        }
        
        self.programs = {
            'notepad': 'notepad.exe',
            'calculadora': 'calc.exe',
            'explorador de archivos': 'explorer.exe',
            'cmd': 'cmd.exe',
            'terminal': 'wt.exe',
            'microsoft edge': 'msedge.exe',
            'chrome': 'chrome.exe',
            'discord': 'Discord.exe',
            'spotify': 'Spotify.exe',
            'whatsapp': 'WhatsApp.exe',
        }
    
    def execute(self, text: str) -> bool:
        """Open a website or program based on the command."""
        text = text.replace('abre', '').strip()
        
        # Check sites
        for site in self.sites:
            if site in text:
                sub.call(f"Start msedge.exe {self.sites[site]}", shell=True)
                self.assistant.speak(f"Abriendo {site}")
                return True
                
        # Check programs
        for program in self.programs:
            if program in text:
                sub.Popen(self.programs[program], shell=True)
                self.assistant.speak(f"Abriendo {program}")
                return True
                
        self.assistant.speak("No he encontrado el sitio o programa que me has pedido.")
        return False
        
    def get_description(self) -> str:
        return "Abre sitios web o programas"
