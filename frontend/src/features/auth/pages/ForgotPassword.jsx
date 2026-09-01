import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import Input from "../../../components/Input/Input";
import Button from "../../../components/Button/Button";

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
    <div className="login-card-container">
      <div className="login-header">
        <h2>Reset Password 🔒</h2>
        <p>Enter your email to receive a 6-digit reset code.</p>
      </div>
      <form className="login-form" onSubmit={handleSubmit}>
        <Input
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
        <Button type="submit" loading={loading} className="login-btn">
          Send Reset Code
        </Button>
        <p className="auth-link">
          Remembered your password? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default ForgotPassword;