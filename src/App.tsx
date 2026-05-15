import { Outlet, Route, Routes, useLocation } from 'react-router-dom'
import MinWidthGuard from './components/MinWidthGuard'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import DashboardPage from './pages/DashboardPage'
import LoginPage from './pages/LoginPage'
import NewReviewPage from './pages/NewReviewPage'
import ResultsPage from './pages/ResultsPage'

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

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-text-primary">{title}</h1>
      <p className="mt-2 text-sm text-text-secondary">This section is coming soon.</p>
    </div>
  )
}

function App() {
  return (
    <>
      <MinWidthGuard />
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route element={<AppShell />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/new-review" element={<NewReviewPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/review-queue" element={<PlaceholderPage title="Review Queue" />} />
            <Route path="/settings" element={<PlaceholderPage title="Settings" />} />
          </Route>
        </Routes>
      </div>
    </>
  )
}

export default App
