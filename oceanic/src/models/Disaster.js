import mongoose from "mongoose";

const DisasterSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["tsunami", "cyclone", "high_waves", "tide", "storm_surge", "coastal_flooding"],
      required: true,
    },
    location: { type: String, required: true, trim: true },
    latitude: { type: Number, required: true, min: -90, max: 90 },
    longitude: { type: Number, required: true, min: -180, max: 180 },
    severity: { type: String, enum: ["low", "moderate", "high", "critical"], default: "low" },
    waveHeight: { type: Number, default: null },
    tideLevel: { type: Number, default: null },
    source: { type: String, default: "manual" }, // manual | incois | noaa | ...
    meta: { type: Object, default: {} },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

DisasterSchema.index({ createdAt: -1 });

export const Disaster =
  mongoose.models.Disaster || mongoose.model("Disaster", DisasterSchema);

