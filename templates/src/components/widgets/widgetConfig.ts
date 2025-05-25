import LatestBlocksWidget from './blockexplorer/latestBlocksWidget';
import TransactionsWidget from './blockexplorer/transactionsWidget';
import TokenTransferDecoder from './blockexplorer/tokenTransferDecoderWidget';
import EventAlertWidget from './eventWatcher/eventAlertSystemWidget';
import ContractABIManager from './eventWatcher/contractAbiManagerWidget';
import { IcmTrackerOutgoing, IcmTrackerIncoming } from './icmDebugger/icmTrackerWidget';
import type { Page } from '../../store/widgetStore';
import Logger from './blockexplorer/logger';

export type WidgetType = 'latestBlocks' | 'transactions' | 'logger' | 'tokenTransferDecoder' | 'contractAbiManager' | 'icmTrackerIncoming' | 'icmTrackerOutgoing' | 'eventAlertSystem';

export const widgetComponentMap = {
    // Block explorer
    latestBlocks: LatestBlocksWidget,
    transactions: TransactionsWidget,
    logger: Logger,
    tokenTransferDecoder: TokenTransferDecoder,
  
    // Event watcher
    eventAlertSystem: EventAlertWidget,
    contractAbiManager: ContractABIManager,

    // ICM Debugger
    icmTrackerIncoming: IcmTrackerIncoming,
    icmTrackerOutgoing: IcmTrackerOutgoing,
};

export const blockExplorerWidgets: WidgetType[] = [
    'latestBlocks',
    'transactions',
    'logger',
    'tokenTransferDecoder',
  ];
  
export const eventWatcherWidgets: WidgetType[] = [
    'contractAbiManager',
    'eventAlertSystem',
];

export const icmDebuggerWidgets: WidgetType[] = [
    'icmTrackerIncoming',
    'icmTrackerOutgoing',
];

export const widgetMap: Record<Page, WidgetType[]> = {
    blockExplorer: blockExplorerWidgets,
    eventWatcher: eventWatcherWidgets,
    icmDebugger: icmDebuggerWidgets,
};
  