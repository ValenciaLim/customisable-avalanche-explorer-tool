import { useUnifiedRpc } from "../../contexts/UnifiedRpcContext";

const TopRightNetworkStatus: React.FC = () => {
  const { activeNetwork, status } = useUnifiedRpc();

  if (!activeNetwork) {
    return (
      <div className="p-2 text-sm bg-red-100 text-red-700 rounded cursor-pointer">
        No Network Connected
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 p-2 bg-gray-100 rounded text-sm cursor-pointer" >
      <div>
        <strong>{activeNetwork.name}</strong> ({activeNetwork.type})
      </div>
      <div
        className={`w-3 h-3 rounded-full ${
          status === "connected" ? "bg-green-500" : status === "error" ? "bg-red-500" : "bg-yellow-500"
        }`}
        title={`Status: ${status}`}
      />
    </div>
  );
}

export default TopRightNetworkStatus;
