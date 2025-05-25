import React, { useEffect, useState } from 'react';
import { fetchTransactionsForBlock } from '../../../hooks/glacier';
import { useBlockExplorerStore } from '../../../store/blockExplorerStore';
import { useUnifiedRpc } from '../../../contexts/UnifiedRpcContext';

export default function TransactionsWidget() {
  const { selectedBlock } = useBlockExplorerStore();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { activeNetwork } = useUnifiedRpc();

  useEffect(() => {
    const loadTransactions = async () => {
      if (!selectedBlock) return;
      try {
        const data = await fetchTransactionsForBlock(selectedBlock.hash, activeNetwork.id);
        setTransactions(data.transactions || []);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Error fetching transactions');
      }
    };

    loadTransactions();
  }, [selectedBlock]);

  if (!selectedBlock) return <p>Select a block to view its transactions.</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">
        Transactions in Block #{selectedBlock.number}
      </h2>
      {error && <p className="text-red-500">{error}</p>}
      {transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <ul className="space-y-2 max-h-96 overflow-y-auto bg-gray-50 border p-2 rounded">
          {transactions.map((tx) => (
            <li key={tx.txHash} className="text-sm break-all border-b py-1">
              {tx.txHash}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
