import type { InterfaceAbi } from 'ethers';
import React, { useState, useEffect } from 'react';

type ABIEntry = {
  contractAddress: string;
  abi: InterfaceAbi | object;
};

const ABI_STORAGE_KEY = 'contract_abis';

function saveABIs(abis: ABIEntry[]) {
  localStorage.setItem(ABI_STORAGE_KEY, JSON.stringify(abis));
}

function loadABIs(): ABIEntry[] {
  try {
    const stored = localStorage.getItem(ABI_STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

const ContractABIManager = () => {
  const [abis, setAbis] = useState<ABIEntry[]>([]);
  const [addressInput, setAddressInput] = useState('');
  const [fileContent, setFileContent] = useState<unknown>(null);

  useEffect(() => {
    const loaded = loadABIs();
    setAbis(loaded);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        setFileContent(json);
      } catch {
        alert('Invalid JSON file');
      }
    };
    reader.readAsText(file);
  };

  const handleAddABI = () => {
    if (!addressInput || !fileContent) {
      alert('Please enter contract address and upload ABI file');
      return;
    }
    const newEntry = { contractAddress: addressInput.toLowerCase(), abi: fileContent };
    const updated = [...abis.filter((a) => a.contractAddress !== newEntry.contractAddress), newEntry];
    setAbis(updated);
    saveABIs(updated);
    setAddressInput('');
    setFileContent(null);
  };

  const handleRemove = (address: string) => {
    const updated = abis.filter((a) => a.contractAddress !== address);
    setAbis(updated);
    saveABIs(updated);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Contract ABI Manager</h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Contract Address"
          className="border p-2 w-full mb-2 rounded"
          value={addressInput}
          onChange={(e) => setAddressInput(e.target.value)}
        />
        <input type="file" accept=".json" onChange={handleFileChange} />
        <button
          onClick={handleAddABI}
          className="btn btn-primary w-full"
        >
          Add ABI
        </button>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Saved ABIs</h3>
        {abis.length === 0 ? (
          <p>No ABIs saved yet.</p>
        ) : (
          <ul>
            {abis.map(({ contractAddress }) => (
              <li key={contractAddress} className="flex justify-between items-center border-b py-2">
                <span className="break-all">{contractAddress}</span>
                <button
                  onClick={() => handleRemove(contractAddress)}
                  className="text-red-600"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ContractABIManager;
