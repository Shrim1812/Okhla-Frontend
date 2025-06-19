import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EditMemberForm from './EditForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import './showMember.css';

const MemberTable = () => {
    const [members, setMembers] = useState([]);
    const [filteredMembers, setFilteredMembers] = useState([]);
    const [selectedMember, setSelectedMember] = useState(null);

    const role = localStorage.getItem("role");

    // State for filters per column (initially empty)
    const [filters, setFilters] = useState({
        MemberName: '',
        CompanyName: '',
        ContactNumber: '',
        Email: '',
        GSTNo: '',
        UdhyamAadhar: '',
        RegistrationDate: '',
        MemberSince: '',
        Address1: '',
        Address2: '',
        Area: '',
        City: '',
        State: '',
        Status: '',  // We'll filter based on 'IsActive' but showing text status
        UpdatedDate: '',
        Owner: '',
        Category: '',
        PrinterCategory: '',
    });

    const fetchMembers = () => {
        axios.get('https://okhla-backend.onrender.com/Ohkla/getMember')
            .then(response => {
                const activeMembers = response.data.filter(member => member.IsActive === true || member.IsActive === 1);
                setMembers(activeMembers);
                setFilteredMembers(activeMembers);
            })
            .catch(error => console.error('Error fetching members:', error));
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    useEffect(() => {
        // Filter members according to filters
        let result = members.filter(member => {
            // Check all filters; if filter value is empty, ignore
            return Object.entries(filters).every(([key, filterVal]) => {
                if (!filterVal) return true; // no filter on this column

                let memberVal = '';

                if (key === 'Status') {
                    memberVal = member.IsActive ? 'active' : 'inactive';
                } else if (key === 'RegistrationDate' || key === 'UpdatedDate') {
                    memberVal = member[key]?.substring(0, 10) || '';
                } else {
                    memberVal = member[key] || '';
                }

                return memberVal.toString().toLowerCase().includes(filterVal.toLowerCase());
            });
        });

        setFilteredMembers(result);
    }, [filters, members]);

    const handleFilterChange = (e, column) => {
        setFilters(prev => ({
            ...prev,
            [column]: e.target.value
        }));
    };

    const handleEdit = (member) => {
        setSelectedMember(member);
    };

    const handleCancel = () => {
        setSelectedMember(null);
    };

    const handleUpdate = () => {
        setSelectedMember(null);
        fetchMembers();
    };

    return (
        <div className="container" style={{ marginLeft: '190px', marginTop: '0' }}>
            <div className="card-header text-white" style={{ backgroundColor: '#173a60' }}>
             <h3 className="mb-0" style={{ textAlign: 'center' }}>👥 All Member Details</h3>
             </div>

            {selectedMember ? (
                <EditMemberForm
                    memberData={selectedMember}
                    onCancel={handleCancel}
                    onUpdate={handleUpdate}
                />
            ) : (
                <div style={{ overflowX: 'auto' }} className="shadow p-3 rounded">
                  <table className="table table-bordered table-hover align-middle text-center equal-width" style={{ minWidth: '1500px' }}>

                       <thead style={{ backgroundColor: '#e6f2ff' }}>
                            <tr>
                                <th>#</th>
                                <th>
                                    Member Name
                                    <input
                                        type="text"
                                        className="form-control form-control-sm mt-1"
                                        value={filters.MemberName}
                                        onChange={(e) => handleFilterChange(e, 'MemberName')}
                                        placeholder="Search..."
                                    />
                                </th>
                                <th>
                                    Company
                                    <input
                                        type="text"
                                        className="form-control form-control-sm mt-1"
                                        value={filters.CompanyName}
                                        onChange={(e) => handleFilterChange(e, 'CompanyName')}
                                        placeholder="Search..."
                                    />
                                </th>
                                <th>
                                    Contact
                                    <input
                                        type="text"
                                        className="form-control form-control-sm mt-1"
                                        value={filters.ContactNumber}
                                        onChange={(e) => handleFilterChange(e, 'ContactNumber')}
                                        placeholder="Search..."
                                    />
                                </th>
                                <th>
                                    Email
                                    <input
                                        type="text"
                                        className="form-control form-control-sm mt-1"
                                        value={filters.Email}
                                        onChange={(e) => handleFilterChange(e, 'Email')}
                                        placeholder="Search..."
                                    />
                                </th>
                                <th>
                                    GST No
                                    <input
                                        type="text"
                                        className="form-control form-control-sm mt-1"
                                        value={filters.GSTNo}
                                        onChange={(e) => handleFilterChange(e, 'GSTNo')}
                                        placeholder="Search..."
                                    />
                                </th>
                                <th>
                                    Udhyam Aadhar
                                    <input
                                        type="text"
                                        className="form-control form-control-sm mt-1"
                                        value={filters.UdhyamAadhar}
                                        onChange={(e) => handleFilterChange(e, 'UdhyamAadhar')}
                                        placeholder="Search..."
                                    />
                                </th>
                                <th>
                                    Registration Date
                                    <input
                                        type="text"
                                        className="form-control form-control-sm mt-1"
                                        value={filters.RegistrationDate}
                                        onChange={(e) => handleFilterChange(e, 'RegistrationDate')}
                                        placeholder="YYYY-MM-DD"
                                    />
                                </th>
                                <th>
                                    Member Since
                                    <input
                                        type="text"
                                        className="form-control form-control-sm mt-1"
                                        value={filters.MemberSince}
                                        onChange={(e) => handleFilterChange(e, 'MemberSince')}
                                        placeholder="Search..."
                                    />
                                </th>
                                <th>
                                    Address 1
                                    <input
                                        type="text"
                                        className="form-control form-control-sm mt-1"
                                        value={filters.Address1}
                                        onChange={(e) => handleFilterChange(e, 'Address1')}
                                        placeholder="Search..."
                                    />
                                </th>
                                <th>
                                    Address 2
                                    <input
                                        type="text"
                                        className="form-control form-control-sm mt-1"
                                        value={filters.Address2}
                                        onChange={(e) => handleFilterChange(e, 'Address2')}
                                        placeholder="Search..."
                                    />
                                </th>
                                <th>
                                    Area
                                    <input
                                        type="text"
                                        className="form-control form-control-sm mt-1"
                                        value={filters.Area}
                                        onChange={(e) => handleFilterChange(e, 'Area')}
                                        placeholder="Search..."
                                    />
                                </th>
                                <th>
                                    City
                                    <input
                                        type="text"
                                        className="form-control form-control-sm mt-1"
                                        value={filters.City}
                                        onChange={(e) => handleFilterChange(e, 'City')}
                                        placeholder="Search..."
                                    />
                                </th>
                                <th>
                                    State
                                    <input
                                        type="text"
                                        className="form-control form-control-sm mt-1"
                                        value={filters.State}
                                        onChange={(e) => handleFilterChange(e, 'State')}
                                        placeholder="Search..."
                                    />
                                </th>
                                <th>
                                    Category
                                    <input
                                        type="text"
                                        className="form-control form-control-sm mt-1"
                                        value={filters.Category}
                                        onChange={(e) => handleFilterChange(e, 'Category')}
                                        placeholder="Search..."
                                    />
                                </th>
                                <th>
                                    Printer Category
                                    <input
                                        type="text"
                                        className="form-control form-control-sm mt-1"
                                        value={filters.PrinterCategory}
                                        onChange={(e) => handleFilterChange(e, 'PrinterCategory')}
                                        placeholder="Search..."
                                    />
                                </th>
                                <th>
                                    Status
                                    <input
                                        type="text"
                                        className="form-control form-control-sm mt-1"
                                        value={filters.Status}
                                        onChange={(e) => handleFilterChange(e, 'Status')}
                                        placeholder="Active/Inactive"
                                    />
                                </th>
                                <th>
                                    Updated Date
                                    <input
                                        type="text"
                                        className="form-control form-control-sm mt-1"
                                        value={filters.UpdatedDate}
                                        onChange={(e) => handleFilterChange(e, 'UpdatedDate')}
                                        placeholder="YYYY-MM-DD"
                                    />
                                </th>
                                <th>
                                    Owner
                                    <input
                                        type="text"
                                        className="form-control form-control-sm mt-1"
                                        value={filters.Owner}
                                        onChange={(e) => handleFilterChange(e, 'Owner')}
                                        placeholder="Search..."
                                    />
                                </th>

                                {role === "admin" && <th>Actions</th>}
                                {/* <th>Actions</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMembers.length === 0 ? (
                                <tr>
                                    <td colSpan="18">No members found</td>
                                </tr>
                            ) : (
                                filteredMembers.map((member, index) => (
                                    <tr key={member.MemberID || index}>
                                        <td>{index + 1}</td>
                                        <td>{member.MemberName}</td>
                                        <td>{member.CompanyName}</td>
                                        <td>{member.ContactNumber}</td>
                                        <td>{member.Email}</td>
                                        <td>{member.GSTNo}</td>
                                        <td>{member.UdhyamAadhar}</td>
                                        <td>{member.RegistrationDate?.substring(0, 10)}</td>
                                        <td>{member.MemberSince}</td>
                                        <td>{member.Address1}</td>
                                        <td>{member.Address2}</td>
                                        <td>{member.Area}</td>
                                        <td>{member.City}</td>
                                        <td>{member.State}</td>
                                        <td>{member.Category}</td>
                                        <td>{member.PrinterCategory}</td>

                                        <td>
                                            {member.IsActive ? (
                                                <span className="badge bg-success">Active</span>
                                            ) : (
                                                <span className="badge bg-secondary">Inactive</span>
                                            )}
                                        </td>
                                        <td>{member.UpdatedDate?.substring(0, 10)}</td>
                                        <td>{member.Owner}</td>

                                        {/* <td>
                                            <button className="btn btn-sm btn-primary" onClick={() => handleEdit(member)}>
                                                Edit
                                            </button>
                                        </td> */}

                                        <td>
                                            {role === 'admin' && (
                                                <button className="btn btn-sm btn-primary" onClick={() => handleEdit(member)}>
                                                    Edit
                                                </button>
                                            )}
                                        </td>

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

export default MemberTable;
