import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { errorText } from "../api";
import { useAuth } from "../AuthContext";
import Message from "../components/Message";

function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) {
      navigate(user.role === "admin" ? "/admin" : "/");
    }
  }, [user, navigate]);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await api.post("/api/login/", { username, password });
      login(res.data.token, res.data.user);
    } catch (err) {
      setError(errorText(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-wrap">
      <section className="auth-side">
        <h1>Piki Ora</h1>
        <p>Book a visit with a doctor at the medical centre.</p>
        <ul>
          <li>See which doctors are in</li>
          <li>Pick a free time</li>
          <li>Check, change or cancel your visit</li>
        </ul>
      </section>
      <section className="auth-form">
        <form onSubmit={onSubmit}>
          <h2>Log in</h2>
          <Message type="error" text={error} />
          <div className="field">
            <label htmlFor="username">Username</label>
            <input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button className="btn" type="submit" disabled={busy}>{busy ? "Logging in..." : "Log in"}</button>
          <p>New patient? <Link to="/register">Create an account</Link></p>
        </form>
      </section>
    </div>
  );
}

export default LoginPage;
