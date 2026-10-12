import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout'
import ScrollToTop from './components/layout/ScrollToTop'
import HomePage from './pages/HomePage'
import ProjectPage from './pages/ProjectPage'
import { getProfile } from './api/strapi'
import { useLocalizedApi } from './hooks/useLocalizedApi'

export default function App() {
  const profile = useLocalizedApi(getProfile)

  return (
    <BrowserRouter>
      <ScrollToTop />
      <MainLayout ownerName={profile.data?.name}>
        <Routes>
          <Route path="/" element={<HomePage profile={profile} />} />
          <Route path="/project/:slug" element={<ProjectPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  )
}
