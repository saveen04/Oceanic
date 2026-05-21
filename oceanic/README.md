# Oceanic

Full-stack real-time platform to **detect and visualize ocean-related disasters**:
tsunami, cyclone, high waves, tides, storm surge, and coastal flooding.

## Tech stack

- **Frontend**: Next.js (App Router) + JavaScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: MongoDB + Mongoose
- **Auth**: JWT (httpOnly cookie session)
- **Maps**: Leaflet (`react-leaflet`) + Heatmap (`leaflet.heat`)
- **Charts**: Recharts

## Pages

- `/` Home
- `/login`, `/signup`
- `/dashboard` (protected)
- `/map` (protected)
- `/weather` (protected)
- `/disasters` (protected)
- `/history` (protected)
- `/admin` (admin only)
- `/about`

## Environment variables

Copy the example and fill in values:

```bash
cp .env.example .env.local
```

Required:

- **`MONGODB_URI`**: MongoDB connection string
- **`JWT_SECRET`**: secret used to sign/verify JWTs

Optional (features still work with mocks if missing):

- **`OPENWEATHER_API_KEY`**: OpenWeatherMap key (Weather page)
- **INCOIS adapter** (Dashboard + Map waves):
  - **`INCOIS_SUMMARY_URL`** (recommended) + **`INCOIS_API_KEY`**
  - or **`INCOIS_BASE_URL`** + **`INCOIS_SUMMARY_PATH`** + **`INCOIS_API_KEY`**
  - optional: **`INCOIS_API_KEY_HEADER`** (defaults to `x-api-key`)
- **`NEXT_PUBLIC_MAPBOX_TOKEN`**: enables Mapbox satellite; otherwise the map uses ESRI satellite imagery

## Run locally

Install and start:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## API routes (main)

- **Auth**
  - `POST /api/auth/signup`
  - `POST /api/auth/login`
  - `GET /api/auth/me`
  - `POST /api/auth/logout`
- **Disasters (MongoDB)**
  - `GET /api/disasters?limit=50&type=...&severity=...`
  - `POST /api/disasters`
  - `DELETE /api/disasters/:id` (admin only)
- **History**
  - `GET /api/history?limit=200&type=...&severity=...&q=...`
- **Weather (OpenWeatherMap)**
  - `GET /api/weather?q=Chennai`
- **INCOIS (adapter)**
  - `GET /api/incois/summary`

## Notes

- **Protected routes** are enforced via `middleware.js` using JWT verification (Edge runtime).
- For INCOIS, this project includes a **safe adapter endpoint** (`/api/incois/summary`) that returns mock data unless you configure `INCOIS_BASE_URL` + `INCOIS_API_KEY`.
  Prefer `INCOIS_SUMMARY_URL` if your endpoint is a full URL.

