import React from 'react'

export const HomePage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
          Witaj w <span className="text-primary-600">SimpleBlog</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Odkrywaj fascynujące artykuły, dziel się swoimi przemyśleniami i dołącz do społeczności 
          pasjonatów różnych dziedzin.
        </p>
      </div>

      {/* Featured Posts */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Najnowsze artykuły</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Mock posts */}
          {[1, 2, 3, 4, 5, 6].map((id) => (
            <article key={id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-r from-primary-400 to-primary-600"></div>
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    Technologia
                  </span>
                  <span className="text-gray-500 text-sm ml-3">
                    2 dni temu
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Przykładowy tytuł artykułu {id}
                </h3>
                <p className="text-gray-600 mb-4">
                  To jest przykładowy opis artykułu, który powinien być krótki i zachęcać do przeczytania całości...
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-300 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-700">Jan Kowalski</span>
                  </div>
                  <button className="text-primary-600 hover:text-primary-800 text-sm font-medium">
                    Czytaj więcej →
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Kategorie</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-blue-600 text-xl">💻</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Technologia</h3>
            <p className="text-gray-600 mb-4">Najnowsze trendy w świecie IT i programowania</p>
            <span className="text-primary-600 text-sm font-medium">15 artykułów →</span>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-green-600 text-xl">🌱</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Styl życia</h3>
            <p className="text-gray-600 mb-4">Rozwój osobisty, zdrowie i dobre nawyki</p>
            <span className="text-primary-600 text-sm font-medium">12 artykułów →</span>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-yellow-600 text-xl">✈️</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Podróże</h3>
            <p className="text-gray-600 mb-4">Przewodniki i relacje z najciekawszych miejsc</p>
            <span className="text-primary-600 text-sm font-medium">8 artykułów →</span>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 rounded-2xl p-8 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Rozpocznij swoją przygodę</h2>
        <p className="text-xl mb-6 opacity-90">
          Dołącz do społeczności i zacznij dzielić się swoimi przemyśleniami
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-primary-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
            Zarejestruj się za darmo
          </button>
          <button className="border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-primary-600 transition-colors">
            Przeglądaj artykuły
          </button>
        </div>
      </section>
    </div>
  )
}