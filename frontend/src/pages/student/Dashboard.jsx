
import { useEffect, useState } from 'react';
import api from '../../api/api';
import { CheckCircle2, FileText, Shield, Bell } from 'lucide-react';
import DigiLockerSection from '../../components/DigiLockerSection';

export default function StudentDashboard() {
  const [stats, setStats] = useState(null);
  console.log("STATS DATA:", stats);

  useEffect(() => {
    api
      .get('/students/dashboard')
      .then((res) => setStats(res.data.data))
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-6">

      {/* Student Profile Card */}
      <div className="card-glass p-6 rounded-3xl border-slate-200/70 dark:border-slate-700/70">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <img
            src="http://localhost:4000/uploads/1780921540143-2.jpg"
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-red-500"
         />

          <div className="flex-1">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              {stats?.fullName || 'Student'}
            </h2>

            <p className="text-slate-500 mt-1">
              {stats?.email}
            </p>

            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-sm text-slate-500">Course</p>
                <p className="font-semibold">
                  {stats?.course || 'N/A'}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Branch</p>
                <p className="font-semibold">
                  {stats?.branch || 'N/A'}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Application Status
                </p>
                <p className="font-semibold text-green-600">
                  {stats?.applicationStatus || 'Draft'}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Documents Uploaded
                </p>
                <p className="font-semibold">
                  {stats?.documentsUploaded || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Cards */}
      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            title: 'Application Status',
            value: stats?.applicationStatus || 'Draft',
            icon: FileText,
            tint: 'from-brand-500 to-sky-400'
          },
          {
            title: 'Documents Uploaded',
            value: stats?.documentsUploaded || 0,
            icon: CheckCircle2,
            tint: 'from-emerald-500 to-emerald-400'
          },
          {
            title: 'Verification Progress',
            value: stats?.verificationProgress || 'Pending',
            icon: Shield,
            tint: 'from-violet-500 to-fuchsia-500'
          },
          {
            title: 'Notifications',
            value: stats?.notifications?.length || 0,
            icon: Bell,
            tint: 'from-slate-600 to-slate-400'
          }
        ].map((card) => (
          <div
            key={card.title}
            className="card-glass p-6 rounded-3xl shadow-xl border-slate-200/70 dark:border-slate-700/70"
          >
            <div
              className={`inline-flex items-center justify-center rounded-2xl bg-gradient-to-br ${card.tint} p-3 text-white`}
            >
              <card.icon size={20} />
            </div>

            <h3 className="mt-6 text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              {card.title}
            </h3>

            <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-100">
              {card.value}
            </p>
          </div>
        ))}
      </section>

      {/* Progress + Profile Completion */}
      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">

        <div className="card-glass p-6 rounded-3xl border-slate-200/70 dark:border-slate-700/70">
          <h2 className="text-xl font-semibold">
            Application Progress
          </h2>

          <div className="mt-6 space-y-4">
            {[
              'Draft',
              'Submitted',
              'Under Review',
              'Document Verification',
              'Approved / Rejected'
            ].map((step, idx) => {
              const active =
                stats?.applicationStatus
                  ?.toLowerCase()
                  .includes(step.toLowerCase()) ||
                (idx === 0 &&
                  stats?.applicationStatus === 'Draft');

              return (
                <div key={step} className="flex items-center gap-4">
                  <span
                    className={`grid h-11 w-11 place-items-center rounded-2xl ${
                      active
                        ? 'bg-brand-600 text-white'
                        : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {idx + 1}
                  </span>

                  <div>
                    <p className="font-semibold">
                      {step}
                    </p>

                    <p className="text-sm text-slate-500">
                      {active
                        ? 'Current stage'
                        : 'Upcoming stage'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card-glass p-6 rounded-3xl border-slate-200/70 dark:border-slate-700/70">
          <h2 className="text-xl font-semibold">
            Profile Completion
          </h2>

          <div className="mt-6 rounded-3xl bg-slate-200 p-1 dark:bg-slate-800">
            <div
              className="h-4 rounded-3xl bg-brand-600"
              style={{
                width: `${stats?.profileCompletion || 0}%`
              }}
            />
          </div>

          <p className="mt-3 text-sm text-slate-500">
            {stats?.profileCompletion || 0}% complete
          </p>
        </div>
      </section>

      {/* DigiLocker */}
      <DigiLockerSection
        uploadedDocuments={
          stats?.uploadedDocuments || []
        }
      />
    </div>
  );
}
