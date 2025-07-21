import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';

const PaymentReceiptTable = () => {
    const [receipts, setReceipts] = useState([]);
      const [selectedReceipt, setSelectedReceipt] = useState(null);

    const [columnFilters, setColumnFilters] = useState({
        ReceiptNumber: '',
        CompanyName: '',
        ReceiptDate: '',
        ReceivedAmount: '',
        PaymentType: '',
        PaymentMode: '',
        BankName: '',
        PaymentYear: '',
    });
    const userId = localStorage.getItem("userId");
console.log(userId)
const username = localStorage.getItem("username");
console.log(username)
useEffect(() => {
    axios
        .get('https://testingokhlabackend.onrender.com/Ohkla/getReceiptOfPayment')
        .then((res) => {
            console.log("👉 Receipt Data:", res.data);  // 👈 Yahan se check karo ReceiptID aa raha ya nahi
            setReceipts(res.data);
        })
        .catch((err) => console.error('❌ Error fetching receipts:', err));
}, []);

    // Filter receipts based on all filters
    const filteredReceipts = receipts.filter((receipt) => {
        return Object.entries(columnFilters).every(([key, filterValue]) => {
            if (!filterValue) return true; // no filter applied on this column

            // Convert values to strings and lowercase for case-insensitive search
            const receiptValue = receipt[key]?.toString().toLowerCase() || '';
            const searchValue = filterValue.toLowerCase();

            return receiptValue.includes(searchValue);
        });
    });

    const handleFilterChange = (col, value) => {
        setColumnFilters((prev) => ({
            ...prev,
            [col]: value,
        }));
    };

      const handleRowSelect = (receipt) => {
        setSelectedReceipt(receipt);
    };

 const handlePrint = () => {
  if (selectedReceipt) {
    const receiptNo = selectedReceipt.ReceiptNumber;
    window.open(
      `https://testingokhlabackend.onrender.com/Ohkla/report/receipt?receiptNo=${receiptNo}`,
      '_blank'
    );
  } else {
    alert('Please select a receipt to print.');
  }
};
const handleSendTo = async () => {
  if (!selectedReceipt) {
    Swal.fire("Please select a receipt first");
    return;
  }

  const receiptNumber = selectedReceipt.ReceiptNumber;
  console.log(receiptNumber)
  const receiptId = selectedReceipt.ReceiptID;
   console.log(receiptId)
  const userId = localStorage.getItem("userId");
     console.log(userId)
    

  try {
    const res = await axios.get(`https://testingokhlabackend.onrender.com/Ohkla/get-member-email/${receiptNumber}`);
    const fetchedEmail = res.data?.email;

    const { value: enteredEmail } = await Swal.fire({
      title: "Send Receipt To",
      input: "email",
      inputLabel: "Member Email",
      inputValue: fetchedEmail,
      showCancelButton: true,
      confirmButtonText: "Send Email",
      inputValidator: (value) => {
        if (!value) return "Email is required";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return "Please enter a valid email";
      },
    });

    if (!enteredEmail) return;

    const sendRes = await axios.post("https://testingokhlabackend.onrender.com/Ohkla/send", {
      receiptId,
      userId,
      toEmail: enteredEmail,
    });

    if (sendRes.data.success) {
      Swal.fire("✅ Success", "Email sent successfully!", "success");
    } else {
      Swal.fire("❌ Error", sendRes.data.message || "Sending failed", "error");
    }

  } catch (err) {
    console.error("❌ Send error:", err);
    Swal.fire("❌ Error", "Something went wrong while sending the email.", "error");
  }
};


  return (
        <div className="container" style={{ marginLeft: '190px' }}>
            <div className="card shadow-sm rounded">
                <div className="card-header text-white d-flex justify-content-between align-items-center" style={{ backgroundColor: '#173a60' }}>
                    <h3 className="mb-0" style={{ textAlign: 'center', flex: 1 }}>🧾 Receipt Summary</h3>
                    <button className="btn btn-primary" onClick={handleSendTo}>
      📩 Send To
    </button>
                  



                    <button
                        className="btn btn-light btn-sm"
                        onClick={handlePrint}
                        style={{ whiteSpace: 'nowrap' }}
                    >
                        🖨️ Print Selected Receipt
                    </button>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover table-bordered mb-0">
                            <thead style={{ backgroundColor: '#e6f2ff' }}>
                                <tr>
                                    <th>Receipt No</th>
                                    <th>Company Name</th>
                                    <th>Receipt Date</th>
                                    <th>Received Amount</th>
                                    <th>Payment Type</th>
                                    <th>Payment Mode</th>
                                    <th>Bank Name</th>
                                    <th>Payment Year</th>
                                </tr>
                                <tr>
                                    {Object.keys(columnFilters).map((col) => (
                                        <th key={col}>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm"
                                                placeholder={
                                                    col === 'ReceiptDate'
                                                        ? 'YYYY-MM-DD'
                                                        : col === 'ReceivedAmount'
                                                            ? 'Amount'
                                                            : col === 'PaymentMode'
                                                                ? 'Online/Offline'
                                                                : col === 'PaymentYear'
                                                                    ? 'Year'
                                                                    : 'Search...'
                                                }
                                                value={columnFilters[col]}
                                                onChange={(e) => handleFilterChange(col, e.target.value)}
                                            />
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredReceipts.length > 0 ? (
                                    filteredReceipts.map((receipt, index) => (
                                        <tr
                                            key={index}
                                            onClick={() => handleRowSelect(receipt)}
                                            className={selectedReceipt?.ReceiptNumber === receipt.ReceiptNumber ? 'table-primary' : ''}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <td className="text-center">{receipt.ReceiptNumber}</td>
                                            <td>{receipt.CompanyName}</td>
                                            <td>{receipt.ReceiptDate?.slice(0, 10)}</td>
                                            <td>₹ {receipt.ReceivedAmount}</td>
                                            <td>{receipt.PaymentType || '-'}</td>
                                            <td>{receipt.PaymentMode || '-'}</td>
                                            <td>{receipt.BankName || '-'}</td>
                                            <td className="text-center">{receipt.PaymentYear || '-'}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="text-center text-muted p-3">
                                            No receipts found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentReceiptTable;
