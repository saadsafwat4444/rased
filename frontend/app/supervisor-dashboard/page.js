 "use client";

import { useEffect, useState } from "react";
import { auth } from "../../firebase/firebase-client";
import { apiFetch } from "../../utils/api";

export default function SupervisorDashboard() {
  const [reports, setReports] = useState([]);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  // جلب كل المحطات
  const fetchStations = async () => {
    try {
      const data = await apiFetch('/stations');
      return data; // [{id: "1", name: "Station 1"}, ...]
    } catch (err) {
      console.error("Failed to fetch stations:", err);
      return [];
    }
  };

  // جلب التقارير
  const fetchReports = async (status = "") => {
    try {
      const data = await apiFetch(`/users/reports?status=${status}`);
      return data;
    } catch (err) {
      console.error("Failed to fetch reports:", err);
      return [];
    }
  };

  // تحميل البيانات
  //     const stationsData = await fetchStations();
  //     setStations(stationsData);

  //     const reportsData = await fetchReports(statusFilter);
  //     setReports(reportsData);
  //     setLoading(false);
  //   };
  //   loadData();
  // }, [statusFilter]);

  useEffect(() => {
  const loadData = async () => {
    setLoading(true);

    const stationsData = await fetchStations();
    setStations(stationsData);

    const reportsData = await fetchReports(statusFilter);
    const reportsArray = Array.isArray(reportsData)
      ? reportsData
      : reportsData?.reports || [];
    setReports(reportsArray);

    setLoading(false);
  };

  loadData();
}, [statusFilter]);

  // Helper: تحويل stationId لاسم المحطة
  const getStationName = (stationId) => {
    return stations.find((s) => s.id === stationId)?.name || "Unknown";
  };

  // Helper: تنسيق التاريخ بشكل آمن
  const formatDate = (createdAt) => {
    console.log('formatDate called with:', createdAt, typeof createdAt);
    
    if (!createdAt) {
      console.log('createdAt is null or undefined');
      return "";
    }
    
    try {
      // Firestore Timestamp format (has both seconds and nanoseconds)
      if (createdAt.seconds !== undefined && createdAt.nanoseconds !== undefined) {
        console.log('Processing Firestore timestamp with seconds:', createdAt.seconds);
        const date = new Date(createdAt.seconds * 1000 + createdAt.nanoseconds / 1000000);
        console.log('Formatted date:', date.toLocaleDateString("en-US"));
        return date.toLocaleDateString("en-US");
      }
      
      // Firestore Timestamp format with underscore prefix (JSON serialized)
      if (createdAt._seconds !== undefined && createdAt._nanoseconds !== undefined) {
        console.log('Processing Firestore timestamp with _seconds:', createdAt._seconds);
        const date = new Date(createdAt._seconds * 1000 + createdAt._nanoseconds / 1000000);
        console.log('Formatted date:', date.toLocaleDateString("en-US"));
        return date.toLocaleDateString("en-US");
      }
      
      // Legacy Firestore Timestamp format (only seconds)
      if (createdAt.seconds) {
        console.log('Processing legacy Firestore timestamp with seconds:', createdAt.seconds);
        const date = new Date(createdAt.seconds * 1000);
        console.log('Formatted date:', date.toLocaleDateString("en-US"));
        return date.toLocaleDateString("en-US");
      }
      
      // Legacy Firestore Timestamp format with underscore
      if (createdAt._seconds) {
        console.log('Processing legacy Firestore timestamp with _seconds:', createdAt._seconds);
        const date = new Date(createdAt._seconds * 1000);
        console.log('Formatted date:', date.toLocaleDateString("en-US"));
        return date.toLocaleDateString("en-US");
      }
      
      // If it's already a Date object
      if (createdAt instanceof Date) {
        console.log('Processing Date object');
        return createdAt.toLocaleDateString("en-US");
      }
      
      // If it's a string or number
      const date = new Date(createdAt);
      if (isNaN(date.getTime())) {
        console.warn("Invalid date:", createdAt);
        return "";
      }
      
      console.log('Processing string/number date:', date.toLocaleDateString("en-US"));
      return date.toLocaleDateString("en-US");
    } catch (error) {
      console.error("Error formatting date:", error, createdAt);
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
      {/* Title */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-indigo-400">Welcome to Your Dashboard Supervisor</h1>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Track your reports and manage stations within your scope.
        </p>
      </div>

      {/* Stats Cards */}
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

     

   

      {/* Reports Table */}
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


 


 