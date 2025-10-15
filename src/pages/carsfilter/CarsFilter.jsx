import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './CarsFilter.css';
import { printCarWeeklyReport } from '../../utils/printUtils';

const CarsFilter = () => {
    const [cars, setCars] = useState([]);
    const [selectedCar, setSelectedCar] = useState(null);
    const printSectionRef = useRef(null);
    const [loading, setLoading] = useState({
        cars: false,
        weeklyData: false,
        saveDaily: false,
        saveWeekly: false
    });
    const [error, setError] = useState({
        cars: null,
        weeklyData: null,
        saveDaily: null,
        saveWeekly: null
    });
    const [weeklyData, setWeeklyData] = useState({
        week_start: '',
        week_end: '',
        odometer_start: 0,
        odometer_end: 0,
        distance: 0,
        gas_per_km: 0,
        driver_salary: 0,
        custody: 0,
        description: '',
        net_expenses: 0,
        net_revenue: 0,
        default_net_revenue: 0,
        week_ref_date: '',
        totals: {
            freight: 0,
            default_freight: 0,
            gas: 0,
            oil: 0,
            card: 0,
            fines: 0,
            tips: 0,
            maintenance: 0,
            spare_parts: 0,
            tires: 0,
            balance: 0,
            washing: 0,
            without: 0
        },
        daily_entries: [
            { day_name: 'السبت', inspection_date: '', driver_name: '', area: '', freight: '', default_freight: '', gas: '', oil: '', card: '', fines: '', tips: '', maintenance: '', spare_parts: '', tires: '', balance: '', washing: '', without: '', week_start: '' },
            { day_name: 'الأحد', inspection_date: '', driver_name: '', area: '', freight: '', default_freight: '', gas: '', oil: '', card: '', fines: '', tips: '', maintenance: '', spare_parts: '', tires: '', balance: '', washing: '', without: '', week_start: '' },
            { day_name: 'الاثنين', inspection_date: '', driver_name: '', area: '', freight: '', default_freight: '', gas: '', oil: '', card: '', fines: '', tips: '', maintenance: '', spare_parts: '', tires: '', balance: '', washing: '', without: '', week_start: '' },
            { day_name: 'الثلاثاء', inspection_date: '', driver_name: '', area: '', freight: '', default_freight: '', gas: '', oil: '', card: '', fines: '', tips: '', maintenance: '', spare_parts: '', tires: '', balance: '', washing: '', without: '', week_start: '' },
            { day_name: 'الأربعاء', inspection_date: '', driver_name: '', area: '', freight: '', default_freight: '', gas: '', oil: '', card: '', fines: '', tips: '', maintenance: '', spare_parts: '', tires: '', balance: '', washing: '', without: '', week_start: '' },
            { day_name: 'الخميس', inspection_date: '', driver_name: '', area: '', freight: '', default_freight: '', gas: '', oil: '', card: '', fines: '', tips: '', maintenance: '', spare_parts: '', tires: '', balance: '', washing: '', without: '', week_start: '' },
        ]
    });

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
    console.log(cars)
    const handleCarSelect = (car) => {
        setSelectedCar(car);

        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD

        fetchWeeklyData(car.id, formattedDate);
    };

    const fetchWeeklyData = async (carId, date) => {
        setLoading(prev => ({ ...prev, weeklyData: true }));
        setError(prev => ({ ...prev, weeklyData: null }));

        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/weekly/detail/?car_id=${carId}&date=${date}`);
            const data = response.data;
            const newWeeklyData = {
                week_start: data.week_start || '',
                week_end: data.week_end || '',
                odometer_start: data.odometer_start || 0,
                odometer_end: data.odometer_end || 0,
                distance: data.distance || 0,
                gas_per_km: data.gas_per_km || 0,
                driver_salary: data.driver_salary || 0,
                custody: data.custody || 0,
                description: data.description || '',
                net_expenses: data.net_expenses || 0,
                net_revenue: data.net_revenue || 0,
                default_net_revenue: data.default_net_revenue || 0,
                week_ref_date: date,
                totals: {
                    freight: data.totals.freight || 0,
                    default_freight: data.totals.default_freight || 0,
                    gas: data.totals.gas || 0,
                    oil: data.totals.oil || 0,
                    card: data.totals.card || 0,
                    fines: data.totals.fines || 0,
                    tips: data.totals.tips || 0,
                    maintenance: data.totals.maintenance || 0,
                    spare_parts: data.totals.spare_parts || 0,
                    tires: data.totals.tires || 0,
                    balance: data.totals.balance || 0,
                    washing: data.totals.washing || 0,
                    without: data.totals.without || 0
                },
                daily_entries: [
                    { day_name: 'السبت', inspection_date: '', driver_name: '', area: '', freight: '', default_freight: '', gas: '', oil: '', card: '', fines: '', tips: '', maintenance: '', spare_parts: '', tires: '', balance: '', washing: '', without: '', week_start: '' },
                    { day_name: 'الأحد', inspection_date: '', driver_name: '', area: '', freight: '', default_freight: '', gas: '', oil: '', card: '', fines: '', tips: '', maintenance: '', spare_parts: '', tires: '', balance: '', washing: '', without: '', week_start: '' },
                    { day_name: 'الاثنين', inspection_date: '', driver_name: '', area: '', freight: '', default_freight: '', gas: '', oil: '', card: '', fines: '', tips: '', maintenance: '', spare_parts: '', tires: '', balance: '', washing: '', without: '', week_start: '' },
                    { day_name: 'الثلاثاء', inspection_date: '', driver_name: '', area: '', freight: '', default_freight: '', gas: '', oil: '', card: '', fines: '', tips: '', maintenance: '', spare_parts: '', tires: '', balance: '', washing: '', without: '', week_start: '' },
                    { day_name: 'الأربعاء', inspection_date: '', driver_name: '', area: '', freight: '', default_freight: '', gas: '', oil: '', card: '', fines: '', tips: '', maintenance: '', spare_parts: '', tires: '', balance: '', washing: '', without: '', week_start: '' },
                    { day_name: 'الخميس', inspection_date: '', driver_name: '', area: '', freight: '', default_freight: '', gas: '', oil: '', card: '', fines: '', tips: '', maintenance: '', spare_parts: '', tires: '', balance: '', washing: '', without: '', week_start: '' },
                ]
            };

            if (data.daily_entries && data.daily_entries.length > 0) {
                const dayMapping = {
                    'Saturday': 'السبت',
                    'Sunday': 'الأحد',
                    'Monday': 'الاثنين',
                    'Tuesday': 'الثلاثاء',
                    'Wednesday': 'الأربعاء',
                    'Thursday': 'الخميس'
                };
                data.daily_entries.forEach(entry => {
                    const dayIndex = newWeeklyData.daily_entries.findIndex(d => d.day_name === dayMapping[entry.day_name]);
                    if (dayIndex !== -1) {
                        newWeeklyData.daily_entries[dayIndex] = {
                            day_name: dayMapping[entry.day_name],
                            inspection_date: entry.inspection_date || '',
                            driver_name: entry.driver_name || '',
                            area: entry.area || '',
                            freight: entry.freight || '',
                            default_freight: entry.default_freight || '',
                            gas: entry.gas || '',
                            oil: entry.oil || '',
                            card: entry.card || '',
                            fines: entry.fines || '',
                            tips: entry.tips || '',
                            maintenance: entry.maintenance || '',
                            spare_parts: entry.spare_parts || '',
                            tires: entry.tires || '',
                            balance: entry.balance || '',
                            washing: entry.washing || '',
                            without: entry.without || '',
                            week_start: entry.week_start || ''
                        };
                    }
                });
            }

            setWeeklyData(newWeeklyData);
        } catch (err) {
            console.error('Error fetching weekly data:', err);
            setError(prev => ({
                ...prev,
                weeklyData: 'حدث خطأ أثناء جلب بيانات الأسبوع. يرجى المحاولة مرة أخرى.'
            }));

            setWeeklyData({
                week_start: '',
                week_end: '',
                odometer_start: 0,
                odometer_end: 0,
                distance: 0,
                gas_per_km: 0,
                driver_salary: 0,
                custody: 0,
                description: '',
                net_expenses: 0,
                net_revenue: 0,
                default_net_revenue: 0,
                week_ref_date: date,
                totals: {
                    freight: 0,
                    default_freight: 0,
                    gas: 0,
                    oil: 0,
                    card: 0,
                    fines: 0,
                    tips: 0,
                    maintenance: 0,
                    spare_parts: 0,
                    tires: 0,
                    balance: 0,
                    washing: 0,
                    without: 0
                },
                daily_entries: [
                    { day_name: 'السبت', inspection_date: '', driver_name: '', area: '', freight: '', default_freight: '', gas: '', oil: '', card: '', fines: '', tips: '', maintenance: '', spare_parts: '', tires: '', balance: '', washing: '', without: '', week_start: '' },
                    { day_name: 'الأحد', inspection_date: '', driver_name: '', area: '', freight: '', default_freight: '', gas: '', oil: '', card: '', fines: '', tips: '', maintenance: '', spare_parts: '', tires: '', balance: '', washing: '', without: '', week_start: '' },
                    { day_name: 'الاثنين', inspection_date: '', driver_name: '', area: '', freight: '', default_freight: '', gas: '', oil: '', card: '', fines: '', tips: '', maintenance: '', spare_parts: '', tires: '', balance: '', washing: '', without: '', week_start: '' },
                    { day_name: 'الثلاثاء', inspection_date: '', driver_name: '', area: '', freight: '', default_freight: '', gas: '', oil: '', card: '', fines: '', tips: '', maintenance: '', spare_parts: '', tires: '', balance: '', washing: '', without: '', week_start: '' },
                    { day_name: 'الأربعاء', inspection_date: '', driver_name: '', area: '', freight: '', default_freight: '', gas: '', oil: '', card: '', fines: '', tips: '', maintenance: '', spare_parts: '', tires: '', balance: '', washing: '', without: '', week_start: '' },
                    { day_name: 'الخميس', inspection_date: '', driver_name: '', area: '', freight: '', default_freight: '', gas: '', oil: '', card: '', fines: '', tips: '', maintenance: '', spare_parts: '', tires: '', balance: '', washing: '', without: '', week_start: '' },
                ]
            });
        } finally {
            setLoading(prev => ({ ...prev, weeklyData: false }));
        }
    };

    const handleInputChange = (dayIndex, field, value) => {
        const updatedDays = [...weeklyData.daily_entries];
        updatedDays[dayIndex] = { ...updatedDays[dayIndex], [field]: value };
        setWeeklyData({
            ...weeklyData,
            daily_entries: updatedDays
        });
    };

    const handleMetadataChange = (field, value) => {
        setWeeklyData({
            ...weeklyData,
            [field]: value
        });
    };

    const saveDailyEntry = async (dayIndex) => {
        if (!selectedCar) {
            return;
        }

        const day = weeklyData.daily_entries[dayIndex];

        if (!day.inspection_date) {
            alert('يرجى إدخال التاريخ أولاً');
            return;
        }

        setLoading(prev => ({ ...prev, saveDaily: true }));
        setError(prev => ({ ...prev, saveDaily: null }));

        try {
            const arabicToEnglish = {
                'السبت': 'Saturday',
                'الأحد': 'Sunday',
                'الاثنين': 'Monday',
                'الثلاثاء': 'Tuesday',
                'الأربعاء': 'Wednesday',
                'الخميس': 'Thursday'
            };

            const apiData = {
                car_id: selectedCar.id,
                inspection_date: day.inspection_date,
                day_name: arabicToEnglish[day.day_name],
                driver_name: day.driver_name || '',
                area: day.area || '',
                freight: parseFloat(day.freight) || 0,
                default_freight: parseFloat(day.default_freight) || 0,
                gas: parseFloat(day.gas) || 0,
                oil: parseFloat(day.oil) || 0,
                card: parseFloat(day.card) || 0,
                fines: parseFloat(day.fines) || 0,
                tips: parseFloat(day.tips) || 0,
                maintenance: parseFloat(day.maintenance) || 0,
                spare_parts: parseFloat(day.spare_parts) || 0,
                tires: parseFloat(day.tires) || 0,
                balance: parseFloat(day.balance) || 0,
                washing: parseFloat(day.washing) || 0,
                without: parseFloat(day.without) || 0
            };
            try {
                await axios.put('http://127.0.0.1:8000/api/daily-entries/by-date/', apiData);
            } catch (updateError) {
                if (updateError.response && updateError.response.status === 404) {
                    await axios.post('http://127.0.0.1:8000/api/daily-entries/', apiData);
                } else {
                    throw updateError;
                }
            }

        } catch (err) {
            console.error('Error saving daily entry:', err);
            // Get more detailed error information
            const errorDetail = err.response?.data ? JSON.stringify(err.response.data) : 'No detailed error information';
            console.log('API Error Details:', errorDetail);

            setError(prev => ({
                ...prev,
                saveDaily: `حدث خطأ أثناء حفظ البيانات اليومية. يرجى المحاولة مرة أخرى. تفاصيل: ${errorDetail}`
            }));
            alert(`حدث خطأ أثناء حفظ البيانات. يرجى المحاولة مرة أخرى. تفاصيل: ${errorDetail}`);
        } finally {
            setLoading(prev => ({ ...prev, saveDaily: false }));
        }
    };

    const saveWeeklySummary = async () => {
        if (!selectedCar) {
            return;
        }

        if (!weeklyData.week_ref_date) {
            const today = new Date();
            const todayDate = today.toISOString().split('T')[0];
            setWeeklyData(prev => ({
                ...prev,
                week_ref_date: todayDate
            }));
            weeklyData.week_ref_date = todayDate;
        }

        setLoading(prev => ({ ...prev, saveWeekly: true }));
        setError(prev => ({ ...prev, saveWeekly: null }));

        try {
            const apiData = {
                car_id: selectedCar.id,
                week_ref_date: weeklyData.week_ref_date,
                odometer_start: parseFloat(weeklyData.odometer_start) || 0,
                odometer_end: parseFloat(weeklyData.odometer_end) || 0,
                driver_salary: parseFloat(weeklyData.driver_salary) || 0,
                custody: parseFloat(weeklyData.custody) || 0,
                description: weeklyData.description || ''
            };
            await axios.post('http://127.0.0.1:8000/api/weekly/', apiData);
            alert('تم حفظ ملخص الأسبوع بنجاح');
        } catch (err) {
            const errorDetail = err.response?.data ? JSON.stringify(err.response.data) : 'No detailed error information';
            setError(prev => ({
                ...prev,
                saveWeekly: `حدث خطأ أثناء حفظ ملخص الأسبوع. يرجى المحاولة مرة أخرى. تفاصيل: ${errorDetail}`
            }));
            alert(`حدث خطأ أثناء حفظ البيانات. يرجى المحاولة مرة أخرى. تفاصيل: ${errorDetail}`);
        } finally {
            setLoading(prev => ({ ...prev, saveWeekly: false }));
        }
    };

    const handleSaveData = async () => {
        try {
            setLoading(prev => ({
                ...prev,
                saveDaily: true,
                saveWeekly: true
            }));

            for (let index = 0; index < weeklyData.daily_entries.length; index++) {
                const day = weeklyData.daily_entries[index];
                if (day.inspection_date) {
                    await saveDailyEntry(index);
                }
            }

            await saveWeeklySummary();

            if (selectedCar) {
                const refreshDate = weeklyData.week_ref_date || new Date().toISOString().split('T')[0];
                await fetchWeeklyData(selectedCar.id, refreshDate);
            }
        } catch (error) {
            console.error("Error in handleSaveData:", error);
        } finally {
            setLoading(prev => ({
                ...prev,
                saveDaily: false,
                saveWeekly: false
            }));
        }
    };

    const handlePrint = () => {
        printCarWeeklyReport(selectedCar, weeklyData);
    };

    const handleClearWeeklyData = async () => {
        if (!selectedCar) {
            return;
        }

        if (!window.confirm('هل أنت متأكد من مسح بيانات الأسبوع الحالي؟ سيتم حذف البيانات من قاعدة البيانات.')) {
            return;
        }

        try {
            setLoading(prev => ({ ...prev, saveDaily: true }));

            const daysToDelete = weeklyData.daily_entries.filter(day => day.inspection_date);

            for (const day of daysToDelete) {
                try {
                    const apiData = {
                        car_id: selectedCar.id,
                        inspection_date: day.inspection_date,
                        day_name: day.day_name === 'السبت' ? 'Saturday' :
                            day.day_name === 'الأحد' ? 'Sunday' :
                                day.day_name === 'الاثنين' ? 'Monday' :
                                    day.day_name === 'الثلاثاء' ? 'Tuesday' :
                                        day.day_name === 'الأربعاء' ? 'Wednesday' :
                                            day.day_name === 'الخميس' ? 'Thursday' : 'Friday',
                        driver_name: '',
                        area: '',
                        freight: 0,
                        default_freight: 0,
                        gas: 0,
                        oil: 0,
                        card: 0,
                        fines: 0,
                        tips: 0,
                        maintenance: 0,
                        spare_parts: 0,
                        tires: 0,
                        balance: 0,
                        washing: 0,
                        without: 0
                    };
                    await axios.put('http://127.0.0.1:8000/api/daily-entries/by-date/', apiData);
                } catch (err) {
                    console.error(`Error clearing data for ${day.inspection_date}:`, err);
                }
            }

            if (weeklyData.week_ref_date) {
                try {
                    const weeklyApiData = {
                        car_id: selectedCar.id,
                        week_ref_date: weeklyData.week_ref_date,
                        odometer_start: 0,
                        odometer_end: 0,
                        driver_salary: 0,
                        custody: 0,
                        description: ''
                    };

                    await axios.put('http://127.0.0.1:8000/api/weekly/by-date/', weeklyApiData);
                } catch (err) {
                    console.error('Error clearing weekly summary:', err);
                }
            }

            // Reset weekly data in the UI
            setWeeklyData({
                week_start: '',
                week_end: '',
                odometer_start: 0,
                odometer_end: 0,
                distance: 0,
                gas_per_km: 0,
                driver_salary: 0,
                custody: 0,
                description: '',
                net_expenses: 0,
                net_revenue: 0,
                default_net_revenue: 0,
                week_ref_date: new Date().toISOString().split('T')[0],
                totals: {
                    freight: 0,
                    default_freight: 0,
                    gas: 0,
                    oil: 0,
                    card: 0,
                    fines: 0,
                    tips: 0,
                    maintenance: 0,
                    spare_parts: 0,
                    tires: 0,
                    balance: 0,
                    washing: 0,
                    without: 0
                },
                daily_entries: [
                    { day_name: 'السبت', inspection_date: '', driver_name: '', area: '', freight: '', default_freight: '', gas: '', oil: '', card: '', fines: '', tips: '', maintenance: '', spare_parts: '', tires: '', balance: '', washing: '', without: '', week_start: '' },
                    { day_name: 'الأحد', inspection_date: '', driver_name: '', area: '', freight: '', default_freight: '', gas: '', oil: '', card: '', fines: '', tips: '', maintenance: '', spare_parts: '', tires: '', balance: '', washing: '', without: '', week_start: '' },
                    { day_name: 'الاثنين', inspection_date: '', driver_name: '', area: '', freight: '', default_freight: '', gas: '', oil: '', card: '', fines: '', tips: '', maintenance: '', spare_parts: '', tires: '', balance: '', washing: '', without: '', week_start: '' },
                    { day_name: 'الثلاثاء', inspection_date: '', driver_name: '', area: '', freight: '', default_freight: '', gas: '', oil: '', card: '', fines: '', tips: '', maintenance: '', spare_parts: '', tires: '', balance: '', washing: '', without: '', week_start: '' },
                    { day_name: 'الأربعاء', inspection_date: '', driver_name: '', area: '', freight: '', default_freight: '', gas: '', oil: '', card: '', fines: '', tips: '', maintenance: '', spare_parts: '', tires: '', balance: '', washing: '', without: '', week_start: '' },
                    { day_name: 'الخميس', inspection_date: '', driver_name: '', area: '', freight: '', default_freight: '', gas: '', oil: '', card: '', fines: '', tips: '', maintenance: '', spare_parts: '', tires: '', balance: '', washing: '', without: '', week_start: '' },
                ]
            });

            // Refresh data from backend to confirm changes
            if (selectedCar) {
                await fetchWeeklyData(selectedCar.id, new Date().toISOString().split('T')[0]);
            }

            alert('تم مسح بيانات الأسبوع من قاعدة البيانات');
        } catch (error) {
            console.error('Error clearing weekly data:', error);
            alert('حدث خطأ أثناء مسح البيانات. يرجى المحاولة مرة أخرى.');
        } finally {
            // Hide loading indicator
            setLoading(prev => ({ ...prev, saveDaily: false }));
        }
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

                    {error.weeklyData && (
                        <div className="error-message">{error.weeklyData}</div>
                    )}

                    <div className="weekly-report">
                        {loading.weeklyData ? (
                            <div className="loading-indicator">جاري تحميل بيانات الأسبوع...</div>
                        ) : (
                            <>
                                <div className="week-date-selector">
                                    <label htmlFor="week_ref_date">تاريخ الأسبوع:</label>
                                    <input
                                        type="date"
                                        id="week_ref_date"
                                        value={weeklyData.week_ref_date}
                                        onChange={(e) => {
                                            handleMetadataChange('week_ref_date', e.target.value);
                                            fetchWeeklyData(selectedCar.id, e.target.value);
                                        }}
                                    />
                                </div>

                                <table className="report-table" ref={printSectionRef}>
                                    <thead>
                                        <tr>
                                            <th>اليوم</th>
                                            <th>التاريخ</th>
                                            <th>السواق</th>
                                            <th>المنطقه</th>
                                            <th>النولون</th>
                                            <th>النولون الاضافي</th>
                                            <th>جاز</th>
                                            <th>زيت</th>
                                            <th>كرت</th>
                                            <th>غرامات</th>
                                            <th>اكراميات</th>
                                            <th>قطع غيار</th>
                                            <th>كاوتش</th>
                                            <th>ميزان</th>
                                            <th>غسيل</th>
                                            <th>بدون</th>
                                            <th>صيانه</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {weeklyData.daily_entries.map((day, index) => (
                                            <tr key={index}>
                                                <td>{day.day_name}</td>
                                                <td><input type="date" value={day.inspection_date} onChange={(e) => handleInputChange(index, 'inspection_date', e.target.value)} /></td>
                                                <td><input type="text" value={day.driver_name} onChange={(e) => handleInputChange(index, 'driver_name', e.target.value)} /></td>
                                                <td><input type="text" value={day.area} onChange={(e) => handleInputChange(index, 'area', e.target.value)} /></td>
                                                <td><input type="number" value={day.freight} onChange={(e) => handleInputChange(index, 'freight', e.target.value)} /></td>
                                                <td><input type="number" value={day.default_freight} onChange={(e) => handleInputChange(index, 'default_freight', e.target.value)} /></td>
                                                <td><input type="number" value={day.gas} onChange={(e) => handleInputChange(index, 'gas', e.target.value)} /></td>
                                                <td><input type="number" value={day.oil} onChange={(e) => handleInputChange(index, 'oil', e.target.value)} /></td>
                                                <td><input type="number" value={day.card} onChange={(e) => handleInputChange(index, 'card', e.target.value)} /></td>
                                                <td><input type="number" value={day.fines} onChange={(e) => handleInputChange(index, 'fines', e.target.value)} /></td>
                                                <td><input type="number" value={day.tips} onChange={(e) => handleInputChange(index, 'tips', e.target.value)} /></td>
                                                <td><input type="number" value={day.spare_parts} onChange={(e) => handleInputChange(index, 'spare_parts', e.target.value)} /></td>
                                                <td><input type="number" value={day.tires} onChange={(e) => handleInputChange(index, 'tires', e.target.value)} /></td>
                                                <td><input type="number" value={day.balance} onChange={(e) => handleInputChange(index, 'balance', e.target.value)} /></td>
                                                <td><input type="number" value={day.washing} onChange={(e) => handleInputChange(index, 'washing', e.target.value)} /></td>
                                                <td><input type="number" value={day.without} onChange={(e) => handleInputChange(index, 'without', e.target.value)} /></td>
                                                <td><input type="number" value={day.maintenance} onChange={(e) => handleInputChange(index, 'maintenance', e.target.value)} /></td>
                                            </tr>
                                        ))}

                                        <tr className="totals-row">
                                            <td colSpan="4">الإجمالي</td>
                                            <td>{weeklyData.totals.freight}</td>
                                            <td>{weeklyData.totals.default_freight}</td>
                                            <td>{weeklyData.totals.gas}</td>
                                            <td>{weeklyData.totals.oil}</td>
                                            <td>{weeklyData.totals.card}</td>
                                            <td>{weeklyData.totals.fines}</td>
                                            <td>{weeklyData.totals.tips}</td>
                                            <td>{weeklyData.totals.spare_parts}</td>
                                            <td>{weeklyData.totals.tires}</td>
                                            <td>{weeklyData.totals.balance}</td>
                                            <td>{weeklyData.totals.washing}</td>
                                            <td>{weeklyData.totals.without}</td>
                                            <td>{weeklyData.totals.maintenance}</td>
                                        </tr>

                                        <tr className="meta-row">
                                            <td colSpan="2">عداد أول المدة</td>
                                            <td colSpan="2"><input type="number" value={weeklyData.odometer_start} onChange={(e) => handleMetadataChange('odometer_start', e.target.value)} /></td>
                                            <td colSpan="2">مرتب السائق</td>
                                            <td colSpan="2"><input type="number" value={weeklyData.driver_salary} onChange={(e) => handleMetadataChange('driver_salary', e.target.value)} /></td>
                                            <td colSpan="2">العهدة</td>
                                            <td colSpan="2"><input type="number" value={weeklyData.custody} onChange={(e) => handleMetadataChange('custody', e.target.value)} /></td>
                                            <td colSpan="2">إجمالي الإيرادات</td>
                                            <td colSpan="3">{weeklyData.net_revenue}</td>
                                        </tr>

                                        <tr className="meta-row">
                                            <td colSpan="2">عداد آخر المدة</td>
                                            <td colSpan="2"><input type="number" value={weeklyData.odometer_end} onChange={(e) => handleMetadataChange('odometer_end', e.target.value)} /></td>
                                            <td colSpan="2">متوسط استهلاك الجاز/كم</td>
                                            <td colSpan="2">
                                                {(() => {
                                                    const gasPerKm = parseFloat(weeklyData.gas_per_km);
                                                    return !isNaN(gasPerKm) ? gasPerKm.toFixed(2) : '0';
                                                })()}
                                            </td>
                                            <td colSpan="2">المصروفات</td>
                                            <td colSpan="2">
                                                {weeklyData.net_revenue}
                                            </td>
                                            <td colSpan="2"> اجمالي الايرادات الاضافية</td>
                                            <td colSpan="3">
                                                {weeklyData.default_net_revenue}
                                            </td>
                                        </tr>
                                        <tr className="meta-row">
                                            <td colSpan="2">ملاحظات</td>
                                            <td colSpan="15">
                                                <textarea
                                                    value={weeklyData.description || ''}
                                                    onChange={(e) => handleMetadataChange('description', e.target.value)}
                                                    placeholder="ملاحظات إضافية"
                                                    className="description-textarea"
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>



                                <div className="actions">
                                    <button
                                        className={`save-btn ${loading.saveDaily || loading.saveWeekly ? 'loading' : ''}`}
                                        onClick={handleSaveData}
                                        disabled={loading.saveDaily || loading.saveWeekly}
                                    >
                                        {loading.saveDaily || loading.saveWeekly ? 'جاري الحفظ...' : 'حفظ البيانات'}
                                    </button>
                                    <button className="print-btn" onClick={handlePrint}>طباعة التقرير</button>
                                    <button className="clear-btn" onClick={handleClearWeeklyData}>مسح البيانات</button>
                                </div>

                                {(error.saveDaily || error.saveWeekly) && (
                                    <div className="error-message save-error">
                                        {error.saveDaily || error.saveWeekly}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CarsFilter;
