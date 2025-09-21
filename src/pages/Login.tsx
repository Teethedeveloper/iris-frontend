import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store";
import { loginUser } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { token, loading, error } = useSelector((state: RootState) => state.auth);

  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(loginUser(form));
  };

  // Redirect if logged in
  useEffect(() => {
    if (token) navigate("/profile");
  }, [token, navigate]);

  return (
    <div className="container center-page">
      <div className="form-card">
        <h2 style={{ textAlign: "center", marginBottom: 24 }}>Login</h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
          {error && (
            <div className="ui-message error-message">{error}</div>
          )}
        </form>
        <button className="back-home-btn" onClick={() => window.location.href = "/"}>
          Back to Home
        </button>
      </div>
    </div>
  );
}

