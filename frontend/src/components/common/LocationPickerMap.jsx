import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import { storeIcon } from "./NepalBranchMap";

const NEPAL_CENTER = [28.3949, 84.124];

const ClickToPlace = ({ onPick }) => {
  useMapEvents({ click: (e) => onPick(e.latlng.lat, e.latlng.lng) });
  return null;
};

const Recenter = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) map.setView(position, Math.max(map.getZoom(), 11));
  }, [position, map]);
  return null;
};

/**
 * Small live preview shown while adding/editing a branch: displays the pin
 * at the entered coordinates, and clicking the map moves the pin (and calls
 * onPick so the form's latitude/longitude update). So the admin sees where
 * the branch actually is instead of just typing numbers.
 */
const LocationPickerMap = ({ latitude, longitude, onPick }) => {
  const lat = Number(latitude);
  const lng = Number(longitude);
  const valid = latitude !== "" && longitude !== "" && Number.isFinite(lat) && Number.isFinite(lng);
  const position = valid ? [lat, lng] : null;

  return (
    <div>
      <div className="relative z-0 rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700" style={{ height: 200, isolation: "isolate" }}>
        <MapContainer
          center={position || NEPAL_CENTER}
          zoom={position ? 11 : 6}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickToPlace onPick={onPick} />
          <Recenter position={position} />
          {position && <Marker position={position} icon={storeIcon} />}
        </MapContainer>
      </div>
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5">
        {valid
          ? "Click the map to fine-tune the pin position."
          : "Pick a city above, or click the map, to place the branch."}
      </p>
    </div>
  );
};

export default LocationPickerMap;
