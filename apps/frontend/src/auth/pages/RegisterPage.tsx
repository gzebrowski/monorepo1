import React from 'react'
import { useNavigate } from 'react-router-dom'
import { RegisterForm } from '../components/RegisterForm'

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate()

  const handleSuccess = () => {
    navigate('/auth/login')
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
            Utwórz nowe konto
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
              onClick={() => navigate('/auth/login')}
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