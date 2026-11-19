import { useEffect, useState } from "react";
import api, { errorText } from "../api";
import Message from "../components/Message";

function AdminPatients() {
  const [patients, setPatients] = useState([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  function load() {
    api.get("/api/patients/").then((res) => setPatients(res.data)).catch((err) => setError(errorText(err)));
  }

  useEffect(() => {
    load();
  }, []);

  async function toggle(patient) {
    setError("");
    setNotice("");
    try {
      await api.patch("/api/patients/" + patient.id + "/", { is_active: !patient.is_active });
      setNotice(patient.is_active ? "Account disabled." : "Account turned back on.");
      load();
    } catch (err) {
      setError(errorText(err));
    }
  }

  return (
    <main className="page">
      <h1>Patients</h1>
      <p>Disabling an account stops that person from logging in. Their old bookings stay on record.</p>
      <Message type="error" text={error} />
      <Message type="ok" text={notice} />
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => {
              const name = (patient.first_name + " " + patient.last_name).trim() || patient.username;
              return (
                <tr key={patient.id}>
                  <td>{name}</td>
                  <td>{patient.username}</td>
                  <td>{patient.email}</td>
                  <td>{patient.phone}</td>
                  <td>{patient.is_active ? "Active" : "Disabled"}</td>
                  <td>
                    <button className="btn secondary" type="button" onClick={() => toggle(patient)}>
                      {patient.is_active ? "Disable" : "Enable"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default AdminPatients;
