import json
import os
from pymongo import MongoClient

# MongoDB Connection String
MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://abhinavjammalamadaka_db_user:tQRrD4FG0tjzfMiI@cluster0.x18fwuk.mongodb.net/?appName=Cluster0")
DB_NAME = "fiscalmind"

def seed_data():
    try:
        client = MongoClient(MONGO_URI)
        db = client[DB_NAME]
        
        # Load sample data
        data_path = "sample_budget_data.json"
        if not os.path.exists(data_path):
            print(f"Error: {data_path} not found.")
            return

        with open(data_path, 'r') as f:
            budget_data = json.load(f)

        # Clear existing collections
        db.budgets.delete_many({})
        db.sectors.delete_many({})
        print("Cleared existing data.")

        # Insert Budget Data
        for year_data in budget_data:
            budget_doc = {
                "year": year_data["year"],
                "total_expenditure": year_data["total_expenditure"],
                "total_receipts": year_data["total_receipts"],
                "fiscal_deficit": year_data["fiscal_deficit"]
            }
            db.budgets.insert_one(budget_doc)
            print(f"Inserted budget for {year_data['year']}")

            # Insert Sector Data
            for sector in year_data["sectors"]:
                sector_doc = {
                    "name": sector["name"],
                    "budget_year": year_data["year"],
                    "allocation": sector["allocation"],
                    "description": sector["description"],
                    "schemes": [],  # Can be enriched
                    "policies": []
                }
                db.sectors.insert_one(sector_doc)
            print(f"Inserted {len(year_data['sectors'])} sectors.")

        print("Seeding complete.")

    except Exception as e:
        print(f"An error occurred: {e}")
        print("Ensure MongoDB is running and pymongo is installed (pip install pymongo).")

if __name__ == "__main__":
    seed_data()
