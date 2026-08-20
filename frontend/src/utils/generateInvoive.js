import jsPDF from "jspdf";

const generateInvoice = (order) => {
  const doc = new jsPDF();

  // =========================
  // COLORS
  // =========================
  const primaryColor = [37, 99, 235];
  const darkColor = [15, 23, 42];
  const grayColor = [100, 116, 139];

  // =========================
  // HEADER
  // =========================

  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 32, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("Inventory Pro", 15, 14);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Inventory Management System", 15, 22);

  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE", 150, 16);

  // =========================
  // INVOICE DETAILS
  // =========================

  doc.setTextColor(...darkColor);

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");

  doc.text(
    `Invoice No: ${order.invoiceNumber || `INV-${order.id}`}`,
    15,
    45
  );

  doc.text(
    `Order ID: ${order.orderId || order.id}`,
    15,
    52
  );

  doc.setFont("helvetica", "normal");

  doc.text(
    `Date: ${order.date || new Date().toLocaleDateString()}`,
    15,
    59
  );

  doc.text(
    `Payment: ${order.paymentStatus || "Pending"}`,
    15,
    66
  );

  doc.text(
    `Order Status: ${order.status || "Pending"}`,
    15,
    73
  );

  // =========================
  // CUSTOMER
  // =========================

  doc.setFillColor(248, 250, 252);
  doc.roundedRect(110, 40, 85, 38, 3, 3, "F");

  doc.setTextColor(...darkColor);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);

  doc.text("Bill To", 116, 48);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  doc.text(
    order.customerName || "Customer",
    116,
    56
  );

  if (order.customerEmail) {
    doc.text(
      order.customerEmail,
      116,
      63
    );
  }

  if (order.customerPhone) {
    doc.text(
      order.customerPhone,
      116,
      70
    );
  }

  // =========================
  // TABLE
  // =========================

  let y = 90;

  doc.setFillColor(...primaryColor);
  doc.rect(15, y, 180, 10, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");

  doc.text("Product", 20, y + 7);
  doc.text("Qty", 105, y + 7);
  doc.text("Price", 130, y + 7);
  doc.text("Total", 165, y + 7);

  y += 10;

  // =========================
  // PRODUCTS
  // =========================

  const items = order.items || [
    {
      name: order.productName || "Product",
      quantity: order.quantity || 1,
      price: order.price || 0,
    },
  ];

  let subtotal = 0;

  items.forEach((item) => {
    const quantity = Number(item.quantity || 1);
    const price = Number(item.price || 0);
    const total = quantity * price;

    subtotal += total;

    doc.setTextColor(...darkColor);
    doc.setFont("helvetica", "normal");

    doc.text(
      String(item.name || "Product"),
      20,
      y + 7
    );

    doc.text(
      String(quantity),
      107,
      y + 7
    );

    doc.text(
      `$${price.toFixed(2)}`,
      130,
      y + 7
    );

    doc.text(
      `$${total.toFixed(2)}`,
      165,
      y + 7
    );

    doc.setDrawColor(226, 232, 240);
    doc.line(15, y + 11, 195, y + 11);

    y += 14;
  });

  // =========================
  // TOTALS
  // =========================

  const taxRate = Number(order.taxRate || 0);

  const tax = subtotal * (taxRate / 100);

  const discount = Number(order.discount || 0);

  const grandTotal =
    subtotal + tax - discount;

  y += 8;

  doc.setFontSize(10);

  doc.setTextColor(...grayColor);
  doc.text("Subtotal:", 130, y);

  doc.setTextColor(...darkColor);
  doc.text(
    `$${subtotal.toFixed(2)}`,
    165,
    y
  );

  y += 8;

  doc.setTextColor(...grayColor);
  doc.text(
    `Tax (${taxRate}%):`,
    130,
    y
  );

  doc.setTextColor(...darkColor);
  doc.text(
    `$${tax.toFixed(2)}`,
    165,
    y
  );

  y += 8;

  doc.setTextColor(...grayColor);
  doc.text("Discount:", 130, y);

  doc.setTextColor(...darkColor);
  doc.text(
    `-$${discount.toFixed(2)}`,
    165,
    y
  );

  y += 10;

  doc.setFillColor(239, 246, 255);
  doc.roundedRect(125, y - 5, 70, 14, 2, 2, "F");

  doc.setTextColor(...primaryColor);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);

  doc.text("TOTAL:", 130, y + 4);

  doc.text(
    `$${grandTotal.toFixed(2)}`,
    165,
    y + 4
  );

  // =========================
  // FOOTER
  // =========================

  doc.setTextColor(...grayColor);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);

  doc.text(
    "Thank you for your business!",
    105,
    270,
    {
      align: "center",
    }
  );

  doc.text(
    "Inventory Pro • Inventory Management System",
    105,
    277,
    {
      align: "center",
    }
  );

  // =========================
  // SAVE PDF
  // =========================

  const invoiceNumber =
    order.invoiceNumber ||
    `INV-${order.id || Date.now()}`;

  doc.save(`${invoiceNumber}.pdf`);

  return invoiceNumber;
};

export default generateInvoice;