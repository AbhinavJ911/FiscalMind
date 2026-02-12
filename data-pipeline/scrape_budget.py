import requests
from bs4 import BeautifulSoup
import json
import time

# URL of the official Union Budget website (Example)
BASE_URL = "https://www.indiabudget.gov.in/budget2024-25/glance.php"

def scrape_budget_glance():
    print(f"Scraping {BASE_URL}...")
    try:
        # In a real scenario, we would make a request
        # response = requests.get(BASE_URL)
        # soup = BeautifulSoup(response.content, 'html.parser')
        
        # Mocking the scraped data for stability in this demo
        time.sleep(1) 
        
        scraped_data = {
            "year": "2024-2025",
            "summary": {
                "total_receipts": 3080274,
                "total_expenditure": 4765768,
                "fiscal_deficit_percent": 5.1
            },
            "source": BASE_URL
        }
        
        print("Scraping successful.")
        return scraped_data
        
    except Exception as e:
        print(f"Error scraping data: {e}")
        return None

def save_to_json(data, filename="scraped_budget_data.json"):
    with open(filename, 'w') as f:
        json.dump(data, f, indent=4)
    print(f"Data saved to {filename}")

if __name__ == "__main__":
    data = scrape_budget_glance()
    if data:
        save_to_json(data)
