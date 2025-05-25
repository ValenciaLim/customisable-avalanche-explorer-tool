  import React, { createContext, useContext, useState, useEffect } from "react";

  export type NetworkType = "local" | "private" | "testnet" | "public" | "customVM";

  export interface Network {
    id: string;
    name: string;
    rpcUrl: string;
    type: NetworkType;
    // You can add more metadata like chainId, explorer URL etc.
  }

  interface UnifiedRPCContextValue {
    networks: Network[];
    activeNetworkId: string | null;
    setActiveNetwork: (id: string) => void;
    addNetwork: (network: Network) => void;
    updateNetwork: (network: Network) => void;
    removeNetwork: (id: string) => void;
    status: "connected" | "disconnected" | "error"; // you can expand this later
    activeNetwork: Network | null;
  }

  const UnifiedRPCContext = createContext<UnifiedRPCContextValue | undefined>(undefined);

  export function UnifiedRPCProvider({ children }: { children: React.ReactNode }) {
    const [networks, setNetworks] = useState<Network[]>(() => {
      // Load from localStorage or fallback default
      const saved = localStorage.getItem("networks");
      return saved ? JSON.parse(saved) : [];
    });
    const [activeNetworkId, setActiveNetworkId] = useState<string | null>(() => {
      return localStorage.getItem("activeNetworkId");
    });
    const [status, setStatus] = useState<UnifiedRPCContextValue["status"]>("disconnected");

    // Persist networks and activeNetworkId on change
    useEffect(() => {
      localStorage.setItem("networks", JSON.stringify(networks));
    }, [networks]);

    useEffect(() => {
      if (activeNetworkId) {
        localStorage.setItem("activeNetworkId", activeNetworkId);
      } else {
        localStorage.removeItem("activeNetworkId");
      }
    }, [activeNetworkId]);

    // TODO: implement real connection checking to update status
    useEffect(() => {
      if (!activeNetworkId) {
        setStatus("disconnected");
        return;
      }
      // simple dummy ping could be done here to the RPC URL to update status
      setStatus("connected");
    }, [activeNetworkId, networks]);

    const addNetwork = (network: Network) => {
      setNetworks((prev) => [...prev, network]);
    };

    const updateNetwork = (network: Network) => {
      setNetworks((prev) => prev.map((n) => (n.id === network.id ? network : n)));
    };

    const removeNetwork = (id: string) => {
      setNetworks((prev) => prev.filter((n) => n.id !== id));
      if (activeNetworkId === id) {
        setActiveNetworkId(null);
      }
    };

    const setActiveNetwork = (id: string) => {
      setActiveNetworkId(id);
    };

    const activeNetwork = networks.find((n) => n.id === activeNetworkId) ?? null;

    return (
      <UnifiedRPCContext.Provider
        value={{
          networks,
          activeNetworkId,
          setActiveNetwork,
          addNetwork,
          updateNetwork,
          removeNetwork,
          status,
          activeNetwork,
        }}
      >
        {children}
      </UnifiedRPCContext.Provider>
    );
  }

  export function useUnifiedRpc() {
    const context = useContext(UnifiedRPCContext);
    if (!context) {
      throw new Error("useUnifiedRpc must be used within UnifiedRPCProvider");
    }
    return context;
  }
