import { useUnifiedRpc } from "../../contexts/unifiedRpcContext";

export default function RPCInput() {
  const {
    activeNetwork,
    updateNetwork,
  } = useUnifiedRpc();

  if (!activeNetwork) return <div>Please select or add a network first.</div>;

  // Update the active network's rpcUrl
  const onChangeRpcUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNetwork({
      ...activeNetwork,
      rpcUrl: e.target.value,
    });
  };

  return (
    <div className="p-4 bg-gray-100 rounded-md">
      <label className="block text-sm font-semibold">RPC URL</label>
      <input
        type="text"
        placeholder="https://localhost:9560"
        value={activeNetwork.rpcUrl}
        onChange={onChangeRpcUrl}
        className="w-full p-2 mt-1 border rounded"
      />
    </div>
  );
}
