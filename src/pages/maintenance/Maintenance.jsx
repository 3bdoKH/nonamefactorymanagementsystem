import React, { useState, useEffect, useCallback } from 'react';
import './Maintenance.css';
import { printMaintenanceReport } from '../../utils/printUtils';

const Maintenance = () => {
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [maintenanceData, setMaintenanceData] = useState(null);
  const [monthData, setMonthData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [activeRow, setActiveRow] = useState(null);
  const [showSparePartPopup, setShowSparePartPopup] = useState(false);
  const [currentSparePartType, setCurrentSparePartType] = useState('');
  const [editingRowIndex, setEditingRowIndex] = useState(null);

  const fetchCars = useCallback(async () => {
    try {
      setLoading(true);
      // Check if the API server is available first
      try {
        const response = await fetch('http://26.16.17.34:8000/api/cars/');

        // Check if we got HTML instead of JSON (common when server returns error page)
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") === -1) {
          throw new Error('API server not available or returned non-JSON response');
        }

        if (!response.ok) {
          throw new Error(`Failed to fetch cars: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setCars(data);
      } catch (apiError) {
        console.error('API Error:', apiError);
        // Use mock data for development/testing when API is unavailable
        setCars([
          { id: 1, car_model: 'Toyota Camry 2022' },
          { id: 2, car_model: 'Honda Civic 2023' },
          { id: 3, car_model: 'BMW X5 2024' }
        ]);
        setError('API server not available. Using mock data for demonstration.');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setError('Error fetching cars: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMaintenanceData = useCallback(async () => {
    try {
      setLoading(true);
      try {
        const response = await fetch(`http://26.16.17.34:8000/api/maintenance/month/?car_id=${selectedCar}&year=${year}&month=${month}`);

        // Check if we got HTML instead of JSON
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") === -1) {
          throw new Error('API server not available or returned non-JSON response');
        }

        if (!response.ok) {
          throw new Error(`Failed to fetch maintenance data: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setMaintenanceData(data);

        // Update monthData with entries from API
        if (data.entries && data.entries.length > 0) {
          setMonthData(prevData => {
            const updatedData = [...prevData];

            // For each entry in the API response, update the corresponding day in monthData
            data.entries.forEach(entry => {
              const entryDate = new Date(entry.date);
              const day = entryDate.getDate();
              const entryMonth = entryDate.getMonth() + 1;
              const entryYear = entryDate.getFullYear();

              // Only update if the entry is for the current month/year
              if (entryMonth === parseInt(month) && entryYear === parseInt(year)) {
                const dayIndex = updatedData.findIndex(d => d.day === day);
                if (dayIndex !== -1) {
                  updatedData[dayIndex] = {
                    ...updatedData[dayIndex],
                    air_filter: parseFloat(entry.air_filter) || 0,
                    oil_filter: parseFloat(entry.oil_filter) || 0,
                    gas_filter: parseFloat(entry.gas_filter) || 0,
                    oil_change: parseFloat(entry.oil_change) || 0,
                    price: parseFloat(entry.price) || 0,
                    spare_part_type: entry.spare_part_type || '',
                    hasData: true
                  };
                }
              }
            });

            return updatedData;
          });
        }
      } catch (apiError) {
        console.error('API Error:', apiError);
        // Use mock data for demonstration
        setMaintenanceData({
          car_id: selectedCar,
          year: year,
          month: month,
          entries: [],
          monthly_totals: {
            air_filter: 0,
            oil_filter: 0,
            gas_filter: 0,
            oil_change: 0,
            price: 0,
            full_total: 0
          },
          yearly_totals: {
            air_filter: 0,
            oil_filter: 0,
            gas_filter: 0,
            oil_change: 0,
            price: 0,
            full_total: 0
          }
        });
        setError('API server not available. Using mock data for demonstration.');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setError('Error fetching maintenance data: ' + error.message);
      setMaintenanceData(null);
    } finally {
      setLoading(false);
    }
  }, [selectedCar, year, month]);

  // Generate data for each day of the month
  const generateMonthData = useCallback(() => {
    const daysInMonth = new Date(year, month, 0).getDate();
    const days = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      days.push({
        date,
        day,
        air_filter: 0,
        oil_filter: 0,
        gas_filter: 0,
        oil_change: 0,
        price: 0,
        spare_part_type: '',
        car_id: selectedCar,
        isEditing: false
      });
    }

    setMonthData(days);
  }, [year, month, selectedCar]);

  // Fetch cars on component mount
  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  // Generate month data and fetch maintenance data when car, year, or month changes
  useEffect(() => {
    if (selectedCar) {
      fetchMaintenanceData();
      generateMonthData();
    }
  }, [selectedCar, year, month, fetchMaintenanceData, generateMonthData]);

  const handleCarChange = (e) => {
    setSelectedCar(e.target.value);
  };

  const handleInputChange = (e, index, field) => {
    const { value } = e.target;
    setMonthData(prevData => {
      const updatedData = [...prevData];
      updatedData[index] = {
        ...updatedData[index],
        [field]: field === 'spare_part_type' ? value : parseFloat(value) || 0,
        isEditing: true
      };
      return updatedData;
    });
    setActiveRow(index);
  };

  const handleSparePartSave = (value) => {
    if (editingRowIndex !== null) {
      setMonthData(prevData => {
        const updatedData = [...prevData];
        updatedData[editingRowIndex] = {
          ...updatedData[editingRowIndex],
          spare_part_type: value,
          isEditing: true
        };
        return updatedData;
      });
    }
    setShowSparePartPopup(false);
    setCurrentSparePartType('');
    setEditingRowIndex(null);
  };

  const handleSparePartCancel = () => {
    setShowSparePartPopup(false);
    setCurrentSparePartType('');
    setEditingRowIndex(null);
  };

  // This function is no longer used - we're using handleRowSubmit instead

  const handleRowSubmit = async (dayData, index) => {
    if (!dayData.isEditing) return;

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      // Check if any values are non-zero
      const hasValues =
        dayData.air_filter > 0 ||
        dayData.oil_filter > 0 ||
        dayData.gas_filter > 0 ||
        dayData.oil_change > 0 ||
        dayData.price > 0 ||
        dayData.spare_part_type.trim() !== '';

      if (!hasValues) {
        // If all values are zero/empty, don't submit
        setMonthData(prevData => {
          const updatedData = [...prevData];
          updatedData[index] = {
            ...updatedData[index],
            isEditing: false
          };
          return updatedData;
        });
        setActiveRow(null);
        return;
      }

      const url = dayData.hasData
        ? '/api/maintenance/by-date/'
        : '/api/maintenance/';

      const method = dayData.hasData ? 'PATCH' : 'POST';

      const submitData = {
        car_id: selectedCar,
        date: dayData.date,
        air_filter: dayData.air_filter,
        oil_filter: dayData.oil_filter,
        gas_filter: dayData.gas_filter,
        oil_change: dayData.oil_change,
        price: dayData.price,
        spare_part_type: dayData.spare_part_type
      };

      try {
        const fullUrl = url.startsWith('http') ? url : `http://127.0.0.1:8000${url}`;
        const response = await fetch(fullUrl, {
          method,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(submitData)
        });

        // Check if we got HTML instead of JSON
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") === -1) {
          throw new Error('API server not available or returned non-JSON response');
        }

        if (!response.ok) {
          let errorMessage = 'Failed to save maintenance data';
          try {
            const errorData = await response.json();
            errorMessage = errorData.detail || errorMessage;
          } catch (e) {
            // If can't parse JSON error, use default message
          }
          throw new Error(errorMessage);
        }

        // Mark as saved
        setMonthData(prevData => {
          const updatedData = [...prevData];
          updatedData[index] = {
            ...updatedData[index],
            isEditing: false,
            hasData: true
          };
          return updatedData;
        });

        setActiveRow(null);
        setSuccess(`تم حفظ سجل الصيانة ليوم ${dayData.day} بنجاح!`);
        fetchMaintenanceData();
      } catch (apiError) {
        console.error('API Error:', apiError);

        // For demonstration purposes, show success anyway when API is unavailable
        setMonthData(prevData => {
          const updatedData = [...prevData];
          updatedData[index] = {
            ...updatedData[index],
            isEditing: false,
            hasData: true
          };
          return updatedData;
        });

        setActiveRow(null);
        setSuccess(`وضع العرض: تم حفظ سجل الصيانة ليوم ${dayData.day} بنجاح!`);
        setError('خادم API غير متاح. لم يتم حفظ التغييرات بالفعل.');
      }
    } catch (error) {
      console.error('Submit error:', error);
      setError('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = (index) => {
    setMonthData(prevData => {
      const updatedData = [...prevData];
      // If it had data before, restore from maintenanceData
      if (updatedData[index].hasData && maintenanceData && maintenanceData.entries) {
        const day = updatedData[index].day;
        const matchingEntry = maintenanceData.entries.find(entry => {
          const entryDate = new Date(entry.date);
          return entryDate.getDate() === day;
        });

        if (matchingEntry) {
          updatedData[index] = {
            ...updatedData[index],
            air_filter: parseFloat(matchingEntry.air_filter) || 0,
            oil_filter: parseFloat(matchingEntry.oil_filter) || 0,
            gas_filter: parseFloat(matchingEntry.gas_filter) || 0,
            oil_change: parseFloat(matchingEntry.oil_change) || 0,
            price: parseFloat(matchingEntry.price) || 0,
            spare_part_type: matchingEntry.spare_part_type || '',
            isEditing: false
          };
        } else {
          // Reset to zeros if no matching entry found
          updatedData[index] = {
            ...updatedData[index],
            air_filter: 0,
            oil_filter: 0,
            gas_filter: 0,
            oil_change: 0,
            price: 0,
            spare_part_type: '',
            isEditing: false
          };
        }
      } else {
        // Reset to zeros if no data before
        updatedData[index] = {
          ...updatedData[index],
          air_filter: 0,
          oil_filter: 0,
          gas_filter: 0,
          oil_change: 0,
          price: 0,
          spare_part_type: '',
          isEditing: false
        };
      }
      return updatedData;
    });
    setActiveRow(null);
  };

  const formatCurrency = (value) => {
    return value === 0 ? ' ' : value.toString().split('.')[0];
  };

  const getDayName = (dateString) => {
    const date = new Date(dateString);
    const dayNames = {
      en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      ar: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
    };
    const dayIndex = date.getDay(); // 0 for Sunday, 1 for Monday, etc.
    return dayNames.ar[dayIndex]; // Return Arabic day name
  };

  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  const handlePrintReport = () => {
    if (!selectedCar || !maintenanceData) return;

    // Get the selected car details
    const carDetails = cars.find(car => car.id === parseInt(selectedCar));

    // Create month and year object for the report title
    const monthYear = {
      month: months.find(m => m.value === parseInt(month))?.label,
      year: year
    };

    // Call the print function from printUtils
    printMaintenanceReport(carDetails, monthYear, maintenanceData);
  };
  console.log(monthData);

  return (
    <div className="maintenance-page">
      <div className="filters-container">
        <div className="filter-item">
          <label>اختر السيارة:</label>
          <select value={selectedCar} onChange={handleCarChange}>
            <option value="">اختر سيارة</option>
            {cars.map(car => (
              <option key={car.id} value={car.id}>
                {car.car_model}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-item">
          <label>السنة:</label>
          <select value={year} onChange={(e) => setYear(e.target.value)}>
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <div className="filter-item">
          <label>الشهر:</label>
          <select value={month} onChange={(e) => setMonth(e.target.value)}>
            {months.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>
      </div>

      {!selectedCar && (
        <div className="empty-message" style={{ maxWidth: "600px", margin: "2rem auto" }}>
          الرجاء اختيار سيارة لعرض سجلات الصيانة
        </div>
      )}

      {selectedCar && (
        <div className="maintenance-calendar">
          <h2>جدول الصيانة الشهري - {months.find(m => m.value === parseInt(month))?.label} {year}</h2>

          {success && <div className="success-message">{success}</div>}
          {error && <div className="error-message">{error}</div>}

          {loading ? (
            <div className="loading-indicator">جاري تحميل البيانات...</div>
          ) : (
            <div className="calendar-table-container">
              <table className="calendar-table">
                <thead>
                  <tr>
                    <th>الرقم</th>
                    <th>اليوم</th>
                    <th>التاريخ</th>
                    <th>فلتر هواء</th>
                    <th>فلتر زيت</th>
                    <th>فلتر بنزين</th>
                    <th>تغيير زيت</th>
                    <th>السعر</th>
                    <th>نوع قطع الغيار</th>
                    <th>المجموع</th>
                    <th>الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {monthData.map((day, index) => (
                    <tr
                      key={day.date}
                      data-day={day.day}
                      className={day.isEditing ? 'editing-row' : day.hasData ? 'has-data-row' : ''}
                    >
                      <td>{day.day}</td>
                      <td>{getDayName(day.date)}</td>
                      <td>{new Date(day.date).toLocaleDateString()}</td>
                      <td>
                        {day.isEditing ? (
                          <input
                            type="number"
                            value={day.air_filter === 0 ? '' : day.air_filter}
                            onChange={(e) => handleInputChange(e, index, 'air_filter')}
                            min="0"
                            step="0.01"
                          />
                        ) : (
                          formatCurrency(day.air_filter)
                        )}
                      </td>
                      <td>
                        {day.isEditing ? (
                          <input
                            type="number"
                            value={day.oil_filter === 0 ? '' : day.oil_filter}
                            onChange={(e) => handleInputChange(e, index, 'oil_filter')}
                            min="0"
                            step="0.01"
                          />
                        ) : (
                          formatCurrency(day.oil_filter)
                        )}
                      </td>
                      <td>
                        {day.isEditing ? (
                          <input
                            type="number"
                            value={day.gas_filter === 0 ? '' : day.gas_filter}
                            onChange={(e) => handleInputChange(e, index, 'gas_filter')}
                            min="0"
                            step="0.01"
                          />
                        ) : (
                          formatCurrency(day.gas_filter)
                        )}
                      </td>
                      <td>
                        {day.isEditing ? (
                          <input
                            type="number"
                            value={day.oil_change === 0 ? '' : day.oil_change}
                            onChange={(e) => handleInputChange(e, index, 'oil_change')}
                            min="0"
                            step="0.01"
                          />
                        ) : (
                          formatCurrency(day.oil_change)
                        )}
                      </td>
                      <td>
                        {day.isEditing ? (
                          <input
                            type="number"
                            value={day.price === 0 ? '' : day.price}
                            onChange={(e) => handleInputChange(e, index, 'price')}
                            min="0"
                            step="0.01"
                          />
                        ) : (
                          formatCurrency(day.price)
                        )}
                      </td>
                      <td>
                        {day.isEditing ? (
                          <button
                            type="button"
                            className="spare-part-btn"
                            onClick={() => {
                              setCurrentSparePartType(day.spare_part_type);
                              setEditingRowIndex(index);
                              setShowSparePartPopup(true);
                            }}
                          >
                            {day.spare_part_type ? 'تعديل نوع قطع الغيار' : 'إضافة نوع قطع الغيار'}
                          </button>
                        ) : (
                          day.spare_part_type.slice(0, 10)
                        )}
                      </td>
                      <td className="total-column">
                        {formatCurrency(
                          parseFloat(day.air_filter) +
                          parseFloat(day.oil_filter) +
                          parseFloat(day.gas_filter) +
                          parseFloat(day.oil_change) +
                          parseFloat(day.price)
                        )}
                      </td>
                      <td className="action-buttons">
                        {day.isEditing ? (
                          <>
                            <button
                              type="button"
                              className="save-btn"
                              onClick={() => handleRowSubmit(day, index)}
                            >
                              حفظ
                            </button>
                            <button
                              type="button"
                              className="cancel-btn"
                              onClick={() => handleCancelEdit(index)}
                            >
                              إلغاء
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            className="edit-btn"
                            onClick={() => {
                              setMonthData(prevData => {
                                const updatedData = [...prevData];
                                // Reset any other editing rows
                                updatedData.forEach((item, i) => {
                                  if (i !== index && item.isEditing) {
                                    updatedData[i] = { ...item, isEditing: false };
                                  }
                                });
                                // Set this row to editing
                                updatedData[index] = { ...updatedData[index], isEditing: true };
                                return updatedData;
                              });
                              setActiveRow(index);
                            }}
                          >
                            {day.hasData ? 'تعديل' : 'إضافة'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {loading && <div className="loading">Loading...</div>}

      {/* Spare Part Type Popup */}
      <SparePartTypePopup
        visible={showSparePartPopup}
        sparePartType={currentSparePartType}
        onSave={handleSparePartSave}
        onCancel={handleSparePartCancel}
      />

      {maintenanceData && (
        <div className="cars-list maintenance-list">
          <div className="report-header">
            <div className="report-title-section">
              <h2>سجلات الصيانة - {months.find(m => m.value === parseInt(month))?.label} {year}</h2>
              <p className="car-model-print">السيارة: {cars.find(car => car.id === parseInt(selectedCar))?.car_model}</p>
              <p className="print-date print-only">تاريخ الطباعة: {new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
            </div>
            <button className="print-btn no-print" onClick={handlePrintReport}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 6 2 18 2 18 9"></polyline>
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                <rect x="6" y="14" width="12" height="8"></rect>
              </svg>
              طباعة التقرير
            </button>
          </div>

          <div className="summary-section print-summary">
            <div className="summary-box">
              <h3>إجماليات الشهر ({months.find(m => m.value === parseInt(month))?.label})</h3>
              <div className="summary-content">
                <div className="summary-row">
                  <span>فلتر هواء:</span>
                  <span>{formatCurrency(maintenanceData.monthly_totals.air_filter)}</span>
                </div>
                <div className="summary-row">
                  <span>فلتر زيت:</span>
                  <span>{formatCurrency(maintenanceData.monthly_totals.oil_filter)}</span>
                </div>
                <div className="summary-row">
                  <span>فلتر بنزين:</span>
                  <span>{formatCurrency(maintenanceData.monthly_totals.gas_filter)}</span>
                </div>
                <div className="summary-row">
                  <span>تغيير زيت:</span>
                  <span>{formatCurrency(maintenanceData.monthly_totals.oil_change)}</span>
                </div>
                <div className="summary-row">
                  <span>سعر:</span>
                  <span>{formatCurrency(maintenanceData.monthly_totals.price)}</span>
                </div>
                <div className="summary-row total">
                  <span>المجموع:</span>
                  <span>{formatCurrency(maintenanceData.monthly_totals.full_total)}</span>
                </div>
              </div>
            </div>

            <div className="summary-box">
              <h3>إجماليات السنة ({year})</h3>
              <div className="summary-content">
                <div className="summary-row">
                  <span>فلتر هواء:</span>
                  <span>{formatCurrency(maintenanceData.yearly_totals.air_filter)}</span>
                </div>
                <div className="summary-row">
                  <span>فلتر زيت:</span>
                  <span>{formatCurrency(maintenanceData.yearly_totals.oil_filter)}</span>
                </div>
                <div className="summary-row">
                  <span>فلتر بنزين:</span>
                  <span>{formatCurrency(maintenanceData.yearly_totals.gas_filter)}</span>
                </div>
                <div className="summary-row">
                  <span>تغيير زيت:</span>
                  <span>{formatCurrency(maintenanceData.yearly_totals.oil_change)}</span>
                </div>
                <div className="summary-row">
                  <span>سعر:</span>
                  <span>{formatCurrency(maintenanceData.yearly_totals.price)}</span>
                </div>
                <div className="summary-row total">
                  <span>المجموع:</span>
                  <span>{formatCurrency(maintenanceData.yearly_totals.full_total)}</span>
                </div>
              </div>
            </div>
          </div>

          {loading && <div className="loading-indicator">جاري تحميل البيانات...</div>}

          {!loading && maintenanceData.entries.length === 0 && (
            <div className="empty-message">لا توجد سجلات صيانة لهذه الفترة</div>
          )}

          {!loading && maintenanceData.entries.length > 0 && (
            <div className="cars-table-container">
              <table className="cars-table">
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
                    <th>الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {maintenanceData.entries.map((entry) => (
                    <tr
                      key={entry.id}
                      className="data-row"
                    >
                      <td>{new Date(entry.date).toLocaleDateString()}</td>
                      <td>{formatCurrency(entry.air_filter)}</td>
                      <td>{formatCurrency(entry.oil_filter)}</td>
                      <td>{formatCurrency(entry.gas_filter)}</td>
                      <td>{formatCurrency(entry.oil_change)}</td>
                      <td>{formatCurrency(entry.price)}</td>
                      <td>
                        {formatCurrency(
                          parseFloat(entry.air_filter) +
                          parseFloat(entry.oil_filter) +
                          parseFloat(entry.gas_filter) +
                          parseFloat(entry.oil_change) +
                          parseFloat(entry.price)
                        )}
                      </td>
                      <td>{entry.spare_part_type.slice(0, 10)}</td>
                      <td className="action-buttons">
                        <button
                          className="edit-btn"
                          onClick={() => {
                            // Find the day in monthData that corresponds to this entry
                            const entryDate = new Date(entry.date);
                            const day = entryDate.getDate();
                            const dayIndex = monthData.findIndex(d => d.day === day);

                            if (dayIndex !== -1) {
                              // Scroll to that day in the calendar
                              const rowElement = document.querySelector(`tr[data-day="${day}"]`);
                              if (rowElement) {
                                rowElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                              }

                              // Set that day to editing mode
                              setMonthData(prevData => {
                                const updatedData = [...prevData];
                                // Reset any other editing rows
                                updatedData.forEach((item, i) => {
                                  if (item.isEditing) {
                                    updatedData[i] = { ...item, isEditing: false };
                                  }
                                });
                                // Set this row to editing
                                updatedData[dayIndex] = { ...updatedData[dayIndex], isEditing: true };
                                return updatedData;
                              });
                              setActiveRow(dayIndex);
                            }
                          }}
                          disabled={loading}
                        >
                          تعديل
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Spare Part Type Popup Component
const SparePartTypePopup = ({ visible, sparePartType, onSave, onCancel }) => {
  const [value, setValue] = useState(sparePartType || '');

  // Update value when sparePartType changes (new day selected)
  useEffect(() => {
    setValue(sparePartType || '');
  }, [sparePartType, visible]);

  const handleSave = () => {
    onSave(value);
  };

  if (!visible) return null;

  return (
    <div className="spare-part-popup-overlay">
      <div className="spare-part-popup">
        <h3>نوع قطع الغيار</h3>
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="أدخل نوع قطع الغيار"
          rows={4}
          autoFocus
        />
        <div className="popup-buttons">
          <button className="save-btn" onClick={handleSave}>حفظ</button>
          <button className="cancel-btn" onClick={onCancel}>إلغاء</button>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;