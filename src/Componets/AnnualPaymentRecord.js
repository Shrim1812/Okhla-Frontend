import React, { useEffect, useState } from 'react';
import axios from 'axios';
const AnnualPaymentsTable = () => {
    const [payments, setPayments] = useState([]);
    const [filteredPayments, setFilteredPayments] = useState([]);
    const [filters, setFilters] = useState({
        MembershipID: '',
        CompanyName: '',
        Year: '',
        TotalAmount: '',
        AmountPaid: '',
        DueAmount: ''
    });
    useEffect(() => {
        fetchAnnualPayments();
    }, []);
    const fetchAnnualPayments = async () => {
        try {
            const res = await axios.get('https://okhla-backend.onrender.com/Ohkla/getAnnualPayments');
            setPayments(res.data);
            setFilteredPayments(res.data);
        } catch (err) {
            console.error('Failed to fetch annual payments:', err);
        }
    };
    const handleFilterChange = (e, key) => {
        const value = e.target.value;
        const updatedFilters = { ...filters, [key]: value };
        setFilters(updatedFilters);
        const filtered = payments.filter(payment =>
            Object.keys(updatedFilters).every(filterKey =>
                String(payment[filterKey]).toLowerCase().includes(updatedFilters[filterKey].toLowerCase())
            )
        );
        setFilteredPayments(filtered);
    };

    return (
        <div style={{ display: 'flex' }}>
            {/* Sidebar already exists with width around 170px - handled in your layout */}

            {/* Main Content - fills remaining screen space */}
            <div style={{ flex: 1, padding: '4px', marginLeft: '195px' }}>
                <div className="card shadow-sm border-0 w-100">
                    <div className="card-header text-white" style={{ backgroundColor: '#173a60' }}>
                        <h3 className="mb-0 text-center">📋 Annual Payment Records</h3>
                    </div>

                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover table-bordered mb-0 text-center align-middle">
                                <thead style={{ backgroundColor: '#e6f2ff' }}>
                                    <tr>
                                        <th>Membership ID</th>
                                        <th>Company Name</th>
                                        <th>Year</th>
                                        <th>Total Amount</th>
                                        <th>Amount Paid</th>
                                        <th>Due Amount</th>
                                    </tr>
                                    <tr>
                                        {['MembershipID', 'CompanyName', 'Year', 'TotalAmount', 'AmountPaid', 'DueAmount'].map((key, index) => (
                                            <th key={index}>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm"
                                                    placeholder="Search"
                                                    value={filters[key]}
                                                    onChange={(e) => handleFilterChange(e, key)}
                                                />
                                            </th>
                                        ))}
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredPayments.length > 0 ? (
                                        filteredPayments.map((payment, index) => (
                                            <tr key={index}>
                                                <td>{payment.MembershipID}</td>
                                                <td className="fw-semibold">{payment.CompanyName}</td>
                                                <td>{payment.Year}</td>
                                                <td className="text-success fw-bold">₹ {payment.TotalAmount}</td>
                                                <td className="text-primary fw-semibold">₹ {payment.AmountPaid}</td>
                                                <td className={payment.DueAmount > 0 ? "text-danger fw-bold" : "text-success fw-bold"}>
                                                    ₹ {payment.DueAmount}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="text-muted py-3">
                                                ❌ No payment records found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnnualPaymentsTable;
