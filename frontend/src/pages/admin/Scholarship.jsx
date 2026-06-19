import { useEffect, useState } from "react";
import api from "../../api/api";

export default function AdminScholarships() {

  const [applications,setApplications] =
    useState([]);

  useEffect(()=>{
    loadApplications();
  },[]);

  const loadApplications = async() => {

    const res =
      await api.get(
        "/scholarships/applications/all"
      );

    setApplications(
      res.data.applications
    );
  };

  const updateStatus = async(id,status) => {

    await api.put(
      `/scholarships/application/${id}`,
      {status}
    );

    loadApplications();
  };

  return (
    <div>

      <h1 className="text-3xl font-bold mb-6">
        Scholarship Applications
      </h1>

      <table className="w-full">

        <thead>
          <tr>
            <th>Student</th>
            <th>Scholarship</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>

          {applications.map((app)=>(
            <tr key={app.id}>

              <td>
                {app.student.fullName}
              </td>

              <td>
                {app.scholarship.name}
              </td>

              <td>
                {app.status}
              </td>

              <td>

                <button
                  onClick={() =>
                    updateStatus(
                      app.id,
                      "approved"
                    )
                  }
                  className="bg-green-600 text-white px-3 py-1 rounded mr-2"
                >
                  Approve
                </button>

                <button
                  onClick={() =>
                    updateStatus(
                      app.id,
                      "rejected"
                    )
                  }
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Reject
                </button>

              </td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
}