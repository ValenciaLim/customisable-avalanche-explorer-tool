import React, { useState } from 'react';

// For simplicity, alerts are stored in local state here.
// In real app, alerts might be persisted in backend or localStorage.

interface Alert {
  id: number;
  eventSignature: string;
  contractAddress: string;
}

const EventAlertWidget = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [eventSignature, setEventSignature] = useState('');
  const [contractAddress, setContractAddress] = useState('');

  const addAlert = () => {
    if (!eventSignature) return;
    setAlerts(prev => [
      ...prev,
      {
        id: Date.now(),
        eventSignature,
        contractAddress,
      },
    ]);
    setEventSignature('');
    setContractAddress('');
  };

  const removeAlert = (id: number) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  return (
    <div className="p-4 bg-white">
      <h3 className="font-semibold mb-2">Event Alert System</h3>

      <div className="space-y-2 mb-4">
        <input
          type="text"
          placeholder="Event Signature (e.g. Transfer(address,address,uint256))"
          value={eventSignature}
          onChange={e => setEventSignature(e.target.value)}
          className="input input-bordered w-full"
        />
        <input
          type="text"
          placeholder="Contract Address (optional)"
          value={contractAddress}
          onChange={e => setContractAddress(e.target.value)}
          className="input input-bordered w-full"
        />
        <button
          onClick={addAlert}
          className="btn btn-primary w-full"
          disabled={!eventSignature.trim()}
        >
          Add Alert
        </button>
      </div>

      <h4 className="font-semibold mb-2">Active Alerts</h4>
      {alerts.length === 0 && <p className="text-gray-500">No alerts set.</p>}
      <ul>
        {alerts.map(alert => (
          <li key={alert.id} className="flex justify-between items-center mb-1 border-b pb-1">
            <span>
              <code>{alert.eventSignature}</code> on{' '}
              <code>{alert.contractAddress || 'any contract'}</code>
            </span>
            <button
              className="text-red-500 font-bold"
              onClick={() => removeAlert(alert.id)}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventAlertWidget;
