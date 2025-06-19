import React, { useEffect, useState } from "react";
import axios from "axios";

const ReceiptTable = () => {
    const [receipts, setReceipts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReceipts();
    }, []);

    const fetchReceipts = async () => {
        try {
            const res = await axios.get("https://okhla-backend.onrender.com/Ohkla/getReceipts");
            setReceipts(res.data);
        } catch (err) {
            console.error("❌ Error fetching receipts:", err.message);
            alert("Failed to load receipt data.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <h4 className="mb-3">🧾 Receipt List</h4>
            {loading ? (
                <p>Loading receipts...</p>
            ) : (
                <div className="table-responsive">
                    <table className="table table-bordered table-striped">
                        <thead className="thead-dark">
                            <tr>
                                <th>Receipt No</th>
                                <th>Date</th>
                                <th>Company</th>
                                <th>Amount</th>
                                <th>Mode</th>
                                <th>Type</th>
                                <th>Cheque No</th>
                                <th>Bank</th>
                            </tr>
                        </thead>
                        <tbody>
                            {receipts.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="text-center">No receipts found.</td>
                                </tr>
                            ) : (
                                receipts.map((r, index) => (
                                    <tr key={index}>
                                        <td>{r.ReceiptNumber}</td>
                                        <td>{new Date(r.ReceiptDate).toLocaleDateString()}</td>
                                        <td>{r.CompanyName}</td>
                                        <td>₹ {parseFloat(r.ReceivedAmount).toFixed(2)}</td>
                                        <td>{r.PaymentMode}</td>
                                        <td>{r.PaymentType}</td>
                                        <td>{r.ChequeNumber || "-"}</td>
                                        <td>{r.BankName || "-"}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ReceiptTable;
