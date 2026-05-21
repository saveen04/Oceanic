"use client";

export function TimelineControl({
  times,
  index,
  setIndex,
  playing,
  setPlaying,
  speed,
  setSpeed,
}) {
  const t = times?.[index] || null;

  return (
    <div className="pointer-events-auto w-full border-t border-black/10 bg-white/85 px-4 py-3 backdrop-blur dark:border-white/10 dark:bg-zinc-950/70">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPlaying(!playing)}
            className="rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white"
          >
            {playing ? "Pause" : "Play"}
          </button>
          <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-200">
            Speed
            <select
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="rounded-xl border border-black/10 bg-white px-2 py-1 text-sm dark:border-white/10 dark:bg-zinc-950"
            >
              <option value={1}>1×</option>
              <option value={2}>2×</option>
              <option value={4}>4×</option>
              <option value={8}>8×</option>
            </select>
          </label>
        </div>

        <div className="text-xs text-zinc-600 dark:text-zinc-300">
          Time (UTC): <span className="font-semibold">{t || "—"}</span>
        </div>
      </div>

      <input
        type="range"
        min={0}
        max={Math.max(0, (times?.length || 1) - 1)}
        value={index}
        onChange={(e) => setIndex(Number(e.target.value))}
        className="mt-3 w-full"
      />
    </div>
  );
}

