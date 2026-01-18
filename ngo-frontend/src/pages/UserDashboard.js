import { useEffect, useState } from "react";
import api from "../services/api";

export default function UserDashboard() {
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    api.get("/donations/my").then((res) => setDonations(res.data));
  }, []);

  return (
    <div>
      <h2>User Dashboard</h2>
      {donations.map((d) => (
        <p key={d.id}>
          ₹{d.amount} - {d.status}
        </p>
      ))}
    </div>
  );
}
