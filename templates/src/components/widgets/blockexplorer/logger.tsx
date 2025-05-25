import React, { useEffect, useState } from 'react';
import { decodeLog } from '../../../lib/abiDecoder';
import { useBlockExplorerStore } from '../../../store/blockExplorerStore';
import type { InterfaceAbi } from 'ethers';

export default function Logger() {
  const { logs } = useBlockExplorerStore();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [decodedLogs, setDecodedLogs] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('contract_abis');
    if (!stored || logs.length === 0) {
      setDecodedLogs([]);
      return;
    }

    try {
      const parsed = JSON.parse(stored) as { contractAddress: string; abi: InterfaceAbi[] }[];

      const decoded = logs.map((log) => {
        const match = parsed.find(
          (entry) => entry.contractAddress.toLowerCase() === log.address.toLowerCase()
        );

        if (!match) {
          return { success: false, log, error: 'No ABI found for address ' + log.address };
        }

        try {
          const decodedLog = decodeLog(match.abi, log);
          return { success: true, log, decoded: decodedLog };
        } catch (err) {
          return { success: false, log, error: String(err) };
        }
      });

      setDecodedLogs(decoded);
    } catch (err) {
      console.error('Invalid contract_abis format in localStorage:', err);
      setDecodedLogs([]);
    }
  }, [logs]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">Logs</h3>

      {decodedLogs.length > 0 ? (
        <div className="space-y-4 mt-2">
          {decodedLogs.map((item, index) => (
            <div key={index} className="bg-gray-100 p-3 rounded text-sm">
              <div className="text-xs text-gray-600 mb-1">
                Log #{index + 1} — {item.log.address}
              </div>
              {item.success ? (
                <pre>{JSON.stringify(item.decoded.args, null, 2)}</pre>
              ) : (
                <div className="text-red-600">Failed to decode: {item.error}</div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">
          No logs decoded. Ensure matching ABIs exist in localStorage.
        </p>
      )}
    </div>
  );
};
