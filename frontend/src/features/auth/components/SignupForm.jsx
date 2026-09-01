import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import Input from "../../../components/Input/Input";
import Button from "../../../components/Button/Button";
import { registerUser } from "../services/auth.service";
import "../styles/SignupForm.css";

function SignupForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // NEW: State to hold the token generated when the user clicks "I'm not a robot"
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const recaptchaRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token); // Save the token when verified
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Guard block: Ensure they clicked the checkbox
    if (!recaptchaToken) {
      alert("Please complete the reCAPTCHA to prove you are human.");
      return;
    }

    try {
      setLoading(true);

      // Send the token to the backend along with the user data
      const payload = { ...formData, recaptchaToken };
      const response = await registerUser(payload);
      
      alert(response.data?.message || "Registration successful.");
      navigate("/verify-otp", { state: { email: formData.email } });
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Registration failed.");
      
      // Reset reCAPTCHA on failure so they can try again
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
        setRecaptchaToken(null);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-header">
        <div className="icon-container">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.477 2 2 6.03 2 11C2 13.565 3.208 15.88 5.148 17.472C5.025 18.337 4.542 19.68 3.32 20.916C3.121 21.118 3.197 21.455 3.473 21.536C5.46 22.122 7.373 21.493 8.528 20.73C9.626 21.054 10.79 21.222 12 21.222C17.523 21.222 22 17.192 22 12.222C22 7.253 17.523 2 12 2Z" fill="#4f46e5"/>
            <circle cx="8" cy="11" r="1.5" fill="white"/>
            <circle cx="12" cy="11" r="1.5" fill="white"/>
            <circle cx="16" cy="11" r="1.5" fill="white"/>
          </svg>
        </div>
        <h2>Create Account 🚀</h2>
        <p>Join and start chatting with friends</p>
      </div>

      <form className="signup-form" onSubmit={handleSubmit}>
        <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your full name" required />
        <Input label="Email" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" required />
        <Input label="Password" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Create a password" required />

        
        <div className="recaptcha-wrapper">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY} 
            onChange={handleRecaptchaChange}
          />
        </div>

        <Button type="submit" loading={loading} className="signup-btn">Sign Up</Button>
        <p className="auth-link">Already have an account? <Link to="/login">Login</Link></p>
      </form>
    </div>
  );
}

export default SignupForm;