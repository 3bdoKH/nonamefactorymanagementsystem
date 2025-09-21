import React, { useState } from 'react'
import './AddCar.css'

const AddCar = () => {
    const [formData, setFormData] = useState({
        carModel: '',
        licenseStartDate: '',
        licenseEndDate: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log('Form submitted:', formData)
        // Add API call here to save the car data
    }

    return (
        <div className="add-car-container">
            <div className="add-car-card">
                <h1>إضافة سيارة جديدة</h1>

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

                    <button type="submit" className="submit-btn">إضافة السيارة</button>
                </form>
            </div>
        </div>
    )
}

export default AddCar
