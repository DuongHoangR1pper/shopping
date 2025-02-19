import os
import requests
from dotenv import load_dotenv

load_dotenv()
TELE_BOT_TOKEN = os.getenv('TELE_BOT_TOKEN')
TELE_CHAT_ID = os.getenv('TELE_CHAT_ID')

class TelegramSender:
    def __init__(self, bot_token=TELE_BOT_TOKEN, chat_id=TELE_CHAT_ID):
        self.bot_token = bot_token
        self.chat_id = chat_id
        
    def send_message(self, message):
        """Send a text message via Telegram bot"""
        msg_url = f"https://api.telegram.org/bot{self.bot_token}/sendMessage"
        response = requests.post(msg_url, data={"chat_id": self.chat_id, "text": message})
        return response.status_code == 200

    def send_file(self, file_path):
        """Send a file via Telegram bot"""
        with open(file_path, "rb") as file:
            url = f"https://api.telegram.org/bot{self.bot_token}/sendDocument"
            response = requests.post(url, data={"chat_id": self.chat_id}, files={"document": file})
            
            if response.status_code == 200:
                print(f"File {file_path} sent successfully.")
                return True
            else:
                print(f"Failed to send {file_path}. Response: {response.text}")
                return False