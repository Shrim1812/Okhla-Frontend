import { useState, useEffect } from "react";
import axios from "axios";
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';

const CreateUserForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "user",
		emailType: "",
        senderEmail: "",
        senderPassword: ""		  
    });

    const [message, setMessage] = useState("");
    const [alertType, setAlertType] = useState("success");

    useEffect(() => {
        const role = localStorage.getItem("role");
        if (role !== "admin") {
            window.location.href = "/";
        }
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("https://okhla-backend.onrender.com/Ohkla/createUser", formData);
            Swal.fire({
                icon: 'success',
                title: 'User Created',
                text: res.data.message,
                confirmButtonColor: '#198754'
            });
            setFormData({
                name: "",
                email: "",
                password: "",
                role: "user",
				emailType: "",
                senderEmail: "",
                senderPassword: ""
            });
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.response?.data?.message || "Something went wrong",
                confirmButtonColor: '#dc3545'
            });
        }
    };

    return (
        <div className="container-fluid d-flex align-items-center justify-content-center min-vh-100 bg-light">
            <div className="card w-100 shadow" style={{ maxWidth: '500px' }}>
                <div className="card-header text-white text-center" style={{ backgroundColor: '#173a60' }}>
                    <h4>Create New User</h4>
                </div>
                <div className="card-body">
                    {message && (
                        <div className={`alert alert-${alertType} text-center`} role="alert">
                            {message}
                        </div>
                    )}
                    <form onSubmit={handleCreate}>
                        <div className="mb-3">
                            <label className="form-label">Name</label>
                            <input
                                type="text"
                                name="name"
                                className="form-control"
                                placeholder="Enter name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                placeholder="Enter email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                name="password"
                                className="form-control"
                                placeholder="Enter password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="form-label">Role</label>
                            <select
                                name="role"
                                className="form-select"
                                value={formData.role}
                                onChange={handleChange}
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
	</div>

                        {/* ✅ NEW FIELDS */}
                        <div className="mb-2">
                            <label className="form-label">Email Type</label>
                            <select
                                name="emailType"
                                className="form-select"
                                value={formData.emailType}
                                onChange={handleChange}
                            >

                                <option value="Google">Google</option>
                                <option value="Microsoft">Microsoft</option>
                            </select>
                        </div>


                        <div className="mb-2">
                            <label className="form-label">Sender Email</label>
                            <input
                                type="email"
                                name="senderEmail"
                                className="form-control"
                                placeholder="Sender's email address"
                                value={formData.senderEmail}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="mb-2">
                            <label className="form-label">Sender Password</label>
                            <input
                                type="password"
                                name="senderPassword"
                                className="form-control"
                                placeholder="Sender's email password"
                                value={formData.senderPassword}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="d-grid">
                            <button type="submit" className="btn btn-success">
                                Create User
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateUserForm;
