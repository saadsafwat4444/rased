
"use client";

import { useEffect, useState } from "react";
import { auth } from "../../firebase/firebase-client";
import { apiFetch } from "../../utils/api";

export default function SupervisorDashboard() {
  const [reports, setReports] = useState([]);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

   
  const fetchStations = async (token) => {
    try {
      const data = await apiFetch("/stations", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    } catch (err) {
      console.error("Failed to fetch stations:", err);
      return [];
    }
  };

  // 🔥 جلب التقارير مع التوكن
  const fetchReports = async (token, status = "") => {
    try {
      const data = await apiFetch(`/users/reports?status=${status}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return Array.isArray(data) ? data : data?.reports || [];
    } catch (err) {
      console.error("Failed to fetch reports:", err);
      return [];
    }
  };

  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const token = await user.getIdToken();

        const stationsData = await fetchStations(token);
        setStations(stationsData);

        const reportsData = await fetchReports(token, statusFilter);
        setReports(reportsData);
      } catch (error) {
        console.error("Error loading dashboard:", error);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [statusFilter]);

  // Helper: تحويل stationId لاسم المحطة
  const getStationName = (stationId) => {
    return stations.find((s) => s.id === stationId)?.name || "Unknown";
  };

  // Helper: تنسيق التاريخ
  const formatDate = (createdAt) => {
    if (!createdAt) return "";

    try {
      if (createdAt.seconds !== undefined)
        return new Date(createdAt.seconds * 1000).toLocaleDateString("en-US");

      if (createdAt._seconds !== undefined)
        return new Date(createdAt._seconds * 1000).toLocaleDateString("en-US");

      const date = new Date(createdAt);
      return isNaN(date.getTime()) ? "" : date.toLocaleDateString("en-US");
    } catch {
      return "";
    }
  };

  // Stats
  const stats = [
    { title: "New", count: reports.filter((r) => r.status === "new").length, color: "bg-green-600" },
    { title: "In Review", count: reports.filter((r) => r.status === "in_review").length, color: "bg-yellow-500" },
    { title: "Assigned", count: reports.filter((r) => r.status === "assigned").length, color: "bg-blue-600" },
    { title: "Resolved", count: reports.filter((r) => r.status === "resolved").length, color: "bg-indigo-700" },
    { title: "Total Reports", count: reports.length, color: "bg-gray-700" },
  ];

  if (loading) return <p className="p-6 text-white">جاري التحميل...</p>;

  return (
    <div className="w-full min-h-screen p-8 space-y-10 bg-gray-900 text-gray-100">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-indigo-400">
          Welcome to Your Dashboard Supervisor
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Track your reports and manage stations within your scope.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map((s) => (
          <div
            key={s.title}
            className={`p-6 rounded-2xl ${s.color} text-white flex flex-col items-center justify-center shadow-lg`}
          >
            <h3 className="text-lg font-medium">{s.title}</h3>
            <p className="mt-2 text-3xl font-bold">{s.count}</p>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto bg-gray-800 rounded-xl shadow p-4">
        <table className="min-w-full text-sm text-right text-gray-200">
          <thead className="bg-gray-700">
            <tr>
              <th className="p-3">Station Name</th>
              <th className="p-3">Description</th>
              <th className="p-3">Severity</th>
              <th className="p-3">Status</th>
              <th className="p-3">Created At</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r.id} className="border-b border-gray-600">
                <td className="p-3">{getStationName(r.stationId)}</td>
                <td className="p-3">{r.description}</td>
                <td className="p-3">{r.severity}</td>
                <td className="p-3 font-bold">{r.status}</td>
                <td className="p-3">{formatDate(r.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}