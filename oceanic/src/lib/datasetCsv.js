import fs from "node:fs";
import path from "node:path";

// Lightweight CSV parser for simple, comma-delimited files with a header row.
export function loadOceanCsv() {
  const csvPath = process.env.OCEANIC_DATASET_CSV;
  if (!csvPath) return null;

  const absPath = path.isAbsolute(csvPath)
    ? csvPath
    : path.join(process.cwd(), csvPath);

  if (!fs.existsSync(absPath)) {
    throw new Error(`CSV dataset not found at ${absPath}`);
  }

  const raw = fs.readFileSync(absPath, "utf8");
  const lines = raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
  if (lines.length < 2) return { rows: [] };

  const header = lines[0].split(",").map((h) => h.trim());
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",").map((c) => c.trim());
    const row = {};
    header.forEach((h, idx) => {
      row[h] = cols[idx] ?? "";
    });
    rows.push(row);
  }

  return { header, rows, path: absPath };
}

