import { useState } from "react";
import { apiRequest } from "../api";

function Donate() {
  const [amount, setAmount] = useState("");

  const donate = async () => {
    const token = localStorage.getItem("token");

    const data = await apiRequest(
      "/donations",
      "POST",
      { amount },
      token
    );

    alert(data.message || "Donation created");
  };

  return (
    <div>
      <h2>Donate</h2>
      <input
        type="number"
        placeholder="Amount"
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={donate}>Donate</button>
    </div>
  );
}

export default Donate;
