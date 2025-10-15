import React, { useState, useEffect, useRef } from 'react';
import './MonthlyDetail.css'
import axios from 'axios';
import { printCarMonthlyReport } from '../../utils/printUtils';
const MonthlyDetail = () => {
    const [cars, setCars] = useState([]);
    const [selectedCar, setSelectedCar] = useState(null);
    const printSectionRef = useRef(null);
    const [loading, setLoading] = useState({
        cars: false,
        monthlyData: false
    });
    const [error, setError] = useState({
        cars: null,
        monthlyData: null
    });
    const [monthlyData, setMonthlyData] = useState({
        year: 0,
        month: 0,
        period_start: '',
        period_end: '',
        odometer_start: 0,
        odometer_end: 0,
        distance_total: 0,
        gas_total: 0,
        gas_per_km: 0,
        driver_salary_total: 0,
        custody_total: 0,
        net_expenses_total: 0,
        net_revenue_total: 0,
        default_net_revenue_total: 0,
        weeks: []
    })

    // Fetch cars from API
    useEffect(() => {
        const fetchCars = async () => {
            setLoading(prev => ({ ...prev, cars: true }));
            setError(prev => ({ ...prev, cars: null }));
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/cars/');
                const carsData = response.data.map(car => ({
                    id: car.id,
                    model: car.car_model,
                    licenseStartDate: car.license_start,
                    licenseEndDate: car.license_end,
                    licenseNumber: `${car.id}`,
                    supervisor: 'المشرف'
                }));
                setCars(carsData);
            } catch (err) {
                console.error('Error fetching cars:', err);
                setError(prev => ({
                    ...prev,
                    cars: 'حدث خطأ أثناء جلب بيانات السيارات. يرجى المحاولة مرة أخرى.'
                }));
            } finally {
                setLoading(prev => ({ ...prev, cars: false }));
            }
        };

        fetchCars();
    }, []);

    const handleCarSelect = (car) => {
        setSelectedCar(car);
        const today = new Date();
        fetchMonthlyData(car.id, today.getFullYear(), today.getMonth() + 1);
    };

    const fetchMonthlyData = async (carId, year, month) => {
        setLoading(prev => ({ ...prev, monthlyData: true }));
        setError(prev => ({ ...prev, monthlyData: null }));

        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/monthly/detail/?car_id=${carId}&year=${year}&month=${month}`);
            const data = response.data;
            console.log(data)
            setMonthlyData(data);
        } catch (err) {
            console.error('Error fetching monthly data:', err);
            setError(prev => ({ ...prev, monthlyData: 'حدث خطأ أثناء جلب بيانات الشهر. يرجى المحاولة مرة أخرى.' }));
        } finally {
            setLoading(prev => ({ ...prev, monthlyData: false }));
        }
    }
    const handlePrint = () => {
        printCarMonthlyReport(selectedCar, monthlyData);
    };
    return (
        <div className="cars-filter-container">
            <div className="cars-list">
                <h2>قائمة السيارات</h2>

                {loading.cars && (
                    <div className="loading-indicator">جاري تحميل بيانات السيارات...</div>
                )}

                {error.cars && (
                    <div className="error-message">{error.cars}</div>
                )}

                {!loading.cars && !error.cars && cars.length === 0 && (
                    <div className="empty-message">لا توجد سيارات متاحة</div>
                )}

                <div className="cars-grid">
                    {cars.map((car) => (
                        <div
                            key={car.id}
                            className={`car-card ${selectedCar && selectedCar.id === car.id ? 'selected' : ''}`}
                            onClick={() => handleCarSelect(car)}
                        >
                            <h3>{car.model}</h3>
                        </div>
                    ))}
                </div>
            </div>

            {selectedCar && (
                <div className="car-details">
                    <div className="car-header">
                        <div className="car-header-container">
                            <h2>تقرير السيارة: {selectedCar.model}</h2>
                            <span>الترخيص: {selectedCar.licenseStartDate} - {selectedCar.licenseEndDate}</span>
                        </div>
                    </div>

                    {error.monthlyData && (
                        <div className="error-message">{error.monthlyData}</div>
                    )}
                    <p className='month-period'>{monthlyData.period_start} - {monthlyData.period_end}</p>

                    <div className="monthly-report">
                        {loading.monthlyData ? (
                            <div className="loading-indicator">جاري تحميل بيانات الشهر...</div>
                        ) : (
                            <>
                                <div className="year-selector">
                                    <label htmlFor="date_selector">العام : </label>
                                    <input
                                        type="month"
                                        id="date_selector"
                                        value={monthlyData.year + '-' + monthlyData.month}
                                        onChange={(e) => {
                                            fetchMonthlyData(selectedCar.id, e.target.value.split('-')[0], e.target.value.split('-')[1]);
                                        }}
                                    />
                                </div>

                                <table className="report-table" ref={printSectionRef}>
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
                                        {monthlyData.weeks.map((week, index) => (
                                            <tr key={index}>
                                                <td>{week.week_start}</td>
                                                <td>{week.week_end}</td>
                                                <td>{week.odometer_start}</td>
                                                <td>{week.odometer_end}</td>
                                                <td>{week.distance}</td>
                                                <td>{week.driver_salary}</td>
                                                <td>{week.custody}</td>
                                                <td>{week.net_expenses}</td>
                                                <td>{week.net_revenue}</td>
                                                <td>{week.default_net_revenue}</td>
                                            </tr>
                                        ))}
                                        <tr className='totals-row'>
                                            <td colSpan="10">الإجمالي</td>
                                        </tr>
                                        <tr className="meta-row">
                                            <td>اجمالي المسافه</td>
                                            <td>{monthlyData.distance_total}</td>
                                            <td>اجمالي المرتبات</td>
                                            <td>{monthlyData.driver_salary_total}</td>
                                            <td>اجمالي العهدة</td>
                                            <td>{monthlyData.custody_total}</td>
                                            <td>اجمالي المصروفات</td>
                                            <td>{monthlyData.net_expenses_total}</td>
                                            <td>اجمالي الايرادات</td>
                                            <td>{monthlyData.net_revenue_total}</td>
                                        </tr>
                                        <tr className="meta-row">
                                            <td>عداد أول الشهر</td>
                                            <td>{monthlyData.odometer_start}</td>
                                            <td>عداد اخر الشهر</td>
                                            <td>{monthlyData.odometer_end}</td>
                                            <td>اجمالي المسافه</td>
                                            <td>{monthlyData.distance_total}</td>
                                            <td>اجمالي الجاز</td>
                                            <td>{monthlyData.gas_total}</td>
                                            <td>متوسط استهلاك الجاز \ كم</td>
                                            <td>{monthlyData.gas_per_km}</td>
                                        </tr>
                                        <tr className="meta-row">
                                            <td>اجمالي المرتبات</td>
                                            <td>{monthlyData.driver_salary_total}</td>
                                            <td> إجمالي الايرادات الاضافية</td>
                                            <td>{monthlyData.default_net_revenue_total}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <br />
                                <br />
                                <div className="actions">
                                    <button className="print-btn" onClick={handlePrint}>طباعة التقرير</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default MonthlyDetail
