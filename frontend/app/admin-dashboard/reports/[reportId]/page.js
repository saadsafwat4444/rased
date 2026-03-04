

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
    <div className="min-h-screen p-4 md:p-8 bg-gray-900 text-gray-100">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-indigo-400 text-center">
        Report Details
      </h1>

      {/* Description */}
      <div className="bg-gray-800 p-4 md:p-6 rounded-xl md:rounded-2xl mb-4 md:mb-6 shadow-lg">
        <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 text-indigo-300">Description</h2>
        <p className="text-sm md:text-base leading-relaxed">{report.description || "No description provided."}</p>
      </div>

      {/* Media + Map grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
        {/* Media */}
        <div className="bg-gray-800 p-4 md:p-6 rounded-xl md:rounded-2xl shadow-lg">
          <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-indigo-300">Media Files</h2>
          {report.mediaUrls?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              {report.mediaUrls.map((url, i) => {
                const isVideo = url.match(/\.(mp4|webm|ogg|mov|avi)$/i);
                return isVideo ? (
                  <video key={i} src={url} controls className="w-full h-40 md:h-48 object-cover rounded-xl bg-gray-700" />
                ) : (
                  <img key={i} src={url} alt={`media-${i}`} className="w-full h-40 md:h-48 object-cover rounded-xl" />
                );
              })}
            </div>
          ) : (
            <p className="text-gray-400">No media available.</p>
          )}
        </div>

        {/* Map */}
        <div className="bg-gray-800 p-4 md:p-6 rounded-xl md:rounded-2xl shadow-lg">
          <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-indigo-300">Location</h2>
          {report.location?.lat && report.location?.lng ? (
            <div className="h-48 md:h-64 w-full rounded-xl overflow-hidden">
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
          {address && <p className="mt-2 text-gray-300 text-sm md:text-base">Address: {address}</p>}
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-gray-800 p-4 md:p-6 rounded-xl md:rounded-2xl shadow-lg">
        <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-indigo-300">Timeline</h2>
        {events.length === 0 ? (
          <p className="text-gray-400">No events associated with this report.</p>
        ) : (
          <ul className="border-l-2 border-indigo-400 pl-4 space-y-4">
            {events.map((event) => (
              <li key={event.id} className="mb-4 relative">
                <span className="absolute -left-3 top-1 w-3 h-3 bg-indigo-400 rounded-full"></span>
                <div className="space-y-2">
                  {event.action === "comment" && (
                    <p className="text-gray-300 text-sm md:text-base">{event.note}</p>
                  )}
                  {event.action === "status_change" && (
                    <p className="text-gray-300 text-sm md:text-base">
                      Status changed from "{event.fromStatus}" to "{event.toStatus}"
                    </p>
                  )}
                  {event.action === "assignment" && (
                    <p className="text-gray-300 text-sm md:text-base">
                      Assigned to userId: {event.actorId}
                    </p>
                  )}
                  {event.createdAt && (
                    <p className="text-gray-500 text-xs md:text-sm mt-1">
                      {new Date(event.createdAt.seconds * 1000).toLocaleString()}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}