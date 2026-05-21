import os
import time
import requests
from pymongo import MongoClient
from dotenv import load_dotenv
from pathlib import Path

# Absolute path resolution for .env.local
env_path = Path(__file__).parent.parent / ".env.local"
load_dotenv(dotenv_path=env_path)

import random

# Configuration
MONGODB_URI = os.getenv("MONGODB_URI")

COASTAL_LOCATIONS = [
    "Vizag, Andhra Pradesh", "Chennai, Tamil Nadu", "Kochi, Kerala", 
    "Mumbai, Maharashtra", "Goa", "Puri, Odisha", "Mangalore, Karnataka",
    "Port Blair, Andaman", "Daman & Diu", "Kolkata, West Bengal"
]

def generate_mock_data():
    """Generates realistic coastal wave, SST grid, and alert data."""
    waves = []
    sst_data = []
    alerts = []
    
    # 1. Coastal Waves
    for loc in COASTAL_LOCATIONS:
        height = round(random.uniform(0.5, 3.5), 1)
        waves.append({
            "location": loc,
            "waveHeight": height,
            "timestamp": time.time()
        })

        # Randomly generate an alert (1 in 10 chance)
        if random.random() < 0.1:
            alert_type = random.choice(["tsunami", "cyclone", "flood", "high_waves", "storm_surge"])
            alerts.append({
                "type": alert_type,
                "location": loc,
                "severity": random.choice(["low", "high", "critical"]),
                "timestamp": time.time()
            })
    
    # 2. Dense SST Grid (Indian Ocean / Bay of Bengal)
    # 5.0N to 25.0N, 65.0E to 95.0E
    for lat in range(5, 26, 2):
        for lng in range(65, 96, 2):
            # Base temp around 28C, with random variation
            temp = round(28.0 + random.uniform(-2.0, 3.0), 1)
            sst_data.append({
                "location": f"Buoy_{lat}_{lng}",
                "temp": temp,
                "lat": float(lat) + random.uniform(-0.5, 0.5),
                "lng": float(lng) + random.uniform(-0.5, 0.5),
                "timestamp": time.time()
            })
            
    return waves, sst_data, alerts

def sync_data():
    print("Connecting to MongoDB...")
    try:
        client = MongoClient(MONGODB_URI)
        db = client.oceanic
        waves_collection = db.waves
        sst_collection = db.sst
        disasters_collection = db.disasters

        print("Fetching Environmental Signals (SST, Waves, Tsunami)...")
        waves, sst_data, alerts = generate_mock_data()

        # Update Wave Data
        for wave in waves:
            waves_collection.update_one({"location": wave["location"]}, {"$set": wave}, upsert=True)
        
        # Update SST Data
        for sst in sst_data:
            sst_collection.update_one({"location": sst["location"]}, {"$set": sst}, upsert=True)
        
        # Update Alerts (Disaster Monitoring)
        for alert in alerts:
            existing = disasters_collection.find_one({
                "location": alert["location"],
                "type": alert["type"],
                "createdAt": {"$gt": time.time() - 3600} # One alert per hour per loc
            })
            if not existing:
                disasters_collection.insert_one({
                    "type": alert["type"],
                    "location": alert["location"],
                    "severity": alert["severity"],
                    "createdAt": alert["timestamp"],
                    "source": "INCOIS_MONITOR"
                })
                print(f"ALERT: New {alert['type'].upper()} signal detected in {alert['location']}")

        print(f"Sync complete. SST Heatmap updated. {len(alerts)} active monitors.")
        
    except Exception as e:
        print(f"Sync error: {e}")

if __name__ == "__main__":
    print("Oceanic Python Backend Service Started")
    print("Mode: REAL-TIME SIMULATION (INCOIS PROTOCOL)")
    while True:
        sync_data()
        print("Standby for next buoy sync (60s)...")
        time.sleep(60) # Sync every minute for high-frequency updates
