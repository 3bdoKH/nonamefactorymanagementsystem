export const printCarWeeklyReport = (selectedCar, weeklyData) => {
  const printWindow = window.open("", "_blank", "width=1000,height=800");
  const tableRows = [];
  weeklyData.daily_entries.forEach((day) => {
    tableRows.push(`
            <tr>
                <td>${day.day_name}</td>
                <td>${day.inspection_date}</td>
                <td>${day.driver_name}</td>
                <td>${day.area}</td>
                <td>${day.freight}</td>
                <td>${day.default_freight}</td>
                <td>${day.gas}</td>
                <td>${day.oil}</td>
                <td>${day.card}</td>
                <td>${day.fines}</td>
                <td>${day.tips}</td>
                <td>${day.maintenance}</td>
                <td>${day.spare_parts}</td>
                <td>${day.tires}</td>
                <td>${day.balance}</td>
                <td>${day.washing}</td>
                <td>${day.without}</td>
            </tr>
        `);
  });

  const totals = weeklyData.totals || {};
  tableRows.push(`
        <tr class="totals-row">
            <td colspan="4">الإجمالي</td>
            <td>${totals.freight}</td>
            <td>${totals.default_freight}</td>
            <td>${totals.gas}</td>
            <td>${totals.oil}</td>
            <td>${totals.card}</td>
            <td>${totals.fines}</td>
            <td>${totals.tips}</td>
            <td>${totals.maintenance}</td>
            <td>${totals.spare_parts}</td>
            <td>${totals.tires}</td>
            <td>${totals.balance}</td>
            <td>${totals.washing}</td>
            <td>${totals.without}</td>
        </tr>
    `);

  tableRows.push(`
        <tr className="meta-row">
          <td colSpan="2">عداد أول المدة</td>
          <td colSpan="2">${weeklyData.odometer_start}</td>
          <td colSpan="2">مرتب السائق</td>
          <td colSpan="2">${weeklyData.driver_salary}</td>
          <td colSpan="2">العهدة</td>
          <td colSpan="2">${weeklyData.custody}</td>
          <td colSpan="2">إجمالي الإيرادات</td>
          <td colSpan="3">${weeklyData.net_revenue}</td>
      </tr>

      <tr className="meta-row">
          <td colSpan="2">عداد آخر المدة</td>
          <td colSpan="2">${weeklyData.odometer_end}</td>
          <td colSpan="2">متوسط استهلاك الجاز/كم</td>
          <td colSpan="2">
              ${(() => {
                const gasPerKm = parseFloat(weeklyData.gas_per_km);
                return !isNaN(gasPerKm) ? gasPerKm.toFixed(2) : "0";
              })()}
          </td>
          <td colSpan="2">المصروفات</td>
          <td colSpan="2">
              ${weeklyData.net_revenue}
          </td>
          <td colSpan="2"> اجمالي الايرادات الاضافية</td>
          <td colSpan="3">
              ${weeklyData.default_net_revenue}
          </td>
      </tr>
      <tr className="meta-row">
          <td colSpan="2">ملاحظات</td>
          <td colSpan="15">
              ${weeklyData.description}
          </td>
      </tr>
    `);

  printWindow.document.write(`
        <!DOCTYPE html>
        <html dir="rtl">
            <head>
                <meta charset="UTF-8">
                <title> التقرير الاسبوعي   : ${selectedCar.model}</title>
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
                        <h2> التقرير الاسبوعي لسيارة : ${selectedCar.model}</h2>
                        <p>رقم اللوحة : ${selectedCar.licenseNumber}</p>
                        <p>المشرف : ${selectedCar.supervisor}</p>
                    </div>
                    
                    <table>
                        <thead>
                            <tr>
                                <th>اليوم</th>
                                <th>التاريخ</th>
                                <th>السواق</th>
                                <th>المنطقه</th>
                                <th>النولون</th>
                                <th>النولون الافتراضي</th>
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

export const printCarMonthlyReport = (selectedCar, monthlyData) => {
  const printWindow = window.open("", "_blank", "width=1000,height=800");
  const tableRows = [];
  monthlyData.weeks.forEach((week) => {
    tableRows.push(`
      <tr>
        <td>${week.week_start}</td>
        <td>${week.week_end}</td>
        <td>${week.odometer_start}</td>
        <td>${week.odometer_end}</td>
        <td>${week.distance}</td>
        <td>${week.driver_salary}</td>
        <td>${week.custody}</td>
        <td>${week.net_expenses}</td>
        <td>${week.net_revenue}</td>
        <td>${week.default_net_revenue}</td>
      </tr>
    `);
  });

  tableRows.push(`
    <tr className='totals-row'>
        <td colSpan="10">الإجمالي</td>
    </tr>
    <tr className="meta-row">
        <td>اجمالي المرتبات</td>
        <td>${monthlyData.driver_salary_total}</td>
        <td>اجمالي العهدة</td>
        <td>${monthlyData.custody_total}</td>
        <td>اجمالي المصروفات</td>
        <td>${monthlyData.net_expenses_total}</td>
        <td>اجمالي الايرادات</td>
        <td>${monthlyData.net_revenue_total}</td>
        <td> إجمالي الايرادات الاضافية</td>
        <td>${monthlyData.default_net_revenue_total}</td>
    </tr>
    <tr className="meta-row">
        <td>عداد أول الشهر</td>
        <td>${monthlyData.odometer_start}</td>
        <td>عداد اخر الشهر</td>
        <td>${monthlyData.odometer_end}</td>
        <td>اجمالي المسافه</td>
        <td>${monthlyData.distance_total}</td>
        <td>اجمالي الجاز</td>
        <td>${monthlyData.gas_total}</td>
        <td>متوسط استهلاك الجاز \\ كم</td>
        <td>${monthlyData.gas_per_km}</td>
    </tr>
    `);
  printWindow.document.write(`
    <!DOCTYPE html>
    <html dir="rtl">
      <head>
        <meta charset="UTF-8">
        <title> التقرير الشهري: ${selectedCar.model}</title>
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
            <h2>التقرير الشهري لسيارة : ${selectedCar.model}</h2>
            <p>رقم اللوحة : ${selectedCar.licenseNumber}</p>
            <p>المشرف : ${selectedCar.supervisor}</p>
            <p> ${monthlyData.period_start} - ${monthlyData.period_end} </p>
          </div>
          <table>
            <thead>
              <tr>
                  <th>بداية الاسبوع</th>
                  <th>نهاية الاسبوع</th>
                  <th>بداية العداد</th>
                  <th>نهاية العداد</th>
                  <th>اجمالي المسافه</th>
                  <th>راتب السائق</th>
                  <th>العهدة</th>
                  <th>اجمالي المصروفات</th>
                  <th>اجمالي الايرادات</th>
                  <th>اجمالي الايرادات الاضافية</th>
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

export const printMaintenanceReport = (
  selectedCar,
  monthYear,
  maintenanceData
) => {
  const printWindow = window.open("", "_blank", "width=1000,height=800");

  // Generate table rows for maintenance entries
  const tableRows = [];
  maintenanceData.entries.forEach((entry) => {
    const date = new Date(entry.date);
    tableRows.push(`
      <tr>
        <td>${date.toLocaleDateString("ar-EG")}</td>
        <td>${parseFloat(entry.air_filter).toFixed(2)}</td>
        <td>${parseFloat(entry.oil_filter).toFixed(2)}</td>
        <td>${parseFloat(entry.gas_filter).toFixed(2)}</td>
        <td>${parseFloat(entry.oil_change).toFixed(2)}</td>
        <td>${parseFloat(entry.price).toFixed(2)}</td>
        <td>${(
          parseFloat(entry.air_filter) +
          parseFloat(entry.oil_filter) +
          parseFloat(entry.gas_filter) +
          parseFloat(entry.oil_change) +
          parseFloat(entry.price)
        ).toFixed(2)}</td>
        <td>${entry.spare_part_type || "-"}</td>
      </tr>
    `);
  });

  // Add summary row
  if (maintenanceData.entries.length > 0) {
    tableRows.push(`
      <tr class="totals-row">
        <td>إجمالي الشهر</td>
        <td>${parseFloat(maintenanceData.monthly_totals.air_filter).toFixed(
          2
        )}</td>
        <td>${parseFloat(maintenanceData.monthly_totals.oil_filter).toFixed(
          2
        )}</td>
        <td>${parseFloat(maintenanceData.monthly_totals.gas_filter).toFixed(
          2
        )}</td>
        <td>${parseFloat(maintenanceData.monthly_totals.oil_change).toFixed(
          2
        )}</td>
        <td>${parseFloat(maintenanceData.monthly_totals.price).toFixed(2)}</td>
        <td>${parseFloat(maintenanceData.monthly_totals.full_total).toFixed(
          2
        )}</td>
        <td></td>
      </tr>
    `);
  }

  // Create HTML document for printing
  printWindow.document.write(`
    <!DOCTYPE html>
    <html dir="rtl">
      <head>
        <meta charset="UTF-8">
        <title>تقرير الصيانة: ${selectedCar.car_model}</title>
        <style>
          @page {
            size: A4;
            margin: 15mm;
          }
          body {
            direction: rtl;
            font-family: Arial, sans-serif;
            padding: 0;
            margin: 0;
            color: #000;
            background-color: white;
          }
          .print-container {
            width: 100%;
            max-width: 100%;
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #000;
          }
          .header h2 {
            margin: 5px 0;
            font-size: 20px;
          }
          .header p {
            margin: 5px 0;
            font-size: 14px;
          }
          .print-date {
            font-size: 12px;
            color: #666;
            font-style: italic;
          }
          .summary-section {
            display: flex;
            gap: 20px;
            margin-bottom: 30px;
            page-break-inside: avoid;
          }
          .summary-box {
            flex: 1;
            border: 1px solid #000;
            padding: 15px;
            border-radius: 4px;
          }
          .summary-box h3 {
            margin-top: 0;
            margin-bottom: 10px;
            font-size: 16px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
          }
          .summary-row {
            display: flex;
            justify-content: space-between;
            padding: 5px 0;
            border-bottom: 1px solid #eee;
          }
          .summary-row.total {
            font-weight: bold;
            border-top: 2px solid #000;
            margin-top: 5px;
            padding-top: 5px;
          }
          /* Yearly summary is smaller */
          .summary-box:nth-child(2) {
            flex: 0.6;
            background-color: #f9fafb;
          }
          .summary-box:nth-child(2) h3 {
            font-size: 14px;
          }
          .summary-box:nth-child(2) .summary-row {
            font-size: 12px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            page-break-inside: auto;
          }
          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
          th, td {
            border: 1px solid #000;
            padding: 8px;
            text-align: center;
          }
          th {
            background-color: #f0f0f0 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            font-weight: bold;
          }
          tbody tr:nth-child(even) {
            background-color: #f9fafb;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .totals-row {
            font-weight: bold;
            background-color: #f5f5f5 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .empty-message {
            text-align: center;
            padding: 30px;
            font-style: italic;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="print-container">
          <div class="header">
            <h2>تقرير الصيانة - ${monthYear.month} ${monthYear.year}</h2>
            <p>السيارة: ${selectedCar.car_model}</p>
            <p class="print-date">تاريخ الطباعة: ${new Date().toLocaleDateString(
              "ar-EG",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }
            )}</p>
          </div>
          
          <div class="summary-section">
            <div class="summary-box">
              <h3>إجماليات الشهر (${monthYear.month})</h3>
              <div class="summary-content">
                <div class="summary-row">
                  <span>فلتر هواء:</span>
                  <span>${parseFloat(
                    maintenanceData.monthly_totals.air_filter
                  ).toFixed(2)}</span>
                </div>
                <div class="summary-row">
                  <span>فلتر زيت:</span>
                  <span>${parseFloat(
                    maintenanceData.monthly_totals.oil_filter
                  ).toFixed(2)}</span>
                </div>
                <div class="summary-row">
                  <span>فلتر بنزين:</span>
                  <span>${parseFloat(
                    maintenanceData.monthly_totals.gas_filter
                  ).toFixed(2)}</span>
                </div>
                <div class="summary-row">
                  <span>تغيير زيت:</span>
                  <span>${parseFloat(
                    maintenanceData.monthly_totals.oil_change
                  ).toFixed(2)}</span>
                </div>
                <div class="summary-row">
                  <span>سعر:</span>
                  <span>${parseFloat(
                    maintenanceData.monthly_totals.price
                  ).toFixed(2)}</span>
                </div>
                <div class="summary-row total">
                  <span>المجموع:</span>
                  <span>${parseFloat(
                    maintenanceData.monthly_totals.full_total
                  ).toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div class="summary-box">
              <h3>إجماليات السنة (${monthYear.year})</h3>
              <div class="summary-content">
                <div class="summary-row">
                  <span>فلتر هواء:</span>
                  <span>${parseFloat(
                    maintenanceData.yearly_totals.air_filter
                  ).toFixed(2)}</span>
                </div>
                <div class="summary-row">
                  <span>فلتر زيت:</span>
                  <span>${parseFloat(
                    maintenanceData.yearly_totals.oil_filter
                  ).toFixed(2)}</span>
                </div>
                <div class="summary-row">
                  <span>فلتر بنزين:</span>
                  <span>${parseFloat(
                    maintenanceData.yearly_totals.gas_filter
                  ).toFixed(2)}</span>
                </div>
                <div class="summary-row">
                  <span>تغيير زيت:</span>
                  <span>${parseFloat(
                    maintenanceData.yearly_totals.oil_change
                  ).toFixed(2)}</span>
                </div>
                <div class="summary-row">
                  <span>سعر:</span>
                  <span>${parseFloat(
                    maintenanceData.yearly_totals.price
                  ).toFixed(2)}</span>
                </div>
                <div class="summary-row total">
                  <span>المجموع:</span>
                  <span>${parseFloat(
                    maintenanceData.yearly_totals.full_total
                  ).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          ${
            maintenanceData.entries.length > 0
              ? `
            <table>
              <thead>
                <tr>
                  <th>التاريخ</th>
                  <th>فلتر هواء</th>
                  <th>فلتر زيت</th>
                  <th>فلتر بنزين</th>
                  <th>تغيير زيت</th>
                  <th>سعر</th>
                  <th>المجموع</th>
                  <th>نوع قطع الغيار</th>
                </tr>
              </thead>
              <tbody>
                ${tableRows.join("")}
              </tbody>
            </table>
          `
              : `
            <div class="empty-message">
              لا توجد سجلات صيانة لهذه الفترة
            </div>
          `
          }
          
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
