import webbrowser
import pyautogui as at
import time


def send_message(contact, message):
    try:
        webbrowser.open(f"https://web.whatsapp.com/send?phone={contact}&text={message}")
        time.sleep(10)  # Espera a que se abra WhatsApp Web
        at.press('enter')  # Envía el mensaje
        print(f"Mensaje enviado a {contact}: {message}")
    except Exception as e:
        print(f"Error al enviar mensaje: {e}")