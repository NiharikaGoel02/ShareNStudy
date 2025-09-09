// routes/ngo.routes.js
import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { location } = req.query;
    if (!location) {
      return res.status(400).json({ error: "Location is required" });
    }

    // 1️⃣ Geocode location using Nominatim
    const geoRes = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: {
        q: location,
        format: "json",
        limit: 1,
      },
    });

    if (!geoRes.data.length) {
      return res.json({ ngos: [] });
    }

    const { lat, lon } = geoRes.data[0];

    // 2️⃣ Fetch NGOs using Overpass API
    const radius = 5000; // 5 km
    const overpassQuery = `
      [out:json][timeout:25];
      (
        node["amenity"="social_facility"](around:${radius},${lat},${lon});
        way["amenity"="social_facility"](around:${radius},${lat},${lon});
        relation["amenity"="social_facility"](around:${radius},${lat},${lon});
      );
      out center;
    `;

    const ngosRes = await axios.get("https://overpass-api.de/api/interpreter", {
      params: { data: overpassQuery },
      timeout: 20000,
    });

    const results = ngosRes.data.elements.map((el) => {
      const tags = el.tags || {};
      const centerLat = el.lat || el.center?.lat || null;
      const centerLon = el.lon || el.center?.lon || null;

      return {
        name: tags.name || "Unknown NGO",
        address: tags["addr:full"] || tags["addr:street"] || "Address not available",
        phone: tags.phone || null,
        website: tags.website || null,
        lat: centerLat,
        lon: centerLon,
      };
    }).filter(ngo => ngo.lat && ngo.lon); // remove entries without coordinates

    res.json({ ngos: results });
  } catch (err) {
    console.error("NGO API error:", err.message);
    res.status(500).json({ error: "Failed to fetch NGOs. Please try again later." });
  }
});

export default router;
