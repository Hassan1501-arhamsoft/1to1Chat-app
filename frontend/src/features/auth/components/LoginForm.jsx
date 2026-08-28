import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Input from "../../../components/Input/Input";
import Button from "../../../components/Button/Button";

import { loginUser } from "../services/auth.service";
import useAuth from "../hooks/useAuth";

import "../styles/LoginForm.css";

function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Separate state for the "Remember me" checkbox (optional integration)
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    // Preserve original formData logic
    if (name === "email" || name === "password") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else if (type === "checkbox" && name === "rememberMe") {
      // Logic for the new "Remember me" checkbox
      setRememberMe(checked);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);

      const response = await loginUser(formData);
      const result = response.data;
   
      if (result.requires2FA) {
        // User has 2FA ON -> Go to OTP page
        alert(result.message || "OTP sent to your email.");
        navigate("/verify-otp", { state: { email: formData.email } });
      } else {
        // User has 2FA OFF -> Log in immediately
        login(result.user, result.token);
        navigate("/dashboard");
      }

      
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message || "Login failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-card-container">
      {/* Header section with the chat icon and titles */}
      <div className="login-header">
        <div className="icon-container">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.477 2 2 6.03 2 11C2 13.565 3.208 15.88 5.148 17.472C5.025 18.337 4.542 19.68 3.32 20.916C3.121 21.118 3.197 21.455 3.473 21.536C5.46 22.122 7.373 21.493 8.528 20.73C9.626 21.054 10.79 21.222 12 21.222C17.523 21.222 22 17.192 22 12.222C22 7.253 17.523 2 12 2Z" fill="#4f46e5"/>
            <circle cx="8" cy="11" r="1.5" fill="white"/>
            <circle cx="12" cy="11" r="1.5" fill="white"/>
            <circle cx="16" cy="11" r="1.5" fill="white"/>
          </svg>
        </div>
        <h2>Welcome Back 👋</h2>
        <p>Login to continue to your account</p>
      </div>

      <form
        className="login-form"
        onSubmit={handleSubmit}
      >
        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          required
        />

        <Input
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          required
        />

        {/* New "Remember me" and "Forgot password" row */}
        <div className="form-extras-row">
          <label className="checkbox-container">
            <input
              type="checkbox"
              name="rememberMe"
              checked={rememberMe}
              onChange={handleChange}
            />
            Remember me
          </label>
          <a href="/forgot-password" className="forgot-password-link">
            Forgot password?
          </a>
        </div>

        <Button
          type="submit"
          loading={loading}
          className="login-btn"
        >
          Login
        </Button>

        <p className="auth-link">
          Don't have an account?{" "}
          <Link to="/signup">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}

export default LoginForm;