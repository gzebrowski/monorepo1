import React, { useState } from 'react'
import type { PostWithRelations } from '@simpleblog/shared'
import { PostList } from '../components/PostList'
import { CategorySelector } from '@/categories/components/CategorySelector'

export const HomePage: React.FC = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>()

  const handlePostClick = (post: PostWithRelations) => {
    console.log('Clicked post:', post.title)
    // Można tutaj dodać nawigację do szczegółów posta
  }

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

      {/* Demo Section - Shared Library Usage */}
      <section className="mb-16">
        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            🔗 Przykład użycia Shared Library
          </h3>
          <p className="text-blue-700">
            Ta aplikacja demonstruje jak używać shared library w monorepo. Backend i frontend 
            dzielą wspólne typy, schemat walidacji Zod i definicje API.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Categories using shared types */}
          <div className="lg:col-span-1">
            <CategorySelector 
              selectedCategoryId={selectedCategoryId}
              onCategorySelect={setSelectedCategoryId}
            />
          </div>

          {/* Posts using shared types */}
          <div className="lg:col-span-2">
            <PostList
              categoryId={selectedCategoryId}
              onPostClick={handlePostClick}
            />
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