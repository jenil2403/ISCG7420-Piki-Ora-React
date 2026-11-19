import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { errorText } from "../api";
import { useAuth } from "../AuthContext";
import Message from "../components/Message";

const empty = {
  first_name: "",
  last_name: "",
  username: "",
  email: "",
  phone: "",
  password: "",
  confirm: "",
};

function RegisterPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) {
      setError("The two passwords do not match.");
      return;
    }
    setBusy(true);
    try {
      const res = await api.post("/api/register/", {
        first_name: form.first_name,
        last_name: form.last_name,
        username: form.username,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });
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
        <h1>Create an account</h1>
        <p>Patients use this form. Staff accounts are already set up at the clinic.</p>
      </section>
      <section className="auth-form">
        <form onSubmit={onSubmit}>
          <h2>Register</h2>
          <Message type="error" text={error} />
          <div className="field">
            <label htmlFor="first_name">First name</label>
            <input id="first_name" name="first_name" value={form.first_name} onChange={onChange} required />
          </div>
          <div className="field">
            <label htmlFor="last_name">Last name</label>
            <input id="last_name" name="last_name" value={form.last_name} onChange={onChange} required />
          </div>
          <div className="field">
            <label htmlFor="username">Username</label>
            <input id="username" name="username" value={form.username} onChange={onChange} required />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" value={form.email} onChange={onChange} required />
          </div>
          <div className="field">
            <label htmlFor="phone">Phone</label>
            <input id="phone" name="phone" value={form.phone} onChange={onChange} />
          </div>
          <div className="field">
            <label htmlFor="password">Password (at least 8 characters)</label>
            <input id="password" name="password" type="password" value={form.password} onChange={onChange} required />
          </div>
          <div className="field">
            <label htmlFor="confirm">Confirm password</label>
            <input id="confirm" name="confirm" type="password" value={form.confirm} onChange={onChange} required />
          </div>
          <button className="btn" type="submit" disabled={busy}>{busy ? "Creating..." : "Create account"}</button>
          <p>Already registered? <Link to="/login">Log in</Link></p>
        </form>
      </section>
    </div>
  );
}

export default RegisterPage;
