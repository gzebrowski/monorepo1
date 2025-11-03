import React from 'react'
import { useNavigate } from 'react-router-dom'
import { LoginForm } from '../components/LoginForm'
import { RegisterForm } from '../components/RegisterForm'

export const LoginPage: React.FC = () => {
  const navigate = useNavigate()

  const handleSuccess = () => {
    navigate('/dashboard')
  }

  const handleError = (error: string) => {
    console.error('Login error:', error)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Przykład użycia Shared Library
          </h2>
          <p className="mt-2 text-gray-600">
            Logowanie z walidacją Zod i wspólnymi typami
          </p>
        </div>
        
        <LoginForm 
          onSuccess={handleSuccess}
          onError={handleError}
        />
        
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Nie masz konta?{' '}
            <button 
              onClick={() => navigate('/register')}
              className="text-blue-600 hover:text-blue-500"
            >
              Zarejestruj się
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate()

  const handleSuccess = () => {
    navigate('/login')
  }

  const handleError = (error: string) => {
    console.error('Register error:', error)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Rejestracja
          </h2>
          <p className="mt-2 text-gray-600">
            Przykład walidacji z shared library
          </p>
        </div>
        
        <RegisterForm 
          onSuccess={handleSuccess}
          onError={handleError}
        />
        
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Masz już konto?{' '}
            <button 
              onClick={() => navigate('/login')}
              className="text-blue-600 hover:text-blue-500"
            >
              Zaloguj się
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export const PostPage: React.FC = () => {
  return <div>Post Page - To be implemented</div>
}

export const CategoryPage: React.FC = () => {
  return <div>Category Page - To be implemented</div>
}

export const DashboardPage: React.FC = () => {
  return <div>Dashboard Page - To be implemented</div>
}