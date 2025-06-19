import React, { useEffect, useState } from "react";
import axios from "axios";

const UserManagementTable = () => {
    const [users, setUsers] = useState([]);
    const [editIndex, setEditIndex] = useState(null);
    const [editData, setEditData] = useState({});

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const res = await axios.get("https://okhla-backend.onrender.com/Ohkla/getAllUsers");

        const sortedUsers = res.data
            .map(u => ({ ...u, Status: u.Status || "Deactive" })) // Default fallback
            .sort((a, b) => {
                if (a.Status === "active" && b.Status !== "active") return -1;
                if (a.Status !== "active" && b.Status === "active") return 1;
                return 0;
            });

        setUsers(sortedUsers);
    };

    const handleEdit = (index) => {
        setEditIndex(index);
        setEditData({ ...users[index] });
    };

    const handleSave = async () => {
        try {
            await axios.post("https://okhla-backend.onrender.com/Ohkla/updateUserByAdmin", {
                userId: editData.UserID,
                name: editData.Name,
                email: editData.Email,
                role: editData.Role,
                status: editData.Status,
            });

            setEditIndex(null);
            fetchUsers();
        } catch (err) {
            alert("Update failed");
        }
    };

    const handleChangePassword = async (user) => {
        const newPass = prompt(`Enter new password for ${user.Name}:`);
        if (!newPass) return;

        try {
            await axios.post("https://okhla-backend.onrender.com/Ohkla/changePassword", {
                email: user.Email,
                newPassword: newPass,
            });
            alert("Password reset successfully.");
        } catch (err) {
            alert("Password reset failed.");
        }
    };

    return (
 <div className="container" style={{ marginLeft: '190px', marginTop: '0' }}>
           <div className="card-header text-white mb-3" style={{ backgroundColor: '#173a60',height: '50px' }}>
               <h3 className="text-center mb-0">👥 User Management</h3>     
       </div>

            <div className="table-responsive"> {/* ✅ Responsive wrapper */}
                <table className="table table-bordered">
                  <thead style={{ backgroundColor: '#e6f2ff' }}>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Edit</th>
                            <th>Change Password</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={user.UserID}>
                                <td>
                                    {editIndex === index ? (
                                        <input
                                            value={editData.Name}
                                            onChange={(e) => setEditData({ ...editData, Name: e.target.value })}
                                            className="form-control"
                                        />
                                    ) : (
                                        user.Name
                                    )}
                                </td>
                                <td>
                                    {editIndex === index ? (
                                        <input
                                            value={editData.Email}
                                            onChange={(e) => setEditData({ ...editData, Email: e.target.value })}
                                            className="form-control"
                                        />
                                    ) : (
                                        user.Email
                                    )}
                                </td>
                                <td>
                                    {editIndex === index ? (
                                        <select
                                            value={editData.Role}
                                            onChange={(e) => setEditData({ ...editData, Role: e.target.value })}
                                            className="form-select"
                                        >
                                            <option value="admin">Admin</option>
                                            <option value="user">User</option>
                                        </select>
                                    ) : (
                                        user.Role
                                    )}
                                </td>
                                <td>
                                    
  {editIndex === index ? (
    <select
      value={editData.Status}
      onChange={(e) => setEditData({ ...editData, Status: e.target.value })}
      className="form-select"
    >
      <option value="active">Active</option>
      <option value="Deactive">Deactive</option>
    </select>
  ) : (
    <span className={`badge ${user.Status === "active" ? "bg-success" : "bg-danger"}`}>
      {user.Status}
    </span>
  )}
</td>

                                <td>
                                    {editIndex === index ? (
                                        <button className="btn btn-success btn-sm" onClick={handleSave}>
                                            Save
                                        </button>
                                    ) : (
                                        <button className="btn btn-warning btn-sm" onClick={() => handleEdit(index)}>
                                            ✏ Edit
                                        </button>
                                    )}
                                </td>
                                <td>
                                    <button
                                        className="btn btn-secondary btn-sm"
                                        onClick={() => handleChangePassword(user)}
                                    >
                                        🔑 Change Password
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagementTable;
