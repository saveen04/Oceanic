/**
 * Parses the specific Open-Meteo CSV format with multiple header sections.
 * @param {string} csvText
 */
export function parseOpenMeteoCsv(csvText) {
  const lines = csvText.split("\n").map(l => l.trim()).filter(Boolean);
  if (!lines.length) return null;

  const metadata = {};
  let dataPoints = [];
  
  // Basic metadata from first two lines
  try {
    const metaKeys = lines[0].split(",");
    const metaValues = lines[1].split(",");
    metaKeys.forEach((key, i) => {
      metadata[key] = metaValues[i];
    });
  } catch (e) {
    console.warn("Failed to parse metadata section", e);
  }

  // Find the header for the main data section
  // It usually starts with "time,pressure_msl..."
  const dataHeaderIdx = lines.findIndex(l => l.startsWith("time") && l.includes("wind_speed"));
  if (dataHeaderIdx === -1) return { metadata, data: [] };

  const headers = lines[dataHeaderIdx].split(",");
  for (let i = dataHeaderIdx + 1; i < lines.length; i++) {
    const values = lines[i].split(",");
    if (values.length < headers.length) continue;

    const entry = {};
    headers.forEach((h, j) => {
      // Clean headers like "wind_speed_10m (km/h)" to "wind_speed_10m"
      const cleanH = h.split(" ")[0];
      const val = values[j];
      entry[cleanH] = isNaN(parseFloat(val)) ? val : parseFloat(val);
    });
    dataPoints.push(entry);
  }

  return { metadata, data: dataPoints };
}
