import { useEffect, useState } from "react";
import { useUnifiedRpc } from "../../contexts/unifiedRpcContext";

export default function BlockHeightWidget() {
  const { activeNetwork } = useUnifiedRpc();
  const rpcUrl = activeNetwork?.rpcUrl || "";
  const [height, setHeight] = useState<number | null>(null);

  useEffect(() => {
    if (!rpcUrl) {
      setHeight(null);
      return;
    }

    async function fetchBlockNumber() {
      try {
        const res = await fetch(rpcUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            method: "eth_blockNumber",
            params: [],
          }),
        });
        const json = await res.json();
        setHeight(parseInt(json.result, 16));
      } catch {
        setHeight(null);
      }
    }

    fetchBlockNumber();
  }, [rpcUrl]);

  if (!rpcUrl) return <div>Please select a network with a valid RPC URL.</div>;
  return <div>Latest Block: {height ?? "Loading..."}</div>;
}
