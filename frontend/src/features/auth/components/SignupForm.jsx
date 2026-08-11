import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../../components/Input/Input";
import Button from "../../../components/Button/Button";
import { registerUser } from "../services/auth.service";
import useAuth from "../hooks/useAuth";
import "../styles/SignupForm.css";

function SignupForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
 

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);

  


      const response = await registerUser(formData);

      login(
        response.data.user,
        response.data.token
      );

      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.message || "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="signup-form"
      onSubmit={handleSubmit}
    >
      

      <Input
        label="Full Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Enter your full name"
        required
      />

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

      <Button
        type="submit"
        loading={loading}
      >
        Create Account
      </Button>

      <p className="auth-link">
        Already have an account?{" "}
        <Link to="/login">Login</Link>
      </p>
    </form>
  );
}

export default SignupForm;