import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Signup.css";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const sendOtp = async () => {
    if (!form.name || !form.email || !form.password) {
      alert("All fields are required");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/send-otp", {
        email: form.email,
      });

      // store signup data temporarily
      sessionStorage.setItem("signupData", JSON.stringify(form));

      navigate("/otp");
    } catch (err) {
        console.log("FULL ERROR:", err);
        alert(JSON.stringify(err.response?.data || err.message));

    } finally { 
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
    <div className="auth-container">
      <h2>Signup</h2>
      <form autoComplete="off">
      <input
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <input
        placeholder="Email"
        autoComplete="username"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <input
        type="password"
        autoComplete="new-password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      </form>

      <button onClick={sendOtp} disabled={loading}>
        {loading ? "Sending OTP..." : "Send OTP"}
      </button>

      <p onClick={() => navigate("/login")} className="link">
        Already have an account? Login
      </p>
    </div>
    </div>
  );
}
