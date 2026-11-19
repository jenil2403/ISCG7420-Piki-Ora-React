import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { errorText } from "../api";
import Message from "../components/Message";
import { prettyDate, shortTime } from "../helpers";

function AppointmentsPage() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  function load() {
    api
      .get("/api/appointments/")
      .then((res) => setRows(res.data))
      .catch((err) => setError(errorText(err)));
  }

  useEffect(() => {
    load();
  }, []);

  async function cancelVisit(id) {
    if (!window.confirm("Cancel this visit?")) return;
    setError("");
    setNotice("");
    try {
      await api.post("/api/appointments/" + id + "/cancel/");
      setNotice("The visit has been cancelled. That time is free for someone else.");
      load();
    } catch (err) {
      setError(errorText(err));
    }
  }

  return (
    <main className="page">
      <h1>My visits</h1>
      <Message type="error" text={error} />
      <Message type="ok" text={notice} />
      {rows.length === 0 ? <p>You do not have any visits yet. <Link to="/doctors">Book one</Link>.</p> : null}
      <div className="cards">
        {rows.map((row) => (
          <article className="card" key={row.id}>
            <p className={row.status === "booked" ? "tag" : "tag off"}>{row.status}</p>
            <h3>{row.doctor_name}</h3>
            <p>
              {prettyDate(row.date)} · {shortTime(row.start_time)} - {shortTime(row.end_time)}
            </p>
            {row.reason ? <p>Reason: {row.reason}</p> : null}
            <p>{row.confirmation_message}</p>
            {row.status === "booked" ? (
              <div className="actions">
                <Link className="btn secondary" to={"/appointments/" + row.id + "/edit"}>Edit</Link>
                <button className="btn danger" type="button" onClick={() => cancelVisit(row.id)}>Cancel</button>
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </main>
  );
}

export default AppointmentsPage;
