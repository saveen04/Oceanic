export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">About Oceanic</h1>
      <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
        Oceanic is a full-stack platform for monitoring ocean conditions and visualizing
        hazards such as tsunamis, cyclones, high waves, tides, storm surge, and coastal
        flooding. It combines external data sources (INCOIS, OpenWeatherMap) with a
        MongoDB-backed detection history and an interactive map.
      </p>

      <div className="mt-6 rounded-3xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-950">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-white">Key features</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-zinc-700 dark:text-zinc-200">
          <li>JWT authentication with protected routes</li>
          <li>Interactive disaster map (markers, heatmap, satellite layer)</li>
          <li>Weather monitoring by place name</li>
          <li>Detection history stored in MongoDB with filters</li>
          <li>Admin tools to manage users and remove incorrect reports</li>
        </ul>
      </div>
    </main>
  );
}

