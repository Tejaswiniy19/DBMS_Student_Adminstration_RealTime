import { useEffect, useState } from "react";
import api from "../../api/api";

export default function ScholarshipManagement() {

  const [scholarships,setScholarships] = useState([]);

  const [form,setForm] = useState({
    name:"",
    description:"",
    amount:"",
    eligibility:"",
    deadline:""
  });

  useEffect(()=>{
    loadScholarships();
  },[]);

  const loadScholarships = async()=>{
    const res = await api.get("/scholarships");
    setScholarships(res.data.scholarships);
  };

  const createScholarship = async()=>{

    await api.post("/scholarships",form);

    setForm({
      name:"",
      description:"",
      amount:"",
      eligibility:"",
      deadline:""
    });

    loadScholarships();
  };

  const deleteScholarship = async(id)=>{

    await api.delete(`/scholarships/${id}`);

    loadScholarships();
  };

  return (
    <div className="space-y-6">

      <h1 className="text-3xl font-bold">
        Scholarship Management
      </h1>

      <div className="grid gap-3">

        <input
          placeholder="Scholarship Name"
          value={form.name}
          onChange={(e)=>
            setForm({...form,name:e.target.value})
          }
        />

        <input
          placeholder="Amount"
          value={form.amount}
          onChange={(e)=>
            setForm({...form,amount:e.target.value})
          }
        />

        <input
          placeholder="Eligibility"
          value={form.eligibility}
          onChange={(e)=>
            setForm({...form,eligibility:e.target.value})
          }
        />

        <button
          onClick={createScholarship}
          className="bg-green-600 text-white p-2 rounded"
        >
          Create Scholarship
        </button>

      </div>

      {scholarships.map((item)=>(
        <div
          key={item.id}
          className="border p-4 rounded"
        >
          <h2>{item.name}</h2>

          <p>₹ {item.amount}</p>

          <button
            onClick={()=>
              deleteScholarship(item.id)
            }
            className="bg-red-600 text-white px-3 py-1 rounded"
          >
            Delete
          </button>
        </div>
      ))}

    </div>
  );
}