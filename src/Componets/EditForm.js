import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';


// States aur UTs ka data (aap apne hisaab se update kar sakte hain)
const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

const indianUTs = [
    'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // Format: YYYY-MM-DD
};


const printerCategoryOptions = [
    { value: 'Offset', label: 'Offset' },
    { value: 'Digital Printer', label: 'Digital Printer' },
    { value: 'Book Printer', label: 'Book Printer' },
    { value: 'Commercial Printer', label: 'Commercial Printer' },
    { value: 'Screen Printer', label: 'Screen Printer' }
];

const EditMemberForm = ({ memberData, onCancel, onUpdate }) => {
    const [formData, setFormData] = useState({});
    const [selectedPrinterCategories, setSelectedPrinterCategories] = useState([]);
    const [errors, setErrors] = useState({});

    const isFormDataChanged = () => {
        const cleanedOriginal = { ...memberData };
        const cleanedCurrent = { ...formData };

        // Normalize PrinterCategory for comparison
        if (cleanedOriginal.PrinterCategory && typeof cleanedOriginal.PrinterCategory === 'string') {
            cleanedOriginal.PrinterCategory = cleanedOriginal.PrinterCategory.split(',').map(x => x.trim()).sort().join(',');
        }
        if (cleanedCurrent.PrinterCategory && typeof cleanedCurrent.PrinterCategory === 'string') {
            cleanedCurrent.PrinterCategory = cleanedCurrent.PrinterCategory.split(',').map(x => x.trim()).sort().join(',');
        }

        // Remove UpdateDate from check if it's auto-filled
        delete cleanedOriginal.UpdateDate;
        delete cleanedCurrent.UpdateDate;

        return JSON.stringify(cleanedOriginal) !== JSON.stringify(cleanedCurrent);
    };

    useEffect(() => {
        if (memberData) {
            setFormData({
                ...memberData,
                UpdateDate: memberData.UpdateDate
                    ? memberData.UpdateDate.split("T")[0]
                    : getCurrentDate()
            });

            if (
                memberData.PrinterCategory &&
                typeof memberData.PrinterCategory === 'string'
            ) {
                const selected = memberData.PrinterCategory.split(',').map(item => ({
                    label: item.trim(),
                    value: item.trim()
                }));
                setSelectedPrinterCategories(selected);
            }
        }
    }, [memberData]);


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handlePrinterCategoryChange = (selectedOptions) => {
        setSelectedPrinterCategories(selectedOptions);
        setFormData({
            ...formData,
            PrinterCategory: selectedOptions ? selectedOptions.map(option => option.value).join(',') : ''
        });
    };

    // Basic validation function
    const validate = () => {
        const newErrors = {};
        if (!formData.MemberName || formData.MemberName.trim() === '') newErrors.MemberName = 'Member Name is required';
        if (!formData.CompanyName || formData.CompanyName.trim() === '') newErrors.CompanyName = 'Company Name is required';
        if (!formData.ContactNumber || formData.ContactNumber.trim() === '') newErrors.ContactNumber = 'Contact Number is required';
        if (!formData.Email || formData.Email.trim() === '') newErrors.Email = 'Email is required';
        if (!formData.State || formData.State.trim() === '') newErrors.State = 'State / UT is required';
        if (!formData.Category || formData.Category.trim() === '') newErrors.Category = 'Category is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        if (!isFormDataChanged()) {
            alert("No changes detected.");
            return;
        }

        try {
            await axios.put(`https://okhla-backend.onrender.com/Ohkla/updateMember/${formData.MembershipID}`, formData);
            alert('Member updated successfully');
            onUpdate();
        } catch (error) {
            console.error('Error updating member:', error);
            alert('Update failed');
        }
    };

    return (
        <div className="container mt-4" style={{ maxWidth: '750px', width: '100%',marginLeft: '250px',height: 'auto',  }}>
            <div className="card shadow-lg">
                <div className="card-header bg-primary text-white">
                    <h4 className="mb-0">Edit Member - {formData.MemberName}</h4>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit} className="row g-3" noValidate>

                        {/* Member Name */}
                        <div className="col-md-6">
                            <label className="form-label">
                                Member Name <span className="star">*</span>
                            </label>
                            <input
                                type="text"
                                className={`form-control ${errors.MemberName ? 'is-invalid' : ''}`}
                                name="MemberName"
                                value={formData.MemberName || ''}
                                onChange={handleChange}
                            />
                            {errors.MemberName && <div className="invalid-feedback">{errors.MemberName}</div>}
                        </div>

                        {/* Company Name */}
                        <div className="col-md-6">
                            <label className="form-label">
                                Company Name <span className="star">*</span>
                            </label>
                            <input
                                type="text"
                                className={`form-control ${errors.CompanyName ? 'is-invalid' : ''}`}
                                name="CompanyName"
                                value={formData.CompanyName || ''}
                                onChange={handleChange}
                            />
                            {errors.CompanyName && <div className="invalid-feedback">{errors.CompanyName}</div>}
                        </div>

                        {/* Contact Number */}
                        <div className="col-md-6">
                            <label className="form-label">
                                Contact Number <span className="star">*</span>
                            </label>
                            <input
                                type="text"
                                className={`form-control ${errors.ContactNumber ? 'is-invalid' : ''}`}
                                name="ContactNumber"
                                value={formData.ContactNumber || ''}
                                onChange={handleChange}
                            />
                            {errors.ContactNumber && <div className="invalid-feedback">{errors.ContactNumber}</div>}
                        </div>

                        {/* Email */}
                        <div className="col-md-6">
                            <label className="form-label">
                                Email <span className="star">*</span>
                            </label>
                            <input
                                type="email"
                                className={`form-control ${errors.Email ? 'is-invalid' : ''}`}
                                name="Email"
                                value={formData.Email || ''}
                                onChange={handleChange}
                            />
                            {errors.Email && <div className="invalid-feedback">{errors.Email}</div>}
                        </div>

                        {/* Udhyam Aadhar */}
                        <div className="col-md-6">
                            <label className="form-label">Udhyam Aadhar</label>
                            <input
                                type="text"
                                className="form-control"
                                name="UdhyamAadhar"
                                value={formData.UdhyamAadhar || ''}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Registration Date */}
                        <div className="col-md-6">
                            <label className="form-label">Registration Date</label>
                            <input
                                type="date"
                                className="form-control"
                                name="RegistrationDate"
                                value={formData.RegistrationDate || ''}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Member Since */}
                        <div className="col-md-6">
                            <label className="form-label">Member Since</label>
                            <input
                                type="text"
                                className="form-control"
                                name="MemberSince"
                                value={formData.MemberSince || ''}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Address Line 1 */}
                        <div className="col-md-6">
                            <label className="form-label">Address Line 1</label>
                            <input
                                type="text"
                                className="form-control"
                                name="Address1"
                                value={formData.Address1 || ''}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Address Line 2 */}
                        <div className="col-md-6">
                            <label className="form-label">Address Line 2</label>
                            <input
                                type="text"
                                className="form-control"
                                name="Address2"
                                value={formData.Address2 || ''}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Area */}
                        <div className="col-md-6">
                            <label className="form-label">Area</label>
                            <input
                                type="text"
                                className="form-control"
                                name="Area"
                                value={formData.Area || ''}
                                onChange={handleChange}
                            />
                        </div>

                        {/* City */}
                        <div className="col-md-6">
                            <label className="form-label">City</label>
                            <input
                                type="text"
                                className="form-control"
                                name="City"
                                value={formData.City || ''}
                                onChange={handleChange}
                            />
                        </div>

                        {/* State / UT */}
                        <div className="col-md-6">
                            <label className="form-label">
                                State / UT <span className="star">*</span>
                            </label>
                            <select
                                className={`form-select ${errors.State ? 'is-invalid' : ''}`}
                                name="State"
                                value={formData.State || ''}
                                onChange={handleChange}
                            >
                                <option value="">-- Select State / UT --</option>
                                <optgroup label="States">
                                    {indianStates.map(state => (
                                        <option key={state} value={state}>{state}</option>
                                    ))}
                                </optgroup>
                                <optgroup label="Union Territories">
                                    {indianUTs.map(ut => (
                                        <option key={ut} value={ut}>{ut}</option>
                                    ))}
                                </optgroup>
                            </select>
                            {errors.State && <div className="invalid-feedback">{errors.State}</div>}
                        </div>

                        {/* Updated Date */}
                        <div className="col-md-6">
                            <label className="form-label">Updated Date</label>
                            <input
                                type="date"
                                className="form-control"
                                id="UpdateDate"
                                name="UpdateDate"
                                value={formData.UpdateDate}
                                onChange={handleChange}
                                readOnly
                            />

                        </div>

                        {/* Owner */}
                        <div className="col-md-6">
                            <label className="form-label">Owner</label>
                            <input
                                type="text"
                                className="form-control"
                                name="Owner"
                                value={formData.Owner || ''}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Category */}
                        <div className="col-md-6">
                            <label className="form-label">
                                Category <span className="star">*</span>
                            </label>
                            <select
                                className={`form-select ${errors.Category ? 'is-invalid' : ''}`}
                                name="Category"
                                value={formData.Category || ''}
                                onChange={handleChange}
                                disabled
                            >
                                <option value="">-- Select Category --</option>
                                <option value="Printer">Printer</option>
                                <option value="Provider">Provider</option>
                                <option value="MachineDealers">Machine Dealers</option>
                                <option value="Publisher">Publisher</option>
                            </select>
                            {errors.Category && <div className="invalid-feedback">{errors.Category}</div>}
                        </div>

                        {/* PrinterCategory (only when Category === 'Printer') */}
                        {formData.Category === 'Printer' && (
                            <div className="col-md-6">
                                <label className="form-label">Printer Category (Multi-Select)</label>
                                <Select
                                    isMulti
                                    name="PrinterCategory"
                                    value={selectedPrinterCategories}
                                    onChange={handlePrinterCategoryChange}
                                    options={printerCategoryOptions}
                                    isDisabled={true}
                                />
                            </div>
                        )}

                        {/* IsActive Status Dropdown */}
                        <div className="col-md-6">
                            <label className="form-label">Status</label>
                            <select
                                className="form-select"
                                name="IsActive"
                                value={formData.IsActive ? 'true' : 'false'}
                                onChange={(e) =>
                                    handleChange({
                                        target: {
                                            name: 'IsActive',
                                            value: e.target.value === 'true'
                                        }
                                    })
                                }
                            >
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>
                            </select>
                        </div>

                        <div className="col-12 mt-3">
                            <button type="submit" className="btn btn-success me-3">
                                💾 Save
                            </button>
                            <button type="button" className="btn btn-secondary" onClick={onCancel}>
                                ❌ Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditMemberForm;
