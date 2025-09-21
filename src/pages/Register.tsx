import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

interface RegisterForm {
  fullName: string;
  phone: string;
  email: string;
  password: string;
  company: string;
  isAgency: "yes" | "no";
}

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterForm>({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    company: "",
    isAgency: "no",
  });
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setMessage(null);
  };

  const saveSessionAndRedirect = (token: string, user: unknown) => {
    // Save token + user and set axios header
    localStorage.setItem("token", token);
    try {
      localStorage.setItem("user", JSON.stringify(user));
    } catch {
      // ignore stringify error
    }
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    navigate("/profile");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!form.fullName || !form.phone || !form.email || !form.password) {
      setMessage("❌ Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // Try registering
      const res = await api.post("/auth/register", form);

      // If backend returns token & user on register, use it directly:
      const data = res.data as Record<string, unknown>;
      if (data?.token && data?.user) {
        saveSessionAndRedirect(data.token as string, data.user);
        return;
      }

      // Otherwise, fallback to logging in immediately (some backends don't return token on register)
      try {
        const loginRes = await api.post("/auth/login", { email: form.email, password: form.password });
        const loginData = loginRes.data as { token?: string; user?: unknown };
        if (loginData?.token && loginData?.user) {
          saveSessionAndRedirect(loginData.token, loginData.user);
          return;
        } else {
          setMessage("✅ Registered — please log in (server did not return a token automatically).");
          setTimeout(() => navigate("/login"), 1500);
        }
      } catch (loginErr: unknown) {
        // If login fallback fails, show a message but registration succeeded
        if (loginErr instanceof Error) {
          setMessage(`✅ Registered but auto-login failed: ${loginErr.message}. Please login.`);
        } else {
          setMessage("✅ Registered but auto-login failed. Please login.");
        }
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (err: unknown) {
      // Nicely handle axios / JS errors without using `any`
      let msg = "❌ Something went wrong";
      if (typeof err === "object" && err !== null && "response" in err) {
        msg = (err as { response?: { data?: { message?: string } } }).response?.data?.message || msg;
      } else if (err instanceof Error) {
        msg = "❌ " + err.message;
      }
      setMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 400, background: "#fff", borderRadius: 16, boxShadow: "0 2px 16px #0001", padding: 32 }}>
        <h2 style={{ textAlign: "center", marginBottom: 24 }}>Create Account</h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <input name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} required style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }} />
          <input name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} required style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }} />
          <input type="email" name="email" placeholder="Email Address" value={form.email} onChange={handleChange} required style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }} />
          <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }} />
          <input name="company" placeholder="Company Name" value={form.company} onChange={handleChange} style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }} />

          <div style={{ marginBottom: "5px" }}>
            <label>Are you an agency?</label><br />
            <label>
              <input type="radio" name="isAgency" value="yes" onChange={handleChange} checked={form.isAgency === "yes"} /> Yes
            </label>
            <label style={{ marginLeft: "10px" }}>
              <input type="radio" name="isAgency" value="no" onChange={handleChange} checked={form.isAgency === "no"} /> No
            </label>
          </div>
          <button type="submit" disabled={loading} style={{ padding: 12, borderRadius: 8, background: "#6c63ff", color: "#fff", border: "none", fontWeight: 600 }}>
            {loading ? "Creating..." : "Create Account"}
          </button>
          <button className="back-home-btn" onClick={() => navigate("/")} >
            Back to Home
          </button>
          {message && (
            <div style={{
              background: message.startsWith("✅") ? "#e6ffed" : "#ffe6e6",
              color: message.startsWith("✅") ? "#2e7d32" : "#d32f2f",
              borderRadius: 8,
              padding: "10px 16px",
              textAlign: "center",
              marginTop: 8,
              fontWeight: 500,
              boxShadow: "0 1px 4px #0001"
            }}>{message}</div>
          )}
        </form>
      </div>
    </div>
  );
}

