import mongoose from "mongoose";

const WeatherSchema = new mongoose.Schema(
  {
    location: { type: String, required: true, trim: true },
    temperature: { type: Number, required: true },
    wind: { type: Number, required: true },
    humidity: { type: Number, required: true },
    rainProbability: { type: Number, default: null },
    stormAlert: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now },
    raw: { type: Object, default: {} },
  },
  { timestamps: false }
);

WeatherSchema.index({ timestamp: -1 });

export const Weather =
  mongoose.models.Weather || mongoose.model("Weather", WeatherSchema);

