const fetchFromGlacier = async (endpoint: string, options: RequestInit = {}) => {
  const url = `/api${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'x-glacier-api-key': import.meta.env.VITE_GLACIER_API_KEY,
      'accept': 'application/json',
      ...options.headers,
    },
    method: options.method || 'GET',
    body: options.body,
  });

  if (!response.ok) {
    throw new Error(`Glacier API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

export const fetchLatestBlocks = async (chainId: string) => {
  const endpoint = `/chains/${chainId}/blocks`;
  return fetchFromGlacier(endpoint);
};

export const fetchTransactionsForBlock = async (blockNumber: number, chainId: string) => {
  const endpoint = `/chains/${chainId}/blocks/${blockNumber}/transactions`;
  return fetchFromGlacier(endpoint);
};

export const fetchFilteredEvents = async (filters: {
  address?: string;
  eventSignature?: string;
  topic0?: string;
  fromBlock?: string | number;
  toBlock?: string | number;
}, chainId: string) => {
  const params = new URLSearchParams();
  if (filters.address) params.append('address', filters.address);
  if (filters.eventSignature) params.append('eventSignature', filters.eventSignature);
  if (filters.topic0) params.append('topic0', filters.topic0);
  if (filters.fromBlock) params.append('fromBlock', String(filters.fromBlock));
  if (filters.toBlock) params.append('toBlock', String(filters.toBlock));

  const endpoint = `/chains/${chainId}/events?${params.toString()}`;
  return fetchFromGlacier(endpoint);
};

// For event alert system, you might want a dummy function or persist alerts locally or backend.
// Here is a placeholder for fetching alerts (if stored server-side)
export const fetchAlerts = async () => {
  // Implement if backend supports alerts, else omit or return empty list
  return [];
};

export async function getICMMessages() {
  const endpoint = `/icm/messages`;
  return fetchFromGlacier(endpoint);
}

export async function getChainName(chainId: string): Promise<string> {
  const endpoint = `/chains/${chainId}`;
  return fetchFromGlacier(endpoint);
}
