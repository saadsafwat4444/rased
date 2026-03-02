 "use client";

import { useEffect, useState } from "react";
import { apiFetch } from "../../../utils/api";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [stations, setStations] = useState([]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    stationScope: [],
  });

  const [editRoleValue, setEditRoleValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  // ================= Fetch =================
  const fetchUsers = async () => {
    try {
      const data = await apiFetch('/users');
      console.log("Fetched users:", data);
      setUsers(Array.isArray(data) ? data : (data.users || []));
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
      setUsers([]);
    }
  };

  const fetchStations = async () => {
    try {
      const data = await apiFetch('/stations');
      setStations(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchStations();
  }, []);

  // ================= Helpers =================
  const getStationNames = (stationIds) => {
    if (!stationIds || stationIds.length === 0) return "No Station";
    const names = stationIds
      .map((id) => stations.find((s) => s.id === id)?.name)
      .filter(Boolean);
    return names.length ? names.join(", ") : "No Station";
  };

  // ================= Validation =================
  const validateSupervisor = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password.trim()) newErrors.password = "Password is required";

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!/^\d{11}$/.test(formData.phone)) {
      newErrors.phone = "Phone must be 11 digits";
    }

    if (!formData.stationScope.length) {
      newErrors.stationScope = "Select at least one station";
      alert("Please select at least one station for the supervisor!");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ================= Add Supervisor =================
  const handleAddSupervisor = async () => {
    if (!validateSupervisor()) return;

    const supervisorData = {
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      stationScope: formData.stationScope,
    };

    try {
      const res = await apiFetch('/users/add-supervisor', {
        method: 'POST',
        body: JSON.stringify(supervisorData),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Failed to add supervisor - Response text:", errorText);
        alert("Failed to add supervisor: " + errorText);
        return;
      }

      let result;
      try {
        const responseText = await res.text();
        result = responseText ? JSON.parse(responseText) : {};
      } catch (jsonError) {
        console.error("JSON parse error:", jsonError);
        alert("Server response is not valid JSON");
        return;
      }

      // setFormData({ fullName: "", email: "", password: "", phone: "", stationScope: [] });
      setErrors({});
      setShowAddModal(false);

      setUsers((prevUsers) => [
        ...prevUsers,
        {
          id: result.uid || 'temp-' + Date.now(),
          fullName: supervisorData.fullName,
          email: supervisorData.email,
          phone: supervisorData.phone,
          role: "Supervisor",
          stationScope: supervisorData.stationScope,
        },
      ]);

      alert("Supervisor added successfully!");
    } catch (err) {
      console.error("Error adding supervisor:", err);
      alert("Error adding supervisor: " + err.message);
    }
    if (!editRoleValue || !selectedUser) return;

    try {
      const res = await apiFetch(`/users/${selectedUser.id}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ role: editRoleValue }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Failed to update role - Response:", errorText);
        alert("Failed to update role: " + errorText);
        return;
      }

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === selectedUser.id
            ? { ...user, role: editRoleValue }
            : user
        )
      );

      setShowEditModal(false);
      setSelectedUser(null);
      alert("Role updated successfully!");
    } catch (err) {
      console.error("Error updating role:", err);
      alert("Error updating role: " + err.message);
    }
  };

  // ================= Pagination =================
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">User Management</h1>
        <button onClick={() => setShowAddModal(true)} className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Supervisor
        </button>
      </div>

      {/* Table */}
      <table className="w-full border text-center">
        <thead className="bg-gray-300">
          <tr>
            <th className="p-2">Name</th>
            <th className="p-2">Station</th>
            <th className="p-2">Phone</th>
            <th className="p-2">Role</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr key={user.id} className="border-t">
              <td className="p-2">{user.fullName}</td>
              <td className="p-2">{getStationNames(user.stationScope)}</td>
              <td className="p-2">{user.phone || "-"}</td>
              <td className="p-2">{user.role}</td>
              <td className="p-2 flex justify-center gap-2">
                <button
                  onClick={() => {
                    setSelectedUser(user);
                    setEditRoleValue(user.role);
                    setShowEditModal(true);
                  }}
                  className="bg-yellow-400 text-white px-3 py-1 rounded"
                >
                  Edit Role
                </button>

                <button onClick={() => handleDelete(user.id)} className="bg-red-500 text-white px-3 py-1 rounded">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      {users.length > usersPerPage && (
        <div className="flex justify-between items-center mt-6">
          <div>
            Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, users.length)} of {users.length}
          </div>

          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
            >
              Previous
            </button>

            <span>
              Page {currentPage} of {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Add Supervisor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-black text-white rounded-lg p-6 w-96 max-h-[85vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Add Supervisor</h2>

            <input
              placeholder="Full Name"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full p-2 border border-gray-600 rounded mb-1 bg-gray-800 text-white placeholder-gray-400"
            />
            {errors.fullName && <p className="text-red-400">{errors.fullName}</p>}

            <input
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-2 border border-gray-600 rounded mb-1 bg-gray-800 text-white placeholder-gray-400"
            />
            {errors.email && <p className="text-red-400">{errors.email}</p>}

            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full p-2 border border-gray-600 rounded mb-1 bg-gray-800 text-white placeholder-gray-400"
            />
            {errors.password && <p className="text-red-400">{errors.password}</p>}

            <input
              placeholder="Phone (11 digits)"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full p-2 border border-gray-600 rounded mb-1 bg-gray-800 text-white placeholder-gray-400"
            />
            {errors.phone && <p className="text-red-400">{errors.phone}</p>}

            <div className="mt-3">
              <p className="mb-2 font-semibold">Select Stations</p>

              {stations.map((station) => (
                <div key={station.id} className="flex items-center gap-2 mb-1">
                  <input
                    type="checkbox"
                    checked={formData.stationScope.includes(station.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({
                          ...formData,
                          stationScope: [...formData.stationScope, station.id],
                        });
                      } else {
                        setFormData({
                          ...formData,
                          stationScope: formData.stationScope.filter((id) => id !== station.id),
                        });
                      }
                    }}
                  />
                  <label>{station.name}</label>
                </div>
              ))}

              {errors.stationScope && <p className="text-red-400">{errors.stationScope}</p>}
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 border rounded">
                Cancel
              </button>

              <button onClick={handleAddSupervisor} className="bg-blue-500 px-4 py-2 rounded">
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Role Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-80">
            <h2 className="text-xl font-bold mb-4">Edit Role</h2>

            <select value={editRoleValue} onChange={(e) => setEditRoleValue(e.target.value)} className="w-full p-2 border rounded mb-4">
              <option value="Admin">Admin</option>
              <option value="Supervisor">Supervisor</option>
              <option value="User">User</option>
            </select>

            <div className="flex justify-end gap-2">
              <button onClick={() => setShowEditModal(false)} className="px-4 py-2 border rounded">
                Cancel
              </button>

              <button onClick={handleEditRole} className="bg-blue-500 text-white px-4 py-2 rounded">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}