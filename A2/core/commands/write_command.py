import os
import subprocess as sub
from core.commands.base_command import BaseCommand

class WriteCommand(BaseCommand):
    """Command to write to text files."""
    
    def execute(self, text: str) -> bool:
        """Write text to a file."""
        try:
            with open('nota.txt', 'a') as f:
                self._write_to_file(f, text)
            return True
        except Exception as e:
            self.assistant.speak(f"Error al escribir: {str(e)}")
            return False
            
    def _write_to_file(self, f, text: str):
        """Internal method to write to file."""
        content = text.replace('escribe', '').strip()
        if content:
            f.write(content + os.linesep)
            f.close()
            self.assistant.speak("Hecho, he escrito lo que me has pedido")
            sub.Popen('nota.txt', shell=True)
        else:
            self.assistant.speak("¿Qué quieres escribir?")
            
    def get_description(self) -> str:
        return "Escribe en un archivo de texto"
