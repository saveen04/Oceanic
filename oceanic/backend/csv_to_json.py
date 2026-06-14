import csv
import json
import os
import re
import math

# Configuration
DATASETS_DIR = "datasets"
OUTPUT_FILE = "src/data/telemetry_data.json"

def clean_val(val, default=0):
    """Sanitizes values to ensure they are JSON serializable (no NaN)."""
    try:
        f_val = float(val)
        if math.isnan(f_val): return default
        return f_val
    except (ValueError, TypeError):
        return default

def parse_coordinate_from_filename(filename):
    """Extracts latitude and longitude from the CSV filename."""
    match = re.search(r"(\d+\.\d+)N(\d+\.\d+)E", filename)
    if match:
        return float(match.group(1)), float(match.group(2))
    return None, None

def parse_csv_to_records(filepath):
    """Parses an Open-Meteo CSV and returns a list of normalized records."""
    records = []
    filename = os.path.basename(filepath)
    lat, lng = parse_coordinate_from_filename(filename)
    
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        if not lines: return []

        # Find data start
        data_start_idx = -1
        for i, line in enumerate(lines):
            if line.startswith("time,"):
                data_start_idx = i
                break
        
        if data_start_idx == -1: return []

        data_lines = lines[data_start_idx:]
        reader = csv.DictReader(data_lines)
        
        for row in reader:
            try:
                # Map various CSV column names to normalized ones
                record = {
                    "lat": lat or 54.54, 
                    "lng": lng or 10.21,
                    "timestamp": row.get('time', ''),
                    "windSpeed": clean_val(row.get('wind_speed_10m (km/h)', row.get('wind_speed_10m', 0))),
                    "windDirection": clean_val(row.get('wind_direction_10m (°)', row.get('wind_direction_10m', 0))),
                    "waveHeight": clean_val(row.get('wave_height (m)', row.get('wave_height', 0))),
                    "temp": clean_val(row.get('sea_surface_temperature (°C)', row.get('sea_surface_temperature', 0))),
                    "currentVelocity": clean_val(row.get('ocean_current_velocity (km/h)', row.get('ocean_current_velocity', 0))),
                    "currentDirection": clean_val(row.get('ocean_current_direction (°)', row.get('ocean_current_direction', 0)))
                }
                records.append(record)
            except (ValueError, TypeError):
                continue
    return records

def main():
    if not os.path.exists("src/data"):
        os.makedirs("src/data")
        
    all_stations = {}
    
    for filename in os.listdir(DATASETS_DIR):
        if filename.endswith(".csv"):
            filepath = os.path.join(DATASETS_DIR, filename)
            station_records = parse_csv_to_records(filepath)
            if station_records:
                station_id = f"station_{filename.split('.')[0].replace(' ', '_')}"
                all_stations[station_id] = station_records
                print(f"[+] Ingested {len(station_records)} records for {station_id}")

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(all_stations, f, indent=2)
        print(f"\n[!] Success: Combined dataset saved to {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
