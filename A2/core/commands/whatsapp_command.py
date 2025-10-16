import pywhatkit
from core.commands.base_command import BaseCommand

class WhatsAppCommand(BaseCommand):
    """Command to send WhatsApp messages."""
    
    def execute(self, text: str) -> bool:
        """Send WhatsApp messages via terminal."""
        try:
            nombre = input("Nombre o grupo: ").strip()
            mensaje = input("Mensaje: ").strip()
            mensaje = f"{mensaje}\natt: A2"
            hora = int(input("Hora de envío (0-23): "))
            minuto = int(input("Minuto de envío (0-59): "))
            
            with open("contactos.txt", "r", encoding="utf-8") as f:
                contactos = {}
                for linea in f:
                    partes = linea.strip().split(",")
                    if len(partes) == 2:
                        contactos[partes[0].lower()] = partes[1]
                        
                if nombre in contactos:
                    destino = contactos[nombre]
                    if destino.startswith("+"):
                        pywhatkit.sendwhatmsg(destino, mensaje, hora, minuto)
                    else:
                        pywhatkit.sendwhatmsg_to_group(destino, mensaje, hora, minuto)
                    print("Mensaje programado.")
                    return True
                else:
                    print("No se encontró el contacto o grupo.")
                    return False
                    
        except Exception as e:
            self.assistant.speak(f"Error al enviar mensaje: {str(e)}")
            return False
            
    def get_description(self) -> str:
        return "Envía mensajes por WhatsApp"
