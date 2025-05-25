import { Interface, JsonRpcProvider, type InterfaceAbi } from "ethers";

export function watchContractEvents(
  rpcUrl: string,
  contractAddress: string,
  abi: InterfaceAbi,
  onEvent: (event: unknown) => void,
  useCustomVmParser = false,
  customVmDecoder?: (log: { topics: readonly string[]; data: string; }) => unknown
) {
  const provider = new JsonRpcProvider(rpcUrl);
  const contractInterface = new Interface(abi);

  const filter = {
    address: contractAddress,
    fromBlock: "latest",
  };

  const handleLog = (log: { topics: readonly string[]; data: string; }) => {
    let event;
    try {
      if (useCustomVmParser && customVmDecoder) {
        event = customVmDecoder(log);
      } else {
        event = contractInterface.parseLog(log);
      }
      onEvent(event);
    } catch (err) {
      console.error("Failed to parse log:", err);
    }
  };

  provider.on(filter, handleLog);

  // Return cleanup function to unsubscribe
  return () => {
    provider.off(filter, handleLog);
  };
}
