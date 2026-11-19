import { useEffect, useState } from "react";
import api, { errorText } from "../api";
import DoctorCard from "../components/DoctorCard";
import Message from "../components/Message";

function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/doctors/")
      .then((res) => setDoctors(res.data))
      .catch((err) => setError(errorText(err)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="page">
      <h1>Doctors</h1>
      <p>Choose a doctor to see the times that are still free.</p>
      <Message type="error" text={error} />
      {loading ? <p className="muted">Loading doctors...</p> : null}
      {!loading && doctors.length === 0 ? <p>No doctors are listed right now.</p> : null}
      <div className="cards">
        {doctors.map((doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} />
        ))}
      </div>
    </main>
  );
}

export default DoctorsPage;
