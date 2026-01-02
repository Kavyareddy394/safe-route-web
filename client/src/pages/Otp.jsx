import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Otp.css";

export default function Otp() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const verifyOtp = async () => {
    const signupData = JSON.parse(sessionStorage.getItem("signupData"));

    if (!signupData) {
      alert("Signup data missing. Please signup again.");
      navigate("/");
      return;
    }

    if (!otp) {
      alert("OTP required");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/signup", {
        ...signupData,
        identifier: signupData.email,
        otp,
      });

      sessionStorage.removeItem("signupData");

      alert("Signup successful. Please login.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
    <div className="auth-container">
      <h2>Enter OTP</h2>

      <input
        placeholder="4-digit OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />

      <button onClick={verifyOtp} disabled={loading}>
        {loading ? "Verifying..." : "Verify OTP"}
      </button>
    </div>
    </div>
  );
}
