import React, { useEffect, useState } from 'react';
import axios from 'axios';

const YearlySummary = () => {
    const [summaryData, setSummaryData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSummary();
    }, []);

    const fetchSummary = async () => {
        try {
            const res = await axios.get('https://okhla-backend.onrender.com/Ohkla/getYearlySummary');
            setSummaryData(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching summary:', err);
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4" style={{ marginLeft: '180px' }}>
            <div className="card shadow-sm">
                <div className="card-header bg-primary text-white d-flex align-items-center">
                    <i className="bi bi-bar-chart-fill me-2"></i>
                    <h5 className="mb-0"style={{ textAlign: 'center' }}>Yearly Payment Summary</h5>
                </div>
                <div className="card-body p-0">
                    {loading ? (
                        <div className="p-3 text-center">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-bordered table-striped mb-0">
                                <thead className="table-dark">
                                    <tr>
                                        <th>Membership ID</th>
                                        <th>Payment Year</th>
                                        <th>Total Amount</th>
                                        <th>Amount Paid</th>
                                        <th>Due Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {summaryData.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.MembershipID}</td>
                                            <td>{item.PaymentYear}</td>
                                            <td>{item.TotalAmountSum}</td>
                                            <td>{item.TotalAmountPaid}</td>
                                            <td>{item.TotalDueAmount}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default YearlySummary;
