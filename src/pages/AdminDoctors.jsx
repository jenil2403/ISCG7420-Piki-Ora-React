import { useEffect, useState } from "react";
import api, { errorText } from "../api";
import Message from "../components/Message";

const empty = {
  full_name: "",
  specialty: "",
  email: "",
  phone: "",
  room: "",
  bio: "",
  is_active: true,
};

function AdminDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  function load() {
    api.get("/api/doctors/").then((res) => setDoctors(res.data)).catch((err) => setError(errorText(err)));
  }

  useEffect(() => {
    load();
  }, []);

  function onChange(e) {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  }

  function startEdit(doctor) {
    setEditingId(doctor.id);
    setForm({
      full_name: doctor.full_name,
      specialty: doctor.specialty,
      email: doctor.email,
      phone: doctor.phone || "",
      room: doctor.room || "",
      bio: doctor.bio || "",
      is_active: doctor.is_active,
    });
    window.scrollTo(0, 0);
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setNotice("");
    try {
      if (editingId) {
        await api.put("/api/doctors/" + editingId + "/", form);
        setNotice("Doctor updated.");
      } else {
        await api.post("/api/doctors/", form);
        setNotice("Doctor added.");
      }
      setForm(empty);
      setEditingId(null);
      load();
    } catch (err) {
      setError(errorText(err));
    }
  }

  async function remove(doctor) {
    if (!window.confirm("Remove " + doctor.full_name + "?")) return;
    setError("");
    try {
      await api.delete("/api/doctors/" + doctor.id + "/");
      setNotice("Doctor removed.");
      load();
    } catch (err) {
      setError(errorText(err));
    }
  }

  return (
    <main className="page">
      <h1>Doctors</h1>
      <Message type="error" text={error} />
      <Message type="ok" text={notice} />
      <form className="card" onSubmit={onSubmit}>
        <h2>{editingId ? "Edit doctor" : "Add a doctor"}</h2>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="full_name">Name</label>
            <input id="full_name" name="full_name" value={form.full_name} onChange={onChange} required />
          </div>
          <div className="field">
            <label htmlFor="specialty">Specialty</label>
            <input id="specialty" name="specialty" value={form.specialty} onChange={onChange} required />
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
            <label htmlFor="room">Room</label>
            <input id="room" name="room" value={form.room} onChange={onChange} />
          </div>
          <div className="field check">
            <input id="is_active" name="is_active" type="checkbox" checked={form.is_active} onChange={onChange} />
            <label htmlFor="is_active">Show on the booking page</label>
          </div>
          <div className="field span-2">
            <label htmlFor="bio">Short note</label>
            <textarea id="bio" name="bio" value={form.bio} onChange={onChange} />
          </div>
        </div>
        <div className="actions">
          <button className="btn" type="submit">{editingId ? "Save doctor" : "Add doctor"}</button>
          {editingId ? (
            <button
              className="btn secondary"
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm(empty);
              }}
            >
              Cancel edit
            </button>
          ) : null}
        </div>
      </form>

      <div className="table-wrap" style={{ marginTop: 16 }}>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Specialty</th>
              <th>Room</th>
              <th>Shown</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor) => (
              <tr key={doctor.id}>
                <td>{doctor.full_name}</td>
                <td>{doctor.specialty}</td>
                <td>{doctor.room}</td>
                <td>{doctor.is_active ? "Yes" : "No"}</td>
                <td className="actions">
                  <button className="btn secondary" type="button" onClick={() => startEdit(doctor)}>Edit</button>
                  <button className="btn danger" type="button" onClick={() => remove(doctor)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default AdminDoctors;
