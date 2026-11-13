// What a non-admin may see of a product: catalog info and a simple
// in-stock flag — never exact stock quantities, thresholds, cost price,
// supplier, or which warehouse holds the stock. This runs on the server
// so the data never reaches a non-admin's browser at all (hiding it in
// the UI alone would still expose it in the network tab).
export const publicProduct = (product) => {
  const p = typeof product.toObject === "function" ? product.toObject() : product;
  return {
    _id: p._id,
    productName: p.productName,
    sku: p.sku,
    description: p.description,
    category: p.category,
    price: p.price,
    image: p.image,
    inStock: (p.stock || 0) > 0,
  };
};

export const isAdmin = (req) => req.user?.role === "admin";
