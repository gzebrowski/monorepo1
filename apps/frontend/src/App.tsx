import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { SimpleHomePage } from './pages/SimpleHomePage'
import { DashboardPage } from './pages/DashboardPage'
import { AuthRoutes } from './auth/routes/AuthRoutes'
import { PostPage } from './posts/pages/PostPage'
import { CategoryPage } from './categories/pages/CategoryPage'
import { AuthProvider } from './auth/contexts/AuthContext'
import { AlertProvider } from './common/contexts/alerts'
import { AdminPanel } from './admin/AdminPanel'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './App.css'

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AlertProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<SimpleHomePage />} />
              <Route path="/auth/*" element={<AuthRoutes />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/admin/:adminModel?/:modelId?" element={<AdminPanel />} />
              <Route path="/post/:slug" element={<PostPage />} />
              <Route path="/category/:slug" element={<CategoryPage />} />
            </Routes>
          </Layout>
        </AlertProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App