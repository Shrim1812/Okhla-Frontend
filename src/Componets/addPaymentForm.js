import React, { useState } from 'react';
import axios from 'axios';
import './addPaymnet.css'

const YearlyPaymentForm = () => {
    const [yearRange, setYearRange] = useState('');
    const [payments, setPayments] = useState({
        Printer: '',
        Provider: '',
        MachineDealer: '',
        Publisher: ''
    });
    const [registrations, setRegistrations] = useState({
        Printer: '',
        Provider: '',
        MachineDealer: '',
        Publisher: ''
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleInputChange = (e, type) => {
        const { name, value } = e.target;
        if (type === 'payment') {
            setPayments(prev => ({
                ...prev,
                [name]: value
            }));
        } else if (type === 'registration') {
            setRegistrations(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (!yearRange.match(/^\d{4}-\d{4}$/)) {
            setError('Year Range format should be like 2024-2025');
            return;
        }

        try {
            const res = await axios.post('https://okhla-backend.onrender.com/Ohkla/addNewYearAndInsertForAllMember', {
                yearRange,
                payments: {
                    Printer: parseFloat(payments.Printer),
                    Provider: parseFloat(payments.Provider),
                    MachineDealer: parseFloat(payments.MachineDealer),
                    Publisher: parseFloat(payments.Publisher)
                },
                registrations: {
                    Printer: parseFloat(registrations.Printer),
                    Provider: parseFloat(registrations.Provider),
                    MachineDealer: parseFloat(registrations.MachineDealer),
                    Publisher: parseFloat(registrations.Publisher)
                }
            });

            setMessage(res.data.message || 'Data saved successfully');
            setYearRange('');
            setPayments({
                Printer: '',
                Provider: '',
                MachineDealer: '',
                Publisher: ''
            });
            setRegistrations({
                Printer: '',
                Provider: '',
                MachineDealer: '',
                Publisher: ''
            });
        } catch (error) {
            console.error('Error:', error);
            setError('Failed to save yearly payments');
        }
    };

return (
    <div
        className="d-flex justify-content-center align-items-center bg-light"
        style={{
            height: '100vh',
            marginLeft: '200px',
            overflow: 'hidden',
        }}
    >
        <div
            className="card shadow-lg p-3"
            style={{
                width: '97%',
                maxWidth: '1100px',
                height: '90vh', // fix height
                borderRadius: '16px',
                backgroundColor: 'white',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
            }}
        >
            <div>
                <h1
                    className="text-center fw-bold text-white mb-3"
                    style={{
                        backgroundColor: '#173a60',
                        padding: '10px',
                        borderRadius: '10px',
                        fontSize: '1.4rem',
                    }}
                >
                    ➕ Add Yearly Payment
                </h1>

                {message && <div className="alert alert-success text-center py-1">{message}</div>}
                {error && <div className="alert alert-danger text-center py-1">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label fw-semibold small">Year Range</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="e.g. 2024-2025"
                            value={yearRange}
                            onChange={(e) => setYearRange(e.target.value)}
                            required
                            style={{ fontSize: '0.9rem', padding: '6px' }}
                        />
                    </div>

                    {['Printer', 'Provider', 'MachineDealer', 'Publisher'].map((category) => (
                        <div className="mb-2" key={category}>
                            <div className="row">
                                <div className="col-12 fw-semibold mb-1 small">{category}</div>
                                <div className="col-md-6 mb-1">
                                    <input
                                        type="number"
                                        className="form-control"
                                        name={category}
                                        placeholder={`${category} Payment`}
                                        value={payments[category]}
                                        onChange={(e) => handleInputChange(e, 'payment')}
                                        min="0"
                                        step="0.01"
                                        required
                                        style={{ fontSize: '0.85rem', padding: '6px' }}
                                    />
                                </div>
                                <div className="col-md-6 mb-1">
                                    <input
                                        type="number"
                                        className="form-control"
                                        name={category}
                                        placeholder={`${category} Registration`}
                                        value={registrations[category]}
                                        onChange={(e) => handleInputChange(e, 'registration')}
                                        min="0"
                                        step="0.01"
                                        required
                                        style={{ fontSize: '0.85rem', padding: '6px' }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
 <div className="text-center mt-3">
                    <button
                        type="submit"
                        className="btn btn-primary fw-bold"
                        style={{
                            fontSize: '0.9rem',
                            padding: '6px 20px',
                            borderRadius: '8px',
                            boxShadow: '0 4px 8px rgba(18, 44, 72, 0.3)',
                            minWidth: '200px',
                        }}
                    >
                        Save Payments
                    </button>
                </div>
                </form>
            </div>
        </div>
    </div>
);

};

export default YearlyPaymentForm;
