import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { SimpleHomePage } from './pages/SimpleHomePage'
import { LoginPage, RegisterPage, PostPage, CategoryPage, DashboardPage } from '@/auth/pages/LoginPage'
import { AuthProvider } from '@/auth/contexts/AuthContext'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<SimpleHomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/post/:slug" element={<PostPage />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </Layout>
    </AuthProvider>
  )
}

export default App