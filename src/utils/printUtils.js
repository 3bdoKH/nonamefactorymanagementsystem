/**
 * Utility function to print car weekly report
 * @param {Object} selectedCar - The selected car data
 * @param {Array} weeklyData - The weekly data for the car
 * @param {Object} totals - The calculated totals
 */
export const printCarWeeklyReport = (selectedCar, weeklyData, totals) => {
  // Create the print window
  const printWindow = window.open("", "_blank", "width=1000,height=800");

  // Prepare table data in a more print-friendly format
  const tableRows = [];

  // Add day rows
  weeklyData.days.forEach((day) => {
    tableRows.push(`
            <tr>
                <td>${day.day}</td>
                <td>${day.date}</td>
                <td>${day.driver}</td>
                <td>${day.area}</td>
                <td>${day.revenue}</td>
                <td>${day.gas}</td>
                <td>${day.oil}</td>
                <td>${day.card}</td>
                <td>${day.fines}</td>
                <td>${day.tips}</td>
                <td>${day.maintenance}</td>
                <td>${day.spareParts}</td>
                <td>${day.tires}</td>
                <td>${day.balance}</td>
                <td>${day.washing}</td>
                <td>${day.withoutIncome}</td>
            </tr>
        `);
  });

  // Add totals row
  tableRows.push(`
        <tr class="totals-row">
            <td colspan="4">الإجمالي</td>
            <td>${totals.revenue}</td>
            <td>${totals.gas}</td>
            <td>${totals.oil}</td>
            <td>${totals.card}</td>
            <td>${totals.fines}</td>
            <td>${totals.tips}</td>
            <td>${totals.maintenance}</td>
            <td>${totals.spareParts}</td>
            <td>${totals.tires}</td>
            <td>${totals.balance}</td>
            <td>${totals.washing}</td>
            <td>${totals.withoutIncome}</td>
        </tr>
    `);

  // Add first metadata row
  const totalIncome =
    totals.revenue -
    totals.gas -
    totals.oil -
    totals.card -
    totals.fines -
    totals.tips -
    totals.maintenance -
    totals.spareParts -
    totals.tires -
    totals.balance -
    totals.washing -
    (parseFloat(weeklyData.driverSalary) || 0);

  tableRows.push(`
        <tr class="meta-row">
            <td colspan="2">عداد أول المدة</td>
            <td colspan="2">${weeklyData.startMeter}</td>
            <td colspan="2">مرتب السائق</td>
            <td colspan="2">${weeklyData.driverSalary}</td>
            <td colspan="2">المدفوعات</td>
            <td colspan="2">${weeklyData.payments}</td>
            <td colspan="2">إجمالي الإيرادات</td>
            <td colspan="2">${totalIncome}</td>
        </tr>
    `);

  // Add second metadata row
  let avgConsumption = "0";
  if (weeklyData.startMeter && weeklyData.endMeter && totals.gas) {
    const startMeter = parseFloat(weeklyData.startMeter) || 0;
    const endMeter = parseFloat(weeklyData.endMeter) || 0;
    if (endMeter > startMeter) {
      avgConsumption = (totals.gas / (endMeter - startMeter)).toFixed(2);
    }
  }

  tableRows.push(`
        <tr class="meta-row">
            <td colspan="2">عداد آخر المدة</td>
            <td colspan="2">${weeklyData.endMeter}</td>
            <td colspan="2">متوسط استهلاك الجاز/كم</td>
            <td colspan="2">${avgConsumption}</td>
            <td colspan="2">الاهلاك</td>
            <td colspan="6">${weeklyData.wasted}</td>
        </tr>
    `);

  // Write the complete HTML to the print window
  printWindow.document.write(`
        <!DOCTYPE html>
        <html dir="rtl">
            <head>
                <meta charset="UTF-8">
                <title>تقرير السيارة: ${selectedCar.model}</title>
                <style>
                    @page {
                        size: landscape;
                        margin: 10mm;
                    }
                    body {
                        direction: rtl;
                        font-family: Arial, sans-serif;
                        padding: 0;
                        margin: 0;
                    }
                    .print-container {
                        width: 100%;
                        max-width: 100%;
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 10px;
                    }
                    .header h2 {
                        margin: 5px 0;
                    }
                    .header p {
                        margin: 5px 0;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        page-break-inside: auto;
                        font-size: 10px;
                    }
                    tr {
                        page-break-inside: avoid;
                        page-break-after: auto;
                    }
                    th, td {
                        border: 1px solid #000;
                        padding: 3px;
                        text-align: center;
                    }
                    th {
                        background-color: #f0f0f0 !important;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                        font-weight: bold;
                    }
                    .totals-row {
                        font-weight: bold;
                        background-color: #f5f5f5 !important;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    .meta-row {
                        background-color: #f9f9f9 !important;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                </style>
            </head>
            <body>
                <div class="print-container">
                    <div class="header">
                        <h2>بيانات السيارة: ${selectedCar.model}</h2>
                        <p>رقم اللوحة: ${selectedCar.licenseNumber}</p>
                        <p>المشرف: ${selectedCar.supervisor}</p>
                    </div>
                    
                    <table>
                        <thead>
                            <tr>
                                <th>اليوم</th>
                                <th>التاريخ</th>
                                <th>السواق</th>
                                <th>المنطقه</th>
                                <th>النولون</th>
                                <th>جاز</th>
                                <th>زيت</th>
                                <th>كرت</th>
                                <th>غرامات</th>
                                <th>اكراميات</th>
                                <th>صيانه</th>
                                <th>قطع غيار</th>
                                <th>كاوتش</th>
                                <th>ميزان</th>
                                <th>غسيل</th>
                                <th>بدون</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tableRows.join("")}
                        </tbody>
                    </table>
                </div>
                <script>
                    window.onload = function() {
                        setTimeout(function() {
                            window.print();
                            setTimeout(function() {
                                window.close();
                            }, 100);
                        }, 500);
                    }
                </script>
            </body>
        </html>
    `);

  printWindow.document.close();
};
