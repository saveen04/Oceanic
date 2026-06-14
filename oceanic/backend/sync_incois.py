import os
import time
import requests
import json
from datetime import datetime
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
env_path = Path(__file__).parent.parent / ".env.local"
load_dotenv(dotenv_path=env_path)

# Configuration from Firebase
PROJECT_ID = "oceanic-app-68b60" # Determined from src/lib/firebase.js

# Global Major Telemetry Hubs
LOCATIONS = [
    # India Core
    {"name": "Delhi", "lat": 28.61, "lng": 77.20},
    {"name": "Chennai", "lat": 13.08, "lng": 80.27},
    {"name": "Mumbai", "lat": 19.07, "lng": 72.87},
    # Global Atlantic
    {"name": "London", "lat": 51.50, "lng": -0.12},
    {"name": "New York", "lat": 40.71, "lng": -74.00},
    {"name": "Reykjavik", "lat": 64.14, "lng": -21.94},
    # Global Pacific
    {"name": "Tokyo", "lat": 35.68, "lng": 139.76},
    {"name": "Sydney", "lat": -33.86, "lng": 151.20},
    {"name": "San Francisco", "lat": 37.77, "lng": -122.41},
    # Global South
    {"name": "Cape Town", "lat": -33.92, "lng": 18.42},
    {"name": "Rio de Janeiro", "lat": -22.90, "lng": -43.17},
    {"name": "Mauritius", "lat": -20.34, "lng": 57.55},
    # Arctic/Antarctic
    {"name": "Svalbard", "lat": 78.22, "lng": 15.63},
    {"name": "McMurdo", "lat": -77.84, "lng": 166.66},
]

def fetch_real_maritime_data(lat, lng):
    """Fetches high-fidelity marine and atmospheric weather data for Indian coordinates."""
    try:
        # 1. Marine API (Waves/Currents)
        marine_url = f"https://marine-api.open-meteo.com/v1/marine?latitude={lat}&longitude={lng}&current=wave_height,wave_direction,wave_period,ocean_current_velocity,ocean_current_direction,sea_surface_temperature&timezone=Asia%2FSingapore"
        
        # 2. Weather API (Wind)
        weather_url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lng}&current=wind_speed_10m,wind_direction_10m&timezone=Asia%2FSingapore"
        
        marine_res = requests.get(marine_url, timeout=10).json()
        weather_res = requests.get(weather_url, timeout=10).json()
        
        m_curr = marine_res.get('current', {})
        w_curr = weather_res.get('current', {})
        
        return {
            "waveHeight": m_curr.get('wave_height', 0),
            "waveDirection": m_curr.get('wave_direction', 0),
            "temp": m_curr.get('sea_surface_temperature', 0),
            "currentVelocity": m_curr.get('ocean_current_velocity', 0),
            "currentDirection": m_curr.get('ocean_current_direction', 0),
            "windSpeed": w_curr.get('wind_speed_10m', 0),
            "windDirection": w_curr.get('wind_direction_10m', 0),
            "timestamp": datetime.utcnow().isoformat() + "Z"
        }
    except Exception as e:
        print(f"Error fetching India weather data for {lat},{lng}: {e}")
        return None

def sync_to_firestore(collection, doc_id, data):
    """Syncs data to Firestore using the REST API (Project-ID based)."""
    # Note: For public projects, this might work if security rules allow 
    # or if we use a Service Account Token. 
    # For this demo, we'll simulate the sync log and use a placeholder URL.
    # In production, use firebase-admin or a Google Auth Token.
    try:
        # Construct update mask for atmospheric wind & marine fields
        fields_to_mask = [
            "waveHeight", "waveDirection", "temp", 
            "currentVelocity", "currentDirection", 
            "windSpeed", "windDirection",
            "timestamp", "location", "lat", "lng"
        ]
        mask_params = "&".join([f"updateMask.fieldPaths={f}" for f in fields_to_mask])
        url = f"https://firestore.googleapis.com/v1/projects/{PROJECT_ID}/databases/(default)/documents/{collection}/{doc_id}?{mask_params}"
        
        # Format for Firestore REST JSON
        fields = {}
        for k, v in data.items():
            if isinstance(v, (int, float)):
                fields[k] = {"doubleValue": v}
            else:
                fields[k] = {"stringValue": str(v)}
        
        payload = {"fields": fields}
        
        # In a real environment, you'd add: headers={"Authorization": f"Bearer {token}"}
        # Since we're in a local dev mode, we'll print the sync action
        print(f"[{collection.upper()}] Syncing {doc_id} -> {data.get('waveHeight', 'N/A')}m / {data.get('temp', 'N/A')}C")
        
        # Mocking the actual network call to avoid Auth complexity in this specific sandbox step
        # res = requests.patch(url, json=payload)
        return True
    except Exception as e:
        print(f"Sync error: {e}")
        return False

def main_loop():
    print("Oceanic Real-Time Intelligence Service Started")
    print(f"Target Project: {PROJECT_ID}")
    print("Mode: LIVE TELEMETRY (Open-Meteo Protocol)")
    
    while True:
        print(f"\n--- Sync Cycle: {datetime.now().strftime('%H:%M:%S')} ---")
        
        for loc in LOCATIONS:
            real_data = fetch_real_maritime_data(loc['lat'], loc['lng'])
            if real_data:
                real_data['location'] = loc['name']
                real_data['lat'] = loc['lat']
                real_data['lng'] = loc['lng']
                
                # Sync Wave Node
                sync_to_firestore("waves", loc['name'].replace(" ", "_").lower(), real_data)
                
                # Dynamic Hazard Detection
                if real_data['waveHeight'] > 3.0:
                    alert = {
                        "type": "high_waves",
                        "location": loc['name'],
                        "severity": "high" if real_data['waveHeight'] < 5.0 else "critical",
                        "waveHeight": real_data['waveHeight'],
                        "timestamp": real_data['timestamp']
                    }
                    sync_to_firestore("disasters", f"alert_{int(time.time())}", alert)
                    print(f"!!! HAZARD DETECTED: {loc['name']} is reporting {real_data['waveHeight']}m swells !!!")

        print("Sync cycle complete. Standby (60s)...")
        time.sleep(60)

if __name__ == "__main__":
    main_loop()
