# 🌊 Oceanic Disaster Detection Platform

> Real-time Full-Stack Web Application for monitoring and visualizing ocean-related disasters including tsunami, cyclone, high waves, tides, storm surge, and coastal flooding 🚨🌊

Built using **Next.js, MongoDB, Tailwind CSS, Leaflet Maps, and Recharts** for real-time disaster analytics and visualization.

---

# ✨ Features

## 🌊 Ocean Disaster Monitoring

* 🌪️ Cyclone Detection
* 🌊 Tsunami Alerts
* 🌊 High Wave Monitoring
* 🌀 Storm Surge Tracking
* 🌧️ Coastal Flood Detection
* 🌊 Tide Visualization

---

## 🗺️ Interactive Maps

* Real-time disaster visualization
* Heatmap integration
* Satellite map support
* Coastal region monitoring

---

## 📊 Analytics Dashboard

* Disaster statistics
* Ocean condition charts
* Historical analysis
* Severity tracking

---

## 🔐 Authentication System

* User Signup/Login
* JWT Authentication
* Secure httpOnly Cookie Sessions
* Protected Routes
* Admin Access Control

---

## 📜 History Tracking

* Disaster event history
* Search & filter support
* Severity-based filtering
* Disaster type categorization

---

# 🚀 Tech Stack

| 🌟 Layer       | 💻 Technology           |
| -------------- | ----------------------- |
| Frontend       | Next.js 14 + React      |
| Styling        | Tailwind CSS            |
| Backend        | Next.js API Routes      |
| Database       | MongoDB + Mongoose      |
| Authentication | JWT + Cookies           |
| Maps           | Leaflet + React Leaflet |
| Heatmaps       | leaflet.heat            |
| Charts         | Recharts                |

---

# 📄 Main Pages

| 📌 Route     | 📖 Description             |
| ------------ | -------------------------- |
| `/`          | Home Page                  |
| `/login`     | Login Page                 |
| `/signup`    | Register Page              |
| `/dashboard` | Protected Dashboard        |
| `/map`       | Disaster Map Visualization |
| `/weather`   | Ocean Weather Monitoring   |
| `/disasters` | Disaster Reports           |
| `/history`   | Disaster History           |
| `/admin`     | Admin Control Panel        |
| `/about`     | About Platform             |

---

# ⚙️ Prerequisites

Before running the project install:

* ✅ Node.js 18+
* ✅ MongoDB
* ✅ npm
* ✅ Internet Connection for APIs

---

# 🚀 Installation Guide

## 1️⃣ Clone Repository

```bash id="e6j4kt"
git clone https://github.com/your-username/oceanic.git

cd oceanic
```

---

## 2️⃣ Setup Environment Variables

```bash id="j5g9tx"
cp .env.example .env.local
```

Add the required variables:

```env id="xnk9gm"
MONGODB_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret

OPENWEATHER_API_KEY=your_weather_key

INCOIS_SUMMARY_URL=your_incois_summary_url
INCOIS_API_KEY=your_incois_api_key

NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
```

---

# 🌐 Run Locally

## Install Dependencies

```bash id="v0k8bp"
npm install
```

---

## Start Development Server

```bash id="71ebwh"
npm run dev
```

🌍 Application runs on:

```bash id="17c9g7"
http://localhost:3000
```

---

# 🔥 Core Functionalities

✅ Real-Time Ocean Disaster Monitoring
✅ Interactive Disaster Maps
✅ Heatmap Visualization
✅ Weather Monitoring
✅ Disaster Analytics Dashboard
✅ Protected Authentication
✅ Admin Management System
✅ MongoDB Data Storage
✅ Historical Disaster Tracking

---

# 🗺️ Map Features

* 🛰️ Satellite View Support
* 🌡️ Heatmap Visualization
* 📍 Disaster Markers
* 🌊 Coastal Monitoring
* ⚡ Real-time Ocean Data

---

# 📊 Dashboard Features

* 📈 Disaster Statistics
* 🌊 Ocean Condition Charts
* 🚨 Severity Monitoring
* 📅 Historical Trends
* 📍 Region-wise Analysis

---

# 🔐 Authentication Features

* Secure Login & Signup
* JWT Token Verification
* httpOnly Cookie Sessions
* Middleware Route Protection
* Admin-only Routes

---

# 🌦️ API Integrations

## 🌤️ OpenWeatherMap

Used for:

* Weather conditions
* Ocean climate monitoring
* Wind & temperature analysis

---

## 🌊 INCOIS Integration

Used for:

* Ocean wave summaries
* Tsunami-related data
* Coastal warnings
* Marine condition monitoring

---

# 📡 Main API Routes

## 🔐 Authentication APIs

| Method | Endpoint           | Description   |
| ------ | ------------------ | ------------- |
| POST   | `/api/auth/signup` | Register User |
| POST   | `/api/auth/login`  | Login User    |
| GET    | `/api/auth/me`     | Current User  |
| POST   | `/api/auth/logout` | Logout User   |

---

## 🌊 Disaster APIs

| Method | Endpoint             | Description             |
| ------ | -------------------- | ----------------------- |
| GET    | `/api/disasters`     | Fetch Disaster Data     |
| POST   | `/api/disasters`     | Create Disaster Record  |
| DELETE | `/api/disasters/:id` | Delete Disaster (Admin) |

---

## 📜 History APIs

| Method | Endpoint       | Description      |
| ------ | -------------- | ---------------- |
| GET    | `/api/history` | Disaster History |

---

## 🌤️ Weather APIs

| Method | Endpoint                 | Description  |
| ------ | ------------------------ | ------------ |
| GET    | `/api/weather?q=Chennai` | Weather Data |

---

## 🌊 INCOIS APIs

| Method | Endpoint              | Description   |
| ------ | --------------------- | ------------- |
| GET    | `/api/incois/summary` | Ocean Summary |

---

# 🗄️ Database Collections

## 👤 Users Collection

```js id="81w9wp"
{
  name,
  email,
  password,
  role,
  createdAt
}
```

---

## 🌊 Disasters Collection

```js id="4n3b0z"
{
  title,
  type,
  severity,
  location,
  coordinates,
  description,
  createdAt
}
```

---

# 📂 Important Commands

## Start Development Server

```bash id="sl5h6n"
npm run dev
```

---

## Install Dependencies

```bash id="lsvr0t"
npm install
```

---

## Build Production

```bash id="iq3e44"
npm run build
```

---

## Start Production Server

```bash id="17grb4"
npm start
```

---

# 🌟 Future Enhancements

* 🤖 AI-based disaster prediction
* 📱 Mobile app support
* ☁️ Cloud deployment
* 🔔 Real-time notifications
* 🌍 Global ocean monitoring
* 📡 Live satellite integration
* 🧠 Machine learning analytics

---

# 📜 Notes

* 🔐 Protected routes are handled using `middleware.js`
* 🌊 INCOIS API includes fallback mock data support
* 🛰️ Mapbox token enables advanced satellite maps
* 🌍 ESRI satellite maps are used as fallback

---

# ❤️ Developed With

* ⚛️ Next.js
* 🌊 Leaflet Maps
* 🍃 MongoDB
* 🎨 Tailwind CSS
* 📊 Recharts
* 🚀 Node.js
