import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api, { errorText } from "../api";
import { useAuth } from "../AuthContext";
import Message from "../components/Message";
import { prettyDate, shortTime } from "../helpers";

function EditAppointmentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const backTo = user && user.role === "admin" ? "/admin/bookings" : "/appointments";
  const [visit, setVisit] = useState(null);
  const [choices, setChoices] = useState([]);
  const [slotId, setSlotId] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api
      .get("/api/appointments/" + id + "/")
      .then((res) => {
        const row = res.data;
        setVisit(row);
        setSlotId(String(row.slot));
        setReason(row.reason || "");
        return api.get("/api/slots/?doctor=" + row.doctor + "&available=true");
      })
      .then((res) => setChoices(res.data))
      .catch((err) => setError(errorText(err)));
  }, [id]);

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api.patch("/api/appointments/" + id + "/", {
        slot: Number(slotId),
        reason: reason,
      });
      navigate(backTo);
    } catch (err) {
      setError(errorText(err));
    } finally {
      setBusy(false);
    }
  }

  const currentInList = visit && choices.some((slot) => slot.id === visit.slot);

  return (
    <main className="page">
      <p><Link to={backTo}>Back</Link></p>
      <h1>Change visit</h1>
      <Message type="error" text={error} />
      {!visit ? <p className="muted">Loading...</p> : null}
      {visit && visit.status !== "booked" ? <p>This visit is already cancelled.</p> : null}
      {visit && visit.status === "booked" ? (
        <form className="card" onSubmit={onSubmit}>
          <p>
            {visit.doctor_name} · currently {prettyDate(visit.date)} at {shortTime(visit.start_time)}
          </p>
          <div className="field">
            <label htmlFor="slot">Time</label>
            <select id="slot" value={slotId} onChange={(e) => setSlotId(e.target.value)}>
              {!currentInList ? (
                <option value={visit.slot}>
                  {prettyDate(visit.date)} {shortTime(visit.start_time)} (current)
                </option>
              ) : null}
              {choices.map((slot) => (
                <option key={slot.id} value={slot.id}>
                  {prettyDate(slot.date)} {shortTime(slot.start_time)} - {shortTime(slot.end_time)}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="reason">Reason</label>
            <textarea id="reason" value={reason} onChange={(e) => setReason(e.target.value)} />
          </div>
          <button className="btn" type="submit" disabled={busy}>{busy ? "Saving..." : "Save changes"}</button>
        </form>
      ) : null}
    </main>
  );
}

export default EditAppointmentPage;
