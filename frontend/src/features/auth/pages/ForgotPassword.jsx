import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import Input from "../../../components/Input/Input";
import Button from "../../../components/Button/Button";
import "../styles/PasswordReset.css";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await api.post("/auth/forgot-password", { email });
      alert(response.data.message);
      navigate("/reset-password", { state: { email } });
    } catch (error) {
      alert(error.response?.data?.message || "Failed to send reset code.");
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
              <path d="M12 2C9.243 2 7 4.243 7 7V10H6C4.897 10 4 10.897 4 12V20C4 21.103 4.897 22 6 22H18C19.103 22 20 21.103 20 20V12C20 10.897 19.103 10 18 10H17V7C17 4.243 14.757 2 12 2ZM9 7C9 5.346 10.346 4 12 4C13.654 4 15 5.346 15 7V10H9V7ZM12 18C10.895 18 10 17.105 10 16C10 14.895 10.895 14 12 14C13.105 14 14 14.895 14 16C14 17.105 13.105 18 12 18Z" fill="#4f46e5"/>
            </svg>
          </div>
          <h2>Reset Password 🔒</h2>
          <p>Enter your email to receive a 6-digit reset code.</p>
        </div>
        <form className="password-reset-form" onSubmit={handleSubmit}>
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
          <Button type="submit" loading={loading} className="reset-btn">
            Send Reset Code
          </Button>
          <p className="reset-auth-link">
            Remembered your password? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;