import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { errorText } from "../api";
import { useAuth } from "../AuthContext";
import Message from "../components/Message";
import { prettyDate, shortTime } from "../helpers";

function HomePage() {
  const { user } = useAuth();
  const [nextVisit, setNextVisit] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/api/appointments/?status=booked")
      .then((res) => setNextVisit(res.data[0] || null))
      .catch((err) => setError(errorText(err)));
  }, []);

  const name = user.first_name || user.username;

  return (
    <main className="page">
      <h1>Kia ora, {name}</h1>
      <p>Book a time with one of our doctors, or check the visits you already have.</p>
      <Message type="error" text={error} />
      {nextVisit ? (
        <article className="card">
          <p className="muted">Your next visit</p>
          <h2>{nextVisit.doctor_name}</h2>
          <p>
            {prettyDate(nextVisit.date)} at {shortTime(nextVisit.start_time)}
            {nextVisit.reason ? " · " + nextVisit.reason : ""}
          </p>
          <p>{nextVisit.confirmation_message}</p>
          <Link className="btn secondary" to="/appointments">See all visits</Link>
        </article>
      ) : (
        <article className="card">
          <h2>No visit booked yet</h2>
          <p>Have a look at the doctors and pick an open time.</p>
          <Link className="btn" to="/doctors">View doctors</Link>
        </article>
      )}
    </main>
  );
}

export default HomePage;
