
import React, { useEffect, useState } from "react";
import axios from "axios";
import'./MemberForm.css';
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
    const [paymentYear, setPaymentYear] = useState('');// New fields
    const [paymentType, setPaymentType] = useState("");
    const [additionalPayable, setAdditionalPayable] = useState("");
    const [remark, setRemark] = useState("");
    const [registrationFees, setRegistrationFees] = React.useState('');
    const [otherCharge, setOtherCharge] = useState();
    const [registrationAmount, setRegistrationAmount] = useState(0);

    const fetchRegistrationFees = async (companyId) => {
        try {
            const response = await fetch(`https://okhla-backend.onrender.com/Ohkla/getRegistrationFee/${companyId}`, {
                method: 'GET',
            });
            const data = await response.json();
            console.log(data); // ✅ should log: { success: true, registrationFee: 3000 }

            if (data.success) {
                setRegistrationFees(data.registrationFee); // ✅ Correct value set here
            } else {
                setRegistrationFees('0'); // Fallback if not successful
            }
        } catch (error) {
            console.error('Error fetching registration fees:', error);
            setRegistrationFees('0'); // Fallback on error
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

               //updated code of receiptCounter
                const lastUsed = parseInt(localStorage.getItem("receiptCounter") || "100", 10); // default 100
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
                // For Registration or Other
                const resMember = await axios.get(`https://okhla-backend.onrender.com/Ohkla/getMemberById/${selectedId}`);
                const memData = resMember.data || {};
                console.log(memData.Category);
                // if(memData.Category != ""){
                //     const RegFees = 
                // }
                setMember(memData);
                const tAmt = memData.TotalAmount != null ? Number(memData.TotalAmount) : 0;
                setTotalAmount(String(tAmt));
                setAmountPaid("0");
                setDueAmount(String(tAmt));
                setIsNewTotalAmountEditable(true);
            }

            // Reset form fields
            setNewPayment("");
            // setReceiptNo(`REC-${Math.floor(100 + Math.random() * 900)}`);
            setChequeNo("");
            setChequeDate("");
            setBankName("");
            setPaymentMode("");
            setAdditionalPayable("");
            setRemark("");

            setIsLoadingData(false);
        } catch (error) {
            console.error("Error fetching member/payment summary:", error);
            alert("❌ Failed to fetch data.");
            setIsLoadingData(false);
        }
    }; // ✅ This is correct — no extra curly brace needed after this.


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
        const newPay = parseFloat(newPayment) || 0;
        const addPay = parseFloat(additionalPayable) || 0;
        const paid = parseFloat(amountPaid) || 0;
        const total = parseFloat(totalAmount) || 0;

        const actualPaid = paymentType === "Annual" ? newPay : addPay;
        const updatedPaid = paid + actualPaid;
        const updatedDue = total - updatedPaid;


       // for recipt
       const current = parseInt(localStorage.getItem("receiptCounter") || "101", 10);
        const nextCounter = current + 1;
        localStorage.setItem("receiptCounter", nextCounter.toString());
        setReceiptNo(`REC-${nextCounter}`);


        // if (!selectedId || (actualPaid <= 0 && paymentType !== "Registration")) {
        //     alert("⚠️ Please enter a valid payment amount.");
        //     return;
        // }

        if (!selectedId) {
            alert("⚠️ Please select a member.");
            return;
        }

        if (paymentType === "Registration") {
            if (!registrationFees || registrationFees <= 0) {
                alert("⚠️ Registration Fees must be greater than 0.");
                return;
            }
        } else if (paymentType === "Other") {
            if (!otherCharge || otherCharge <= 0) {
                alert("⚠️ Please enter a valid Other Charge.");
                return;
            }
        }

        let actual = 0;

        if (paymentType === "Registration") {
            actual = registrationFees;
        } else if (paymentType === "Other") {
            actual = otherCharge;
        }


        if (!paymentMode) {
            alert("Payment Mode is required!");
            return;  // stop further processing
        }

        try {
            if (paymentType === "Annual") {
                // ✅ Send to YearlyPaymentSummary
                await axios.post("https://okhla-backend.onrender.com/Ohkla/addPayment", {
                    MembershipID: parseInt(selectedId),
                    PaymentYear: selectedYear,
                    AmountPaid: updatedPaid,
                    DueAmount: updatedDue,
                    TotalAmount: total,
                    ReceiptNumber: receiptNo,
                    ChequeNumber: chequeNo,
                    ChequeReceiveOn: chequeDate || null,
                    BankName: bankName,
                    PaymentType: paymentMode,
                    PaymentCategory: paymentType,
                    Remark: remark
                });

                alert("✅ Payment details saved to YearlyPaymentSummary!");

                const receiptPayload = {
                    ReceiptNumber: receiptNo,
                    ReceiptDate: new Date().toISOString().split('T')[0], // today's date in YYYY-MM-DD
                    MembershipID: parseInt(selectedId),
                    ReceivedAmount: actualPaid,
                    PaymentMode: paymentMode,
                    PaymentType: paymentType,
                    ChequeNumber: chequeNo,
                    BankName: bankName,
                    PaymentYear: paymentType === "Annual" ? selectedYear : null,
                };
                console.log(receiptPayload);
                const receiptRes = await axios.post("https://okhla-backend.onrender.com/Ohkla/ReceiptOfPayment", receiptPayload);
                console.log("✅ Receipt added:", receiptRes.data);

                alert("Receipt added successfully!");

                try {
                    const payload = {
                        MembershipID: parseInt(selectedId),
                        PaymentYear: selectedYear,
                        AmountPaid: updatedPaid
                    };
                    console.log("Sending PUT:", payload);

                    const response = await axios.put("https://okhla-backend.onrender.com/Ohkla/updateAnnualPayment", payload);
                    console.log("Response:", response.data);
                    alert("Annual payment updated successfully!");

                } catch (error) {
                    console.error("❌ PUT error:", error.response?.data || error.message);
                    alert("Error while updating annual payment: " + (error.response?.data?.error || error.message));
                }
            } else {
                // ✅ Send to ExtraDetail
                const response = await axios.post("https://okhla-backend.onrender.com/Ohkla/ExtraDetail", {
                    MembershipID: parseInt(selectedId),
                    CompanyName: companyName,
                    PaymentYear: selectedYear,
                    // Amount: addPay,  // Correct key
                    Amount: actual,
                    ReceiptNumber: receiptNo,
                    ChequeNumber: chequeNo,
                    ChequeReceiveOn: chequeDate ? chequeDate : null,
                    BankName: bankName,
                    PaymentMode: paymentMode,
                    PaymentCategory: paymentType,
                    Remark: remark
                });
                console.log("Payment Type:", paymentType);
                console.log("Registration Fees:", registrationFees);
                console.log("Other Charge:", otherCharge);
                console.log("Amount to send:", actual);

                console.log(response);
                alert("✅ Payment details saved to ExtraDetail!");
                const receiptPayload = {
                    ReceiptNumber: receiptNo,
                    ReceiptDate: new Date().toISOString().split('T')[0],
                    MembershipID: parseInt(selectedId),
                    ReceivedAmount: actual, // ✅ Yeh sahi hai
                    PaymentMode: paymentMode,
                    PaymentType: paymentType,
                    ChequeNumber: chequeNo,
                    BankName: bankName,
                    PaymentYear: null,
                };

                console.log(receiptPayload);

                const receiptRes = await axios.post("https://okhla-backend.onrender.com/Ohkla/ReceiptOfPayment", receiptPayload);
                console.log("✅ Receipt added:", receiptRes.data);


                // ✅ Reset form values
                setCompanyName("");
                setAmountPaid(updatedPaid.toFixed(2));
                setDueAmount(updatedDue.toFixed(2));
                setNewPayment("");
                // setReceiptNo(`REC-${Math.floor(100 + Math.random() * 900)}`);
                setChequeNo("");
                setChequeDate("");
                setBankName("");
                setPaymentMode("");
                setAdditionalPayable("");
                setRemark("");
            }
        } catch (err) {
            console.error("❌ Error while saving payment:", err.response || err.message);
            alert("❌ Failed to save payment details. Please try again.");
        }
    };

return (
  <div style={{ display: 'flex' }}>
    {/* Sidebar */}
    <div style={{ width: '200px' }}>
      {/* Sidebar content here */}
    </div>

    {/* Main Content */}
    <div style={{ flex: 1, padding: '0' }}>
      <div
        className="card shadow mt-0 p-1"
        style={{ width: '100%', height: '100%', margin: '0', padding: '0' }}
      >
        <div
          className="card-header text-white p-2"
          style={{
            backgroundColor: '#173a60',
            margin: '0',height: '50px',
            borderBottom: '1px solid #ccc',
          }}
        >
          <h4 className="mb-0 text-center">➕ Add Payments Details</h4>
        </div>

        {/* Top Filters */}
        {/* <div
          className="row align-items-end mb-3 gx-2"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          <InputSelect
            label={
              <>
                Payment Type <span className="star">*</span>
              </>
            }
            style={{ flex: '0 0 48%' }}
            className="custom-input"
            value={paymentType}
            onChange={(e) => setPaymentType(e.target.value)}
            options={['', 'Annual', 'Registration', 'Other']}
          />

          <div style={{ flex: '0 0 48%' }}>
            <label className="form-label">
              Company Name <span className="star">*</span>
            </label>
            <select
              className="form-select custom-input"
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              style={{ width: '100%', height: '38px' }}
            >
              <option value="">Select</option>
              {companies.map((comp) => (
                <option key={comp.MembershipID} value={comp.MembershipID}>
                  {comp.CompanyName}
                </option>
              ))}
            </select>
          </div>
<div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', alignItems: 'flex-end' }}></div>
          {paymentType !== 'Registration' && paymentType !== 'Other' && (
            <div style={{ flex: '0 0 48%' }}>
              <label className="form-label">
                Payment Year <span className="star">*</span>
              </label>
              <select
                className="form-select custom-input"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                style={{ width: '100%', height: '38px' }}
              >
                <option value="">Select Year</option>
                {years.map((y, i) => (
                  <option key={i} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          )}
<div style={{ flex: '0 0 15%' }}>

            <button
              onClick={fetchMember}
              className="btn btn-primary btn-sm"
              disabled={isLoadingData}
              style={{
                padding: '5px 6px',
                fontSize: '0.8rem',
                height: '35px',
                width: '100%',
              }}
            >
              {isLoadingData ? 'Loading...' : 'Search'}
            </button>
          </div>
        </div> */}

<div className="row align-items-end mb-3 gx-3">
                <InputSelect
                    label={<><span>Payment Type</span> <span className="star">*</span></>}
                    value={paymentType}
                    onChange={(e) => setPaymentType(e.target.value)}
                    options={["", "Annual", "Registration", "Other"]}
                    required={true}
                />

                <div className="col-md-5">
                    <label className="form-label">Company Name  <span className="star">*</span></label>
                    <select className="form-select" onChange={(e) => setSelectedId(e.target.value)} value={selectedId}>
                        <option value="" required={true}>Select</option>
                        {companies.map((comp) => (
                            <option key={comp.MembershipID} value={comp.MembershipID}>
                                {comp.CompanyName}
                            </option>
                        ))}
                    </select>
                </div>

                {paymentType !== "Registration" && paymentType !== "Other" && (
                    <div className="col-md-3">
                        <label className="form-label">
                            Payment Year <span className="star">*</span>
                        </label>
                        <select
                            className="form-select"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            required={true}
                        >
                            <option value="">Select Year</option>
                            {years.map((y, i) => (
                                <option key={i} value={y}>
                                    {y}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
                <div className="col-md-2 d-grid">
                    <button
  onClick={fetchMember}
  className="btn btn-primary"
  disabled={isLoadingData}
  style={{ width: '100px' }} // 👈 yahan width kam kar di
>
  {isLoadingData ? 'Loading...' : 'Search'}
</button>
                </div>
            </div>

  <hr/>

        {/* Member Details */}
        <div
          className="row g-3"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          <InputField label="Member ID" className="custom-input" value={member.MembershipID || ''} readOnly />
          <InputField label="Company Name" className="custom-input" value={member.CompanyName || ''} readOnly />
          <InputField label="Member Name" className="custom-input" value={member.MemberName || ''} readOnly />
          <InputField label="Email" className="custom-input" value={member.Email || ''} readOnly />
          <InputField label="Member Since" className="custom-input" value={member.MemberSince || ''} readOnly />
          <InputField label="Contact No." className="custom-input" value={member.ContactNumber || ''} readOnly />

          {paymentType === 'Annual' && (
            <>
              <InputField
                label="Total Amount"
                type="number"
                className="custom-input"
                value={totalAmount}
                readOnly={!isNewTotalAmountEditable}
                onChange={isNewTotalAmountEditable ? handleTotalAmountChange : undefined}
              />
              <InputField label="Amount Paid" className="custom-input" type="number" value={amountPaid} readOnly />
              <InputField label="Due Amount" className="custom-input" type="number" value={dueAmount} readOnly />
            </>
          )}

          <InputSelect
            label={
              <>
                Payment Mode <span className="star">*</span>
              </>
            }
            className="custom-input"
            value={paymentMode}
            onChange={(e) => setPaymentMode(e.target.value)}
            options={['', 'UPI', 'Online', 'Cash', 'Cheque']}
            style={{ flex: '0 0 48%' }}
          />

          <InputField label="Receipt No." className="custom-input" value={receiptNo} readOnly />

          {paymentMode === 'Cheque' && (
            <>
              <InputField label="Cheque No." className="custom-input" value={chequeNo} onChange={(e) => setChequeNo(e.target.value)} />
              <InputField
                label="Cheque Receive On"
                className="custom-input"
                type="date"
                value={chequeDate}
                onChange={(e) => setChequeDate(e.target.value)}
              />
              <InputField label="Bank" className="custom-input" value={bankName} onChange={(e) => setBankName(e.target.value)} />
            </>
          )}

          {paymentType === 'Other' && (
            <InputField
              label={
                <>
                  Other Charge <span className="star">*</span>
                </>
              }
              type="number"
              className="custom-input"
              value={otherCharge}
              onChange={(e) => setOtherCharge(Number(e.target.value))}
            />
          )}

          {paymentType === 'Registration' && (
            <InputField
              label={
                <>
                  Registration Amount <span className="star">*</span>
                </>
              }
              type="number"
              className="custom-input"
              value={registrationFees}
              onChange={(e) => setRegistrationAmount(Number(e.target.value))}
            />
          )}

          {paymentType === 'Annual' && (
            <div style={{ flex: '0 0 48%' }}>
              <label className="form-label fw-bold">
                Payable <span className="star">*</span>
              </label>
              <input
                type="number"
                className="form-control custom-input"
                value={newPayment}
                onChange={(e) => handleNewPaymentChange(e.target.value)}
                required
                style={{ width: '100%', height: '38px' }}
              />
            </div>
          )}

          {paymentType !== 'Annual' && (
            <InputField
              label={
                <>
                  Remark <span className="star">*</span>
                </>
              }
              className="custom-input"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
            />
          )}
        </div>

        {/* Save Button */}
        <div className="mt-4 text-end" style={{ marginTop: '20px' }}>
          <button
            onClick={handleSave}
            className="btn btn-success btn-sm"
            disabled={isLoadingData}
            style={{ padding: '4px 8px', fontSize: '0.8rem', minWidth: '80px' }}
          >
            {isLoadingData ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  </div>
);

// ✅ InputField Component
function InputField({ label, value, onChange, readOnly = false, type = 'text', className = '' }) {
  return (
    <div style={{ flex: '0 0 48%' }}>
      <label className="form-label">{label}</label>
      <input
        type={type}
        className={`form-control ${className}`}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        style={{ width: '100%', height: '38px' }}
      />
    </div>
  );
}

// ✅ InputSelect Component
function InputSelect({ label, value, onChange, options, className = '', style = {} }) {
  return (
    <div style={{ flex: '0 0 48%', ...style }}>
      <label className="form-label">{label}</label>
      <select className={`form-select ${className}`} value={value} onChange={onChange} style={{ width: '100%', height: '38px' }}>
        {options.map((opt, i) => (
          <option key={i} value={opt}>
            {opt === '' ? 'Select' : opt}
          </option>
        ))}
      </select>
    </div>
  );
}


}

export default PaymentForm;
