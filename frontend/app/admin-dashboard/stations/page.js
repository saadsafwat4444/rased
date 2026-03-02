"use client";

import { useState, useEffect } from "react";
import LeafletMap from "../../../component/Map";
import { apiFetch } from "../../../utils/api";

const INITIAL_FORM = {
  stationNumber: "",
  name: "",
  region: "",
  address: "",
};

// Validation
function validateForm(data, location, stations, editStationId = null) {
  const err = {};
  const trim = (v) => (typeof v === "string" ? v.trim() : v);

  if (!trim(data.stationNumber)) {
    err.stationNumber = "Station number is required";
  } else if (!/^\d+$/.test(data.stationNumber)) {
    err.stationNumber = "Station number must be numeric";
  } else {
    // Check uniqueness
    const duplicate = stations.find(
      (s) =>
        String(s.id) === data.stationNumber &&
        s.id !== editStationId // exclude current station when editing
    );
    if (duplicate) {
      err.stationNumber = "This station number already exists";
    }
  }
  if (!trim(data.name)) err.name = "الاسم مطلوب";
  if (!trim(data.region)) err.region = "المنطقة مطلوبة";
  if (!trim(data.address)) err.address = "الموقع / العنوان مطلوب";

  const lat = location?.lat;
  const lng = location?.lng;
  if (lat == null || lng == null || Number.isNaN(Number(lat)) || Number.isNaN(Number(lng))) {
    err.location = "اختر الموقع من الخريطة";
  }

  return err;
}

export default function StationsPage() {
  const [stations, setStations] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editStation, setEditStation] = useState(null);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({ ...INITIAL_FORM });
  const [deleteStationId, setDeleteStationId] = useState(null);
  const [location, setLocation] = useState({ lat: 31.2, lng: 31.4 });
  const [currentPage, setCurrentPage] = useState(1);
  const stationsPerPage = 10;

  // Set location and fetch address from API
  const setLocationAndFetchAddress = async (lat, lng) => {
    setLocation({ lat, lng });
    try {
      const res = await fetch(`/api/reverseGeocode?lat=${lat}&lon=${lng}`);
      const data = await res.json();
      setFormData((prev) => ({ ...prev, address: data.address || "" }));
    } catch {
      setFormData((prev) => ({ ...prev, address: "" }));
    }
  };

  const handleLocationChange = (newLocation) => {
    setLocationAndFetchAddress(newLocation.lat, newLocation.lng);
  };

  // On modal open for Add: get user location
  useEffect(() => {
    if (!showModal || editStation || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setLocationAndFetchAddress(lat, lng);
      },
      () => {},
      { enableHighAccuracy: true }
    );
  }, [showModal, editStation]);

  // Load stations
  const loadStations = async () => {
    try {
      const data = await apiFetch('/stations');
      return data;
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const data = await loadStations();
      if (!cancelled) setStations(data);
    })();
    return () => { cancelled = true; };
  }, []);

  const handleSubmit = async () => {
    const validationErrors = validateForm(formData, location, stations, editStation?.id);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const payload = {
      ...formData,
      lat: Number(location.lat),
      lng: Number(location.lng),
    };

    try {
      if (editStation) {
        await apiFetch(`/stations/${editStation.id}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
      } else {
        await apiFetch('/stations', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }

      setShowModal(false);
      setEditStation(null);
      setFormData({ ...INITIAL_FORM });
      setErrors({});

      const data = await loadStations();
      setStations(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this station?")) return;
    await apiFetch(`/stations/${id}`, { method: 'DELETE' });
    const data = await loadStations();
    setStations(data);
  };

  const filteredStations = stations.filter((s) =>
    s.region?.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination logic
  const indexOfLastStation = currentPage * stationsPerPage;
  const indexOfFirstStation = indexOfLastStation - stationsPerPage;
  const currentStations = filteredStations.slice(indexOfFirstStation, indexOfLastStation);
  const totalPages = Math.ceil(filteredStations.length / stationsPerPage);

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

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4 items-center">
        <h1 className="text-2xl font-bold">Stations Management</h1>
        <button
          onClick={() => {
            setEditStation(null);
            setFormData({ ...INITIAL_FORM });
            setErrors({});
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Station
        </button>
      </div>

      <input
        type="text"
        placeholder="Search by region..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      />

      <table className="w-full border text-center">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="p-2">Number</th>
            <th className="p-2">Name</th>
            <th className="p-2">Region</th>
            <th className="p-2">Address</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentStations.map((station) => (
            <tr key={station.id} className="border-t">
              <td className="p-2">{station.id}</td>
              <td className="p-2">{station.name}</td>
              <td className="p-2">{station.region}</td>
              <td className="p-2">{station.address}</td>
              <td className="p-2 flex justify-center gap-2">
                <button
                  onClick={() => {
                    setEditStation(station);
                    setFormData({
                      stationNumber: station.id,
                      name: station.name,
                      region: station.region,
                      address: station.address || "",
                    });
                    setLocation({
                      lat: station.lat ?? 31.2,
                      lng: station.lng ?? 31.4,
                    });
                    setShowModal(true);
                  }}
                  className="bg-yellow-400 px-3 py-1 rounded text-white"
                >
                  Edit
                </button>
                <button
                 onClick={() => setDeleteStationId(station.id)}
                  className="bg-red-500 px-3 py-1 rounded text-white"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      {filteredStations.length > stationsPerPage && (
        <div className="flex justify-between items-center mt-8">
          <div className="text-sm text-gray-600">
            Showing {indexOfFirstStation + 1} to {Math.min(indexOfLastStation, filteredStations.length)} of {filteredStations.length} stations
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg ${
                currentPage === 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg ${
                currentPage === totalPages
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center p-4">
          <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="p-6 overflow-y-auto flex-1">
              <h2 className="text-xl font-bold mb-4">
                {editStation ? "Edit Station" : "Add Station"}
              </h2>

              <div className="space-y-3">
                <input
                  placeholder="Station Number"
                  value={formData.stationNumber}
                  onChange={(e) => setFormData({ ...formData, stationNumber: e.target.value })}
                  className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-2 rounded w-full"
                />
                {errors.stationNumber && <p className="text-red-500 text-sm">{errors.stationNumber}</p>}

                <input
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-2 rounded w-full"
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

                <input
                  placeholder="Region"
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-2 rounded w-full"
                />
                {errors.region && <p className="text-red-500 text-sm">{errors.region}</p>}

                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    الموقع / العنوان (يُعبأ من الخريطة أو يدويًا)
                  </label>
                  <input
                    placeholder="مثال: شبين الكوم المنوفيه"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-2 rounded w-full"
                  />
                  {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
                  {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
                </div>

                <div className="pt-2 rounded-xl border border-gray-300 dark:border-gray-600 overflow-hidden">
                  <LeafletMap location={location} setLocation={handleLocationChange} />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditStation(null);
                }}
                className="border border-gray-300 dark:border-gray-600 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
