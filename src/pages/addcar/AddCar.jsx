import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './AddCar.css'

const AddCar = () => {
    const [formData, setFormData] = useState({
        carModel: '',
        licenseStartDate: '',
        licenseEndDate: ''
    })
    const [loading, setLoading] = useState({ form: false, cars: false, delete: false, update: false })
    const [error, setError] = useState({ form: null, cars: null, delete: null, update: null })
    const [success, setSuccess] = useState({ form: false, delete: false, update: false })
    const [cars, setCars] = useState([]);
    const [selectedCar, setSelectedCar] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const handleCarSelect = (car) => {
        setSelectedCar(car);
        if (car) {
            setFormData({
                carModel: car.model,
                licenseStartDate: car.licenseStartDate,
                licenseEndDate: car.licenseEndDate
            });
            setIsEditing(true);
        } else {
            setFormData({
                carModel: '',
                licenseStartDate: '',
                licenseEndDate: ''
            });
            setIsEditing(false);
        }
    };

    const handleDeleteCar = async (id, e) => {
        if (e) e.stopPropagation();

        if (!window.confirm('هل أنت متأكد من حذف هذه السيارة؟')) {
            return;
        }

        setLoading(prev => ({ ...prev, delete: true }));
        setError(prev => ({ ...prev, delete: null }));

        try {
            await axios.delete(`http://26.16.17.34:8000/api/cars/${id}/`);

            setCars(prevCars => prevCars.filter(car => car.id !== id));

            if (selectedCar && selectedCar.id === id) {
                setSelectedCar(null);
                setFormData({
                    carModel: '',
                    licenseStartDate: '',
                    licenseEndDate: ''
                });
                setIsEditing(false);
            }

            setSuccess(prev => ({ ...prev, delete: true }));

            setTimeout(() => {
                setSuccess(prev => ({ ...prev, delete: false }));
            }, 3000);

        } catch (err) {
            console.error('Error deleting car:', err);
            setError(prev => ({
                ...prev,
                delete: 'حدث خطأ أثناء حذف السيارة. يرجى المحاولة مرة أخرى.'
            }));
        } finally {
            setLoading(prev => ({ ...prev, delete: false }));
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value
        })

        const actionType = isEditing ? 'update' : 'form';
        setError(prev => ({ ...prev, [actionType]: null }))
        setSuccess(prev => ({ ...prev, [actionType]: false }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const actionType = isEditing ? 'update' : 'form';

        setLoading(prev => ({ ...prev, [actionType]: true }))
        setError(prev => ({ ...prev, [actionType]: null }))
        setSuccess(prev => ({ ...prev, [actionType]: false }))

        try {
            const apiData = {
                car_model: formData.carModel,
                license_start: formData.licenseStartDate,
                license_end: formData.licenseEndDate
            }

            let response;

            if (isEditing && selectedCar) {
                // Update existing car
                response = await axios.put(`http://26.16.17.34:8000/api/cars/${selectedCar.id}/`, apiData)
                console.log('Car updated successfully:', response.data)

                // Update the car in the state
                setCars(prevCars =>
                    prevCars.map(car =>
                        car.id === selectedCar.id
                            ? {
                                id: car.id,
                                model: apiData.car_model,
                                licenseStartDate: apiData.license_start,
                                licenseEndDate: apiData.license_end
                            }
                            : car
                    )
                )

                setSuccess(prev => ({ ...prev, update: true }))

                // Clear success message after 3 seconds
                setTimeout(() => {
                    setSuccess(prev => ({ ...prev, update: false }))
                }, 3000)
            } else {
                // Create new car
                response = await axios.post('http://26.16.17.34:8000/api/cars/', apiData)
                console.log('Car created successfully:', response.data)

                // Add the new car to the state
                const newCar = {
                    id: response.data.id,
                    model: response.data.car_model,
                    licenseStartDate: response.data.license_start,
                    licenseEndDate: response.data.license_end
                }

                setCars(prevCars => [...prevCars, newCar])
                setSuccess(prev => ({ ...prev, form: true }))

                // Clear success message after 3 seconds
                setTimeout(() => {
                    setSuccess(prev => ({ ...prev, form: false }))
                }, 3000)
            }

            // Reset form and selection
            setFormData({
                carModel: '',
                licenseStartDate: '',
                licenseEndDate: ''
            })

            setSelectedCar(null)
            setIsEditing(false)

        } catch (err) {
            console.error(`Error ${isEditing ? 'updating' : 'creating'} car:`, err)
            setError(prev => ({
                ...prev,
                [actionType]: err.response?.data || `حدث خطأ أثناء ${isEditing ? 'تعديل' : 'إضافة'} السيارة. يرجى المحاولة مرة أخرى.`
            }))
        } finally {
            setLoading(prev => ({ ...prev, [actionType]: false }))
        }
    }
    useEffect(() => {
        const fetchCars = async () => {
            setLoading(prev => ({ ...prev, cars: true }));
            setError(prev => ({ ...prev, cars: null }));

            try {
                const response = await axios.get('http://26.16.17.34:8000/api/cars/');

                const carsData = response.data.map(car => ({
                    id: car.id,
                    model: car.car_model,
                    licenseStartDate: car.license_start,
                    licenseEndDate: car.license_end
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
    return (
        <div className="add-car-container">
            <div className="add-car-card">
                <h1>{isEditing ? 'تعديل السيارة' : 'إضافة سيارة جديدة'}</h1>

                {success.form && (
                    <div className="success-message">
                        تمت إضافة السيارة بنجاح!
                    </div>
                )}

                {success.update && (
                    <div className="success-message">
                        تم تعديل السيارة بنجاح!
                    </div>
                )}

                {error.form && (
                    <div className="error-message">
                        {typeof error.form === 'string' ? error.form : 'حدث خطأ أثناء إضافة السيارة. يرجى المحاولة مرة أخرى.'}
                    </div>
                )}

                {error.update && (
                    <div className="error-message">
                        {typeof error.update === 'string' ? error.update : 'حدث خطأ أثناء تعديل السيارة. يرجى المحاولة مرة أخرى.'}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="carModel">موديل السيارة</label>
                        <input
                            type="text"
                            id="carModel"
                            name="carModel"
                            value={formData.carModel}
                            onChange={handleChange}
                            placeholder="أدخل موديل السيارة"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="licenseStartDate">تاريخ بدء الترخيص</label>
                        <input
                            type="date"
                            id="licenseStartDate"
                            name="licenseStartDate"
                            value={formData.licenseStartDate}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="licenseEndDate">تاريخ انتهاء الترخيص</label>
                        <input
                            type="date"
                            id="licenseEndDate"
                            name="licenseEndDate"
                            value={formData.licenseEndDate}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-buttons">
                        {isEditing && (
                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={() => {
                                    setSelectedCar(null);
                                    setIsEditing(false);
                                    setFormData({
                                        carModel: '',
                                        licenseStartDate: '',
                                        licenseEndDate: ''
                                    });
                                }}
                            >
                                إلغاء التعديل
                            </button>
                        )}
                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={loading.form || loading.update}
                        >
                            {isEditing
                                ? (loading.update ? 'جارِ التعديل...' : 'تعديل السيارة')
                                : (loading.form ? 'جارِ الإضافة...' : 'إضافة السيارة')
                            }
                        </button>
                    </div>
                </form>
            </div>
            <div className="cars-list">
                <h2>قائمة السيارات</h2>

                {success.delete && (
                    <div className="success-message">تم حذف السيارة بنجاح!</div>
                )}

                {error.delete && (
                    <div className="error-message">{error.delete}</div>
                )}

                {loading.cars && (
                    <div className="loading-indicator">جاري تحميل بيانات السيارات...</div>
                )}

                {error.cars && (
                    <div className="error-message">{error.cars}</div>
                )}

                {!loading.cars && !error.cars && cars.length === 0 && (
                    <div className="empty-message">لا توجد سيارات متاحة</div>
                )}

                <div className="cars-table-container">
                    {cars.length > 0 && (
                        <table className="cars-table">
                            <thead>
                                <tr>
                                    <th>موديل السيارة</th>
                                    <th>تاريخ بدء الترخيص</th>
                                    <th>تاريخ انتهاء الترخيص</th>
                                    <th>الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cars.map((car) => (
                                    <tr
                                        key={car.id}
                                        className={selectedCar && selectedCar.id === car.id ? 'selected-row' : ''}
                                    >
                                        <td>{car.model}</td>
                                        <td>{car.licenseStartDate}</td>
                                        <td>{car.licenseEndDate}</td>
                                        <td className="action-buttons">
                                            <button
                                                className="edit-btn"
                                                onClick={() => handleCarSelect(car)}
                                                disabled={loading.update}
                                            >
                                                تعديل
                                            </button>
                                            <button
                                                className="delete-btn"
                                                onClick={(e) => handleDeleteCar(car.id, e)}
                                                disabled={loading.delete}
                                            >
                                                {loading.delete && selectedCar && selectedCar.id === car.id ? 'جارِ الحذف...' : 'حذف'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AddCar