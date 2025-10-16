from core.commands.base_command import BaseCommand

class ContactCommand(BaseCommand):
    """Command to add new contacts."""
    
    def execute(self, text: str) -> bool:
        """Add a new contact to the contacts file."""
        try:
            nombre = input("Nombre del contacto o grupo: ").strip().lower()
            dato = input("Número (+34...) o ID de grupo: ").strip()
            with open("contactos.txt", "a", encoding="utf-8") as f:
                f.write(f"{nombre},{dato}\n")
            print("Contacto/Grupo guardado.")
            return True
        except Exception as e:
            self.assistant.speak(f"Error al guardar contacto: {str(e)}")
            return False
            
    def get_description(self) -> str:
        return "Agrega nuevos contactos"
