import React, { useEffect, useState } from 'react';
import { fetchLatestBlocks } from '../../../hooks/glacier';
import { useBlockExplorerStore } from '../../../store/blockExplorerStore';
import { useUnifiedRpc } from '../../../contexts/UnifiedRpcContext';
import { JsonRpcProvider } from 'ethers';

export default function LatestBlocksWidget() {
  const [blocks, setBlocks] = useState<any[]>([]);
  const { setSelectedBlock, setLogs } = useBlockExplorerStore();
  const { activeNetwork } = useUnifiedRpc();
  const provider = new JsonRpcProvider(activeNetwork?.rpcUrl);

  useEffect(() => {
    const loadBlocksAndLogs = async () => {
      try {
        const data = await fetchLatestBlocks(activeNetwork.id);
        setBlocks(data.blocks);

        const allLogs: any[] = [];

        for (const block of data.blocks) {
          const blockDetails = await provider.getBlock(block.blockHash);

          if (!blockDetails) return;

          for (const tx of blockDetails.transactions) {
            try {
              const receipt = await provider.getTransactionReceipt(tx);
              allLogs.push(...receipt.logs); // collect logs
            } catch (err) {
              console.error(`Failed to get receipt for tx ${tx}:`, err);
            }
          }
        }

        setLogs(allLogs);
      } catch (err) {
        console.error('Error loading blocks/logs:', err);
      }
    };

    loadBlocksAndLogs();
    const interval = setInterval(loadBlocksAndLogs, 10000);
    return () => clearInterval(interval);
  }, [activeNetwork.id]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Latest Blocks</h2>
      <ul className="space-y-2">
        {blocks.map((block) => (
          <li
            key={block.blockHash}
            onClick={() => setSelectedBlock({ number: block.blockNumber, hash: block.blockHash })}
            className="cursor-pointer p-3 rounded bg-blue-100 hover:bg-blue-200"
          >
            Block #{block.blockNumber} - {new Date(block.blockTimestamp * 1000).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
