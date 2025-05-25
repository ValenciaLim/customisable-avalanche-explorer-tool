import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type WidgetType } from '../components/widgets/widgetConfig';

export type Page = 'blockExplorer' | 'eventWatcher' | 'icmDebugger';

const allWidgets = {
    'blockExplorer': {
        name: "Block Explorer", 
        widgets: [
            { type: 'latestBlocks', visible: true},
            { type: 'transactions', visible: true},
            { type: 'logger', visible: true},
            { type: 'tokenTransferDecoder', visible: true},
        ]
    },
    'eventWatcher': {
        name: "Event Watcher", 
        widgets: [
            { type: 'contractAbiManager', visible: true},
            { type: 'eventAlertSystem', visible: true},
        ]
    },
    'icmDebugger': {
        name: "ICM Debugger", 
        widgets: [
            { type: 'icmTrackerIncoming', visible: true},
            { type: 'icmTrackerOutgoing', visible: true},
        ]
    },
}

type WidgetInfo = {
    type: WidgetType;
    visible: boolean;
};

export type PageInfo = {
    name: string;
    widgets: WidgetInfo[];
};

type WidgetStore = {
    widgets: Record<Page, PageInfo>;
    toggleWidgetVisibility: (page: Page, type: WidgetType) => void;
    moveWidgetToPage: (
        fromPage: Page,
        toPage: Page,
        widgetType: WidgetType
    ) => void;
    renamePage: (page: Page, newName: Page) => void;
    addPage: (page: Page, pageDisplayName?: string) => void;
    deletePage: (page: Page) => void;
};
  
export const useWidgetStore = create<WidgetStore>(
    persist<WidgetStore>(
        (set) => ({
            widgets: allWidgets,
        
            toggleWidgetVisibility: (page, type) =>
            set((state) => {
                const pageInfo = state.widgets[page];
                if (!pageInfo) return state;
        
                const updatedWidgets = pageInfo.widgets.map((w) =>
                w.type === type ? { ...w, visible: !w.visible } : w
                );
        
                return {
                widgets: {
                    ...state.widgets,
                    [page]: {
                    ...pageInfo,
                    widgets: updatedWidgets,
                    },
                },
                };
            }),
            moveWidgetToPage: (fromPage, toPage, widgetType) =>
            set((state) => {
                const fromPageInfo = state.widgets[fromPage];
                const toPageInfo = state.widgets[toPage];
                if (!fromPageInfo || !toPageInfo) return state;
        
                const movingWidget = fromPageInfo.widgets.find(
                (w) => w.type === widgetType
                );
                if (!movingWidget) return state;
        
                return {
                widgets: {
                    ...state.widgets,
                    [fromPage]: {
                    ...fromPageInfo,
                    widgets: fromPageInfo.widgets.filter((w) => w.type !== widgetType),
                    },
                    [toPage]: {
                    ...toPageInfo,
                    widgets: [...toPageInfo.widgets, movingWidget],
                    },
                },
                };
            }),
            renamePage: (page, newName) =>
                set((state) => {
                const pageInfo = state.widgets[page];
                if (!pageInfo) return state;
            
                return {
                    widgets: {
                    ...state.widgets,
                    [page]: {
                        ...pageInfo,
                        name: newName,
                    },
                    },
                };
                }),
            addPage: (pageName, pageDisplayName) =>
            set((state) => {
                if (state.widgets[pageName]) return {};
                return {
                widgets: {
                    ...state.widgets,
                    [pageName]: {
                    name: pageDisplayName || pageName,
                    widgets: [],
                    },
                },
                };
            }),
            deletePage: (page) => {
                set((state) => {
                if (!state.widgets[page]) return {};
                const { [page]: _, ...rest } = state.widgets;
                return { widgets: rest };
                });
            },
        }),
        {
            name: 'widget-store', // key in localStorage
        }
    )
);
