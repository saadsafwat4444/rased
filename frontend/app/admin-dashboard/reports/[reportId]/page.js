// "use client";
// import { useEffect, useState } from "react";
// import { auth, db } from "../../../../firebase/firebase-client";
// import { doc, getDoc, collection, getDocs,where, query, orderBy } from "firebase/firestore";
// import { useParams } from "next/navigation";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import dynamic from "next/dynamic";

// // Leaflet map (load dynamically for SSR)
// const Map = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
// const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
// const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
// const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });
// delete L.Icon.Default.prototype._getIconUrl;

// L.Icon.Default.mergeOptions({
//   iconRetinaUrl:
//     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
//   iconUrl:
//     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
//   shadowUrl:
//     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
// });
// export default function ReportDetails() {

 
//   const params = useParams();
//   const { reportId } = params;

//   const [report, setReport] = useState(null);

//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [address, setAddress] = useState("");

//   useEffect(() => {
//     const fetchReport = async () => {
//       setLoading(true);
//       try {
//         // Fetch main report
//         const reportRef = doc(db, "reports", reportId);
//         const reportSnap = await getDoc(reportRef);
//         if (reportSnap.exists()) {
//           const data = reportSnap.data();
//           setReport(data);

//           // Reverse geocoding
//           if (data.location?.lat && data.location?.lng) {
//             const res = await fetch(`/api/reverseGeocode?lat=${data.location.lat}&lon=${data.location.lng}`);

//             const json = await res.json();
//             setAddress(json.address || "");
//           }
//         }

//         // Fetch report events
//         const eventsRef = collection(db, "report_events");
//         const q = query(eventsRef, where("reportId", "==", reportId), orderBy("createdAt", "asc"));
//         const snapshot = await getDocs(q);
//         const eventsData = snapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setEvents(eventsData);
//       } catch (err) {
//         console.error("Failed to fetch report details:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchReport();
//   }, [reportId]);

//   if (loading)
//     return (
//       <div className="flex items-center justify-center h-screen bg-gray-900 text-white text-lg">
//         Loading report details...
//       </div>
//     );

//   if (!report)
//     return (
//       <div className="flex items-center justify-center h-screen bg-gray-900 text-white text-lg">
//         Report not found.
//       </div>
//     );

//   return (
//     <div className="min-h-screen p-8 bg-gray-900 text-gray-100">
//       <h1 className="text-3xl font-bold mb-6 text-indigo-400">
//         Report Details – تفاصيل البلاغ
//       </h1>

//       {/* Description */}
//       <div className="bg-gray-800 p-5 rounded-2xl mb-6 shadow-lg">
//         <h2 className="text-xl font-semibold mb-2 text-indigo-300">وصف البلاغ</h2>
//         <p className="text-gray-300">{report.description}</p>
//       </div>

//       {/* Media */}
//       {report.mediaUrls && report.mediaUrls.length > 0 && (
//         <div className="bg-gray-800 p-5 rounded-2xl mb-6 shadow-lg">
//           <h2 className="text-xl font-semibold mb-4 text-indigo-300">الصور والفيديوهات</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//             {report.mediaUrls.map((url, i) => {
//               const isVideo = url.match(/\.(mp4|webm|ogg)$/i);
//               return isVideo ? (
//                 <video
//                   key={i}
//                   src={url}
//                   controls
//                   className="w-full h-48 object-cover rounded-xl bg-gray-700"
//                 />
//               ) : (
//                 <img
//                   key={i}
//                   src={url}
//                   alt={`media-${i}`}
//                   className="w-full h-48 object-cover rounded-xl"
//                 />
//               );
//             })}
//           </div>
//         </div>
//       )}

//       {/* Map */}
//       {report.location?.lat && report.location?.lng && (
//         <div className="bg-gray-800 p-5 rounded-2xl mb-6 shadow-lg">
//           <h2 className="text-xl font-semibold mb-4 text-indigo-300">الموقع على الخريطة</h2>
//           <div className="h-64 w-full rounded-xl overflow-hidden">
//             <Map
//               center={[report.location.lat, report.location.lng]}
//               zoom={16}
//               scrollWheelZoom={false}
//               className="h-full w-full"
//             >
//               <TileLayer
//                 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                 attribution="&copy; OpenStreetMap contributors"
//               />
//               <Marker position={[report.location.lat, report.location.lng]}>
//                 <Popup>{address || "Loading address..."}</Popup>
//               </Marker>
//             </Map>
//           </div>
//           {address && <p className="mt-2 text-gray-300">العنوان: {address}</p>}
//         </div>
//       )}

//       {/* Timeline */}
//       <div className="bg-gray-800 p-5 rounded-2xl shadow-lg">
//         <h2 className="text-xl font-semibold mb-4 text-indigo-300">Timeline</h2>
//         {events.length === 0 ? (
//           <p className="text-gray-400">لا توجد أحداث مرتبطة بالبلاغ.</p>
//         ) : (
//           <ul className="border-l-2 border-indigo-400 pl-4">
//             {events.map((event) => (
//               <li key={event.id} className="mb-4 relative">
//                 <span className="absolute -left-3 top-1 w-3 h-3 bg-indigo-400 rounded-full"></span>
//                 <p className="text-gray-300">{event.description}</p>
//                 {event.createdAt && (
//                   <p className="text-gray-500 text-sm mt-1">
//                     {new Date(event.createdAt.seconds * 1000).toLocaleString()}
//                   </p>
//                 )}
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// }

 

 
 
// // export default function ReportDetails() {
// //   const params = useParams();
// //   const reportId = params?.reportId;

// //   const [report, setReport] = useState(null);
// //   const [events, setEvents] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [address, setAddress] = useState("");

// //   useEffect(() => {
// //     if (!reportId) return;

// //     const fetchReport = async () => {
// //       setLoading(true);

// //       try {
// //         // 1️⃣ جلب البلاغ
// //         const reportRef = doc(db, "reports", reportId);
// //         const reportSnap = await getDoc(reportRef);

// //         if (reportSnap.exists()) {
// //           const data = reportSnap.data();
// //           setReport(data);

// //           // 2️⃣ Reverse Geocoding من API route
// //           if (data.location?.lat && data.location?.lng) {
// //             const res = await fetch(
// //               `/api/reverseGeocode?lat=${data.location.lat}&lon=${data.location.lng}`
// //             );

// //             const json = await res.json();

// //             // مهم: بنستخدم address مش display_name
// //             setAddress(json.address || "");
// //           }
// //         }

// //         // 3️⃣ جلب Timeline
// //         const eventsRef = collection(db, "report_events");
// //         const q = query(
// //           eventsRef,
// //           where("reportId", "==", reportId),
// //           orderBy("createdAt", "asc")
// //         );

// //         const snapshot = await getDocs(q);

// //         const eventsData = snapshot.docs.map((doc) => ({
// //           id: doc.id,
// //           ...doc.data(),
// //         }));

// //         setEvents(eventsData);
// //       } catch (err) {
// //         console.error("Failed to fetch report details:", err);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchReport();
// //   }, [reportId]);

// //   if (loading) {
// //     return (
// //       <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
// //         Loading report details...
// //       </div>
// //     );
// //   }

// //   if (!report) {
// //     return (
// //       <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
// //         Report not found.
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen p-8 bg-gray-900 text-gray-100">
// //       <h1 className="text-3xl font-bold mb-6 text-indigo-400">
// //         Report Details – تفاصيل البلاغ
// //       </h1>

// //       {/* Description */}
// //       <div className="bg-gray-800 p-5 rounded-2xl mb-6">
// //         <h2 className="text-xl font-semibold mb-2 text-indigo-300">
// //           وصف البلاغ
// //         </h2>
// //         <p>{report.description}</p>
// //       </div>

// //       {/* Map */}
// //       {report.location?.lat && report.location?.lng && (
// //         <div className="bg-gray-800 p-5 rounded-2xl mb-6">
// //           <h2 className="text-xl font-semibold mb-4 text-indigo-300">
// //             الموقع على الخريطة
// //           </h2>

// //           <div className="h-64 w-full rounded-xl overflow-hidden">
// //             <Map
// //               center={[report.location.lat, report.location.lng]}
// //               zoom={16}
// //               scrollWheelZoom={false}
// //               className="h-full w-full"
// //             >
// //               <TileLayer
// //                 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
// //                 attribution="&copy; OpenStreetMap contributors"
// //               />
// //               <Marker position={[report.location.lat, report.location.lng]}>
// //                 <Popup>{address || "Loading address..."}</Popup>
// //               </Marker>
// //             </Map>
// //           </div>

// //           {address && (
// //             <p className="mt-2 text-gray-300">العنوان: {address}</p>
// //           )}
// //         </div>
// //       )}

// //       {/* Timeline */}
// //       <div className="bg-gray-800 p-5 rounded-2xl">
// //         <h2 className="text-xl font-semibold mb-4 text-indigo-300">
// //           Timeline
// //         </h2>

// //         {events.length === 0 ? (
// //           <p className="text-gray-400">
// //             لا توجد أحداث مرتبطة بالبلاغ.
// //           </p>
// //         ) : (
// //           <ul className="border-l-2 border-indigo-400 pl-4">
// //             {events.map((event) => (
// //               <li key={event.id} className="mb-4 relative">
// //                 <span className="absolute -left-3 top-1 w-3 h-3 bg-indigo-400 rounded-full"></span>
// //                 <p>{event.description}</p>

// //                 {event.createdAt && (
// //                   <p className="text-gray-500 text-sm mt-1">
// //                     {new Date(
// //                       event.createdAt.seconds * 1000
// //                     ).toLocaleString()}
// //                   </p>
// //                 )}
// //               </li>
// //             ))}
// //           </ul>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }

// "use client";

// import { useEffect, useState } from "react";
// import { db } from "../../../../firebase/firebase-client";
// import {
//   doc,
//   getDoc,
//   collection,
//   getDocs,
//   where,
//   query,
//   orderBy,
// } from "firebase/firestore";
// import { useParams } from "next/navigation";
// import dynamic from "next/dynamic";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";

// // Leaflet dynamic imports (SSR safe)
// const Map = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
// const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
// const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
// const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });

// // Fix Leaflet marker icon URLs
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: "/leaflet/marker-icon-2x.png",
//   iconUrl: "/leaflet/marker-icon.png",
//   shadowUrl: "/leaflet/marker-shadow.png",
// });

// export default function ReportDetails() {
//   const { reportId } = useParams();
//   const [report, setReport] = useState(null);
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [address, setAddress] = useState("");

//   useEffect(() => {
//     if (!reportId) return;

//     const fetchReport = async () => {
//       setLoading(true);
//       try {
//         // Fetch main report
//         const reportRef = doc(db, "reports", reportId);
//         const reportSnap = await getDoc(reportRef);

//         if (reportSnap.exists()) {
//           const data = reportSnap.data();
//           setReport(data);

//           // Reverse geocoding
//           if (data.location?.lat && data.location?.lng) {
//             try {
//               const res = await fetch(
//                 `/api/reverseGeocode?lat=${data.location.lat}&lon=${data.location.lng}`
//               );
//               const json = await res.json();
//               setAddress(json.address || "");
//             } catch {
//               setAddress("");
//             }
//           }
//         }

//         // Fetch report events
//         const eventsRef = collection(db, "report_events");
//         const q = query(eventsRef, where("reportId", "==", reportId), orderBy("createdAt", "asc"));
//         const snapshot = await getDocs(q);
//         const eventsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//         setEvents(eventsData);
//       } catch (err) {
//         console.error("Failed to fetch report details:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchReport();
//   }, [reportId]);

//   if (loading) return <div className="flex items-center justify-center h-screen bg-gray-900 text-white">Loading report details...</div>;
//   if (!report) return <div className="flex items-center justify-center h-screen bg-gray-900 text-white">Report not found.</div>;

//   return (
//     <div className="min-h-screen p-6 md:p-10 bg-gray-900 text-gray-100">
//       <h1 className="text-3xl font-bold mb-6 text-indigo-400 text-center">Report Details – تفاصيل البلاغ</h1>

//       {/* Description */}
//       <div className="bg-gray-800 p-5 rounded-2xl mb-6 shadow-lg">
//         <h2 className="text-xl font-semibold mb-2 text-indigo-300">وصف البلاغ</h2>
//         <p>{report.description || "No description provided."}</p>
//       </div>

//       {/* Media + Map grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//         {/* Media */}
//         <div className="bg-gray-800 p-5 rounded-2xl shadow-lg">
//           <h2 className="text-xl font-semibold mb-4 text-indigo-300">الصور والفيديوهات</h2>
//           {report.mediaUrls && report.mediaUrls.length > 0 ? (
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
//               {report.mediaUrls.map((url, i) => {
//                 const isVideo = url.match(/\.(mp4|webm|ogg|mov|avi)$/i);
//                 return isVideo ? (
//                   <video key={i} src={url} controls className="w-full h-48 object-cover rounded-xl bg-gray-700" />
//                 ) : (
//                   <img key={i} src={url} alt={`media-${i}`} className="w-full h-48 object-cover rounded-xl" />
//                 );
//               })}
//             </div>
//           ) : (
//             <p className="text-gray-400">No media available.</p>
//           )}
//         </div>

//         {/* Map */}
//         <div className="bg-gray-800 p-5 rounded-2xl shadow-lg">
//           <h2 className="text-xl font-semibold mb-4 text-indigo-300">الموقع على الخريطة</h2>
//           {report.location?.lat && report.location?.lng ? (
//             <div className="h-64 w-full rounded-xl overflow-hidden">
//               <Map center={[report.location.lat, report.location.lng]} zoom={16} scrollWheelZoom={false} className="h-full w-full">
//                 <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
//                 <Marker position={[report.location.lat, report.location.lng]}>
//                   <Popup>{address || "Loading address..."}</Popup>
//                 </Marker>
//               </Map>
//             </div>
//           ) : (
//             <p className="text-gray-400">No location data available.</p>
//           )}
//           {address && <p className="mt-2 text-gray-300">العنوان: {address}</p>}
//         </div>
//       </div>

//       {/* Timeline */}
//       <div className="bg-gray-800 p-5 rounded-2xl shadow-lg">
//         <h2 className="text-xl font-semibold mb-4 text-indigo-300">Timeline</h2>
//         {events.length === 0 ? (
//           <p className="text-gray-400">لا توجد أحداث مرتبطة بالبلاغ.</p>
//         ) : (
//           <ul className="border-l-2 border-indigo-400 pl-4">
//             {events.map((event) => (
//               <li key={event.id} className="mb-4 relative">
//                 <span className="absolute -left-3 top-1 w-3 h-3 bg-indigo-400 rounded-full"></span>
//                 <p className="text-gray-300">{event.description}</p>
//                 {event.createdAt && (
//                   <p className="text-gray-500 text-sm mt-1">{new Date(event.createdAt.seconds * 1000).toLocaleString()}</p>
//                 )}
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { db } from "../../../../firebase/firebase-client";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  where,
  query,
  orderBy,
} from "firebase/firestore";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Leaflet dynamic imports (SSR safe)
const Map = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});

export default function ReportDetails() {
  const { reportId } = useParams();
  const [report, setReport] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (!reportId) return;

    const fetchAll = async () => {
      setLoading(true);

      try {
        // 1️⃣ Fetch report + reverse geocode
        const reportRef = doc(db, "reports", reportId);
        const reportSnap = await getDoc(reportRef);

        if (!reportSnap.exists()) throw new Error("Report not found");

        const data = reportSnap.data();
        setReport(data);

        // Reverse geocoding if location exists
        const addressPromise =
          data.location?.lat && data.location?.lng
            ? fetch(`/api/reverseGeocode?lat=${data.location.lat}&lon=${data.location.lng}`)
                .then((res) => res.json())
                .then((json) => json.address || "")
                .catch(() => "")
            : Promise.resolve("");

        // 2️⃣ Fetch report events
        const eventsRef = collection(db, "report_events");
        const q = query(eventsRef, where("reportId", "==", reportId), orderBy("createdAt", "asc"));
        const eventsPromise = getDocs(q).then((snapshot) =>
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );

        // Run both promises in parallel
        const [fetchedAddress, fetchedEvents] = await Promise.all([addressPromise, eventsPromise]);
        setAddress(fetchedAddress);
        setEvents(fetchedEvents);
      } catch (err) {
        console.error("Failed to fetch report details:", err);
        setReport(null);
        setEvents([]);
        setAddress("");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [reportId]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        Loading report details...
      </div>
    );

  if (!report)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        Report not found.
      </div>
    );

  return (
    <div className="min-h-screen p-6 md:p-10 bg-gray-900 text-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-indigo-400 text-center">
        Report Details – تفاصيل البلاغ
      </h1>

      {/* Description */}
      <div className="bg-gray-800 p-5 rounded-2xl mb-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-2 text-indigo-300">وصف البلاغ</h2>
        <p>{report.description || "No description provided."}</p>
      </div>

      {/* Media + Map grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Media */}
        <div className="bg-gray-800 p-5 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-indigo-300">الصور والفيديوهات</h2>
          {report.mediaUrls?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
              {report.mediaUrls.map((url, i) => {
                const isVideo = url.match(/\.(mp4|webm|ogg|mov|avi)$/i);
                return isVideo ? (
                  <video key={i} src={url} controls className="w-full h-48 object-cover rounded-xl bg-gray-700" />
                ) : (
                  <img key={i} src={url} alt={`media-${i}`} className="w-full h-48 object-cover rounded-xl" />
                );
              })}
            </div>
          ) : (
            <p className="text-gray-400">No media available.</p>
          )}
        </div>

        {/* Map */}
        <div className="bg-gray-800 p-5 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-indigo-300">الموقع على الخريطة</h2>
          {report.location?.lat && report.location?.lng ? (
            <div className="h-64 w-full rounded-xl overflow-hidden">
              <Map center={[report.location.lat, report.location.lng]} zoom={16} scrollWheelZoom={false} className="h-full w-full">
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />
                <Marker position={[report.location.lat, report.location.lng]}>
                  <Popup>{address || "Loading address..."}</Popup>
                </Marker>
              </Map>
            </div>
          ) : (
            <p className="text-gray-400">No location data available.</p>
          )}
          {address && <p className="mt-2 text-gray-300">العنوان: {address}</p>}
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-gray-800 p-5 rounded-2xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-indigo-300">Timeline</h2>
        {events.length === 0 ? (
          <p className="text-gray-400">لا توجد أحداث مرتبطة بالبلاغ.</p>
        ) : (
          <ul className="border-l-2 border-indigo-400 pl-4">
            {events.map((event) => (
              <li key={event.id} className="mb-4 relative">
                <span className="absolute -left-3 top-1 w-3 h-3 bg-indigo-400 rounded-full"></span>
                <p className="text-gray-300">{event.description}</p>
                {event.createdAt && (
                  <p className="text-gray-500 text-sm mt-1">
                    {new Date(event.createdAt.seconds * 1000).toLocaleString()}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}