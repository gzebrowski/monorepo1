import React, { useState, useEffect } from 'react';
import { simpleApiClient } from '../api/simple-client';

const API_BASE_URL = 'http://localhost:3001/api';

export const SimpleHomePage: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Pobierz kategorie
        const categoriesData = await simpleApiClient.get('/categories');
        setCategories(categoriesData);
        
        // Pobierz posty
        const postsData = await simpleApiClient.get('/posts');
        setPosts(postsData);
        
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Wystąpił błąd');
        console.error('Błąd ładowania danych:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Ładowanie...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="text-red-500 text-xl mb-4">❌ Błąd: {error}</div>
        <div className="text-gray-600">
          Sprawdź czy backend działa na http://localhost:3001
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Spróbuj ponownie
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          🔗 Simple Blog - Shared Library Demo
        </h1>
        <p className="text-gray-600 text-lg">
          Backend: NestJS + PostgreSQL | Frontend: React + TypeScript | Shared: Zod + Types
        </p>
      </header>

      {/* Stats */}
      <div className="bg-blue-50 rounded-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{categories.length}</div>
            <div className="text-gray-600">Kategorii</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{posts.length}</div>
            <div className="text-gray-600">Postów</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">✅</div>
            <div className="text-gray-600">CORS Fixed</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Kategorie */}
        <div>
          <h2 className="text-2xl font-bold mb-4">📂 Kategorie</h2>
          <div className="space-y-3">
            {categories.map((category) => (
              <div 
                key={category.id}
                className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{category.name}</h3>
                    <p className="text-gray-600 text-sm">{category.description}</p>
                    <p className="text-gray-500 text-xs">Slug: {category.slug}</p>
                  </div>
                  <div
                    className="w-6 h-6 rounded-full border-2 border-gray-200"
                    style={{ backgroundColor: category.color }}
                    title={`Kolor kategorii: ${category.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Posty */}
        <div>
          <h2 className="text-2xl font-bold mb-4">📝 Posty</h2>
          <div className="space-y-4">
            {posts.map((post) => (
              <div 
                key={post.id}
                className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
                {post.excerpt && (
                  <p className="text-gray-600 mb-2">{post.excerpt}</p>
                )}
                <div className="text-sm text-gray-500 space-y-1">
                  <div>Slug: {post.slug}</div>
                  <div>Autor ID: {post.authorId} | Kategoria ID: {post.categoryId}</div>
                  <div>Status: {post.isPublished ? '✅ Opublikowany' : '⏳ Szkic'}</div>
                  <div>
                    Utworzono: {new Date(post.createdAt).toLocaleDateString('pl-PL')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 pt-8 border-t text-center text-gray-600">
        <div className="mb-4">
          <div className="text-sm space-y-2">
            <div>🎯 <strong>API Base URL:</strong> {API_BASE_URL}</div>
            <div>🔗 <strong>Shared Library:</strong> @simpleblog/shared</div>
            <div>🛠️ <strong>Validation:</strong> Zod schemas</div>
          </div>
        </div>
        <div className="text-xs text-gray-500">
          Aplikacja demonstrująca shared library w monorepo TypeScript
        </div>
      </footer>
    </div>
  );
};