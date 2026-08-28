import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import useAuth from "../hooks/useAuth";
import Input from "../../../components/Input/Input";
import Button from "../../../components/Button/Button";

function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const email = location.state?.email;

  // Kick them back to login if they bypassed the flow
  if (!email) {
    navigate("/login");
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await api.post("/auth/verify-otp", { email, otp });

      login(response.data.data.user, response.data.data.token);
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-card-container">
      <div className="login-header">
        <h2>Enter OTP 🔐</h2>
        <p>We sent a 6-digit code to {email}</p>
      </div>
      <form className="login-form" onSubmit={handleSubmit}>
        <Input
          label="One-Time Password"
          type="text"
          maxLength="6"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="123456"
          required
        />
        <Button type="submit" loading={loading} className="login-btn">
          Verify & Login
        </Button>
      </form>
    </div>
  );
}

export default VerifyOtp;