import { Link } from "react-router-dom";
import "../styles/main.scss";

export default function Welcome() {
  return (
    <div className="container">
      <h1>Welcome to Iris 🌸</h1>
      <p>Please login or create an account to continue.</p>
      <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
        <Link to="/login">
          <button style={{ background: "#44C9D1" }}>Login</button>
        </Link>
        <Link to="/register">
          <button style={{ background: "#44C9D1" }}>Create Account</button>
        </Link>
      </div>
    </div>
  );
}
