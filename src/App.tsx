import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import MinWidthGuard from './components/MinWidthGuard'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import DashboardPage from './pages/DashboardPage'
import NewReviewPage from './pages/NewReviewPage'
import ResultsPage from './pages/ResultsPage'
import ReviewQueuePage from './pages/ReviewQueuePage'
import SettingsPage from './pages/SettingsPage'

function AppShell() {
  const location = useLocation()
  return (
    <>
      <Navbar />
      <Sidebar />
      <main
        key={location.pathname}
        className="app-main main-scroll page-enter min-h-screen overflow-y-auto pl-56 pt-20 print:pl-0 print:pt-0"
      >
        <Outlet />
      </main>
    </>
  )
}

function App() {
  return (
    <>
      <MinWidthGuard />
      <div className="min-h-screen">
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/new-review" element={<NewReviewPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/review-queue" element={<ReviewQueuePage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </div>
    </>
  )
}

export default App
