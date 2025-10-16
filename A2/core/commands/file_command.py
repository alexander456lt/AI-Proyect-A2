import subprocess as sub
from core.commands.base_command import BaseCommand

class FileCommand(BaseCommand):
    """Command to open files."""
    
    def __init__(self, assistant):
        super().__init__(assistant)
        self.files = {
            'colores': 'colores.py',
            'cortana': '__main__.py',
            'notas': 'nota.txt',
            '__pycache__': '__pycache__'
        }
    
    def execute(self, text: str) -> bool:
        """Open a file based on the command."""
        file = text.replace('archivo', '').strip()
        
        if file in self.files:
            sub.Popen(self.files[file], shell=True)
            self.assistant.speak(f"Abriendo {file}")
            return True
        else:
            self.assistant.speak("No he encontrado el archivo que me has pedido.")
            return False
            
    def get_description(self) -> str:
        return "Abre archivos"
