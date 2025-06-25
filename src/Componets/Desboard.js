import React, { useState, useEffect } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import 'devextreme/dist/css/dx.light.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Select from 'react-select';


import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const DashboardUI = () => {
  const [companies, setCompanies] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedMembershipID, setSelectedMembershipID] = useState('');
  const [company, setCompany] = useState('');
  const [selectedYears, setSelectedYears] = useState([]);
  const [showData, setShowData] = useState(false);
  const [otherPayments, setOtherPayments] = useState([]);

  const [memberData, setMemberData] = useState({
    memberId: '',
    memberName: '',
    memberSince: '',
    totalAmount: 0,
    paidAmount: 0,
    dueAmount: 0
  });

  const [allYearData, setAllYearData] = useState([]);

  useEffect(() => {
    fetch('https://okhla-backend.onrender.com/Ohkla/companies')
      .then(res => res.json())
      .then(data => setCompanies(data))
      .catch(err => console.error('Error fetching companies:', err));
  }, []);

  const handleCompanyChange = (e) => {
    const selectedCompany = e.target.value;
    setCompany(selectedCompany);
    const comp = companies.find(c => c.CompanyName === selectedCompany);
    setSelectedMembershipID(comp ? Number(comp.MembershipID) : '');
    setYears([]);
    setSelectedYears([]);
    setShowData(false);
    setOtherPayments([]);
  };

  useEffect(() => {
    if (!selectedMembershipID) return;

    fetch(`https://okhla-backend.onrender.com/Ohkla/payment-years?MembershipID=${selectedMembershipID}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setYears(data);
      })
      .catch(err => {
        console.error('Error fetching years:', err);
        setYears([]);
      });
  }, [selectedMembershipID]);

  const handleSearch = () => {
    if (!company || selectedYears.length === 0) {
      alert('Please select both Company and Year(s)');
      return;
    }

    const isAll = selectedYears.includes('All');

    const url = isAll || selectedYears.length > 1
      ? 'https://okhla-backend.onrender.com/Ohkla/dashboard-multiyear'
      : 'https://okhla-backend.onrender.com/Ohkla/dashboard-data';

    const payload = {
      companyName: company,
      ...(isAll
        ? {}
        : selectedYears.length > 1
          ? { years: selectedYears }
          : { paymentYear: selectedYears[0] })
    };

    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        if (!data) {
          alert('No data found');
          setShowData(false);
          return;
        }

        if (isAll || selectedYears.length > 1) {
          const filteredData = selectedYears.includes('All')
            ? data.payments
            : data.payments.filter(d => selectedYears.includes(d.year?.toString()));

          const totalAmount = filteredData.reduce((acc, item) => acc + (item.TotalAmount || item.total || 0), 0);
          const paidAmount = filteredData.reduce((acc, item) => acc + (item.AmountPaid || item.paid || 0), 0);
          const dueAmount = filteredData.reduce((acc, item) => acc + (item.DueAmount || item.due || 0), 0);

          setAllYearData(filteredData || []);
          setMemberData({
            memberId: data.member?.MembershipID || '',
            memberName: data.member?.MemberName || '',
            memberSince: data.member?.MemberSince || '',
            totalAmount,
            paidAmount,
            dueAmount
          });
        } else {
          const payment = data.Payments?.[0] || {};
          setMemberData({
            memberId: data.MembershipID || '',
            memberName: data.MemberName || '',
            memberSince: data.MemberSince || '',
            totalAmount: payment.TotalAmount || 0,
            paidAmount: payment.AmountPaid || 0,
            dueAmount: payment.DueAmount || 0
          });
          setAllYearData([]);
        }

        // Fetch other payments
        fetch(`https://okhla-backend.onrender.com/Ohkla/other-payments?companyName=${company}`)
          .then(res => res.json())
          .then(op => {
            setOtherPayments(Array.isArray(op) ? op : []);
          })
          .catch(err => {
            console.error('Error fetching other payments:', err);
            setOtherPayments([]);
          });

        setShowData(true);
      })
      .catch(err => {
        console.error('Error fetching dashboard data:', err);
        alert('Failed to fetch dashboard data');
        setShowData(false);
      });
  };

  const pieData = {
    labels: ['Total Amount', 'Paid Amount', 'Due Amount'],
    datasets: [
      {
        data: [memberData.totalAmount, memberData.paidAmount, memberData.dueAmount],
        backgroundColor: ['#75F3F3', '#7AC0F1', '#F1AB7A'],
        borderWidth: 1
      }
    ]
  };

  const barData = {
    labels: ['Total', 'Paid', 'Due'],
    datasets: [
      {
        label: `${company} - ${selectedYears[0]}`,
        data: [memberData.totalAmount, memberData.paidAmount, memberData.dueAmount],
        backgroundColor: ['#84d0c8', '#caea6e', '#cd954e'],
        barThickness: 60
      }
    ]
  };

  const groupedBarData = {
    labels: allYearData.map(d => d.year),
    datasets: [
      {
        label: 'Total Amount',
        backgroundColor: '#84d0c8',
        data: allYearData.map(d => d.TotalAmount || d.total || 0),
        barThickness: 60
      },
      {
        label: 'Paid Amount',
        backgroundColor: '#caea6e',
        data: allYearData.map(d => d.AmountPaid || d.paid || 0),
        barThickness: 60
      },
      {
        label: 'Due Amount',
        backgroundColor: '#cd954e',
        data: allYearData.map(d => d.DueAmount || d.due || 0),
        barThickness: 60
      }
    ]
  };

  return (
    <div className="container" style={{ marginLeft: '195px' }}>
      {/* <h3 className="mb-0">Dashboard</h3> */}
      {/* <div className="card-header text-white" style={{ backgroundColor: '#173a60' }}>
                    <h3 className="mb-2" style={{ textAlign: 'center' }}>📈 Dashboard</h3>
                </div> */}

                 <div className="card-header text-white" style={{ backgroundColor: '#173a60',height: '50px' , display: 'flex',
    justifyContent: 'center', // horizontally center
    alignItems: 'center',}}>
        <h3 className="mb-0" style={{ textAlign: 'center' }}>
         📈 Dashboard
        </h3>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <label>Company Name</label>
          <select className="form-select" value={company} onChange={handleCompanyChange}>
            <option value="">Select</option>
            {companies.map((c, idx) => (
              <option key={idx} value={c.CompanyName}>{c.CompanyName}</option>
            ))}
          </select>
        </div>

     {/* <div className="col-md-4">
 <label>Payment Year(s)</label>
<select
  className="form-select"
  multiple
  size={3}      // Ye ek fixed visible option count dega, baaki scroll se dikhega
  value={selectedYears}
  onChange={(e) => {
    const options = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedYears(options);
  }}
>
  <option value="All">All</option>
  {years.map((year, idx) => (
    <option key={idx} value={year}>{year}</option>
  ))}
</select>

</div> */}
<div className="col-md-4">
  <label>Payment Year(s)</label>
  <Select
    isMulti
    options={[{ value: 'All', label: 'All' }, ...years.map(year => ({ value: year, label: year.toString() }))]}
    value={selectedYears.map(y => ({ value: y, label: y.toString() }))}
    onChange={(selectedOptions) => {
      const selectedValues = selectedOptions.map(opt => opt.value);
      setSelectedYears(selectedValues);
    }}
    placeholder="Select year(s)..."
  />
</div>



        <div className="col-md-4 d-flex align-items-end">
          <button className="btn btn-primary w-50" onClick={handleSearch}>Search</button>
        </div>
      </div>

      {showData && (
        <>
          <div className="row mb-4">
            <div className="col-md-4"><strong>Member ID:</strong> {memberData.memberId}</div>
            <div className="col-md-4"><strong>Member Name:</strong> {memberData.memberName}</div>
            <div className="col-md-4"><strong>Member Since:</strong> {memberData.memberSince}</div>
          </div>

          <div className="row mb-5">
            {/* Full width Bar chart */}
            <div className="col-12">
              {(selectedYears.includes('All') || selectedYears.length > 1) ? (
                <>
                  <h6>Yearly Comparison</h6>
                  <div style={{ height: '400px' }}>
                    <Bar data={groupedBarData} options={{ responsive: true, maintainAspectRatio: false }} />
                  </div>
                </>
              ) : (
                <>
                  <h6>Amount Comparison</h6>
                  <div style={{ height: '300px' }}>
                    <Bar data={barData} options={{ maintainAspectRatio: false }} />
                  </div>
                </>
              )}
            </div>

            {/* Pie chart and Other Payments side by side */}
            <div className="col-md-6 mt-4">
              <h6>Payment Status</h6>
              <div style={{ height: '250px' }}>
                <Pie data={pieData} options={{ maintainAspectRatio: false }} />
              </div>
            </div>

            {otherPayments.length > 0 && (
              <div className="col-md-6 mt-4">
                <h6>Other Payments</h6>
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Amount</th>
                      <th>Remark</th>
                    </tr>
                  </thead>
                  <tbody>
                    {otherPayments.map((op, idx) => (
                      <tr key={idx}>
                        <td>{op.Category}</td>
                        <td>{op.Amount}</td>
                        <td>{op.Remark}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardUI;

