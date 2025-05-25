import { BrowserRouter } from "react-router-dom";
import { UnifiedRPCProvider } from "./contexts/UnifiedRpcContext";
import AppLayout from "./AppLayout";

function App() {
  return (
    <BrowserRouter>
      <UnifiedRPCProvider>
        <AppLayout />
      </UnifiedRPCProvider>
    </BrowserRouter>
  );
}

export default App;

