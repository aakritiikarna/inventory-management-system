// Approximate city-center coordinates for Nepal, used to pre-fill a
// branch's map position when the admin picks a city. These are real
// locations (not random), but only city-level — the admin can refine the
// pin by clicking the preview map or editing latitude/longitude.
export const NEPAL_CITIES = {
  Kathmandu: { latitude: 27.7172, longitude: 85.324 },
  Lalitpur: { latitude: 27.6588, longitude: 85.3247 },
  Bhaktapur: { latitude: 27.671, longitude: 85.4298 },
  Pokhara: { latitude: 28.2096, longitude: 83.9856 },
  Biratnagar: { latitude: 26.4525, longitude: 87.2718 },
  Bharatpur: { latitude: 27.6833, longitude: 84.4333 },
  Butwal: { latitude: 27.7006, longitude: 83.4484 },
  Dharan: { latitude: 26.8065, longitude: 87.2846 },
  Nepalgunj: { latitude: 28.05, longitude: 81.6167 },
  Hetauda: { latitude: 27.4287, longitude: 85.0322 },
  Janakpur: { latitude: 26.7288, longitude: 85.9266 },
  Birgunj: { latitude: 27.0104, longitude: 84.877 },
  Dhangadhi: { latitude: 28.6833, longitude: 80.6 },
  Itahari: { latitude: 26.6667, longitude: 87.2833 },
};

export const findCityCoords = (cityName) => {
  const key = Object.keys(NEPAL_CITIES).find(
    (c) => c.toLowerCase() === String(cityName || "").trim().toLowerCase()
  );
  return key ? NEPAL_CITIES[key] : null;
};
