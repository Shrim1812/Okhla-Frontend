import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaTachometerAlt, FaUserPlus, FaMoneyCheckAlt, FaUsers, FaReceipt,
  FaChartLine, FaPlusCircle, FaClipboardList, FaSignOutAlt
} from 'react-icons/fa';
import './Sidbar.css';

function Sidbaar() {
  const [role, setRole] = useState('');
  const navigate = useNavigate();								 

  useEffect(() => {
    const savedRole = localStorage.getItem('role');
    setRole(savedRole);
  }, []);

	 const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    navigate('/'); // Redirect to login
  };	
  
return (
    <div
      className="sidebar text-white p-3"
      style={{
        minHeight: '100vh',
        width: '200px',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 2001,
        transition: 'all 0.3s ease',
        background: 'linear-gradient(135deg, #27496d, #142850)',
        boxShadow: '2px 0 5px rgba(0,0,0,0.3)',
      }}
    >
      <div className="mb-3">
        <h4 className="m-0">Menu</h4>
      </div>

      <ul className="list-unstyled">
        <li>
          <Link to="/dashboard" className="text-white d-flex align-items-center gap-2">
            <FaTachometerAlt /> Dashboard
          </Link>
        </li>

        {/* Only for Admin */}
        {role === 'admin' && (
          <li>
            <Link to="/member-form" className="text-white d-flex align-items-center gap-2">
              <FaUserPlus /> New Member Form
            </Link>
          </li>
        )}

        {/* Common for Admin and User */}
        <li>
          <Link to="/member-table" className="text-white d-flex align-items-center gap-2">
            <FaUsers /> Member List
          </Link>
        </li>
        <li>
          <Link to="/payment-form" className="text-white d-flex align-items-center gap-2">
            <FaMoneyCheckAlt /> Payment Form
          </Link>
        </li>
        <li>
          <Link to="/receipt-table" className="text-white d-flex align-items-center gap-2">
            <FaReceipt /> Payment Receipt
          </Link>
        </li>
    

        {/* Admin-only Settings */}
        {role === 'admin' && (
          <>
            <li>
              <Link to="/Add-payment" className="text-white d-flex align-items-center gap-2">
                <FaPlusCircle /> Payment Setting
              </Link>
            </li>
            <li>
              <Link to="/Annual-payment" className="text-white d-flex align-items-center gap-2">
                <FaClipboardList /> Annual Summary
              </Link>
            </li>
            <li>
              <Link to="/user-management" className="text-white d-flex align-items-center gap-2">
                <FaUsers /> User Management
              </Link>
            </li>
            <li>
              <Link to="/create-user" className="text-white d-flex align-items-center gap-2">
                <FaUserPlus /> Add User
              </Link>
            </li>
          </>
        )}

        <li>
          <button
            onClick={handleLogout}
            className="btn btn-danger w-100 mt-3 d-flex align-items-center gap-2"
            style={{ backgroundColor: '#c0392b', border: 'none' }}
          >
            <FaSignOutAlt /> Logout
          </button>
        </li>		 
      </ul>
    </div>
  );
}

export default Sidbaar;
