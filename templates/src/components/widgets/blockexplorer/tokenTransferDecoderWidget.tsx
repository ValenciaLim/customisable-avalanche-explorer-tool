import React, { useEffect, useState } from 'react';
import { Interface } from 'ethers';
import { useBlockExplorerStore } from '../../../store/blockExplorerStore';
import { fetchTransactionsForBlock } from '../../../hooks/glacier';
import { useUnifiedRpc } from '../../../contexts/UnifiedRpcContext';

const transferEventSig = 'event Transfer(address indexed from, address indexed to, uint256 value)';
const erc20Iface = new Interface([transferEventSig]);

export default function TokenTransferDecoderWidget() {
  const { selectedBlock } = useBlockExplorerStore();
  const [transfers, setTransfers] = useState<any[]>([]);
  const { activeNetwork } = useUnifiedRpc();

  useEffect(() => {
    const decodeTransfers = async () => {
      if (!selectedBlock) return;
      try {
        const data = await fetchTransactionsForBlock(selectedBlock.hash, activeNetwork.id);

        const decoded = [];

        for (const tx of data.transactions) {
          for (const log of tx.logs || []) {
            try {
              const parsed = erc20Iface.parseLog(log);
              if (parsed.name === 'Transfer') {
                decoded.push({
                  from: parsed.args.from,
                  to: parsed.args.to,
                  value: parsed.args.value.toString(),
                  txHash: tx.txHash,
                });
              }
            } catch {
              // skip non-transfer logs
            }
          }
        }

        setTransfers(decoded);
      } catch (err) {
        console.error(err);
      }
    };

    decodeTransfers();
  }, [selectedBlock]);

  return (
    <div className="p-4 bg-yellow-100 rounded shadow">
      <h2 className="text-lg font-semibold mb-2">Token Transfers</h2>
      {selectedBlock ? (
        transfers.length ? (
          <ul className="space-y-1 text-sm max-h-96 overflow-y-auto">
            {transfers.map((t, i) => (
              <li key={i} className="border-b py-1 break-all">
                <strong>From:</strong> {t.from}<br />
                <strong>To:</strong> {t.to}<br />
                <strong>Value:</strong> {t.value}<br />
                <strong>Tx:</strong> {t.txHash}
              </li>
            ))}
          </ul>
        ) : (
          <p>No ERC20 transfers found.</p>
        )
      ) : (
        <p>Select a block to decode token transfers.</p>
      )}
    </div>
  );
}
