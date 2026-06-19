import { useEffect, useState } from "react";
import api from "../../api/api";

export default function Scholarships() {

  const [scholarships,setScholarships] = useState([]);

  useEffect(() => {
    api.get("/scholarships")
      .then(res => setScholarships(res.data.scholarships))
      .catch(console.error);
  }, []);

  const applyScholarship = async(id) => {

    const studentId =
      localStorage.getItem("studentId");

    await api.post("/scholarships/apply",{
      studentId,
      scholarshipId:id
    });

    alert("Applied Successfully");
  };

  return (
    <div className="space-y-6">

      <h1 className="text-3xl font-bold">
        Scholarships
      </h1>

      {scholarships.map((s)=>(
        <div
          key={s.id}
          className="card-glass p-6 rounded-3xl"
        >
          <h2 className="text-xl font-bold">
            {s.name}
          </h2>

          <p>{s.description}</p>

          <p className="mt-2">
            Amount: ₹{s.amount}
          </p>

          <button
            onClick={()=>applyScholarship(s.id)}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
          >
            Apply
          </button>
        </div>
      ))}

    </div>
  );
}