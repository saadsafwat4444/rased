"use client";

import { useEffect, useState } from "react";
import { auth } from "../../../firebase/firebase-client";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555";

export default function MyReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const reportsPerPage = 10;

  useEffect(() => {
    const fetchReports = async () => {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const token = await user.getIdToken();
        const res = await fetch(`${API_BASE_URL}/reports/my`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch reports: ${res.status}`);
        }

        const data = await res.json();

        const reportsArray = Array.isArray(data)
          ? data.map((r) => ({
              ...r,
              mediaUrls: r.mediaUrls || [],
              locationName: r.locationName || `${r.lat}, ${r.lng}`,
              createdAt: r.createdAt?._seconds
                ? new Date(r.createdAt._seconds * 1000).toISOString()
                : "",
            }))
          : [];

        setReports(reportsArray);
      } catch (err) {
        console.error("Error fetching reports:", err);
        setReports([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Pagination logic
  const filteredReports = reports.filter(report =>
    report.description.toLowerCase().includes(searchTerm.toLowerCase())
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

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-300">
        Loading reports...
      </p>
    );

  if (!filteredReports.length)
    return (
      <div className="text-center mt-10">
        <p className="text-gray-300 mb-4">
          {searchTerm ? "No reports found matching your search." : "No reports found."}
        </p>
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="text-indigo-400 hover:text-indigo-200 underline"
          >
            Clear search
          </button>
        )}
      </div>
    );

  return (
    <div className="p-4 md:p-10 bg-gray-900 min-h-screen text-gray-100">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center text-indigo-400">
        My Reports
      </h1>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search by description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
          />
          {searchTerm && (
            <div className="mt-2 text-center text-sm text-gray-400">
              Found {filteredReports.length} report{filteredReports.length !== 1 ? "s" : ""} matching "{searchTerm}"
            </div>
          )}
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border border-gray-700 rounded-xl overflow-hidden">
          <thead className="bg-gray-800">
            <tr>
              <th className="p-3 text-left text-gray-300">#</th>
              <th className="p-3 text-left text-gray-300">Description</th>
              <th className="p-3 text-left text-gray-300">Category</th>
              <th className="p-3 text-left text-gray-300">Severity</th>
              <th className="p-3 text-left text-gray-300">Location</th>
              <th className="p-3 text-left text-gray-300">Created At</th>
              <th className="p-3 text-left text-gray-300">Status</th>
              <th className="p-3 text-left text-gray-300">Media</th>
            </tr>
          </thead>
          <tbody>
            {currentReports.map((report, index) => (
              <tr
                key={report.id}
                className="border-b border-gray-700 hover:bg-gray-800 transition-colors"
              >
                <td className="p-3">{indexOfFirstReport + index + 1}</td>
                <td className="p-3">{report.description}</td>
                <td className="p-3">{report.category}</td>
                <td className="p-3">{report.severity}</td>
                <td className="p-3">{report.locationName}</td>
                <td className="p-3">
                  {new Date(report.createdAt).toLocaleString("en-US")}
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        report.status === "new"
                          ? "bg-blue-500"
                          : report.status === "in_review"
                          ? "bg-yellow-400"
                          : report.status === "assigned"
                          ? "bg-purple-500"
                          : report.status === "resolved"
                          ? "bg-green-500"
                          : report.status === "rejected"
                          ? "bg-red-500"
                          : "bg-gray-400"
                      }`}
                    ></span>

                    <span className="capitalize text-sm font-medium">
                      {(report.status || "new").replace("_", " ")}
                    </span>
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-2">
                    {report.mediaUrls?.map((url, i) => {
                      if (url.match(/\.(mp4|webm|mov|avi)$/i)) {
                        return (
                          <video key={i} src={url} controls className="w-32 h-32 rounded-lg" />
                        );
                      } else {
                        return (
                          <img
                            key={i}
                            src={url}
                            alt={`report-${i}`}
                            className="w-20 h-20 object-cover rounded-lg border border-gray-600 hover:scale-105 transition"
                          />
                        );
                      }
                    })}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden flex flex-col gap-4">
        {currentReports.map((report, index) => (
          <div
            key={report.id}
            className="border border-gray-700 rounded-xl p-4 shadow-md bg-gray-800"
          >
            <p>
              <strong>#</strong> {indexOfFirstReport + index + 1}
            </p>
            <p>
              <strong>Description:</strong> {report.description}
            </p>
            <p>
              <strong>Category:</strong> {report.category}
            </p>
            <p>
              <strong>Severity:</strong> {report.severity}
            </p>
            <p>
              <strong>Location:</strong> {report.locationName}
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {new Date(report.createdAt).toLocaleString("en-US")}
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {report.mediaUrls?.map((url, i) => (
                <a
                  key={i}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 underline hover:text-indigo-200"
                >
                  File {i + 1}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {reports.length > reportsPerPage && (
        <div className="flex justify-between items-center mt-8">
          <div className="text-sm text-gray-400">
            Showing {indexOfFirstReport + 1} to {Math.min(indexOfLastReport, reports.length)} of {reports.length} reports
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
    </div>
  );
}
