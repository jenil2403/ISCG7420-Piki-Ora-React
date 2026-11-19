import { Link } from "react-router-dom";

function DoctorCard({ doctor }) {
  return (
    <article className="card">
      <h3>{doctor.full_name}</h3>
      <p className="specialty">{doctor.specialty}</p>
      <p className="muted">{doctor.room || "Clinic room"}</p>
      {doctor.bio ? <p>{doctor.bio}</p> : null}
      <Link className="btn" to={"/book/" + doctor.id}>See times</Link>
    </article>
  );
}

export default DoctorCard;
