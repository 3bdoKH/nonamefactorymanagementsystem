import React, { useState, useEffect, useRef } from 'react';
import './CarsFilter.css';
import { printCarWeeklyReport } from '../../utils/printUtils';

const CarsFilter = () => {
    const [cars, setCars] = useState([]);
    const [selectedCar, setSelectedCar] = useState(null);
    const printSectionRef = useRef(null);
    const [weeklyData, setWeeklyData] = useState({
        days: [
            { day: 'السبت', date: '', driver: '', area: '', revenue: '', gas: '', oil: '', card: '', fines: '', tips: '', maintenance: '', spareParts: '', tires: '', balance: '', washing: '', withoutIncome: '' },
            { day: 'الأحد', date: '', driver: '', area: '', revenue: '', gas: '', oil: '', card: '', fines: '', tips: '', maintenance: '', spareParts: '', tires: '', balance: '', washing: '', withoutIncome: '' },
            { day: 'الاثنين', date: '', driver: '', area: '', revenue: '', gas: '', oil: '', card: '', fines: '', tips: '', maintenance: '', spareParts: '', tires: '', balance: '', washing: '', withoutIncome: '' },
            { day: 'الثلاثاء', date: '', driver: '', area: '', revenue: '', gas: '', oil: '', card: '', fines: '', tips: '', maintenance: '', spareParts: '', tires: '', balance: '', washing: '', withoutIncome: '' },
            { day: 'الأربعاء', date: '', driver: '', area: '', revenue: '', gas: '', oil: '', card: '', fines: '', tips: '', maintenance: '', spareParts: '', tires: '', balance: '', washing: '', withoutIncome: '' },
            { day: 'الخميس', date: '', driver: '', area: '', revenue: '', gas: '', oil: '', card: '', fines: '', tips: '', maintenance: '', spareParts: '', tires: '', balance: '', washing: '', withoutIncome: '' },
        ],
        startMeter: '',
        endMeter: '',
        driverSalary: '',
        payments: '',
        totalIncome: '',
        averageGasConsumption: '',
        wasted: '',
        supervisor: '',
    });
    // cars data
    useEffect(() => {
        const mockCars = [
            { id: 1, model: 'تويوتا كورولا', licenseNumber: '123 أ ب ج', supervisor: 'أحمد محمد' },
            { id: 2, model: 'هيونداي إلنترا', licenseNumber: '456 د هـ و', supervisor: 'محمود علي' },
            { id: 3, model: 'نيسان صني', licenseNumber: '789 ز ح ط', supervisor: 'كريم سعيد' }
        ];
        setCars(mockCars);
    }, []);

    const handleCarSelect = (car) => {
        setSelectedCar(car);
    };

    const handleInputChange = (dayIndex, field, value) => {
        const updatedDays = [...weeklyData.days];
        updatedDays[dayIndex] = { ...updatedDays[dayIndex], [field]: value };
        setWeeklyData({
            ...weeklyData,
            days: updatedDays
        });
    };

    const handleMetadataChange = (field, value) => {
        setWeeklyData({
            ...weeklyData,
            [field]: value
        });
    };

    const calculateTotals = () => {
        const totals = {
            revenue: 0, gas: 0, oil: 0, card: 0, fines: 0, tips: 0,
            maintenance: 0, spareParts: 0, tires: 0, balance: 0,
            washing: 0, withoutIncome: 0
        };
        weeklyData.days.forEach(day => {
            Object.keys(totals).forEach(key => {
                const value = parseFloat(day[key]) || 0;
                totals[key] += value;
            });
        });
        return totals;
    };

    const totals = calculateTotals();

    const handlePrint = () => {
        printCarWeeklyReport(selectedCar, weeklyData, totals);
    };

    return (
        <div className="cars-filter-container">
            <div className="cars-list">
                <h2>قائمة السيارات</h2>
                <div className="cars-grid">
                    {cars.map((car) => (
                        <div
                            key={car.id}
                            className={`car-card ${selectedCar && selectedCar.id === car.id ? 'selected' : ''}`}
                            onClick={() => handleCarSelect(car)}
                        >
                            <h3>{car.model}</h3>
                            <p>رقم اللوحة: {car.licenseNumber}</p>
                        </div>
                    ))}
                </div>
            </div>

            {selectedCar && (
                <div className="car-details">
                    <div className="car-header">
                        <h2>بيانات السيارة: {selectedCar.model}</h2>
                        <p>رقم اللوحة: {selectedCar.licenseNumber}</p>
                        <p>المشرف: {selectedCar.supervisor}</p>
                    </div>

                    <div className="weekly-report">
                        <table className="report-table" ref={printSectionRef}>
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
                                {weeklyData.days.map((day, index) => (
                                    <tr key={index}>
                                        <td>{day.day}</td>
                                        <td><input type="date" value={day.date} onChange={(e) => handleInputChange(index, 'date', e.target.value)} /></td>
                                        <td><input type="text" value={day.driver} onChange={(e) => handleInputChange(index, 'driver', e.target.value)} /></td>
                                        <td><input type="text" value={day.area} onChange={(e) => handleInputChange(index, 'area', e.target.value)} /></td>
                                        <td><input type="number" value={day.revenue} onChange={(e) => handleInputChange(index, 'revenue', e.target.value)} /></td>
                                        <td><input type="number" value={day.gas} onChange={(e) => handleInputChange(index, 'gas', e.target.value)} /></td>
                                        <td><input type="number" value={day.oil} onChange={(e) => handleInputChange(index, 'oil', e.target.value)} /></td>
                                        <td><input type="number" value={day.card} onChange={(e) => handleInputChange(index, 'card', e.target.value)} /></td>
                                        <td><input type="number" value={day.fines} onChange={(e) => handleInputChange(index, 'fines', e.target.value)} /></td>
                                        <td><input type="number" value={day.tips} onChange={(e) => handleInputChange(index, 'tips', e.target.value)} /></td>
                                        <td><input type="number" value={day.maintenance} onChange={(e) => handleInputChange(index, 'maintenance', e.target.value)} /></td>
                                        <td><input type="number" value={day.spareParts} onChange={(e) => handleInputChange(index, 'spareParts', e.target.value)} /></td>
                                        <td><input type="number" value={day.tires} onChange={(e) => handleInputChange(index, 'tires', e.target.value)} /></td>
                                        <td><input type="number" value={day.balance} onChange={(e) => handleInputChange(index, 'balance', e.target.value)} /></td>
                                        <td><input type="number" value={day.washing} onChange={(e) => handleInputChange(index, 'washing', e.target.value)} /></td>
                                        <td><input type="number" value={day.withoutIncome} onChange={(e) => handleInputChange(index, 'withoutIncome', e.target.value)} /></td>
                                    </tr>
                                ))}

                                <tr className="totals-row">
                                    <td colSpan="4">الإجمالي</td>
                                    <td>{totals.revenue}</td>
                                    <td>{totals.gas}</td>
                                    <td>{totals.oil}</td>
                                    <td>{totals.card}</td>
                                    <td>{totals.fines}</td>
                                    <td>{totals.tips}</td>
                                    <td>{totals.maintenance}</td>
                                    <td>{totals.spareParts}</td>
                                    <td>{totals.tires}</td>
                                    <td>{totals.balance}</td>
                                    <td>{totals.washing}</td>
                                    <td>{totals.withoutIncome}</td>
                                </tr>


                                <tr className="meta-row">
                                    <td colSpan="2">عداد أول المدة</td>
                                    <td colSpan="2"><input type="number" value={weeklyData.startMeter} onChange={(e) => handleMetadataChange('startMeter', e.target.value)} /></td>
                                    <td colSpan="2">مرتب السائق</td>
                                    <td colSpan="2"><input type="number" value={weeklyData.driverSalary} onChange={(e) => handleMetadataChange('driverSalary', e.target.value)} /></td>
                                    <td colSpan="2">المدفوعات</td>
                                    <td colSpan="2"><input type="number" value={weeklyData.payments} onChange={(e) => handleMetadataChange('payments', e.target.value)} /></td>
                                    <td colSpan="2">إجمالي الإيرادات</td>
                                    <td colSpan="2">{totals.revenue - totals.gas - totals.oil - totals.card - totals.fines - totals.tips - totals.maintenance - totals.spareParts - totals.tires - totals.balance - totals.washing - weeklyData.driverSalary}</td>
                                </tr>

                                <tr className="meta-row">
                                    <td colSpan="2">عداد آخر المدة</td>
                                    <td colSpan="2"><input type="number" value={weeklyData.endMeter} onChange={(e) => handleMetadataChange('endMeter', e.target.value)} /></td>
                                    <td colSpan="2">متوسط استهلاك الجاز/كم</td>
                                    <td colSpan="2">
                                        {weeklyData.startMeter && weeklyData.endMeter && totals.gas
                                            ? ((totals.gas) / (weeklyData.endMeter - weeklyData.startMeter)).toFixed(2)
                                            : '0'}
                                    </td>
                                    <td colSpan="2">الاهلاك</td>
                                    <td colSpan="6"><input type="number" value={weeklyData.wasted} onChange={(e) => handleMetadataChange('wasted', e.target.value)} /></td>
                                </tr>
                            </tbody>
                        </table>

                        <div className="actions">
                            <button className="save-btn">حفظ البيانات</button>
                            <button className="print-btn" onClick={handlePrint}>طباعة التقرير</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CarsFilter;
