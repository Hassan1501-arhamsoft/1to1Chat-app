import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import Input from "../../../components/Input/Input";
import Button from "../../../components/Button/Button";

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
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
    <div className="login-card-container">
      <div className="login-header">
        <h2>Create New Password ✨</h2>
        <p>Enter the code sent to {email}</p>
      </div>
      <form className="login-form" onSubmit={handleSubmit}>
        <Input
          label="6-Digit Reset Code"
          type="text"
          name="otp"
          maxLength="6"
          value={formData.otp}
          onChange={handleChange}
          placeholder="123456"
          required
        />
        <Input
          label="New Password"
          type="password"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          placeholder="Enter new password"
          required
        />
        <Button type="submit" loading={loading} className="login-btn">
          Save Password
        </Button>
      </form>
    </div>
  );
}

export default ResetPassword;