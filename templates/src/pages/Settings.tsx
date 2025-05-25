import React, { useState } from "react";
import { useUnifiedRpc, type NetworkType } from "../contexts/UnifiedRpcContext";

const networkTypes = ["local", "private", "testnet", "public", "customVM"] as const;

const SettingsPage: React.FC = () => {
  const {
    networks,
    addNetwork,
    updateNetwork,
    removeNetwork,
    activeNetworkId,
    setActiveNetwork,
  } = useUnifiedRpc();

  // For adding or editing network
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    id: "",
    name: "",
    rpcUrl: "",
    type: "testnet" as NetworkType,
  });

  // Reset form with current editing network data
  const startEditing = (id: string) => {
    setEditingId(id);
    const net = networks.find((n) => n.id === id);
    if (net) {
        setForm({
            id: net.id,
            name: net.name,
            rpcUrl: net.rpcUrl,
            type: net.type,
        });
    }
  };

  // Clear form & editing
  const cancelEditing = () => {
    setEditingId(null);
    setForm({ id:"", name: "", rpcUrl: "", type: "testnet" });
  };

  // Submit add or update
  const submitForm = () => {
    if (!form.name || !form.rpcUrl) {
      alert("Please fill in both name and RPC URL");
      return;
    }

    if (editingId) {
      updateNetwork({
        id: form.id,
        name: form.name,
        rpcUrl: form.rpcUrl,
        type: form.type,
      });
    } else {
        if (!form.id) {
            alert("Please enter a unique ID for the network");
            return;
          }

      if (networks.find((n) => n.id === form.id)) {
        alert("Network ID already exists");
        return;
      }

      addNetwork({
        id: form.id,
        name: form.name,
        rpcUrl: form.rpcUrl,
        type: form.type,
      });
    }

    cancelEditing();
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Network Settings</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Existing Networks</h2>
        {networks.map((net) => (
          <div
            key={net.id}
            className={`border p-3 rounded mb-2 flex justify-between items-center ${
              activeNetworkId === net.id ? "border-blue-500 bg-blue-50" : ""
            }`}
          >
            <div>
              <strong>{net.name}</strong> ({net.type})<br />
              <small className="text-gray-600">{net.rpcUrl}</small>
            </div>
            <div className="space-x-2">
              {activeNetworkId !== net.id && (
                <button
                  onClick={() => setActiveNetwork(net.id)}
                  className="px-3 py-1 text-sm bg-blue-600 rounded"
                >
                  Connect
                </button>
              )}
              <button
                onClick={() => startEditing(net.id)}
                className="px-3 py-1 text-sm bg-yellow-400 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      `Are you sure you want to remove network "${net.name}"?`
                    )
                  ) {
                    removeNetwork(net.id);
                    if (activeNetworkId === net.id) {
                      setActiveNetwork("");
                    }
                  }
                }}
                className="px-3 py-1 text-sm bg-red-600 rounded"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="border p-4 rounded">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? "Edit Network" : "Add New Network"}
        </h2>
        <label className="block mb-2">
          Name:
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </label>

        <label className="block mb-2">
          RPC URL:
          <input
            type="text"
            value={form.rpcUrl}
            onChange={(e) => setForm((f) => ({ ...f, rpcUrl: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </label>

        <label className="block mb-2">
          Chain ID:
          <input
            type="text"
            value={form.id}
            onChange={(e) => setForm((f) => ({ ...f, id: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </label>

        <label className="block mb-4">
          Type:
          <select
            value={form.type}
            onChange={(e) =>
              setForm((f) => ({ ...f, type: e.target.value as NetworkType }))
            }
            className="w-full p-2 border border-gray-300 rounded mt-1"
          >
            {networkTypes.map((t) => (
              <option key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
        </label>

        <div className="flex space-x-2">
          <button
            onClick={submitForm}
            className="px-4 py-2 bg-green-600 rounded"
          >
            {editingId ? "Update" : "Add"}
          </button>
          {editingId && (
            <button
              onClick={cancelEditing}
              className="px-4 py-2 bg-gray-400 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
