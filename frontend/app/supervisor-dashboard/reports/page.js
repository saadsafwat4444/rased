 
// // "use client";

// // import { useEffect, useState } from "react";
// // import { auth } from "../../../firebase/firebase-client";
// // import Swal from "sweetalert2";


// // export default function ReportsSupervisor() {
// //   const [reports, setReports] = useState([]);
// //   const [stations, setStations] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [statusFilter, setStatusFilter] = useState("");
 

// // //   const updateReportStatus = async (reportId, newStatus) => {
// // //   try {
// // //     const user = auth.currentUser;
// // //     if (!user) return;

// // //     const token = await user.getIdToken();

// // //     const res = await fetch(
// // //       `http://localhost:5555/users/reports/${reportId}/status`,
// // //       {
// // //         method: "PATCH",
// // //         headers: {
// // //           "Content-Type": "application/json",
// // //           Authorization: `Bearer ${token}`,
// // //         },
// // //         body: JSON.stringify({ status: newStatus }),
// // //       }
// // //     );

// // //     if (!res.ok) {
// // //       throw new Error("Failed to update");
// // //     }

// // //     // تحديث UI مباشرة
// // //     setReports((prev) =>
// // //       prev.map((r) =>
// // //         r.id === reportId ? { ...r, status: newStatus } : r
// // //       )
// // //     );
// // //   } catch (err) {
// // //     console.error("Update error:", err);
// // //   }
// // // };



// // const updateReportStatus = async (reportId, newStatus) => {
// //   try {
// //     const user = auth.currentUser;
// //     if (!user) return;

// //     const token = await user.getIdToken();

// //     const res = await fetch(
// //       `http://localhost:5555/users/reports/${reportId}/status`,
// //       {
// //         method: "PATCH",
// //         headers: {
// //           "Content-Type": "application/json",
// //           Authorization: `Bearer ${token}`,
// //         },
// //         body: JSON.stringify({ status: newStatus }),
// //       }
// //     );

// //     if (!res.ok) {
// //       throw new Error("Failed to update");
// //     }

// //     // تحديث UI مباشرة
// //     setReports((prev) =>
// //       prev.map((r) =>
// //         r.id === reportId ? { ...r, status: newStatus } : r
// //       )
// //     );

// //       Swal.fire({
// //       icon: "success",
// //       title: "Status Updated",
// //       text: `The report status is now "${newStatus}"`,
// //       timer: 2000,
// //       showConfirmButton: false,
// //       toast: true,
// //       position: "top-right",
// //     }); 
// //   } catch (err) {
// //     console.error("Update error:", err);
// //      Swal.fire({
// //       icon: "error",
// //       title: "Update Failed",
// //       text: "Could not update the report status",
// //       timer: 2000,
// //       showConfirmButton: false,
// //       toast: true,
// //       position: "top-right",
// //     });
// //   }
// // };

// //   // ===============================
// //   // Fetch Stations
// //   // ===============================
// //   const fetchStations = async () => {
// //     try {
// //       const user = auth.currentUser;
// //       if (!user) return [];

// //       const token = await user.getIdToken();

// //       const res = await fetch("http://localhost:5555/stations", {
// //         headers: { Authorization: `Bearer ${token}` },
// //       });

// //       if (!res.ok) throw new Error("Failed to fetch stations");

// //       const data = await res.json();
// //       return Array.isArray(data) ? data : [];
// //     } catch (err) {
// //       console.error("Stations Error:", err);
// //       return [];
// //     }
// //   };

// //   // ===============================
// //   // Fetch Reports
// //   // ===============================
// //   const fetchReports = async (status = "") => {
// //     try {
// //       const user = auth.currentUser;
// //       if (!user) return [];

// //       const token = await user.getIdToken();

// //       const url = status
// //         ? `http://localhost:5555/users/reports?status=${status}`
// //         : `http://localhost:5555/users/reports`;

// //       const res = await fetch(url, {
// //         headers: { Authorization: `Bearer ${token}` },
// //       });

// //       if (!res.ok) throw new Error("Failed to fetch reports");

// //       const data = await res.json();
// //       return Array.isArray(data) ? data : [];
// //     } catch (err) {
// //       console.error("Reports Error:", err);
// //       return [];
// //     }
// //   };

// //   // ===============================
// //   // Load Data
// //   // ===============================
// //   useEffect(() => {
// //     const loadData = async () => {
// //       setLoading(true);

// //       const stationsData = await fetchStations();
// //       setStations(stationsData);

// //       const reportsData = await fetchReports(statusFilter);
// //       setReports(reportsData);

// //       setLoading(false);
// //     };

// //     loadData();
// //   }, [statusFilter]);

// //   // ===============================
// //   // Get Station Name by ID
// //   // ===============================
// //   const getStationName = (stationId) => {
// //     return stations.find((s) => s.id === stationId)?.name || "Unknown";
// //   };

// //   // ===============================
// //   // Render
// //   // ===============================


// //    const addComment = async (reportId) => {
// //     if (!commentText[reportId]) return;
// //     try {
// //       await axios.post(`/users/reports/${reportId}/comments`, {
// //         comment: commentText[reportId],
// //       });
// //       alert("Comment added successfully");
// //       setCommentText({ ...commentText, [reportId]: "" });
// //       fetchReports(); // إعادة تحميل التقارير لتحديث التعليقات
// //     } catch (err) {
// //       console.error(err);
// //       alert("Failed to add comment");
// //     }
// //   };
// //   return (

  
// //     <div className="p-6 space-y-6 text-white">

       

// //       <h1 className="text-2xl font-bold text-center">
// //         Supervisor Reports
// //       </h1>

// //       {/* Status Filter */}
// //       <div className="flex justify-center">
// //         <select
// //           value={statusFilter}
// //           onChange={(e) => setStatusFilter(e.target.value)}
// //           className="border p-2 rounded bg-gray-800 text-white"
// //         >
// //           <option value="">All Statuses</option>
// //           <option value="new">New</option>
// //           <option value="in_review">In Review</option>
// //           <option value="assigned">Assigned</option>
// //           <option value="resolved">Resolved</option>
// //         </select>
// //       </div>

// //       {/* Loading */}
// //       {loading && (
// //         <div className="text-center text-lg">Loading...</div>
// //       )}

// //       {/* Empty State */}
// //       {!loading && reports.length === 0 && (
// //         <div className="text-center text-gray-400">
// //           No reports found.
// //         </div>
// //       )}

// //       {/* Reports Table */}
// //       {!loading && reports.length > 0 && (
// //         <div className="overflow-x-auto bg-gray-800 rounded-xl shadow p-4">
// //           <table className="min-w-full text-sm text-right text-gray-200">
// //             <thead className="bg-gray-700">
// //               <tr>
// //                 <th className="p-3">Station Name</th>
// //                 <th className="p-3">Description</th>
// //                 <th className="p-3">Severity</th>
// //                 <th className="p-3">Status</th>
               
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {reports.map((r) => (
// //                 <tr key={r.id} className="border-b border-gray-600">
// //                   <td className="p-3">
// //                     {getStationName(r.stationId)}
// //                   </td>
// //                   <td className="p-3">{r.description}</td>
// //                   <td className="p-3">{r.severity}</td>
// //                   {/* <td className="p-3 font-bold capitalize">
// //                     {r.status}
// //                   </td> */}

// //                   <td className="p-3">
// //   <select
// //     value={r.status}
// //     onChange={(e) => updateReportStatus(r.id, e.target.value)}
// //     className="bg-gray-700 text-white p-1 rounded"
// //   >
// //     <option value="new">New</option>
// //     <option value="in_review">In Review</option>
// //     <option value="assigned">Assigned</option>
// //     <option value="resolved">Resolved</option>
// //   </select>
// // </td>
                  
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>

         
// //         </div>
// //       )}
// //     </div>
// //   );
// // }


// "use client";

// import { useEffect, useState } from "react";
// import { auth } from "../../../firebase/firebase-client";
// import Swal from "sweetalert2";
// import axios from "axios";

// export default function ReportsSupervisor() {
//   const [reports, setReports] = useState([]);
//   const [stations, setStations] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [statusFilter, setStatusFilter] = useState("");
//   const [commentText, setCommentText] = useState({}); // لتخزين نصوص التعليقات مؤقتاً

//   // ===============================
//   // Fetch Stations
//   // ===============================
//   const fetchStations = async () => {
//     try {
//       const user = auth.currentUser;
//       if (!user) return [];

//       const token = await user.getIdToken();
//       const res = await fetch("http://localhost:5555/stations", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error("Failed to fetch stations");
//       const data = await res.json();
//       return Array.isArray(data) ? data : [];
//     } catch (err) {
//       console.error("Stations Error:", err);
//       return [];
//     }
//   };

//   // ===============================
//   // Fetch Reports
//   // ===============================
//   const fetchReports = async (status = "") => {
//     try {
//       const user = auth.currentUser;
//       if (!user) return [];

//       const token = await user.getIdToken();
//       const url = status
//         ? `http://localhost:5555/users/reports?status=${status}`
//         : `http://localhost:5555/users/reports`;

//       const res = await fetch(url, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error("Failed to fetch reports");
//       const data = await res.json();
//       return Array.isArray(data) ? data : [];
//     } catch (err) {
//       console.error("Reports Error:", err);
//       return [];
//     }
//   };

//   // ===============================
//   // Load Data
//   // ===============================
//   useEffect(() => {
//     const loadData = async () => {
//       setLoading(true);

//       const stationsData = await fetchStations();
//       setStations(stationsData);

//       const reportsData = await fetchReports(statusFilter);
//       setReports(reportsData);

//       setLoading(false);
//     };
//     loadData();
//   }, [statusFilter]);

//   // ===============================
//   // Get Station Name by ID
//   // ===============================
//   const getStationName = (stationId) => {
//     return stations.find((s) => s.id === stationId)?.name || "Unknown";
//   };

//   // ===============================
//   // Update Report Status
//   // ===============================
//   const updateReportStatus = async (reportId, newStatus) => {
//     try {
//       const user = auth.currentUser;
//       if (!user) return;
//       const token = await user.getIdToken();

//       const res = await fetch(
//         `http://localhost:5555/users/reports/${reportId}/status`,
//         {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ status: newStatus }),
//         }
//       );

//       if (!res.ok) throw new Error("Failed to update");

//       setReports((prev) =>
//         prev.map((r) =>
//           r.id === reportId ? { ...r, status: newStatus } : r
//         )
//       );

//       Swal.fire({
//         icon: "success",
//         title: "Status Updated",
//         text: `The report status is now "${newStatus}"`,
//         timer: 2000,
//         showConfirmButton: false,
//         toast: true,
//         position: "top-right",
//       });
//     } catch (err) {
//       console.error("Update error:", err);
//       Swal.fire({
//         icon: "error",
//         title: "Update Failed",
//         text: "Could not update the report status",
//         timer: 2000,
//         showConfirmButton: false,
//         toast: true,
//         position: "top-right",
//       });
//     }
//   };

  
//   const addComment = async (reportId) => {
//     const comment = commentText[reportId]?.trim();
//     if (!comment) return;

//     try {
//       const user = auth.currentUser;
//       if (!user) return;
//       const token = await user.getIdToken();

//       const res = await fetch(
//         `http://localhost:5555/users/reports/${reportId}/comments`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ comment }),
//         }
//       );

//       if (!res.ok) throw new Error("Failed to add comment");

//       // تحديث UI مباشرة
//       setReports((prev) =>
//         prev.map((r) =>
//           r.id === reportId
//             ? {
//                 ...r,
//                 comments: [
//                   ...(r.comments || []),
//                   {
//                     comment,
//                     fullName: user.displayName || user.email,
//                     createdAt: new Date().toISOString(),
//                   },
//                 ],
//               }
//             : r
//         )
//       );

//       setCommentText({ ...commentText, [reportId]: "" });

//       Swal.fire({
//         icon: "success",
//         title: "Comment Added",
//         text: "Your comment has been added",
//         timer: 2000,
//         showConfirmButton: false,
//         toast: true,
//         position: "top-right",
//       });
//     } catch (err) {
//       console.error(err);
//       Swal.fire({
//         icon: "error",
//         title: "Failed",
//         text: "Could not add comment",
//         timer: 2000,
//         showConfirmButton: false,
//         toast: true,
//         position: "top-right",
//       });
//     }
//   };

//   // ===============================
//   // Render
//   // ===============================
//   return (
//     <div className="p-6 space-y-6 text-white">
//       <h1 className="text-2xl font-bold text-center">Supervisor Reports</h1>

//       {/* Status Filter */}
//       <div className="flex justify-center">
//         <select
//           value={statusFilter}
//           onChange={(e) => setStatusFilter(e.target.value)}
//           className="border p-2 rounded bg-gray-800 text-white"
//         >
//           <option value="">All Statuses</option>
//           <option value="new">New</option>
//           <option value="in_review">In Review</option>
//           <option value="assigned">Assigned</option>
//           <option value="resolved">Resolved</option>
//         </select>
//       </div>

//       {/* Loading */}
//       {loading && <div className="text-center text-lg">Loading...</div>}

//       {/* Empty State */}
//       {!loading && reports.length === 0 && (
//         <div className="text-center text-gray-400">No reports found.</div>
//       )}

//       {/* Reports Table */}
//       {!loading && reports.length > 0 && (
//         <div className="overflow-x-auto bg-gray-800 rounded-xl shadow p-4 space-y-4">
//           {reports.map((r) => (
//             <div key={r.id} className="border-b border-gray-600 p-3 rounded">
//               <div className="flex justify-between items-center mb-2">
//                 <span className="font-bold">{getStationName(r.stationId)}</span>
//                 <select
//                   value={r.status}
//                   onChange={(e) =>
//                     updateReportStatus(r.id, e.target.value)
//                   }
//                   className="bg-gray-700 text-white p-1 rounded"
//                 >
//                   <option value="new">New</option>
//                   <option value="in_review">In Review</option>
//                   <option value="assigned">Assigned</option>
//                   <option value="resolved">Resolved</option>
//                 </select>
//               </div>

//               <p className="mb-1">{r.description}</p>
//               <p className="text-sm text-gray-300 mb-2">Severity: {r.severity}</p>

//               {/* Comments */}
//               <div className="mb-2">
//                 <h3 className="font-medium mb-1">Comments:</h3>
//                 {r.comments?.length ? (
//                   <ul className="list-disc pl-5 text-gray-200">
//                     {r.comments.map((c, idx) => (
//                       <li key={idx}>
//                         <span className="font-semibold">{c.fullName}:</span>{" "}
//                         {c.comment}{" "}
//                         <span className="text-gray-400 text-xs">
//                           {new Date(c.createdAt).toLocaleString()}
//                         </span>
//                       </li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <p className="text-gray-400 text-sm">No comments yet.</p>
//                 )}
//               </div>

//               {/* Add Comment */}
//               <div className="flex gap-2">
//                 <input
//                   type="text"
//                   placeholder="Add a comment..."
//                   value={commentText[r.id] || ""}
//                   onChange={(e) =>
//                     setCommentText({
//                       ...commentText,
//                       [r.id]: e.target.value,
//                     })
//                   }
//                   className="border rounded px-2 py-1 flex-1 bg-gray-700 text-white"
//                 />
//                 <button
//                   onClick={() => addComment(r.id)}
//                   className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
//                 >
//                   Comment
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { auth } from "../../../firebase/firebase-client";
import Swal from "sweetalert2";

export default function SupervisorReports() {
  const [reports, setReports] = useState([]);
  const [stations, setStations] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [commentText, setCommentText] = useState({});

  // ===============================
  // Fetch Stations
  // ===============================
  const fetchStations = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return [];

      const token = await user.getIdToken();
      const res = await fetch("http://localhost:5555/stations", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch stations");
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error("Stations Error:", err);
      return [];
    }
  };

  // ===============================
  // Fetch Technicians (users role='user')
  // ===============================
  const fetchTechnicians = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return [];

      const token = await user.getIdToken();
      const res = await fetch("http://localhost:5555/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
         console.log("Users from backend:", data); 
     const usersArray = Array.isArray(data.users) ? data.users : [];
const filtered= usersArray.filter(
  (u) => u.role && u.role.toLowerCase() === "user"
);

console.log("Filtered technicians:", filtered);
return filtered;

    } catch (err) {
      console.error("Technicians Error:", err);
      return [];
    }
  };

  // ===============================
  // Fetch Reports
  // ===============================
  const fetchReports = async (status = "") => {
    try {
      const user = auth.currentUser;
      if (!user) return [];

      const token = await user.getIdToken();
      const url = status
        ? `http://localhost:5555/users/reports?status=${status}`
        : `http://localhost:5555/users/reports`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch reports");
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error("Reports Error:", err);
      return [];
    }
  };

  // ===============================
  // Load All Data
  // ===============================
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      const [stationsData, techData, reportsData] = await Promise.all([
        fetchStations(),
        fetchTechnicians(),
        fetchReports(statusFilter),
      ]);

      setStations(stationsData);
      setTechnicians(techData);
      setReports(reportsData);
      setLoading(false);
    };

    loadData();
  }, [statusFilter]);

  // ===============================
  // Get Station Name by ID
  // ===============================
  const getStationName = (stationId) =>
    stations.find((s) => s.id === stationId)?.name || "Unknown";

  // ===============================
  // Update Report Status
  // ===============================
  const updateReportStatus = async (reportId, newStatus) => {
    try {
      const user = auth.currentUser;
      if (!user) return;
      const token = await user.getIdToken();

      const res = await fetch(
        `http://localhost:5555/users/reports/${reportId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!res.ok) throw new Error("Failed to update");

      setReports((prev) =>
        prev.map((r) =>
          r.id === reportId ? { ...r, status: newStatus } : r
        )
      );

      Swal.fire({
        icon: "success",
        title: "Status Updated",
        text: `Report status is now "${newStatus}"`,
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: "top-right",
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Could not update the report status",
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: "top-right",
      });
    }
  };

  // ===============================
  // Assign Report to Technician
  // ===============================
  const assignReport = async (reportId, technicianId) => {
    try {
      // Find technician data
      const technician = technicians.find(t => t.id === technicianId);
      const technicianEmail = technician?.email;
      
      console.log('Assigning report:', reportId, 'to technician:', technicianId, 'email:', technicianEmail);
      const user = auth.currentUser;
      if (!user) return;

      const token = await user.getIdToken();

      const res = await fetch(
        `http://localhost:5555/users/reports/${reportId}/assign`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId: technicianId, email: technicianEmail }),
        }
      );

      if (!res.ok) throw new Error("Failed to assign report");

      setReports((prev) =>
        prev.map((r) =>
          r.id === reportId
            ? { ...r, assignedToUserId: technicianId, status: "assigned" }
            : r
        )
      );

      Swal.fire({
        icon: "success",
        title: "Report Assigned",
        text: "Report has been assigned successfully",
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: "top-right",
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Assign Failed",
        text: "Could not assign report",
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: "top-right",
      });
    }
  };

  // ===============================
  // Add Comment
  // ===============================
  const addComment = async (reportId) => {
    const comment = commentText[reportId]?.trim();
    if (!comment) return;

    try {
      const user = auth.currentUser;
      if (!user) return;
      const token = await user.getIdToken();

      const res = await fetch(
        `http://localhost:5555/users/reports/${reportId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ comment }),
        }
      );

      if (!res.ok) throw new Error("Failed to add comment");

      setReports((prev) =>
        prev.map((r) =>
          r.id === reportId
            ? {
                ...r,
                comments: [
                  ...(r.comments || []),
                  {
                    comment,
                    fullName: user.displayName || user.email,
                    createdAt: new Date().toISOString(),
                  },
                ],
              }
            : r
        )
      );

      setCommentText({ ...commentText, [reportId]: "" });

      Swal.fire({
        icon: "success",
        title: "Comment Added",
        text: "Your comment has been added",
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: "top-right",
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Could not add comment",
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: "top-right",
      });
    }
  };

  // ===============================
  // Render
  // ===============================
  return (
    <div className="p-6 space-y-6 text-white">
      <h1 className="text-2xl font-bold text-center">Supervisor Reports</h1>

     

      {loading && <div className="text-center text-lg">Loading...</div>}

      {!loading && reports.length === 0 && (
        <div className="text-center text-gray-400">No reports found.</div>
      )}

      {!loading &&
        reports.length > 0 &&
        reports.map((r) => (
          <div
            key={r.id}
            className="border-b border-gray-600 p-3 rounded bg-gray-800"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold">{getStationName(r.stationId)}</span>

              <select
                value={r.status}
                onChange={(e) => updateReportStatus(r.id, e.target.value)}
                className="bg-gray-700 text-white p-1 rounded"
              >
                <option value="new">New</option>
                <option value="in_review">In Review</option>
                <option value="assigned">Assigned</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>

            <p className="mb-1">{r.description}</p>
            <p className="text-sm text-gray-300 mb-2">Severity: {r.severity}</p>

            {/* Assign to Technician */}
            <div className="mb-2">
              <select
                value={r.assignedToUserId || ""}
                onChange={(e) => assignReport(r.id, e.target.value)}
                className="bg-gray-700 text-white p-1 rounded w-full"
              >
                <option value="">-- Assign to Technician --</option>
                {technicians.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.fullName}
                  </option>
                ))}
              </select>
            </div>

            {/* Comments */}
            <div className="mb-2">
              <h3 className="font-medium mb-1">Comments:</h3>
              {r.comments?.length ? (
                <ul className="list-disc pl-5 text-gray-200">
                  {r.comments.map((c, idx) => (
                    <li key={idx}>
                      <span className="font-semibold">{c.fullName}:</span>{" "}
                      {c.comment}{" "}
                      <span className="text-gray-400 text-xs">
                        {new Date(c.createdAt).toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400 text-sm">No comments yet.</p>
              )}
            </div>

            {/* Add Comment */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add a comment..."
                value={commentText[r.id] || ""}
                onChange={(e) =>
                  setCommentText({ ...commentText, [r.id]: e.target.value })
                }
                className="border rounded px-2 py-1 flex-1 bg-gray-700 text-white"
              />
              <button
                onClick={() => addComment(r.id)}
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Comment
              </button>
            </div>
          </div>
        ))}
    </div>
  );
}