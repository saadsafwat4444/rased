 "use client";

import { auth } from "../../../firebase/firebase-client";
import { useRouter } from "next/navigation"; 
import { useEffect, useState } from "react";
import LeafletMap from "../../../component/Map";
import Swal from "sweetalert2";
import { apiFetch } from "../../../utils/api";

export default function NewReport() {
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Electricity");
  const [severity, setSeverity] = useState("low");
  const [stationScope, setStationScope] = useState([]);
  const [stationId, setStationId] = useState("");
  const [status, setStatus] = useState("new");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [location, setLocation] = useState({ lat: 31.2, lng: 31.4 });
  const [locationName, setLocationName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [stations, setStations] = useState([]);

  const router = useRouter();
  const user = auth.currentUser;

  // Fetch stations from Firestore
  useEffect(() => {
    const fetchStations = async () => {
      try {
        const data = await apiFetch('/stations');
        setStations(data);
      } catch (err) {
        console.error("Error fetching stations:", err);
      }
    };

    fetchStations();
  }, []);

  const updateStationScope = (selectedStationNames) => {
  const ids = stations
    .filter(station => selectedStationNames.includes(station.name))
    .map(station => station.id);
  setStationScope(ids);
};


const handleStationChange = (e) => {
  const selectedName = stations.find(station => station.id === e.target.value)?.name;
  setStationId(e.target.value);

  if (selectedName) {
    updateStationScope([selectedName]);
  } else {
    setStationScope([]);
  }
};




  const validate = () => {
    const newErrors = { description: "", stationId: "", mediaFiles: "" };

    if (!description) {
      newErrors.description = "Description is required";
    }
    if (!stationId) {
      newErrors.stationId = "Station is required";
    }
    if (mediaFiles.length === 0) {
      newErrors.mediaFiles = "At least one media file is required";
    }

    setErrors(newErrors);
    return !newErrors.description && !newErrors.stationId && !newErrors.mediaFiles;
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setLocation({ lat, lng });

        try {
          const res = await fetch(`/api/reverseGeocode?lat=${lat}&lon=${lng}`);
          const data = await res.json();
          setLocationName(data.address || "Unknown");
        } catch (err) {
          console.error("Error fetching location name:", err);
          setLocationName("Unknown");
        }
      });
    }
  }, []);

  const handleFileChange = (e) => {
    if (!e.target.files) return;
    setMediaFiles([...e.target.files]);
  };
 



 



const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return;
  if (!user) return alert("You must be logged in!");

  setLoading(true);

  try {
    const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dwaek4qqz/upload";
    const UPLOAD_PRESET = "unsigned_user_upload";

    // رفع الملفات
    const mediaUrls = await Promise.all(
      mediaFiles.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", UPLOAD_PRESET);

        const res = await fetch(CLOUDINARY_URL, { method: "POST", body: formData });
        if (!res.ok) throw new Error("Upload failed");
        const data = await res.json();
        return data.secure_url;
      })
    );

    const token = await user.getIdToken();

    // تجهيز payload
    const reportPayload = {
      description,
      category,
      severity,
      stationId: String(stationId),       
      stationScope: [String(stationId)],   
      lat: location.lat,
      lng: location.lng,
      locationName,
      mediaUrls,
    };

    // ✅ console.log آمنة
    if (reportPayload.stationScope && reportPayload.stationScope.length > 0) {
      console.log('Station ID type:', typeof reportPayload.stationScope[0]);
      console.log('Station ID value:', reportPayload.stationScope[0]);
    } else {
      console.log('StationScope is empty or undefined, using stationId instead');
      console.log('Station ID type:', typeof reportPayload.stationId);
      console.log('Station ID value:', reportPayload.stationId);
    }

    // إرسال البلاغ
    const res = await apiFetch('/reports', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(reportPayload),
    });

    if (res.ok) {
      await Swal.fire({
        icon: "success",
        title: "Report created successfully!",
        showConfirmButton: false,
        timer: 2000,
      });
      router.push("/user-dashboard/my-report");
    } else {
      const err = await res.json();
      await Swal.fire({
        icon: "error",
        title: "Error occurred!",
        text: err.message,
      });
    }
  } catch (error) {
    console.error("Upload/Submission error:", error);
    await Swal.fire({
      icon: "error",
      title: "Upload Failed",
      text: error.message,
    });
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 md:px-10 py-10 relative">
      {/* Main Form */}
      <div className="w-full max-w-2xl bg-gray-900/90 backdrop-blur-lg rounded-2xl shadow-2xl p-6 md:p-10 border border-gray-700">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center tracking-wide">Create New Report</h1>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          {/* Description */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">Problem Description</label>
            <input
              type="text"
             
              placeholder="Write a clear description of the problem..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}

             

              className="bg-gray-800 border border-gray-700 text-white placeholder-gray-400 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition w-full"
               
            />
            {errors.description&&(
                <p className="text-red-500 mt-1">{errors.description}</p>
            )}

          </div>

          {/* Category & Severity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-300">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-gray-800 border border-gray-700 text-white placeholder-gray-400 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition w-full"
              >
                <option value="Electricity">Electricity</option>
                <option value="Equipment">Equipment</option>
                <option value="Cleaning">Cleaning</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-300">Severity</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="bg-gray-800 border border-gray-700 text-white placeholder-gray-400 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition w-full"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>


      

          {/* Station */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">Select Station</label>
            <select
              value={stationId}
              // onChange={(e) => setStationId(e.target.value)}

              onChange={handleStationChange}
              className="bg-gray-800 border border-gray-700 text-white placeholder-gray-400 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition w-full"
            >
              <option value="">Choose a station...</option>
              {stations.map((station) => (
                <option key={station.id} value={station.id}>
                  {station.name}
                </option>
              ))}
            </select>
            {errors.stationId && (
              <p className="text-red-500 mt-1">{errors.stationId}</p>
            )}
          </div>

          {/* File Upload */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">Upload Images / Videos</label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="bg-gray-800 border border-gray-700 text-white placeholder-gray-400 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition w-full"
            />
          </div>

          {/* Map */}
          <div className="h-64 md:h-96 w-full rounded-xl overflow-hidden border border-gray-700">
            <LeafletMap location={location} setLocation={setLocation} />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 transition text-white py-3 rounded-xl font-semibold mt-4 disabled:opacity-50 disabled:cursor-not-allowed shadow-md w-full"
          >
            {loading ? "Loading..." : "Submit Report"}
          </button>
        </form>
      </div>
    </div>
  );
}