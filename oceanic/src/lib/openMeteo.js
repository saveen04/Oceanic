export function normalizeOpenMeteoHourly(result) {
  const hourly = result?.hourly;
  if (!hourly || !Array.isArray(hourly.time)) return null;

  const times = hourly.time;
  const out = times.map((t, i) => ({
    time: t,
    wind_speed_10m: hourly.wind_speed_10m?.[i] ?? null,
    temperature_2m: hourly.temperature_2m?.[i] ?? null,
    relative_humidity_2m: hourly.relative_humidity_2m?.[i] ?? null,
  }));

  return out;
}

export function findNearestTimeIndex(times, targetIso) {
  if (!Array.isArray(times) || times.length === 0) return 0;
  if (!targetIso) return 0;
  const target = new Date(targetIso).getTime();
  if (!Number.isFinite(target)) return 0;

  let bestIdx = 0;
  let bestDiff = Infinity;
  for (let i = 0; i < times.length; i++) {
    const ms = new Date(times[i]).getTime();
    const diff = Math.abs(ms - target);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestIdx = i;
    }
  }
  return bestIdx;
}

