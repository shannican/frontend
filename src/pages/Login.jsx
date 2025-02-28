import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "./Login.css";
import hrImage from "../assets/hrdashboardimag.jpg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await API.post("/auth/login", { email, password });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      alert("Login Successful!");
      navigate("/candidates");
    } catch (error) {
      console.error("Login Error:", error);
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h1 className="logo-text">LOGO</h1>
      <div className="login-boxs">
        <div className="left-box">
          <div className="image-box">
            <img className="img" src={hrImage} alt="hrImage" />
          </div>
          <h3 className="text-h3">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit.
            Facilis,amet nobis adipisicing debitis laborum mollitia dolorem.
          </h3>
          <p className="text-p">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae,
            recusandae. Itaque voluptatum ipsa porro, mollitia natus non
            corporis ullam. Non maiores hic id optio corrupti aliquid impedit
            accusamus tempora officia..
          </p>
        </div>
        <div className="auth-cards">
          <h2 className="auth-titles">Welcome To Login Page</h2>
          {error && <p className="auth-errors">{error}</p>}
          <div className="forms">
            <form onSubmit={handleLogin} className="auth-form">
              <div className="input-groups">
                <label className="label" htmlFor="email">
                  Email*
                </label>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="auth-inputs"
                />
              </div>

              <div className="input-groups">
                <label className="label" htmlFor="password">
                  Password*
                </label>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="auth-inputs"
                />
                <label className="forgotpass-text" htmlFor="">
                  Forgot password?
                </label>
              </div>

              <button type="submit" disabled={loading} className="auth-buttons">
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          </div>

          <p className="register-text">
            Do Not have an Account? <a href="/register">Register Now</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
