import { Toaster } from "sonner";
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClientInstance } from '@/lib/query-client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider } from '@/lib/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import Layout from '@/components/Layout';
import HomePage from '@/pages/HomePage';
import StatsPage from '@/pages/StatsPage';
import HistoryPage from '@/pages/HistoryPage';
import More from '@/pages/More';
import SettingsPage from '@/pages/Settings';
import SubstancesPage from '@/pages/Substances';
import InfoCenter from '@/pages/InfoCenter';
import EditInjection from '@/pages/EditInjection';
import AchievementsPage from '@/pages/Achievements';
import RemindersPage from '@/pages/Reminders';
import ExportData from '@/pages/ExportData';
import SupportPage from '@/pages/Support';
import SafetyGuide from '@/pages/SafetyGuide';
import HelpResources from '@/pages/HelpResources';
import NotificationSettings from '@/pages/NotificationSettings';
import FaqPage from '@/pages/Faq';

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/stats" element={<StatsPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/more" element={<More />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/substances" element={<SubstancesPage />} />
              <Route path="/info-center" element={<InfoCenter />} />
              <Route path="/edit-injection" element={<EditInjection />} />
              <Route path="/achievements" element={<AchievementsPage />} />
              <Route path="/reminders" element={<RemindersPage />} />
              <Route path="/export-data" element={<ExportData />} />
              <Route path="/support" element={<SupportPage />} />
              <Route path="/safety-guide" element={<SafetyGuide />} />
              <Route path="/help-resources" element={<HelpResources />} />
              <Route path="/notification-settings" element={<NotificationSettings />} />
              <Route path="/faq" element={<FaqPage />} />
            </Route>
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Router>
        <Toaster theme="dark" position="top-center" />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;