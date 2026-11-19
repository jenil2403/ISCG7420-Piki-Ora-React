import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { errorText } from "../api";
import Message from "../components/Message";
import { prettyDate, shortTime } from "../helpers";

function AdminHome() {
  const [counts, setCounts] = useState({ doctors: 0, slots: 0, bookings: 0, patients: 0 });
  const [latest, setLatest] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      api.get("/api/doctors/"),
      api.get("/api/slots/"),
      api.get("/api/appointments/?status=booked"),
      api.get("/api/patients/"),
    ])
      .then(([doctors, slots, bookings, patients]) => {
        setCounts({
          doctors: doctors.data.length,
          slots: slots.data.length,
          bookings: bookings.data.length,
          patients: patients.data.length,
        });
        setLatest(bookings.data.slice(0, 5));
      })
      .catch((err) => setError(errorText(err)));
  }, []);

  return (
    <main className="page">
      <h1>Staff dashboard</h1>
      <p>Add doctors, open up appointment times, and look after bookings.</p>
      <Message type="error" text={error} />
      <section className="stats">
        <article className="card stat"><strong>{counts.doctors}</strong>Doctors</article>
        <article className="card stat"><strong>{counts.slots}</strong>Times</article>
        <article className="card stat"><strong>{counts.bookings}</strong>Booked visits</article>
        <article className="card stat"><strong>{counts.patients}</strong>Patients</article>
      </section>
      <div className="actions" style={{ marginBottom: 16 }}>
        <Link className="btn" to="/admin/doctors">Manage doctors</Link>
        <Link className="btn secondary" to="/admin/slots">Open a time</Link>
      </div>
      <h2>Latest bookings</h2>
      {latest.length === 0 ? <p>No booked visits yet.</p> : null}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Doctor</th>
              <th>When</th>
            </tr>
          </thead>
          <tbody>
            {latest.map((row) => (
              <tr key={row.id}>
                <td>{row.patient_name}</td>
                <td>{row.doctor_name}</td>
                <td>{prettyDate(row.date)} {shortTime(row.start_time)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default AdminHome;
