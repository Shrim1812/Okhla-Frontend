// src/components/OtherPaymentsTable.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const OtherPaymentsTable = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    axios
      .get("https://okhla-backend.onrender.com/Ohkla/getothersPayment")
      .then((res) => setPayments(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (

    <div className="container" style={{ marginLeft: '190px', marginTop: '0' }}>
             <div className="card-header text-white" style={{ backgroundColor: '#173a60',height: '50px' , display: 'flex',justifyContent: 'center', // horizontally center
alignItems: 'center',}}>
             <h3 className="mb-0" style={{ textAlign: 'center' }}>🔁Other Payments-List</h3>
             </div>
    {/* <div className="container mt-4">
      <h2>Other Payments</h2> */}
         {/* <div style={{ overflowX: 'auto' }} className="shadow p-3 rounded"> */}
     <table className="table table-bordered table-hover align-middle text-center equal-width">
        <thead>
          <tr>
            
            <th>MembershipID</th>
            <th>CompanyName</th>
            <th>PaymentCategory</th>
            
            <th>Amount</th>
            <th>Remark</th>
            <th>PaymentMode</th>
          </tr>
        </thead>
       <tbody>
  {payments.map((p) => (
    <tr key={p.PaymentID}>
      <td>{p.MembershipID}</td>
      <td>{p.CompanyName}</td>
      <td>{p.PaymentCategory}</td>
   
      <td>{p.Amount}</td>
      <td>{p.Remark}</td>
      <td>{p.PaymentMode}</td>
    </tr>
  ))}
</tbody>

      </table>
      </div>
   
  );
};

export default OtherPaymentsTable;
