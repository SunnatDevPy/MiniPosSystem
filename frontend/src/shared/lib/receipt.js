export function printReceipt({ shiftNumber, cashier, paymentType, cart, total }) {
  const lines = cart
    .map(
      (x) =>
        `<tr><td>${x.name}</td><td>${x.qty}</td><td>${x.unitPrice.toFixed(2)}</td><td>${x.lineTotal.toFixed(2)}</td></tr>`
    )
    .join("");
  const popup = window.open("", "_blank", "width=360,height=640");
  if (!popup) return;
  popup.document.write(`
    <html>
      <head><title>Receipt</title></head>
      <body style="font-family:Arial;padding:10px;">
        <h3>Mini POS</h3>
        <p>Shift: ${shiftNumber}</p>
        <p>Cashier: ${cashier}</p>
        <p>Payment: ${paymentType}</p>
        <table border="1" cellspacing="0" cellpadding="4" width="100%">
          <thead><tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead>
          <tbody>${lines}</tbody>
        </table>
        <h3>Total: ${total.toFixed(2)}</h3>
      </body>
    </html>
  `);
  popup.document.close();
  popup.focus();
  popup.print();
}
