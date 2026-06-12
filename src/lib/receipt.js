export const downloadReceipt = (ticket, website) => {
  const content = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Receipt - Booking #${ticket.booking_id}</title>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Lato:wght@300;400;700&display=swap" rel="stylesheet">
        <style>
          body {
            font-family: 'Lato', sans-serif;
            color: #333333;
            padding: 60px 40px;
            max-width: 800px;
            margin: 0 auto;
            background-color: #ffffff;
            -webkit-print-color-adjust: exact;
          }
          .receipt-wrapper {
            border: 1px solid #e0e0e0;
            padding: 60px;
            position: relative;
          }
          .receipt-wrapper::before {
            content: '';
            position: absolute;
            top: 4px;
            left: 4px;
            right: 4px;
            bottom: 4px;
            border: 1px solid #f0f0f0;
            pointer-events: none;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .header img {
            max-height: 60px;
            margin-bottom: 20px;
          }
          .header h1 {
            font-family: 'Playfair Display', serif;
            font-size: 32px;
            font-weight: 600;
            margin: 0 0 10px 0;
            letter-spacing: 1px;
            color: #1a1a1a;
          }
          .header p {
            font-size: 13px;
            color: #777777;
            letter-spacing: 2px;
            text-transform: uppercase;
            margin: 0;
          }
          .title-section {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 30px;
            border-bottom: 1px solid #eeeeee;
          }
          .title-section h2 {
            font-family: 'Playfair Display', serif;
            font-size: 24px;
            font-weight: 400;
            margin: 0 0 10px 0;
            font-style: italic;
            color: #444444;
          }
          .title-section .booking-id {
            font-size: 14px;
            letter-spacing: 1px;
            color: #888888;
          }
          .status-indicator {
            display: inline-block;
            margin-top: 15px;
            padding: 4px 12px;
            border: 1px solid #cccccc;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: #555555;
          }
          .grid {
            display: flex;
            justify-content: space-between;
            margin-bottom: 50px;
          }
          .grid-col {
            flex: 1;
          }
          .grid-col.right {
            text-align: right;
          }
          .label {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: #999999;
            margin-bottom: 8px;
          }
          .value {
            font-size: 15px;
            color: #222222;
            margin: 0 0 15px 0;
            line-height: 1.5;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 40px;
          }
          th {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: #999999;
            padding: 15px 0;
            border-bottom: 1px solid #dddddd;
            border-top: 1px solid #dddddd;
            text-align: left;
            font-weight: 400;
          }
          th.right, td.right {
            text-align: right;
          }
          td {
            padding: 25px 0;
            border-bottom: 1px solid #eeeeee;
            vertical-align: top;
          }
          .item-name {
            font-family: 'Playfair Display', serif;
            font-size: 20px;
            color: #1a1a1a;
            margin-bottom: 10px;
          }
          .item-meta {
            font-size: 13px;
            color: #666666;
            line-height: 1.6;
          }
          .item-meta strong {
            color: #333333;
            font-weight: 700;
          }
          .totals {
            width: 350px;
            margin-left: auto;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            font-size: 14px;
            color: #555555;
          }
          .total-row.grand {
            border-top: 1px solid #dddddd;
            border-bottom: 1px solid #dddddd;
            padding: 15px 0;
            margin-top: 10px;
            font-family: 'Playfair Display', serif;
            font-size: 22px;
            color: #1a1a1a;
            font-weight: 600;
          }
          .footer {
            margin-top: 70px;
            text-align: center;
            font-size: 12px;
            color: #888888;
            letter-spacing: 1px;
            font-style: italic;
          }
          @media print {
            body { padding: 0; }
            .receipt-wrapper { border: none; padding: 20px; }
            .receipt-wrapper::before { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="receipt-wrapper">
          <div class="header">
            ${website?.logo_url ? `<img src="${website.logo_url}" alt="Logo" />` : ''}
            <h1>${website?.hero_title || 'Tour Company'}</h1>
            ${website?.contact_email ? `<p>${website.contact_email}</p>` : ''}
          </div>

          <div class="title-section">
            <div class="booking-id">Booking ID: #${ticket.booking_id.toString().padStart(6, '0')}</div>
            <div class="status-indicator">${ticket.status}</div>
          </div>

          <div class="grid">
            <div class="grid-col">
              <div class="label">Guest Information</div>
              <p class="value">
                ${ticket.customer_name}<br>
                ${ticket.customer_email}<br>
                ${ticket.phone ? `${ticket.phone}` : ''}
              </p>
            </div>
            <div class="grid-col right">
              <div class="label">Transaction Date</div>
              <p class="value">${new Date(ticket.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              
              <div class="label">Transaction ID</div>
              <p class="value">${ticket.transaction_id || 'Not Provided'}</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Tour Description</th>
                <th style="text-align: center; width: 100px;">Guests</th>
                <th class="right" style="width: 120px;">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div class="item-name">${ticket.tour_title}</div>
                  <div class="item-meta">
                    <strong>Date:</strong> ${new Date(ticket.tour_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}<br>
                    <strong>Journey:</strong> ${ticket.starting_location || 'Start'} ${ticket.finish_location && ticket.finish_location !== ticket.starting_location ? `&rarr; ${ticket.finish_location}` : ''}<br>
                    ${ticket.duration ? `<strong>Duration:</strong> ${ticket.duration}<br>` : ''}
                    ${ticket.tour_spots && ticket.tour_spots.length > 0 ? `<br><strong>Destinations:</strong> ${ticket.tour_spots.map(s => s.name).join(', ')}<br>` : ''}
                    ${ticket.tour_features && ticket.tour_features.length > 0 ? `<strong>Inclusions:</strong> ${ticket.tour_features.map(f => f.name).join(', ')}<br>` : ''}
                    ${ticket.separate_room ? '<br><em>Includes Private Room Upgrade</em>' : ''}
                  </div>
                </td>
                <td style="text-align: center; font-size: 16px;">
                  ${ticket.seats}
                </td>
                <td class="right" style="font-size: 16px;">
                  $${ticket.total_price}
                </td>
              </tr>
            </tbody>
          </table>

          <div class="totals">
            <div class="total-row">
              <span>Subtotal</span>
              <span>$${ticket.total_price}</span>
            </div>
            <div class="total-row grand">
              <span>Total Bill</span>
              <span>$${ticket.total_price}</span>
            </div>
          </div>

          <div class="footer">
            We are honored to host you. Please present this document upon your arrival.<br>
            Should you require assistance, do not hesitate to contact us.
          </div>
        </div>

        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 500);
          }
        </script>
      </body>
    </html>
  `;

  const printWindow = window.open('', '_blank', 'width=900,height=900');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(content);
    printWindow.document.close();
  } else {
    alert("Please allow popups to view and print the receipt.");
  }
};
