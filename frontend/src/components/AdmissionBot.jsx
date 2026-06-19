import { useState } from "react";

export default function AdmissionBot() {

  const [question,setQuestion] = useState("");
  const [answer,setAnswer] = useState("");

  const askBot = () => {

    const q = question.toLowerCase();

    if(q.includes("documents"))
      setAnswer("Upload Aadhaar, SSC, Intermediate and Income Certificate");

    else if(q.includes("scholarship"))
      setAnswer("Visit Scholarship section and click Apply");

    else if(q.includes("status"))
      setAnswer("Check Application Status card on dashboard");

    else
      setAnswer("Please contact admission office");
  };

  return (
    <div className="p-6 border rounded">

      <h2 className="font-bold">
        AI Admission Assistant
      </h2>

      <input
        className="border p-2 w-full mt-3"
        value={question}
        onChange={(e)=>
          setQuestion(e.target.value)
        }
      />

      <button
        onClick={askBot}
        className="bg-blue-600 text-white px-4 py-2 mt-3 rounded"
      >
        Ask
      </button>

      <p className="mt-4">
        {answer}
      </p>

    </div>
  );
}