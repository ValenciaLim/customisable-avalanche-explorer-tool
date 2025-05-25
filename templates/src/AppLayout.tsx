import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/navigation/side-navbar";
import TopRightNetworkStatus from "./components/unifiedRpc/network-indicator";
import SettingsPage from "./pages/Settings";
import DynamicPage from "./pages/DynamicPage";
import { CustomPage } from "./pages/CustomPage";

function AppLayout() {
  return (
    <div className="flex flex-col w-full h-screen">
      {/* Header */}
      <header className="flex justify-between items-center p-4 bg-gray-100">
        <div className="text-xl font-bold"></div>
        <TopRightNetworkStatus />
      </header>

      {/* Body: sidebar + main content */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto bg-white p-6">
          <Routes>
            {/* Default to blockexplorer */}
            <Route path="/" element={<DynamicPage />} />
            {/* Dynamic pages */}
            <Route path="/:page" element={<DynamicPage />} />
            {/* Keep settings separate */}
            <Route path="/settings" element={<SettingsPage />} />
            {/* Customisation control page */}
            <Route path="/custom" element={<CustomPage />} />
            {/* Add more routes if needed */}
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
