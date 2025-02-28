import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "./Register.css";
import hrImage from "../assets/hrdashboardimag.jpg";


const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!name || !email || !password) {
      setError("All fields are required!");
      setLoading(false);
      return;
    }

    try {
      await API.post("/auth/register", { name, email, password });
      alert("Registration Successful! Redirecting to login...");
      navigate("/");
    } catch (error) {
      console.error("Registration Error:", error);
      setError("Registration Failed. Email may already be in use.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h1 className="logo-text">LOGO</h1>
      <div className="register-card">
        <div className="register-info">
          <div className="image-box">
            <img className="img" src={hrImage} alt="hrImage" />
          </div>
          <h2>Lorem ipsum dolor sit amet</h2>
          <p>
            Tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
            veniam.
          </p>
          <div className="dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <div className="register-form">
          <h2 className="auth-title">Welcome to Dashboard</h2>
          {error && <p className="error">{error}</p>}
          <div className="register-form-input">
            <form onSubmit={handleRegister}>
              <div className="input-group">
                <label className="label">Full Name</label>
                <input
                  className="auth-input"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label className="label">Email Address</label>
                <input
                  type="email"
                  className="auth-input"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label className="label">Password</label>
                <input
                  type="password"
                  className="auth-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label className="label" htmlFor="confirmPassword">
                  Confirm Password*
                </label>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="auth-input"
                />
              </div>

              <button type="submit" disabled={loading}>
                {loading ? "Registering..." : "Register"}
              </button>
            </form>
          </div>

          <p className="login-text">
            Already have an account? <a href="/login">Login</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
