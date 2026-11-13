import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Nepal's rough center — used as the default map view.
const NEPAL_CENTER = [28.3949, 84.124];

// A simple store-pin icon built from a div, so we never depend on Leaflet's
// default marker image paths (which break under most bundlers).
export const storeIcon = L.divIcon({
  className: "",
  html: `<div style="
    width:30px;height:30px;border-radius:50% 50% 50% 0;
    background:#2563eb;transform:rotate(-45deg);
    display:flex;align-items:center;justify-content:center;
    box-shadow:0 2px 6px rgba(0,0,0,0.35);border:2px solid white;
  ">
    <span style="transform:rotate(45deg);font-size:14px;">🏬</span>
  </div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 28],
  popupAnchor: [0, -26],
});

// Same pin in red for a branch that currently has products needing restock,
// so low-stock warehouses stand out on the map at a glance.
const alertIcon = L.divIcon({
  className: "",
  html: `<div style="
    width:30px;height:30px;border-radius:50% 50% 50% 0;
    background:#dc2626;transform:rotate(-45deg);
    display:flex;align-items:center;justify-content:center;
    box-shadow:0 2px 6px rgba(0,0,0,0.35);border:2px solid white;
  ">
    <span style="transform:rotate(45deg);font-size:14px;">🏬</span>
  </div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 28],
  popupAnchor: [0, -26],
});

// Flies to + opens the popup of whichever branch is "selected" (e.g. when
// an admin clicks a branch card below the map).
const FocusSelected = ({ selectedId, markerRefs, branches }) => {
  const map = useMap();
  useEffect(() => {
    if (!selectedId) return;
    const branch = branches.find((b) => b._id === selectedId);
    if (!branch) return;
    map.flyTo([branch.latitude, branch.longitude], 11, { duration: 0.8 });
    const marker = markerRefs.current[selectedId];
    if (marker) setTimeout(() => marker.openPopup(), 850);
  }, [selectedId, branches, map, markerRefs]);
  return null;
};

/**
 * Renders branches (real backend data — lat/lng come from the Branch model)
 * as pins on a Nepal-centered OpenStreetMap. Every marker reflects an actual
 * document in the Branch collection; hovering/clicking shows the branch's
 * name, location and (when analytics are supplied) orders and stock.
 */
const NepalBranchMap = ({ branches = [], height = 360, selectedId = null }) => {
  const markerRefs = useRef({});
  const validBranches = branches.filter(
    (b) => typeof b.latitude === "number" && typeof b.longitude === "number"
  );

  return (
    <div
      className="relative z-0 rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-800"
      // isolation keeps Leaflet's internal panes (z-index up to 700) from
      // painting on top of modals/dropdowns elsewhere on the page.
      style={{ height, isolation: "isolate" }}
    >
      <MapContainer
        center={NEPAL_CENTER}
        zoom={7}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FocusSelected selectedId={selectedId} markerRefs={markerRefs} branches={validBranches} />

        {validBranches.map((branch) => (
          <Marker
            key={branch._id}
            position={[branch.latitude, branch.longitude]}
            icon={branch.lowStockCount > 0 ? alertIcon : storeIcon}
            title={`${branch.name} — ${branch.city}`}
            ref={(m) => {
              if (m) markerRefs.current[branch._id] = m;
            }}
          >
            <Popup>
              <div style={{ minWidth: 170 }}>
                <p style={{ fontWeight: 600, marginBottom: 2 }}>{branch.name}</p>
                <p style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>{branch.city}, Nepal</p>
                {branch.address && (
                  <p style={{ fontSize: 12, color: "#64748b" }}>{branch.address}</p>
                )}
                {typeof branch.orders === "number" && (
                  <p style={{ fontSize: 12, marginTop: 4 }}>
                    <strong>{branch.orders}</strong> orders · <strong>{branch.totalStock ?? 0}</strong> units in stock
                  </p>
                )}
                {branch.lowStockCount > 0 && (
                  <p style={{ fontSize: 12, marginTop: 4, color: "#b45309", fontWeight: 600 }}>
                    ⚠ {branch.lowStockCount} product{branch.lowStockCount === 1 ? "" : "s"} low on stock
                  </p>
                )}
                <span
                  style={{
                    display: "inline-block",
                    marginTop: 6,
                    fontSize: 11,
                    padding: "2px 8px",
                    borderRadius: 999,
                    background: branch.status === "active" ? "#d1fae5" : "#f1f5f9",
                    color: branch.status === "active" ? "#059669" : "#64748b",
                  }}
                >
                  {branch.status}
                </span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default NepalBranchMap;
