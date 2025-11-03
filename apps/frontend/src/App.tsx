import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { SimpleHomePage } from './pages/SimpleHomePage'
import { DashboardPage } from './pages/DashboardPage'
import { AuthRoutes } from './auth/routes/AuthRoutes'
import { PostPage } from './posts/pages/PostPage'
import { CategoryPage } from './categories/pages/CategoryPage'
import { AuthProvider } from './auth/contexts/AuthContext'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<SimpleHomePage />} />
          <Route path="/auth/*" element={<AuthRoutes />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/post/:slug" element={<PostPage />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
        </Routes>
      </Layout>
    </AuthProvider>
  )
}

export default App