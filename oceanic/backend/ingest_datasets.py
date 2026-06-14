import csv
import json
import os
import requests
from datetime import datetime

# Configuration
DATASETS_DIR = "datasets"
PROJECT_ID = "oceanic-app-68b60"

def parse_coordinate_from_header(first_row):
    """Extracts latitude and longitude from the CSV header row."""
    try:
        lat = float(first_row[0])
        lng = float(first_row[1])
        return lat, lng
    except (ValueError, IndexError):
        return None, None

def ingest_csv(filepath):
    """Parses an Open-Meteo CSV and pushes it to Firestore."""
    filename = os.path.basename(filepath)
    print(f"[*] Processing {filename}...")
    
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        if not lines:
            return

        # 1. Parse Header for Coordinates
        reader = csv.reader([lines[1]]) # Coordinate row is often line 2
        header_vals = next(reader)
        lat, lng = parse_coordinate_from_header(header_vals)
        
        if lat is None:
            # Fallback: Try to parse from filename if header fails (e.g. open-meteo-54.54N10.21E...)
            import re
            match = re.search(r"(\d+\.\d+)N(\d+\.\d+)E", filename)
            if match:
                lat, lng = float(match.group(1)), float(match.group(2))
        
        if lat is None:
            print(f"[-] Could not determine coordinates for {filename}. Skipping.")
            return

        print(f"[+] Coordinates detected: {lat}, {lng}")

        # 2. Find Data Start
        # Hourly data usually starts after a secondary header line containing "time"
        data_start_idx = -1
        for i, line in enumerate(lines):
            if line.startswith("time,"):
                data_start_idx = i
                break
        
        if data_start_idx == -1:
            print(f"[-] Could not find data header in {filename}. Skipping.")
            return

        # 3. Parse Hourly Data
        data_lines = lines[data_start_idx:]
        reader = csv.DictReader(data_lines)
        
        records = []
        for row in reader:
            # Normalize fields
            # Note: Field names in CSV vary (e.g. "wave_height (m)")
            try:
                record = {
                    "lat": lat,
                    "lng": lng,
                    "location": f"Station {lat},{lng}",
                    "timestamp": row.get('time', ''),
                    "windSpeed": float(row.get('wind_speed_10m (km/h)', row.get('wind_speed_10m', 0)) or 0),
                    "windDirection": float(row.get('wind_direction_10m (°)', row.get('wind_direction_10m', 0)) or 0),
                    "waveHeight": float(row.get('wave_height (m)', row.get('wave_height', 0)) or 0),
                    "temp": float(row.get('sea_surface_temperature (°C)', row.get('sea_surface_temperature', 0)) or 0),
                    "currentVelocity": float(row.get('ocean_current_velocity (km/h)', row.get('ocean_current_velocity', 0)) or 0),
                    "currentDirection": float(row.get('ocean_current_direction (°)', row.get('ocean_current_direction', 0)) or 0)
                }
                records.append(record)
            except ValueError:
                continue

        print(f"[+] Parsed {len(records)} records for {filename}")
        
        # 4. Push to Firestore (Sample - pushing the most recent one to "telemetry" for immediate visibility
        # or push all to historical. For now, let's update the active telemetry.)
        if records:
            # We use the first record (closest to current time if the user just downloaded it)
            latest = records[0] 
            doc_id = f"station_{str(lat).replace('.','_')}_{str(lng).replace('.','_')}"
            update_firestore(latest, doc_id)

def update_firestore(data, doc_id):
    """Sends one telemetry record to the active Firestore sync collection."""
    collection = "telemetry"
    fields_to_mask = list(data.keys())
    mask_params = "&".join([f"updateMask.fieldPaths={f}" for f in fields_to_mask])
    
    url = f"https://firestore.googleapis.com/v1/projects/{PROJECT_ID}/databases/(default)/documents/{collection}/{doc_id}?{mask_params}"
    
    # Convert to Firestore JSON format
    firestore_data = {"fields": {}}
    for k, v in data.items():
        if isinstance(v, (int, float)):
            firestore_data["fields"][k] = {"doubleValue": float(v)}
        else:
            firestore_data["fields"][k] = {"stringValue": str(v)}
            
    try:
        response = requests.patch(url, json=firestore_data, timeout=10)
        if response.status_code == 200:
            print(f"[+] Successfully synced {doc_id} to Firestore.")
        else:
            print(f"[-] Failed to sync {doc_id}: {response.text}")
    except Exception as e:
        print(f"[-] Error syncing to Firestore: {e}")

if __name__ == "__main__":
    if not os.path.exists(DATASETS_DIR):
        print(f"[-] Datasets directory {DATASETS_DIR} not found.")
    else:
        for filename in os.listdir(DATASETS_DIR):
            if filename.endswith(".csv"):
                ingest_csv(os.path.join(DATASETS_DIR, filename))
