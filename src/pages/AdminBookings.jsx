import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { errorText } from "../api";
import Message from "../components/Message";
import { prettyDate, shortTime } from "../helpers";

function AdminBookings() {
  const [status, setStatus] = useState("booked");
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  function load(nextStatus) {
    const query = nextStatus ? "?status=" + nextStatus : "";
    api
      .get("/api/appointments/" + query)
      .then((res) => setRows(res.data))
      .catch((err) => setError(errorText(err)));
  }

  useEffect(() => {
    load(status);
  }, [status]);

  async function cancelVisit(id) {
    if (!window.confirm("Cancel this patient's visit?")) return;
    setError("");
    try {
      await api.post("/api/appointments/" + id + "/cancel/");
      setNotice("Booking cancelled.");
      load(status);
    } catch (err) {
      setError(errorText(err));
    }
  }

  return (
    <main className="page">
      <div className="page-head">
        <h1>All bookings</h1>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="booked">Booked</option>
          <option value="cancelled">Cancelled</option>
          <option value="">All</option>
        </select>
      </div>
      <Message type="error" text={error} />
      <Message type="ok" text={notice} />
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Doctor</th>
              <th>When</th>
              <th>Reason</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.patient_name}</td>
                <td>{row.doctor_name}</td>
                <td>{prettyDate(row.date)} {shortTime(row.start_time)}</td>
                <td>{row.reason}</td>
                <td>{row.status}</td>
                <td className="actions">
                  {row.status === "booked" ? (
                    <>
                      <Link className="btn secondary" to={"/appointments/" + row.id + "/edit"}>Edit</Link>
                      <button className="btn danger" type="button" onClick={() => cancelVisit(row.id)}>Cancel</button>
                    </>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length === 0 ? <p>Nothing in this list.</p> : null}
    </main>
  );
}

export default AdminBookings;
