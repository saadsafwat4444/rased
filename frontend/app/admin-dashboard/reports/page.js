"use client";

import { useEffect, useState } from "react";
import { db } from "../../../firebase/firebase-client";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import Link from "next/link";

export default function AllReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 9; // 3x3 grid

  // Filters
  const [region, setRegion] = useState("");
  const [station, setStation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [stationsList, setStationsList] = useState([]);
  const [regionsList, setRegionsList] = useState([]);

  // Fetch stations and regions for dropdowns
  useEffect(() => {
    const fetchStations = async () => {
      const stationsRef = collection(db, "stations");
      const snapshot = await getDocs(stationsRef);
      const stationsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStationsList(stationsData);

      const regions = Array.from(new Set(stationsData.map((s) => s.region)));
      setRegionsList(regions);
    };

    fetchStations();
  }, []);

  // Fetch reports
  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        let reportsRef = collection(db, "reports");
        let q = query(reportsRef, orderBy("createdAt", "desc"));

        if (region) q = query(q, where("region", "==", region));
        if (station) q = query(q, where("stationId", "==", station));

        // Convert JS Dates to Firestore Timestamps
        if (startDate && endDate) {
          const start = Timestamp.fromDate(new Date(startDate));
          const end = Timestamp.fromDate(new Date(endDate));
          q = query(q, where("createdAt", ">=", start), where("createdAt", "<=", end));
        }

        const snapshot = await getDocs(q);
        const reportsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReports(reportsData);
      } catch (err) {
        console.error("Failed to fetch reports:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [region, station, startDate, endDate]);

  // Pagination logic
  const filteredReports = reports.filter(
    (r) =>
      r.stationNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.status?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = filteredReports.slice(indexOfFirstReport, indexOfLastReport);
  const totalPages = Math.ceil(filteredReports.length / reportsPerPage);

  // Pagination functions
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, region, station, startDate, endDate]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white text-lg font-medium">
        Loading reports...
      </div>
    );

  return (
    <div className="min-h-screen p-8 bg-gray-900 text-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-indigo-400 tracking-wide">
        All Reports
      </h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search reports..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full md:w-1/3 mb-6 px-4 py-2 rounded-xl bg-gray-800 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8">
        {/* Region */}
        <select
          className="px-4 py-2 rounded-xl bg-gray-800 text-gray-100 hover:bg-gray-700 transition"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
        >
          <option value="">All Regions</option>
          {regionsList.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        {/* Station */}
        <select
          className="px-4 py-2 rounded-xl bg-gray-800 text-gray-100 hover:bg-gray-700 transition"
          value={station}
          onChange={(e) => setStation(e.target.value)}
        >
          <option value="">All Stations</option>
          {stationsList
            .filter((s) => !region || s.region === region)
            .map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
        </select>

        {/* Dates */}
        <input
          type="date"
          className="px-4 py-2 rounded-xl bg-gray-800 text-gray-100 hover:bg-gray-700 transition"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          className="px-4 py-2 rounded-xl bg-gray-800 text-gray-100 hover:bg-gray-700 transition"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      {/* Reports */}
      {filteredReports.length === 0 ? (
        <p className="text-gray-400 text-lg">No reports found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentReports.map((report) => (
              <div
                key={report.id}
                className="bg-gray-800 rounded-3xl p-6 shadow-xl hover:scale-105 hover:shadow-2xl transition-transform duration-300 flex flex-col"
              >
                <h2 className="font-semibold text-lg mb-2 text-indigo-300">
                  Station: {report.stationNumber || report.stationId}
                </h2>
                <p className="text-gray-300 mb-3">{report.description}</p>
                <p className="text-sm">
                  Status:{" "}
                  <span
                    className={`font-bold ${
                      report.status === "new"
                        ? "text-blue-400"
                        : report.status === "in_review"
                        ? "text-yellow-400"
                        : report.status === "assigned"
                        ? "text-indigo-400"
                        : report.status === "resolved"
                        ? "text-green-400"
                        : report.status === "rejected"
                        ? "text-red-400"
                        : "text-gray-300"
                    }`}
                  >
                    {report.status}
                  </span>
                </p>
                {report.createdAt && (
                  <p className="text-gray-500 text-sm mt-2">
                    Created:{" "}
                    {report.createdAt.toDate
                      ? report.createdAt.toDate().toLocaleString()
                      : new Date(report.createdAt.seconds * 1000).toLocaleString()}
                  </p>
                )}

                <Link
                  href={`/admin-dashboard/reports/${report.id}`}
                  className="mt-auto inline-block text-center bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-5 py-2 rounded-xl transition"
                >
                  Show Details
                </Link>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {filteredReports.length > reportsPerPage && (
            <div className="flex justify-between items-center mt-8">
              <div className="text-sm text-gray-400">
                Showing {indexOfFirstReport + 1} to {Math.min(indexOfLastReport, filteredReports.length)} of {filteredReports.length} reports
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === 1
                      ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                      : "bg-indigo-500 text-white hover:bg-indigo-600"
                  }`}
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-gray-300">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === totalPages
                      ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                      : "bg-indigo-500 text-white hover:bg-indigo-600"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
