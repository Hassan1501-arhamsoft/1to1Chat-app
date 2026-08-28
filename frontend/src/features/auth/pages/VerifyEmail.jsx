import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../../api/axios";

function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState("verifying");
  
  // Use a ref to track if we have already made the API call
  const hasFetched = useRef(false);

  useEffect(() => {
    // If we already fired the request, stop here (prevents Strict Mode double-fire)
    if (hasFetched.current) return;
    hasFetched.current = true;

    const verifyUserEmail = async () => {
      try {
        await api.get(`/auth/verify-email/${token}`);
        setStatus("success");
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        setStatus("failed");
      }
    };
    
    if (token) {
        verifyUserEmail();
    }
  }, [token]);

  if (status === "verifying") return <p>Verifying your email...</p>;
  
  if (status === "failed") return (
    <div>
      <p style={{ color: "red" }}>Verification failed or token expired.</p>
      <p>If you already verified your account, you can simply log in.</p>
      <Link to="/login">Go to Login</Link>
    </div>
  );

  return (
    <div>
      <h2>Email Verified! ✅</h2>
      <p>Your account is now active.</p>
      
    </div>
  );
}

export default VerifyEmail;