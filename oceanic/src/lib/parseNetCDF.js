import fs from "fs";
import { ready, FS, File } from "h5wasm/node";

/**
 * Parses a NetCDF-4 (HDF5) file and extracts SST anomaly data.
 * @param {string} filePath - Path to the NetCDF file.
 * @returns {Promise<Object>} - Result object with success status and data.
 */
export async function parseNetCDF(filePath) {
    try {
        if (!fs.existsSync(filePath)) {
            return {
                success: false,
                error: `File not found: ${filePath}`
            };
        }

        // Initialize h5wasm
        await ready;

        // Read the file into a buffer
        const buffer = fs.readFileSync(filePath);
        
        // Use FS to create a virtual file in WASM
        const vPath = "temp_data.nc";
        FS.writeFile(vPath, new Uint8Array(buffer));

        // Open the file
        const file = new File(vPath, "r");

        // Helper to get dataset data
        const getDatasetData = (name) => {
            const ds = file.get(name);
            if (!ds) throw new Error(`Dataset not found: ${name}`);
            return ds.value;
        };

        // Extract variables
        const lats = getDatasetData("latitude");
        const lons = getDatasetData("longitude");
        const dsSst = file.get("sea_surface_temperature_anomaly");
        
        if (!dsSst) {
            throw new Error("SST anomaly dataset not found");
        }

        const anomalies = dsSst.value;
        const shape = dsSst.shape; // [time, latitude, longitude]
        
        const timeSize = shape[0];
        const latLen = shape[1];
        const lonLen = shape[2];

        // Take the last timestep
        const lastTimeIndex = timeSize - 1;

        let result = [];
        let stride = 5;

        for (let i = 0; i < latLen; i += stride) {
            for (let j = 0; j < lonLen; j += stride) {
                // Index calculation: t * (latLen * lonLen) + i * lonLen + j
                const index = lastTimeIndex * (latLen * lonLen) + i * lonLen + j;
                const val = anomalies[index];

                // Filter out NaNs or typical fill values
                if (val !== null && val !== undefined && !isNaN(val) && val > -100 && val < 50) {
                    result.push({
                        lat: parseFloat(lats[i]),
                        lon: parseFloat(lons[j]),
                        anomaly: parseFloat(val)
                    });
                }
            }
        }

        // Clean up
        file.close();
        FS.unlink(vPath);

        // Calculate median anomaly for summary
        let medianAnomaly = 0;
        if (result.length > 0) {
            const sorted = result.map(p => p.anomaly).sort((a, b) => a - b);
            medianAnomaly = sorted[Math.floor(sorted.length / 2)];
        }

        return {
            success: true,
            count: result.length,
            data: result,
            medianAnomaly,
            source: filePath.split(/[\\/]/).pop()
        };

    } catch (err) {
        console.error("NetCDF Parsing Error (h5wasm):", err);
        return {
            success: false,
            error: err.message
        };
    }
}
