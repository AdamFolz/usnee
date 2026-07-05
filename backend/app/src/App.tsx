import { Routes, Route } from "react-router";
import { useState, useEffect } from "react";
import HomePage from "./pages/HomePage";
import HistoryPage from "./pages/HistoryPage";
import SettingsPage from "./pages/SettingsPage";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import BottomNav from "./components/BottomNav";
import { useAuth } from "./hooks/useAuth";
import { siteConfig } from "./config";

function MainApp() {
  const [activeTab, setActiveTab] = useState<"home" | "history" | "settings">("home");
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    document.title = siteConfig.title;
    document.documentElement.lang = siteConfig.language;
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0f0c29]">
        <div className="text-[#888] text-sm">Загрузка...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="h-screen flex flex-col bg-[#0f0c29] text-white overflow-hidden">
      <main className="flex-1 overflow-y-auto pb-16 scrollbar-hide">
        {activeTab === "home" && <HomePage />}
        {activeTab === "history" && <HistoryPage />}
        {activeTab === "settings" && <SettingsPage />}
      </main>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainApp />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
