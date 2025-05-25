import React from "react";
import { Link } from "react-router-dom";
import { useWidgetStore } from "../../store/widgetStore";

const fixedTabs = {
  blockExplorer: { name: "Block Explorer", disabled: false },
  eventWatcher: { name: "Event Watcher", disabled: false },
  icmDebugger: { name: "ICM Debugger", disabled: false },
  contractTester: { name: "Contract Tester", disabled: true }, // disabled
  custom: { name: "Custom", disabled: false },
  settings: { name: "Settings", disabled: false },
};

const Sidebar: React.FC = () => {
  const { widgets } = useWidgetStore();

  const dynamicTabs = Object.keys(widgets).reduce((acc, page) => {
    if (page in fixedTabs) return acc;

    acc[page] = {
      name: page.charAt(0).toUpperCase() + page.slice(1), // Capitalize
      disabled: false,
    };
    return acc;
  }, {} as Record<string, { name: string; disabled: boolean }>);

  const navTabs = { ...fixedTabs, ...dynamicTabs };

  return (
    <div className="w-64 h-screen bg-gray-900 text-white flex flex-col p-6">
      <nav className="flex flex-col gap-3 mt-4">
        {Object.entries(navTabs).map(([key, tab]) =>
          tab.disabled ? (
            <span
              key={key}
              className="text-gray-500 cursor-not-allowed rounded px-3 py-2 select-none"
              title="Disabled"
            >
              {tab.name}
            </span>
          ) : (
            <Link
              key={key}
              to={`/${key}`}
              className="hover:bg-gray-700 rounded px-3 py-2"
            >
              {tab.name}
            </Link>
          )
        )}
      </nav>
    </div>
  );
};

export default Sidebar;
