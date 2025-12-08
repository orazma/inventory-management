"use client";

import { useGetAllAdminsQuery, useCreateAdminMutation, useDeleteAdminMutation } from "@/state/api";
import { useAppSelector } from "@/app/redux";
import Header from "@/app/(components)/Header";
import { DataGrid, GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import { useState } from "react";
import { Trash2, Plus, Eye, EyeOff } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

const columns: GridColDef[] = [
  { field: "adminId", headerName: "ID", width: 120 },
  { field: "name", headerName: "Name", width: 180 },
  { field: "email", headerName: "Email", width: 220 },
  { field: "role", headerName: "Role", width: 140 },
  {
    field: "actions",
    type: "actions",
    headerName: "Actions",
    width: 100,
    getActions: (params: any) => [
      <GridActionsCellItem
        key={params.id}
        icon={<Trash2 className="w-4 h-4 text-red-500" />}
        label="Delete"
        onClick={() => params.deleteAdmin?.(params.row.adminId)}
        disabled={params.row.role === "SUPER_ADMIN"}
      />,
    ],
  },
];

const Moderators = () => {
  const admin = useAppSelector((state) => state.global.admin);
  const { data: admins, isError, isLoading } = useGetAllAdminsQuery();
  const [createAdmin] = useCreateAdminMutation();
  const [deleteAdmin] = useDeleteAdminMutation();

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // Only show Super Admin accounts and Moderators
  const filteredAdmins = admins?.filter((a) => a.role === "SUPER_ADMIN" || a.role === "MODERATOR") || [];

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.email || !formData.password) {
      setError("Name, email, and password are required");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      const adminId = uuidv4();
      await createAdmin({ 
        adminId, 
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: "MODERATOR"
      }).unwrap();
      setFormData({ name: "", email: "", password: "" });
      setShowModal(false);
    } catch (err: any) {
      setError(err?.data?.message || "Failed to create admin");
    }
  };

  const handleDeleteAdmin = async (adminId: string) => {
    const adminToDelete = filteredAdmins.find(a => a.adminId === adminId);
    
    if (adminToDelete?.role === "SUPER_ADMIN") {
      alert("Cannot delete Super Admin accounts");
      return;
    }

    if (confirm("Are you sure you want to delete this moderator?")) {
      try {
        await deleteAdmin(adminId).unwrap();
      } catch (err: any) {
        alert(err?.data?.message || "Failed to delete moderator");
      }
    }
  };

  // Only Super Admin can access this page
  if (admin?.role !== "SUPER_ADMIN") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-500 mb-4">Access Denied</h1>
          <p className="text-gray-600">Only super admins can manage moderators.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <div className="py-4">Loading...</div>;
  }

  if (isError || !admins) {
    return (
      <div className="text-center text-red-500 py-4">Failed to fetch admins</div>
    );
  }

  const columnsWithDelete = columns.map((col) => {
    if (col.field === "actions") {
      return {
        ...col,
        getActions: (params: any) => [
          <GridActionsCellItem
            key={params.id}
            icon={<Trash2 className="w-4 h-4 text-red-500" />}
            label="Delete"
            onClick={() => handleDeleteAdmin(params.row.adminId)}
            disabled={params.row.role === "SUPER_ADMIN"}
          />,
        ],
      };
    }
    return col;
  });

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-5">
        <Header name="Moderators & Admins" />
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
        >
          <Plus className="w-4 h-4" />
          Add Moderator
        </button>
      </div>

      <DataGrid
        rows={filteredAdmins}
        columns={columnsWithDelete}
        getRowId={(row) => row.adminId}
        checkboxSelection={false}
        className="bg-white shadow rounded-lg border border-gray-200 mt-5 !text-gray-700"
      />

      {/* Create Admin Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Add New Moderator</h2>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter moderator name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter moderator email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter password (min 6 characters)"
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-900 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                >
                  Create Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Moderators;
