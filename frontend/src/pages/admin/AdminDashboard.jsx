import { useEffect, useState } from 'react';
import api from '../../api/api';
import {BarChart,Bar,XAxis,YAxis,Tooltip,ResponsiveContainer,PieChart,Pie,Cell} from "recharts";
const colors = ['#2563EB', '#7C3AED', '#06B6D4', '#22C55E', '#F59E0B', '#EF4444'];

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

  useEffect(() => {
  api.get('/admin/dashboard')
    .then((res) => {
      console.log("DASHBOARD RESPONSE:");
      console.log(res.data);
      setSummary(res.data);
    })
    .catch((err) => {
      console.log("DASHBOARD ERROR:");
      console.log(err);
    });
}, []);

return (
  <div className="space-y-6">

    <div className="flex justify-end">
      <a
        href="http://localhost:4000/api/reports/students-csv"
        target="_blank"
        rel="noreferrer"
        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        Download Student Report CSV
      </a>
    </div>
      <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-5">
        {[
          { label: 'Total Students', value: summary?.summary.totalStudents || 0 },
          { label: 'Applications Received', value: summary?.summary.applicationsReceived || 0 },
          { label: 'Pending Verification', value: summary?.summary.pendingVerification || 0 },
          { label: 'Approved', value: summary?.summary.approved || 0 },
          { label: 'Rejected', value: summary?.summary.rejected || 0 }
        ].map((item) => (
          <div key={item.label} className="card-glass p-6 rounded-3xl border-slate-200/70 dark:border-slate-700/70">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{item.label}</p>
            <p className="mt-4 text-3xl font-semibold text-slate-900 dark:text-slate-100">{item.value}</p>
          </div>
        ))}
      </section>
      <section className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="card-glass p-6 rounded-3xl border-slate-200/70 dark:border-slate-700/70">
          <h2 className="text-xl font-semibold">Admissions by Branch</h2>
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
            <div className="mt-6 rounded-3xl bg-slate-200 p-4 dark:bg-slate-800">
              <div className="text-5xl font-semibold text-slate-900 dark:text-slate-100">{summary?.summary.approvalRate || 0}%</div>
              <p className="mt-2 text-slate-500 dark:text-slate-400">Total approval performance for reviewed admissions.</p>
            </div>
          </div>
          <div className="card-glass p-6 rounded-3xl border-slate-200/70 dark:border-slate-700/70">
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
  );
}
