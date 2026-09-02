import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import Input from "../../../components/Input/Input";
import Button from "../../../components/Button/Button";
import "../styles/PasswordReset.css";

function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ otp: "", newPassword: "" });

  const email = location.state?.email;

  if (!email) {
    navigate("/forgot-password");
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Strip non-numeric characters for the OTP field
    const updatedValue = name === "otp" ? value.replace(/\D/g, "") : value;
    setFormData({ ...formData, [name]: updatedValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await api.post("/auth/reset-password", {
        email,
        otp: formData.otp,
        newPassword: formData.newPassword,
      });
      alert(response.data.message);
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="password-reset-wrapper">
      <div className="password-reset-card">
        <div className="password-reset-header">
          <div className="icon-container">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 8H5V10H19V8ZM19 14H5V16H19V14ZM12 22L12 11L16 11L12 5L8 11L12 11L12 22Z" fill="#4f46e5"/>
            </svg>
          </div>
          <h2>Create New Password ✨</h2>
          <p>Enter the code sent to <strong>{email}</strong></p>
        </div>
        <form className="password-reset-form" onSubmit={handleSubmit}>
          <div className="otp-input-container">
            <Input
              label="6-Digit Reset Code"
              type="text"
              name="otp"
              maxLength="6"
              value={formData.otp}
              onChange={handleChange}
              placeholder="• • • • • •"
              required
            />
          </div>
          <Input
            label="New Password"
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="Enter new password"
            required
          />
          <Button type="submit" loading={loading} className="reset-btn">
            Save Password
          </Button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;