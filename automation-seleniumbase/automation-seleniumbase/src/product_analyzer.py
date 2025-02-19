import os
import pandas as pd
import requests
from datetime import datetime
import json
import schedule
import time
from telegram_sender import TelegramSender
from dotenv import load_dotenv

load_dotenv()
BASE_DATA_DIR = os.getenv(r'BASE_DATA_DIR')
BASE_ANALYSIS_DIR = os.getenv(r'BASE_ANALYSIS_DIR')
AI_API_KEY = os.getenv('AI_API_KEY')
AI_API_URL = os.getenv(r'AI_API_URL')

class ProductAnalyzer:
    def __init__(self, base_data_dir=BASE_DATA_DIR, base_analysis_dir=BASE_ANALYSIS_DIR, ai_api_key=AI_API_KEY, ai_api_url=AI_API_URL):
        self.base_data_dir = base_data_dir
        self.base_analysis_dir = base_analysis_dir
        self.ai_api_url = ai_api_url
        self.ai_api_key = ai_api_key
        self.telegram = TelegramSender()
        
    def get_todays_files(self):
        """Get all CSV files from today in BASE_DATA_DIR"""
        today = datetime.now().strftime('%Y%m%d')
        files = []
        for file in os.listdir(self.base_data_dir):
            if file.endswith('.csv') and today in file:
                files.append(os.path.join(self.base_data_dir, file))
        return files

    def calculate_discount_percentage(self, row):
        """Calculate discount percentage from original and current price"""
        try:
            original = float(row['original_price'].replace('₫', '').replace(',', '').strip())
            current = float(row['current_price'].replace('₫', '').replace(',', '').strip())
            return ((original - current) / original) * 100
        except:
            return 0

    def analyze_products(self, df):
        """Send products to AI API for analysis"""
        products_text = df.to_json(orient='records')
        
        payload = {
            "mode": "query",
            "user": "oanhcuongdo",
            "message": f"""Analyze these products and identify interesting deals:
            {products_text}
            Focus on:
            1. Significant price drops (>50%)
            2. Popular or trending items
            3. Good value for money
            Provide a summary of the best deals."""
        }
        
        headers = {
            'Authorization': f'Bearer {self.ai_api_key}',
            'Content-Type': 'application/json'
        }
        
        response = requests.post(self.ai_api_url, json=payload, headers=headers)
        return response.json()

    def process_category_file(self, file_path):
        """Process a single category file"""
        category = os.path.basename(file_path).split('_')[0]
        df = pd.read_csv(file_path)
        
        # Remove duplicates keeping last occurrence based on product name
        df = df.drop_duplicates(subset=['product_name'], keep='last')
        
        df['discount_percentage'] = df.apply(self.calculate_discount_percentage, axis=1)
        significant_deals = df[df['discount_percentage'] > 50].sort_values('discount_percentage', ascending=False)

        # Get AI analysis
        analysis = self.analyze_products(significant_deals)
        
        return {
            'category': category,
            'deals': significant_deals.to_dict('records'),
            'ai_analysis': analysis
        }

    def results_to_csv(self, results):
        """Convert analysis results to CSV format"""
        rows = []
        for category_result in results:
            category = category_result['category']
            for deal in category_result['deals']:
                row = {
                    'category': category,
                    'product_name': deal['product_name'],
                    'discount_percentage': f"{deal['discount_percentage']:.2f}%",
                    'current_price': deal['current_price'],
                    'original_price': deal['original_price'],
                    'product_image_url': deal['product_image_url'],
                }
                rows.append(row)
        
        return pd.DataFrame(rows)

    def run_analysis(self):
        """Main function to run the analysis"""
        files = self.get_todays_files()
        results = []
        
        for file in files:
            try:
                result = self.process_category_file(file)
                results.append(result)
            except Exception as e:
                print(f"Error processing {file}: {str(e)}")

        analysis_dir = self.base_analysis_dir
        os.makedirs(analysis_dir, exist_ok=True)

        # Save JSON results
        json_file = os.path.join(analysis_dir, f'analysis.json')
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(results, f, ensure_ascii=False, indent=2)

        df = self.results_to_csv(results)
        csv_file = os.path.join(analysis_dir, f'analysis.csv')
        df.to_csv(csv_file, index=False, encoding='utf-8-sig')

        # self.telegram.send_message("🔥 Today's Best Deals 🔥")
        self.telegram.send_file(csv_file)
        
        print(f"Analysis saved to: {csv_file}")
        print("Results sent to Telegram successfully")
        
        return csv_file

def run_analysis():
    analyzer = ProductAnalyzer()
    try:
        analyzer.run_analysis()
    except Exception as e:
        print(f"Error during analysis: {str(e)}")

if __name__ == "__main__":
    run_analysis()
    schedule.every().day.at("00:10").do(run_analysis)
    schedule.every(6).hours.do(run_analysis)
    while True:
        schedule.run_pending()
        time.sleep(1)