#!/usr/bin/env python3
"""
A2 - Asistente Virtual Inteligente
==================================
Un asistente virtual con voz, integración con WhatsApp y múltiples comandos.
"""

import sys
import os
import threading

# Add core modules to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'core'))

from core.assistant import Assistant
from core.command_handler import CommandHandler

def main():
    """Main entry point for A2 assistant."""
    print("🤖 Iniciando A2 - Asistente Virtual Inteligente...")
    
    # Create assistant instance
    assistant = Assistant(name="A2")
    
    # Create command handler
    command_handler = CommandHandler(assistant)
    
    # Register commands with assistant
    commands = command_handler.get_available_commands()
    for keyword, description in commands.items():
        assistant.register_command(keyword, lambda text, kw=keyword: command_handler.execute(kw, text))
    
    # Start web dashboard in background thread
    from dashboard.web_dashboard import start_dashboard
    dashboard_thread = threading.Thread(target=start_dashboard, daemon=True)
    dashboard_thread.start()
    
    # Open dashboard in browser
    import webbrowser
    webbrowser.open("http://localhost:5000")
    
    # Ask user for mode
    mode = input("¿Modo chatbox o cortana? (chatbox/cortana): ").strip().lower()
    try:
        if mode == "chatbox":
            assistant.start_chatbox()
        else:
            assistant.start()
    except KeyboardInterrupt:
        print("\n👋 Cerrando A2...")
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        
if __name__ == "__main__":
    main()
