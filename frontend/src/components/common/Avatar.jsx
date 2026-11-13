import { useState } from "react";
import { getImageUrl } from "../../utils/imageUrl";

const PALETTE = [
  "bg-blue-500", "bg-emerald-500", "bg-amber-500",
  "bg-indigo-500", "bg-rose-500", "bg-purple-500", "bg-teal-500",
];

const initialsOf = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("") || "?";

const colorFor = (name = "") =>
  PALETTE[(name.charCodeAt(0) || 0) % PALETTE.length];

/**
 * Reusable avatar: shows the uploaded image when present, falls back to a
 * colored initials circle if there's no image or the image fails to load.
 * Never renders a broken-image icon.
 */
const Avatar = ({ name = "", src, size = 40, className = "" }) => {
  const [failed, setFailed] = useState(false);
  const url = getImageUrl(src);

  if (url && !failed) {
    return (
      <img
        src={url}
        alt={name || "avatar"}
        style={{ width: size, height: size }}
        className={`rounded-full object-cover flex-shrink-0 border border-gray-200 dark:border-slate-700 ${className}`}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <div
      style={{ width: size, height: size, fontSize: size * 0.38 }}
      className={`rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 ${colorFor(name)} ${className}`}
    >
      {initialsOf(name)}
    </div>
  );
};

export default Avatar;
