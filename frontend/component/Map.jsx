// "use client";

// import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
// import { useState, useEffect } from "react";
// import L from "leaflet";

 
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
//   iconUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
//   shadowUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
// });

// function LocationMarker({ location, setLocation }) {
//   useMapEvents({
//     click(e) {
//       setLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
//     },
//   });

//   return (
//     <Marker
//       position={location}
//       draggable
//       eventHandlers={{
//         dragend: (e) => {
//           setLocation({
//             lat: e.target.getLatLng().lat,
//             lng: e.target.getLatLng().lng,
//           });
//         },
//       }}
//     />
//   );
// }

// export default function LeafletMap({ location, setLocation }) {
//   const [address, setAddress] = useState("");

//   // Fetch العنوان من API Route
//   useEffect(() => {
//     const fetchAddress = async () => {
//       try {
//         const res = await fetch(
//           `/api/reverseGeocode?lat=${location.lat}&lon=${location.lng}`
//         );
//         const data = await res.json();
//         if (data.address) setAddress(data.address);
//       } catch (err) {
//         setAddress("");
//       }
//     };
//     fetchAddress();
//   }, [location]);

//   return (
//     <div className="flex flex-col gap-3">
//       <MapContainer
//         center={location}
//         zoom={15}
//         scrollWheelZoom={true}
//         className="w-full h-80 rounded-xl shadow-md"
//       >
//         <TileLayer
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
//         /> 
//         <LocationMarker location={location} setLocation={setLocation} />
//       </MapContainer>

//       {address && (
//         <div className="bg-gray-800 border border-gray-700 text-white placeholder-gray-400 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition">
//           📍 <span className="font-semibold">العنوان:</span> {address}
"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";

// Dynamically import the map to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

const useMapEvents = dynamic(
  () => import("react-leaflet").then((mod) => mod.useMapEvents),
  { ssr: false }
);

import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

function LocationMarker({ location, setLocation }) {
  const mapEvents = useMapEvents({
    click(e) {
      setLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });

  return (
    <Marker
      position={location}
      draggable
      eventHandlers={{
        dragend: (e) => {
          setLocation({
            lat: e.target.getLatLng().lat,
            lng: e.target.getLatLng().lng,
          });
        },
      }}
    />
  );
}

export default function LeafletMap({ location, setLocation }) {
  const [mapReady, setMapReady] = useState(false);
  const [address, setAddress] = useState("");
  const mapRef = useRef();

  // Force recenter map on location change
  useEffect(() => {
    if (mapRef.current && mapReady) {
      mapRef.current.setView([location.lat, location.lng], mapRef.current.getZoom());
    }
  }, [location, mapReady]);

  // Fetch address from reverseGeocode API
  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const res = await fetch(
          `/api/reverseGeocode?lat=${location.lat}&lon=${location.lng}`
        );
        const data = await res.json();
        setAddress(data.address || "");
      } catch {
        setAddress("");
      }
    };
    if (mapReady) {
      fetchAddress();
    }
  }, [location, mapReady]);

  useEffect(() => {
    setMapReady(true);
  }, []);

  if (!mapReady) {
    return (
      <div className="w-full h-80 bg-gray-800 rounded-xl flex items-center justify-center">
        <div className="text-white">Loading map...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <MapContainer
        center={location}
        zoom={15}
        scrollWheelZoom={true}
        className="w-full h-80 rounded-xl shadow-md"
        whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <LocationMarker location={location} setLocation={setLocation} />
      </MapContainer>

      {address && (
        <div className="bg-gray-800 border border-gray-700 text-white p-3 rounded-xl transition">
          📍 <span className="font-semibold">العنوان:</span> {address}
        </div>
      )}
    </div>
  );
}