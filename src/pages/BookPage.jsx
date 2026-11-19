import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api, { errorText } from "../api";
import Message from "../components/Message";
import { prettyDate, shortTime } from "../helpers";

function BookPage() {
  const { doctorId } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selected, setSelected] = useState(null);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [busy, setBusy] = useState(false);

  function loadSlots() {
    return api
      .get("/api/slots/?doctor=" + doctorId + "&available=true")
      .then((res) => setSlots(res.data));
  }

  useEffect(() => {
    api
      .get("/api/doctors/" + doctorId + "/")
      .then((res) => setDoctor(res.data))
      .catch((err) => setError(errorText(err)));
    loadSlots().catch((err) => setError(errorText(err)));
  }, [doctorId]);

  async function book(e) {
    e.preventDefault();
    if (!selected) {
      setError("Pick a time first.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const res = await api.post("/api/appointments/", {
        slot: selected.id,
        reason: reason,
      });
      setConfirmation(res.data.confirmation_message);
      setSelected(null);
      setReason("");
      await loadSlots();
    } catch (err) {
      setError(errorText(err));
    } finally {
      setBusy(false);
    }
  }

  const groups = {};
  slots.forEach((slot) => {
    if (!groups[slot.date]) groups[slot.date] = [];
    groups[slot.date].push(slot);
  });

  return (
    <main className="page">
      <p><Link to="/doctors">Back to doctors</Link></p>
      <h1>{doctor ? doctor.full_name : "Book a time"}</h1>
      {doctor ? <p className="specialty">{doctor.specialty}</p> : null}
      <Message type="error" text={error} />
      {confirmation ? (
        <div className="card">
          <h2>Appointment confirmed</h2>
          <p>{confirmation}</p>
          <Link className="btn" to="/appointments">Go to my visits</Link>
        </div>
      ) : null}

      {Object.keys(groups).length === 0 ? <p>No open times for this doctor yet.</p> : null}

      {Object.keys(groups).map((date) => (
        <section className="day-block" key={date}>
          <h3>{prettyDate(date)}</h3>
          <div className="slots">
            {groups[date].map((slot) => (
              <button
                type="button"
                key={slot.id}
                className={selected && selected.id === slot.id ? "slot on" : "slot"}
                onClick={() => setSelected(slot)}
              >
                {shortTime(slot.start_time)} - {shortTime(slot.end_time)}
              </button>
            ))}
          </div>
        </section>
      ))}

      {selected ? (
        <form className="card" onSubmit={book}>
          <h3>
            {prettyDate(selected.date)} at {shortTime(selected.start_time)}
          </h3>
          <div className="field">
            <label htmlFor="reason">Reason for the visit (optional)</label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="For example: sore throat"
            />
          </div>
          <button className="btn" type="submit" disabled={busy}>
            {busy ? "Booking..." : "Confirm booking"}
          </button>
        </form>
      ) : null}
    </main>
  );
}

export default BookPage;
