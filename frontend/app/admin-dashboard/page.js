"use client";

import { useEffect, useState } from "react";
import { db } from "../../firebase/firebase-client";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useRouter } from "next/navigation";

const statusList = [
  { key: "new", label: "New", color: "bg-green-600" },
  { key: "in_review", label: "In Review", color: "bg-yellow-500" },
  { key: "assigned", label: "Assigned", color: "bg-blue-500" },
  { key: "resolved", label: "Resolved", color: "bg-indigo-600" },
  { key: "rejected", label: "Rejected", color: "bg-red-600" },
];

export default function DashboardHomeAdmin() {
  const [stats, setStats] = useState({});
  const [total, setTotal] = useState(0);
  const router = useRouter();

  useEffect(() => {
    async function fetchStats() {
      const counts = {};
      let totalCount = 0;

      for (let i = 0; i < statusList.length; i++) {
        const status = statusList[i];
       
        const q = query(collection(db, "reports"), where("status", "==", status.key));
        const snap = await getDocs(q);
        counts[status.key] = snap.size;  
        totalCount += snap.size;
      }

      
      const allSnap = await getDocs(collection(db, "reports"));
      setTotal(allSnap.size);

      setStats(counts);
    }

    fetchStats();
  }, []);

  return (
    <div className="w-full min-h-screen p-8 space-y-10 bg-gray-900 text-gray-100">

      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-indigo-400">
          Welcome to Admin Dashboard
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Overview of all reports across all stations.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
        {statusList.map((s) => (
          <div
            key={s.key}
            className={`p-6 rounded-2xl ${s.color} text-white flex flex-col items-center justify-center shadow-lg shadow-black/50 hover:scale-105 transition`}
          >
            <h3 className="text-lg font-medium">{s.label}</h3>
            <p className="mt-2 text-3xl font-bold">{stats[s.key] ?? 0}</p>
          </div>
        ))}

        <div className="p-6 rounded-2xl bg-indigo-700 text-white flex flex-col items-center justify-center shadow-lg shadow-black/50 hover:scale-105 transition">
          <h3 className="text-lg font-medium">Total Reports</h3>
          <p className="mt-2 text-3xl font-bold">{total}</p>
        </div>
      </div>

      

    </div>
  );
}