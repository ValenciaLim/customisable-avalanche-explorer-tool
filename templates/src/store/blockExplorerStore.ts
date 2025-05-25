import { create } from 'zustand';

interface BlockExplorerState {
  selectedBlock: {
    number: number;
    hash: string;
  } | null;
  logs: unknown[];
  setSelectedBlock: (block: { number: number; hash: string }) => void;
  setLogs: (logs: unknown[]) => void;
}

export const useBlockExplorerStore = create<BlockExplorerState>((set) => ({
  selectedBlock: null,
  logs: [],
  setSelectedBlock: (block) => set({ selectedBlock: block }),
  setLogs: (logs) => set({ logs }),
}));
