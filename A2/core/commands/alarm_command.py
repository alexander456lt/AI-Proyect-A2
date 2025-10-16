import datetime
import threading
from pygame import mixer
import keyboard
from core.commands.base_command import BaseCommand

class AlarmCommand(BaseCommand):
    """Command to set alarms."""
    
    def execute(self, text: str) -> bool:
        """Set an alarm based on the given time."""
        num = text.replace('alarma', '').strip()
        if not num:
            self.assistant.speak("¿A qué hora quieres la alarma?")
            return False
            
        self.assistant.speak(f"Alarma puesta para {num} horas")
        
        # Format time
        if num[0] != '0' and len(num) < 5:
            num = '0' + num
            
        def alarm_thread():
            while True:
                if datetime.datetime.now().strftime('%H:%M') == str(num):
                    print("Alarma sonando")
                    mixer.init()
                    mixer.music.load('alarma.mp3')
                    mixer.music.play()
                    
                    while True:
                        if keyboard.is_pressed('s'):
                            mixer.music.stop()
                            break
                    break
                    
        thread = threading.Thread(target=alarm_thread)
        thread.daemon = True
        thread.start()
        return True
        
    def get_description(self) -> str:
        return "Configura una alarma"
