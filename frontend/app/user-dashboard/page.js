// "use client";

// import { useEffect, useState } from "react";
// import { auth } from "../../firebase/firebase-client";
// import { apiFetch } from "../../utils/api";

// export default function UserDashboard() {
//   // إحصائيات ثابتة عشان نتجنب الـ 403 error
//   const stats = [
//     {
//       title: "New",
//       count: 0,
//       color: "bg-green-600",
//     },
//     {
//       title: "In Review",
//       count: 0,
//       color: "bg-yellow-500",
//     },
//     {
//       title: "Assigned",
//       count: 0,
//       color: "bg-blue-600",
//     },
//     {
//       title: "Resolved",
//       count: 0,
//       color: "bg-indigo-700",
//     },
//     {
//       title: "Total Reports",
//       count: 0,
//       color: "bg-gray-700",
//     },
//   ];

//   return (
//     <div className="w-full min-h-screen p-8 space-y-10 bg-gray-900 text-gray-100">
//       {/* Title */}
//       <div className="text-center space-y-4">
//         <h1 className="text-4xl font-bold text-indigo-400">Welcome to Your Dashboard User</h1>
//         <p className="text-gray-300 max-w-2xl mx-auto">
//           Track your reports and create new ones easily. Here is an overview of your report statuses.
//         </p>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
//         {stats.map((s) => (
//           <div
//             key={s.title}
//             className={`p-6 rounded-2xl ${s.color} text-white flex flex-col items-center justify-center shadow-lg shadow-black/50 hover:scale-105 transition`}
//           >
//             <h3 className="text-lg font-medium">{s.title}</h3>
//             <p className="mt-2 text-3xl font-bold">{s.count}</p>
//           </div>
//         ))}
//       </div>

//       {/* Action Buttons */}
//       <div className="flex flex-col sm:flex-row gap-6 justify-center">
//         <a
//           href="/user-dashboard/new-report"
//           className="px-8 py-3 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 transition text-center"
//         >
//           Create New Report
//         </a>

//         <a
//           href="/user-dashboard/my-report"
//           className="px-8 py-3 border border-indigo-600 text-indigo-200 rounded-xl hover:bg-indigo-800 hover:text-white shadow-lg transition text-center"
//         >
//           View My Reports
//         </a>
//       </div>
//     </div>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import { auth } from "../../firebase/firebase-client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555";

export default function UserDashboard() {
  const [stats, setStats] = useState([
    { title: "New", count: 0, color: "bg-blue-500" },
    { title: "In Review", count: 0, color: "bg-yellow-400" },
    { title: "Assigned", count: 0, color: "bg-purple-500" },
    { title: "Resolved", count: 0, color: "bg-green-500" },
    { title: "Total Reports", count: 0, color: "bg-gray-700" },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const token = await user.getIdToken();
        const res = await fetch(`${API_BASE_URL}/reports/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          console.error("Failed to fetch reports:", res.status);
          setLoading(false);
          return;
        }

        const reports = await res.json();

        setStats([
          { title: "New", count: reports.filter(r => r.status === "new").length, color: "bg-blue-500" },
          { title: "In Review", count: reports.filter(r => r.status === "in_review").length, color: "bg-yellow-400" },
          { title: "Assigned", count: reports.filter(r => r.status === "assigned").length, color: "bg-purple-500" },
          { title: "Resolved", count: reports.filter(r => r.status === "resolved").length, color: "bg-green-500" },
          { title: "Total Reports", count: reports.length, color: "bg-gray-700" },
        ]);
      } catch (err) {
        console.error("Error fetching reports:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="w-full min-h-screen p-8 space-y-10 bg-gray-900 text-gray-100">
      {/* Title */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-indigo-400">Welcome to Your Dashboard</h1>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Track your reports and create new ones easily. Here is an overview of your report statuses.
        </p>
      </div>

      {/* Stats Cards */}
      {loading ? (
        <p className="text-center text-gray-300 text-lg">Loading stats...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {stats.map((s) => (
            <div
              key={s.title}
              className={`p-6 rounded-2xl ${s.color} text-white flex flex-col items-center justify-center shadow-lg shadow-black/50 hover:scale-105 transition`}
            >
              <h3 className="text-lg font-medium">{s.title}</h3>
              <p className="mt-2 text-3xl font-bold">{s.count}</p>
            </div>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-6 justify-center">
        <a
          href="/user-dashboard/new-report"
          className="px-8 py-3 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 transition text-center"
        >
          Create New Report
        </a>

        <a
          href="/user-dashboard/my-report"
          className="px-8 py-3 border border-indigo-600 text-indigo-200 rounded-xl hover:bg-indigo-800 hover:text-white shadow-lg transition text-center"
        >
          View My Reports
        </a>
      </div>
    </div>
  );
}