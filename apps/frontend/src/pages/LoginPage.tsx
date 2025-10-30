import React from 'react'

export const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Zaloguj się do swojego konta
          </h2>
        </div>
        <form className="mt-8 space-y-6">
          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Adres email"
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">Hasło</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Hasło"
            />
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Zaloguj się
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export const RegisterPage: React.FC = () => {
  return <div>Register Page - To be implemented</div>
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