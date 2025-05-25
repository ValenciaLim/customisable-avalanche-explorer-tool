import { Interface, LogDescription } from 'ethers';

export function decodeLog(abi: any[], log: { data: string; topics: string[] }): LogDescription | null {
  try {
    const iface = new Interface(abi);
    return iface.parseLog(log);
  } catch (e) {
    console.error('Log decode failed:', e);
    return null;
  }
}
