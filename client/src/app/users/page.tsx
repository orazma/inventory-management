"use client";

import { useGetUsersQuery, useCreateUserMutation, useDeleteUserMutation } from "@/state/api";
import { useAppSelector } from "@/app/redux";
import Header from "@/app/(components)/Header";
import { DataGrid, GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import { useState } from "react";
import { Trash2, Plus } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

const columns: GridColDef[] = [
  { field: "userId", headerName: "ID", width: 90 },
  { field: "name", headerName: "Name", width: 200 },
  { field: "email", headerName: "Email", width: 200 },
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
        onClick={() => params.deleteUser?.(params.row.userId)}
      />,
    ],
  },
];

const Users = () => {
  const admin = useAppSelector((state) => state.global.admin);
  const { data: users, isError, isLoading } = useGetUsersQuery();
  const [createUser] = useCreateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [error, setError] = useState("");

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.email) {
      setError("Name and email are required");
      return;
    }

    try {
      const userId = uuidv4();
      await createUser({ userId, ...formData }).unwrap();
      setFormData({ name: "", email: "" });
      setShowModal(false);
    } catch (err: any) {
      setError(err?.data?.message || "Failed to create user");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(userId).unwrap();
      } catch (err: any) {
        alert(err?.data?.message || "Failed to delete user");
      }
    }
  };

  if (isLoading) {
    return <div className="py-4">Loading...</div>;
  }

  if (isError || !users) {
    return (
      <div className="text-center text-red-500 py-4">Failed to fetch users</div>
    );
  }

  // Add delete handler to grid columns
  const columnsWithDelete = columns.map((col) => {
    if (col.field === "actions") {
      return {
        ...col,
        getActions: (params: any) => [
          <GridActionsCellItem
            key={params.id}
            icon={<Trash2 className="w-4 h-4 text-red-500" />}
            label="Delete"
            onClick={() => handleDeleteUser(params.row.userId)}
          />,
        ],
      };
    }
    return col;
  });

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-5">
        <Header name="Users" />
        {admin?.role === "SUPER_ADMIN" && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            <Plus className="w-4 h-4" />
            Add User
          </button>
        )}
      </div>

      <DataGrid
        rows={users}
        columns={admin?.role === "SUPER_ADMIN" ? columnsWithDelete : columns.filter(col => col.field !== "actions")}
        getRowId={(row) => row.userId}
        checkboxSelection={admin?.role === "SUPER_ADMIN"}
        className="bg-white shadow rounded-lg border border-gray-200 mt-5 !text-gray-700"
      />

      {/* Create User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Add New User</h2>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter user name"
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
                  placeholder="Enter user email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
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
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
