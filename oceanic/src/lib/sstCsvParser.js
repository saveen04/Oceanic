export function parseSstCsv(csvText) {
  const lines = csvText.split("\n").map(l => l.trim()).filter(Boolean);
  if (!lines.length) return null;

  const dataPoints = [];
  
  // The SST CSV has two time-series sections. 
  // We'll look for the second one which seems more complete (line 7 onwards)
  // Or just find all lines that start with a date-time 2026-
  
  lines.forEach(line => {
    if (line.startsWith("2026-")) {
      const [time, sst] = line.split(",");
      if (time && sst && !isNaN(parseFloat(sst))) {
        dataPoints.push({
          time: time,
          sst: parseFloat(sst)
        });
      }
    }
  });

  return { data: dataPoints };
}
