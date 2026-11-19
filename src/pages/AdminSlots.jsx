import { useEffect, useState } from "react";
import api, { errorText } from "../api";
import Message from "../components/Message";
import { prettyDate, shortTime } from "../helpers";

const empty = { doctor: "", date: "", start_time: "", end_time: "" };

function AdminSlots() {
  const [doctors, setDoctors] = useState([]);
  const [slots, setSlots] = useState([]);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  function load() {
    api.get("/api/doctors/").then((res) => {
      setDoctors(res.data);
      setForm((current) => ({
        ...current,
        doctor: current.doctor || (res.data[0] ? String(res.data[0].id) : ""),
      }));
    });
    api.get("/api/slots/").then((res) => setSlots(res.data)).catch((err) => setError(errorText(err)));
  }

  useEffect(() => {
    load();
  }, []);

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setNotice("");
    try {
      await api.post("/api/slots/", {
        doctor: Number(form.doctor),
        date: form.date,
        start_time: form.start_time,
        end_time: form.end_time,
      });
      setNotice("Time added.");
      setForm({ ...form, date: "", start_time: "", end_time: "" });
      load();
    } catch (err) {
      setError(errorText(err));
    }
  }

  async function remove(slot) {
    if (!window.confirm("Remove this time?")) return;
    setError("");
    try {
      await api.delete("/api/slots/" + slot.id + "/");
      setNotice("Time removed.");
      load();
    } catch (err) {
      setError(errorText(err));
    }
  }

  return (
    <main className="page">
      <h1>Appointment times</h1>
      <p>Add the times a doctor can see patients. A booked time cannot be removed until the visit is cancelled.</p>
      <Message type="error" text={error} />
      <Message type="ok" text={notice} />
      <form className="card row-form" onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="doctor">Doctor</label>
          <select id="doctor" name="doctor" value={form.doctor} onChange={onChange} required>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>{doctor.full_name}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="date">Date</label>
          <input id="date" name="date" type="date" value={form.date} onChange={onChange} required />
        </div>
        <div className="field">
          <label htmlFor="start_time">Start</label>
          <input id="start_time" name="start_time" type="time" value={form.start_time} onChange={onChange} required />
        </div>
        <div className="field">
          <label htmlFor="end_time">End</label>
          <input id="end_time" name="end_time" type="time" value={form.end_time} onChange={onChange} required />
        </div>
        <button className="btn" type="submit">Add time</button>
      </form>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Doctor</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {slots.map((slot) => (
              <tr key={slot.id}>
                <td>{slot.doctor_name}</td>
                <td>{prettyDate(slot.date)}</td>
                <td>{shortTime(slot.start_time)} - {shortTime(slot.end_time)}</td>
                <td>{slot.is_available ? "Free" : "Booked"}</td>
                <td>
                  <button className="btn danger" type="button" onClick={() => remove(slot)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default AdminSlots;
