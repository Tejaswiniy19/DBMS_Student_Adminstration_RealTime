import { useEffect, useState } from 'react';
import api from '../../api/api';
import {BarChart,Bar,XAxis,YAxis,Tooltip,ResponsiveContainer,PieChart,Pie,Cell} from 'recharts';
import {FaUserGraduate,FaClipboardList,FaClock,FaCheckCircle,FaTimesCircle,FaGraduationCap,FaTrophy,FaFilePdf} from "react-icons/fa";
const colors = [
  '#60A5FA',
  '#A78BFA',
  '#22D3EE',
  '#4ADE80',
  '#FBBF24',
  '#FB7185'
];

const DashboardChart = ({ data }) => {

  const chartData = data?.branches?.map(item => ({
    branch: item.branch,
    students: item._count
  })) || [];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <XAxis dataKey="branch" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="students" />
      </BarChart>
    </ResponsiveContainer>
  );
};


export default function AdminDashboard() {

  const [summary, setSummary] = useState(null);
  const [academicCertificates, setAcademicCertificates] = useState([]);
  const [sportsCertificates, setSportsCertificates] = useState([]);

  useEffect(() => {
    api.get("/admin/dashboard")
      .then((res) => {
        setSummary(res.data);
        setAcademicCertificates(res.data.academicCertificates);
        setSportsCertificates(res.data.sportsCertificates);
      })
      .catch(console.error);


  }, []);


return (
  <div
    className="min-h-screen bg-cover bg-center bg-no-repeat p-6"
    style={{
      backgroundImage: `
        linear-gradient(
          rgba(0,0,12,0.45),
          rgba(0,0,12,0.55)
        ),
        url('https://jntugv.edu.in/static/media/JNTU_PIC.ae61eebb7dc963f0dd30.png') `,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}
  >
    <div className="max-w-7xl mx-auto space-y-6">

    <div className="flex justify-end">
      <a
        href="http://localhost:5000/api/reports/students-csv"
        target="_blank"
        rel="noreferrer"
        className="
bg-gradient-to-r
from-blue-600
to-indigo-600
text-white
px-6
py-3
rounded-xl
font-semibold
shadow-lg
hover:scale-105
hover:shadow-xl
transition-all
duration-300">
<div className="flex items-center gap-2">
<FaFilePdf/>
<span>
Download Student Report CSV
</span>
</div>
      </a>
    </div>
      <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-5">
{[
{
label:"Total Students",
value:summary?.summary?.totalStudents || 0,
icon:<FaUserGraduate className="text-blue-600 text-3xl"/>,
},

{
label:"Applications Received",
value:summary?.summary?.applicationsReceived || 0,
icon:<FaClipboardList className="text-purple-600 text-3xl"/>,
},

{
label:"Pending Verification",
value:summary?.summary?.pendingVerification || 0,
icon:<FaClock className="text-yellow-500 text-3xl"/>,
},

{
label:"Approved",
value:summary?.summary?.approved || 0,
icon:<FaCheckCircle className="text-green-500 text-3xl"/>,
},

{
label:"Rejected",
value:summary?.summary?.rejected || 0,
icon:<FaTimesCircle className="text-red-500 text-3xl"/>,
},

].map(item=>(

<div key={item.label} className="
bg-white/90
    dark:bg-slate-900/90
    backdrop-blur-xl
    rounded-3xl
    p-6
    shadow-xl
    border
    border-white/40
    dark:border-slate-700
    hover:shadow-2xl
    hover:-translate-y-1
    transition-all
    duration-300
">

 <div className="flex justify-between items-center">

<div>

<p className="text-sm uppercase tracking-widest text-slate-600 dark:text-slate-300 ">

{item.label}

</p>

<p className="text-4xl font-bold mt-4 text-slate-600 dark:text-white">

{item.value}

</p>

</div>

<div>

{item.icon}

</div>

</div>
          </div>
        ))}
      </section>
      <section className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="bg-white/75
dark:bg-slate-900/85
backdrop-blur-md
rounded-3xl
p-6
shadow-xl
border
border-white/40
dark:border-slate-700">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Admissions by Branch</h2>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summary?.charts.branchDistribution || []}>
                <XAxis dataKey="branch" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Bar dataKey="count" fill="#2563EB" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="grid gap-6">
          <div className="card-glass p-6 rounded-3xl border-slate-200/70 dark:border-slate-700/70">
            <h2 className="text-xl font-semibold">Approval Rate</h2>
            <div className="mt-6
    rounded-3xl
    bg-gradient-to-r
    from-emerald-400/90
    to-light-green-500/90
    backdrop-blur-md
    p-6
    text-white
  ">
              <div className="text-5xl font-semibold text-slate-900 dark:text-slate-100">{summary?.summary.approvalRate || 0}%</div>
              <p className="mt-2 text-slate-500 dark:text-slate-400">Total approval performance for reviewed admissions.</p>
            </div>
          </div>
          <div className="bg-white/75
          dark:bg-slate-900/85
    backdrop-blur-md
    rounded-3xl
    p-6
    shadow-xl
    border
    border-white/40
    dark:border-slate-700">
            <h2 className="text-xl font-semibold">Category Distribution</h2>
            <div className="mt-6 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={summary?.charts.categoryDistribution || []} dataKey="count" nameKey="category" outerRadius={90} innerRadius={40} paddingAngle={4}>
                    {(summary?.charts.categoryDistribution || []).map((entry, index) => (
                      <Cell key={entry.category} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>
    </div>
    



<div className="flex items-center gap-2 mt-10 mb-6">
  <FaTrophy className="text-yellow-500" />
  <h2 className="text-2xl font-bold">
    Academic Certificates
  </h2>
</div>

<table className="w-full overflow-hidden rounded-2xl bg-white/80 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200
dark:border-slate-700 shadow-xl">

  <thead>
    <tr className="border-b border-slate-200 dark:border-slate-700">
      <th className="text-left p-4 text-slate-900 dark:text-white">Student</th>
      <th className="text-center p-4 text-slate-900 dark:text-white">Certificate</th>
    </tr>
  </thead>

  <tbody>

    {academicCertificates.length > 0 ? (

      academicCertificates.map((doc) => (

        <tr
          key={doc.id}
          className="border-b hover:bg-blue-50 transition"
        >

          <td className="p-4">

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 text-white font-bold flex items-center justify-center">

                {doc.student?.fullName?.charAt(0)}

              </div>

              <div>

                <p className="font-semibold text-slate-900 dark:text-white">
                  {doc.student?.fullName}
                </p>

                <p className="text-xs text-gray-500 dark:text-slate-400">
                  {doc.student?.email}
                </p>

              </div>

            </div>

          </td>

          <td className="text-center p-4">

            <a
              href={`http://localhost:5000${doc.filePath}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center w-10 h-10 rounded-xl border hover:bg-gray-100 transition"
            >

              <FaFilePdf className="text-red-600 text-xl" />

            </a>

          </td>

        </tr>

      ))

    ) : (

      <tr>

        <td
          colSpan="2"
          className="text-center py-8 text-slate-600
dark:text-slate-300
bg-white/40
dark:bg-slate-900/40"
        >
          No Academic Certificates Uploaded
        </td>

      </tr>

    )}

  </tbody>

</table>


<div className="flex items-center gap-2 mt-10 mb-6">
  <FaTrophy className="text-yellow-500" />
  <h2 className="text-2xl font-bold">
    Sports Certificates
  </h2>
</div>

<table className="w-full overflow-hidden rounded-2xl bg-white/80 dark:bg-slate-900/90 backdrop-blur-md border
border-slate-200
dark:border-slate-700
shadow-xl">

  <thead>
    <tr className="border-b">
      <th className="text-left p-4 text-slate-900 dark:text-white">Student</th>
      <th className="text-center p-4">Certificate</th>
    </tr>
  </thead>

  <tbody>

    {sportsCertificates.length > 0 ? (

      sportsCertificates.map((doc) => (

        <tr
          key={doc.id}
          className="border-b hover:bg-blue-50 transition"
        >

          <td className="p-4">

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 text-white font-bold flex items-center justify-center">

                {doc.student?.fullName?.charAt(0)}

              </div>

              <div>

                <p className="font-semibold">
                  {doc.student?.fullName}
                </p>

                <p className="text-xs text-gray-500">
                  {doc.student?.email}
                </p>

              </div>

            </div>

          </td>

          <td className="text-center p-4">

            <a
              href={`http://localhost:5000${doc.filePath}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center w-10 h-10 rounded-xl border hover:bg-gray-100 transition"
            >

              <FaFilePdf className="text-red-600 text-xl" />

            </a>

          </td>

        </tr>

      ))

    ) : (

      <tr>

        <td
          colSpan="2"
          className="text-center py-8 text-slate-600
dark:text-slate-300
bg-white/40
dark:bg-slate-900/40"
        >
          No Sports Certificates Uploaded
        </td>

      </tr>

    )}

  </tbody>

</table>



</div>
); }