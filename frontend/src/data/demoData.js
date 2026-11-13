// ============================================================
// DEMO DATA LAYER
// ------------------------------------------------------------
// Everything in this file is DEMO/PLACEHOLDER data. None of it comes from
// the backend or represents real business records. It exists purely so
// the dashboard doesn't show completely blank charts on a fresh database
// (e.g. right after `npm run seed`, before any real orders exist).
//
// Rule: real API data is ALWAYS preferred. These are only used as a
// fallback when the real dataset is empty/too small to chart, and any
// component using them must show a visible "Demo data" indicator so a
// viewer never mistakes this for live business data.
// ============================================================

export const DEMO_MONTHLY_REVENUE = [
  { label: "Jan", revenue: 186000 },
  { label: "Feb", revenue: 205000 },
  { label: "Mar", revenue: 179000 },
  { label: "Apr", revenue: 231000 },
  { label: "May", revenue: 248000 },
  { label: "Jun", revenue: 262000 },
  { label: "Jul", revenue: 241000 },
  { label: "Aug", revenue: 279000 },
  { label: "Sep", revenue: 296000 },
  { label: "Oct", revenue: 312000 },
  { label: "Nov", revenue: 288000 },
  { label: "Dec", revenue: 334000 },
];

export const DEMO_ORDER_STATUS = [
  { name: "Delivered", value: 148 },
  { name: "Processing", value: 42 },
  { name: "Pending", value: 27 },
  { name: "Shipped", value: 35 },
  { name: "Cancelled", value: 9 },
];

export const DEMO_CATEGORY_SALES = [
  { name: "Electronics", products: 38 },
  { name: "Laptops", products: 24 },
  { name: "Smartphones", products: 19 },
  { name: "Accessories", products: 46 },
  { name: "Office Equipment", products: 22 },
  { name: "Furniture", products: 15 },
];

export const DEMO_USER_GROWTH = [
  { label: "Jan", users: 12 },
  { label: "Feb", users: 19 },
  { label: "Mar", users: 15 },
  { label: "Apr", users: 27 },
  { label: "May", users: 33 },
  { label: "Jun", users: 29 },
  { label: "Jul", users: 41 },
  { label: "Aug", users: 47 },
  { label: "Sep", users: 52 },
  { label: "Oct", users: 61 },
  { label: "Nov", users: 58 },
  { label: "Dec", users: 70 },
];

// Realistic Nepali customer names, used only to illustrate what a populated
// "Recent Orders" section looks like in demo/preview contexts. Real order
// pages always render the actual `order.customer` value from the database.
export const DEMO_CUSTOMER_NAMES = [
  "Aarav Sharma",
  "Sanjay Thapa",
  "Priya Gurung",
  "Riya Karki",
  "Anish Shrestha",
  "Suman Adhikari",
  "Nisha Rai",
  "Bibek Maharjan",
  "Sabina Tamang",
  "Kiran Poudel",
];

export const DEMO_BRANCH_ANALYTICS = [
  { name: "Kathmandu Central", city: "Kathmandu", revenue: 2450000, orders: 842 },
  { name: "Pokhara Branch", city: "Pokhara", revenue: 1680000, orders: 563 },
  { name: "Lalitpur Warehouse", city: "Lalitpur", revenue: 1320000, orders: 410 },
  { name: "Biratnagar Branch", city: "Biratnagar", revenue: 980000, orders: 305 },
  { name: "Butwal Outlet", city: "Butwal", revenue: 740000, orders: 221 },
];
