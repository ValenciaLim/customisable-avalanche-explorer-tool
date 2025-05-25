import { useEffect, useState } from "react";
import { useUnifiedRpc } from "../../../contexts/UnifiedRpcContext";
import { getICMMessages, getChainName } from "../../../hooks/glacier";

interface IcmMessage {
  id: string;
  sourceEvmChainId: number;
  destinationEvmChainId: number;
}

export const IcmTrackerIncoming = () => <IcmTrackerWidget direction="Incoming" />;
export const IcmTrackerOutgoing = () => <IcmTrackerWidget direction="Outgoing" />;

export default function IcmTrackerWidget({ direction }: { direction: "Incoming" | "Outgoing" }) {
  const { activeNetwork } = useUnifiedRpc();
  const [messages, setMessages] = useState<IcmMessage[]>([]);
  const [chainNames, setChainNames] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!activeNetwork?.id) return;

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const allMessages = await getICMMessages();
        const relevantMessages = allMessages.messages.filter((msg) =>
          direction === "incoming"
            ? msg.destinationEvmChainId === activeNetwork.id
            : msg.sourceEvmChainId === activeNetwork.id
        );

        const uniqueChainIds = [
          ...new Set(relevantMessages.flatMap((msg) => [
            msg.sourceEvmChainId,
            msg.destinationEvmChainId
          ])),
        ];

        const names: Record<number, string> = {};
        await Promise.all(uniqueChainIds.map(async (id) => {
          if (!chainNames[id]) {
            const chain = await getChainName(id);
            names[id] = chain.chainName;
          }
        }));

        setChainNames((prev) => ({ ...prev, ...names }));
        setMessages(relevantMessages);
      } catch (error) {
        console.error("Error fetching ICM messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [activeNetwork?.chainId, direction]);

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">ICM Messages</h2>
      <div className={`mb-1 font-bold mb-4w ${direction === 'Incoming' ? 'text-green-600' : 'text-red-600'}`}>
        {direction}
      </div>

      {loading ? (
        <p>Loading messages...</p>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className="border rounded p-3 text-sm bg-gray-50">
              <div><strong>ID:</strong> {msg.id}</div>
              <div>
                <strong>From:</strong> {chainNames[msg.sourceEvmChainId] || msg.sourceEvmChainId}
              </div>
              <div>
                <strong>To:</strong> {chainNames[msg.destinationEvmChainId] || msg.destinationEvmChainId}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
