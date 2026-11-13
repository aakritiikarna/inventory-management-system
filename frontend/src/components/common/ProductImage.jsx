import { useState } from "react";
import { getProductImage, buildPlaceholder } from "../../utils/productImages";

/**
 * Single reusable way to render a product image anywhere in the app
 * (Products, Orders, Dashboard, Reports, Invoice). Handles:
 *   1. Real uploaded backend image
 *   2. A keyword/category-matched icon placeholder (inline SVG — can't
 *      fail to load, unlike a hotlinked stock photo)
 *   3. A plain initials placeholder, only if #1 fails to load at runtime
 *      (e.g. the uploaded file was since deleted from disk)
 *
 * Never renders a broken-image icon or empty box.
 */
const ProductImage = ({ product, size = 44, rounded = "rounded-lg", className = "" }) => {
  const primary = getProductImage(product, size);
  const hasRealImage = Boolean(product?.image);
  const placeholder = buildPlaceholder(product?.productName, size);

  const [failedSrc, setFailedSrc] = useState(null);
  const src = primary && primary === failedSrc ? placeholder : primary || placeholder;

  const handleError = () => {
    // Only the real-upload path can actually fail a network/file load —
    // the icon placeholder is inline SVG and can't 404.
    if (hasRealImage) setFailedSrc(primary);
  };

  return (
    <img
      src={src}
      onError={handleError}
      alt={product?.productName || "Product"}
      style={{ width: size, height: size }}
      className={`${rounded} object-cover border border-gray-200 dark:border-slate-700 flex-shrink-0 bg-gray-50 dark:bg-slate-800 ${className}`}
    />
  );
};

export default ProductImage;
