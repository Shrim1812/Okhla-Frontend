import React, { useEffect, useState } from "react";
import axios from "axios";
import './MemberForm.css';

function PaymentForm() {
  const [companies, setCompanies] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [member, setMember] = useState({});
  const [totalAmount, setTotalAmount] = useState("");
  const [amountPaid, setAmountPaid] = useState("0");
  const [dueAmount, setDueAmount] = useState("0");
  const [newPayment, setNewPayment] = useState("");
  const [receiptNo, setReceiptNo] = useState("");
  const [chequeNo, setChequeNo] = useState("");
  const [chequeDate, setChequeDate] = useState("");
  const [bankName, setBankName] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isNewTotalAmountEditable, setIsNewTotalAmountEditable] = useState(false);
  const [years, setYears] = useState([]);
  const [companyName, setCompanyName] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [additionalPayable, setAdditionalPayable] = useState("");
  const [remark, setRemark] = useState("");
  const [registrationFees, setRegistrationFees] = useState('');
  const [otherCharge, setOtherCharge] = useState();
  const [registrationAmount, setRegistrationAmount] = useState(0);

  const fetchRegistrationFees = async (companyId) => {
    try {
      const response = await fetch(`https://okhla-backend.onrender.com/Ohkla/getRegistrationFee/${companyId}`);
      const data = await response.json();
      if (data.success) {
        setRegistrationFees(data.registrationFee);
      } else {
        setRegistrationFees('0');
      }
    } catch (error) {
      console.error('Error fetching registration fees:', error);
      setRegistrationFees('0');
    }
  };

  useEffect(() => {
    axios.get("https://okhla-backend.onrender.com/Ohkla/getCompany")
      .then((res) => setCompanies(res.data))
      .catch((err) => console.error("Error fetching companies:", err));

    axios.get("https://okhla-backend.onrender.com/Ohkla/getYear")
      .then((res) => {
        const yearsFromAPI = res.data.map((item) => item.YearRange);
        setYears(yearsFromAPI);
        const lastUsed = parseInt(localStorage.getItem("receiptCounter") || "0", 10);
        const nextReceiptNo = lastUsed + 1;
        setReceiptNo(`RCE-${nextReceiptNo}`);
      })
      .catch((err) => console.error("Error fetching years:", err));
  }, []);

  useEffect(() => {
    const idNum = Number(selectedId);
    const selected = companies.find(c => c.MembershipID === idNum);

    if (selected) {
      setCompanyName(selected.CompanyName);
    }

    if (paymentType === "Registration" && selectedId && !isNaN(idNum)) {
      fetchRegistrationFees(selectedId);
    }
  }, [selectedId, selectedYear, paymentType, companies]);

  const fetchMember = async () => {
    if (!selectedId || !paymentType || (paymentType === "Annual" && !selectedYear)) {
      alert("⚠️ Please select Company, Payment Type, and Year (only for Annual).");
      return;
    }
    try {
      setIsLoadingData(true);
      if (paymentType === "Annual") {
        const { data } = await axios.get(
          `https://okhla-backend.onrender.com/Ohkla/getMemberAndPaymentSummaryById/${selectedId}/${selectedYear}`
        );
        if (data && Object.keys(data).length > 0) {
          setMember(data);
          setTotalAmount(String(data.TotalAmount ?? ""));
          setAmountPaid(String(data.AmountPaid ?? "0"));
          setDueAmount(String(data.DueAmount ?? "0"));
          setIsNewTotalAmountEditable(false);
        } else {
          const resMember = await axios.get(`https://okhla-backend.onrender.com/Ohkla/getMemberById/${selectedId}`);
          const memData = resMember.data || {};
          setMember(memData);
          const tAmt = memData.TotalAmount != null ? Number(memData.TotalAmount) : 0;
          setTotalAmount(String(tAmt));
          setAmountPaid("0");
          setDueAmount(String(tAmt));
          setIsNewTotalAmountEditable(true);
        }
      } else {
        const resMember = await axios.get(`https://okhla-backend.onrender.com/Ohkla/getMemberById/${selectedId}`);
        const memData = resMember.data || {};
        setMember(memData);
        const tAmt = memData.TotalAmount != null ? Number(memData.TotalAmount) : 0;
        setTotalAmount(String(tAmt));
        setAmountPaid("0");
        setDueAmount(String(tAmt));
        setIsNewTotalAmountEditable(true);
      }

      // Reset basic form fields
      setNewPayment("");
      setChequeDate("");
      setPaymentMode("");
      setAdditionalPayable("");
      setRemark("");
      setIsLoadingData(false);
    } catch (error) {
      console.error("Error fetching member/payment summary:", error);
      alert("❌ Failed to fetch data.");
      setIsLoadingData(false);
    }
  };

  const handleTotalAmountChange = (e) => {
    const val = e.target.value;
    const total = parseFloat(val) || 0;
    const paid = parseFloat(amountPaid) || 0;
    setTotalAmount(val);
    setDueAmount((total - paid).toFixed(2));
  };

  const handleNewPaymentChange = (value) => {
    const newPay = parseFloat(value) || 0;
    const paid = parseFloat(amountPaid) || 0;
    const total = parseFloat(totalAmount) || 0;
    setNewPayment(value);
    setDueAmount((total - (paid + newPay)).toFixed(2));
  };

  const handleSave = async () => {
    if (!selectedId || !paymentMode) {
      alert("⚠️ Please fill all required fields.");
      return;
    }
    const newPay = parseFloat(newPayment) || 0;
    const addPay = parseFloat(additionalPayable) || 0;
    const paid = parseFloat(amountPaid) || 0;
    const total = parseFloat(totalAmount) || 0;
    const actualPaid = paymentType === "Annual" ? newPay : addPay;
    const updatedPaid = paid + actualPaid;
    const updatedDue = total - updatedPaid;

    let actual = 0;
    if (paymentType === "Registration") {
      if (!registrationFees || registrationFees <= 0) {
        alert("⚠️ Registration Fees must be greater than 0.");
        return;
      }
      actual = registrationFees;
    } else if (paymentType === "Other") {
      if (!otherCharge || otherCharge <= 0) {
        alert("⚠️ Please enter a valid Other Charge.");
        return;
      }
      actual = otherCharge;
    }

    try {
      const current = parseInt(localStorage.getItem("receiptCounter") || "100", 10);
      const next = current + 1;
      const newReceiptNo = `REC-${next}`;
      setReceiptNo(`REC-${next + 1}`);
      localStorage.setItem("receiptCounter", next.toString());

      if (paymentType === "Annual") {
        await axios.post("https://okhla-backend.onrender.com/Ohkla/addPayment", {
          MembershipID: parseInt(selectedId),
          PaymentYear: selectedYear,
          AmountPaid: updatedPaid,
          DueAmount: updatedDue,
          TotalAmount: total,
          ReceiptNumber: newReceiptNo,
          ChequeNumber: chequeNo,
          ChequeReceiveOn: chequeDate || null,
          BankName: bankName,
          PaymentType: paymentMode,
          PaymentCategory: paymentType,
          Remark: remark
        });

        await axios.post("https://okhla-backend.onrender.com/Ohkla/ReceiptOfPayment", {
          ReceiptNumber: newReceiptNo,
          ReceiptDate: new Date().toISOString().split('T')[0],
          MembershipID: parseInt(selectedId),
          ReceivedAmount: actualPaid,
          PaymentMode: paymentMode,
          PaymentType: paymentType,
          ChequeNumber: chequeNo,
          BankName: bankName,
          PaymentYear: selectedYear
        });

        await axios.put("https://okhla-backend.onrender.com/Ohkla/updateAnnualPayment", {
          MembershipID: parseInt(selectedId),
          PaymentYear: selectedYear,
          AmountPaid: updatedPaid
        });

        alert("✅ Annual payment saved successfully!");
      } else {
        await axios.post("https://okhla-backend.onrender.com/Ohkla/ExtraDetail", {
          MembershipID: parseInt(selectedId),
          CompanyName: companyName,
          PaymentYear: selectedYear,
          Amount: actual,
          ReceiptNumber: newReceiptNo,
          ChequeNumber: chequeNo,
          ChequeReceiveOn: chequeDate || null,
          BankName: bankName,
          PaymentMode: paymentMode,
          PaymentCategory: paymentType,
          Remark: remark
        });

        await axios.post("https://okhla-backend.onrender.com/Ohkla/ReceiptOfPayment", {
          ReceiptNumber: newReceiptNo,
          ReceiptDate: new Date().toISOString().split('T')[0],
          MembershipID: parseInt(selectedId),
          ReceivedAmount: actual,
          PaymentMode: paymentMode,
          PaymentType: paymentType,
          ChequeNumber: chequeNo,
          BankName: bankName,
          PaymentYear: selectedYear
        });

        alert("✅ Extra detail and receipt saved!");
      }
    } catch (error) {
      console.error("❌ Error saving payment:", error.response?.data || error.message);
      alert("Error saving payment details.");
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '200px' }}></div>
      <div style={{ flex: 1 }}>
        <div className="card shadow mt-0 p-1" style={{ width: '100%' }}>
          <div className="card-header text-white p-2" style={{ backgroundColor: '#173a60', height: '50px' }}>
            <h4 className="mb-0 text-center">➕ Add Payments Details</h4>
          </div>

          <div className="row align-items-end mb-3 gx-3">
            <InputSelect
              label="Payment Type *"
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
              options={["", "Annual", "Registration", "Other"]}
              required
            />

            <div className="col-md-5">
              <label className="form-label">Company Name *</label>
              <select className="form-select" onChange={(e) => setSelectedId(e.target.value)} value={selectedId}>
                <option value="">Select</option>
                {companies.map((comp) => (
                  <option key={comp.MembershipID} value={comp.MembershipID}>
                    {comp.CompanyName}
                  </option>
                ))}
              </select>
            </div>

            {paymentType === "Annual" && (
              <div className="col-md-3">
                <label className="form-label">Payment Year *</label>
                <select className="form-select" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} required>
                  <option value="">Select Year</option>
                  {years.map((y, i) => (
                    <option key={i} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="col-md-2 d-grid">
              <button onClick={fetchMember} className="btn btn-primary" disabled={isLoadingData}>
                {isLoadingData ? 'Loading...' : 'Search'}
              </button>
            </div>
          </div>

          <hr />

          <div className="row g-3 flex-wrap">
            <InputField label="Member ID" value={member.MembershipID || ''} readOnly />
            <InputField label="Company Name" value={member.CompanyName || ''} readOnly />
            <InputField label="Member Name" value={member.MemberName || ''} readOnly />
            <InputField label="Email" value={member.Email || ''} readOnly />
            <InputField label="Member Since" value={member.MemberSince || ''} readOnly />
            <InputField label="Contact No." value={member.ContactNumber || ''} readOnly />

            {paymentType === 'Annual' && (
              <>
                <InputField label="Total Amount" type="number" value={totalAmount || ''} onChange={handleTotalAmountChange} readOnly={!isNewTotalAmountEditable} />
                <InputField label="Amount Paid" type="number" value={amountPaid || ''} readOnly />
                <InputField label="Due Amount" type="number" value={dueAmount || ''} readOnly />
              </>
            )}

            <InputSelect label="Payment Mode *" value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)} options={['', 'UPI', 'Online', 'Cash', 'Cheque']} />

            <InputField label="Receipt No." value={receiptNo || ''} readOnly />

            {paymentMode === 'Cheque' && (
              <>
                <InputField key="chequeNo" label="Cheque No." value={chequeNo || ''} onChange={(e) => setChequeNo(e.target.value)} />
                <InputField key="chequeDate" label="Cheque Receive On" type="date" value={chequeDate || ''} onChange={(e) => setChequeDate(e.target.value)} />
                <InputField key="bankName" label="Bank" value={bankName || ''} onChange={(e) => setBankName(e.target.value)} />
              </>
            )}

            {paymentType === 'Other' && (
              <InputField label="Other Charge *" type="number" value={otherCharge || ''} onChange={(e) => setOtherCharge(Number(e.target.value))} />
            )}

            {paymentType === 'Registration' && (
              <InputField label="Registration Amount *" type="number" value={registrationFees || ''} onChange={(e) => setRegistrationAmount(Number(e.target.value))} />
            )}

            {paymentType === 'Annual' && (
              <InputField label="Payable *" type="number" value={newPayment || ''} onChange={(e) => handleNewPaymentChange(e.target.value)} />
            )}

            {paymentType !== 'Annual' && (
              <InputField label="Remark *" value={remark || ''} onChange={(e) => setRemark(e.target.value)} />
            )}
          </div>

          <div className="mt-4 text-end">
            <button onClick={handleSave} className="btn btn-success btn-sm" disabled={isLoadingData}>
              {isLoadingData ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ✅ Updated InputField
function InputField({ label, value, onChange, readOnly = false, type = 'text' }) {
  return (
    <div style={{ flex: '0 0 48%' }}>
      <label className="form-label">{label}</label>
      <input
        type={type}
        className="form-control"
        value={value || ''}
        onChange={onChange}
        readOnly={readOnly}
        style={{ width: '100%', height: '38px' }}
      />
    </div>
  );
}

// ✅ InputSelect
function InputSelect({ label, value, onChange, options }) {
  return (
    <div style={{ flex: '0 0 48%' }}>
      <label className="form-label">{label}</label>
      <select className="form-select" value={value} onChange={onChange} style={{ width: '100%', height: '38px' }}>
        {options.map((opt, i) => (
          <option key={i} value={opt}>
            {opt === '' ? 'Select' : opt}
          </option>
        ))}
      </select>
    </div>
  );
}

export default PaymentForm;
