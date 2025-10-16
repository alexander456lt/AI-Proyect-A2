import threading
from core.commands.base_command import BaseCommand
from . import color_utils

class ColorCommand(BaseCommand):
    """Command to detect colors with camera."""

    def execute(self, text: str) -> bool:
        """Start color detection with camera."""
        self.assistant.speak("Detectando colores")
        thread = threading.Thread(target=color_utils.capture)
        thread.daemon = True
        thread.start()
        return True

    def get_description(self) -> str:
        return "Detecta colores con la cámara"
