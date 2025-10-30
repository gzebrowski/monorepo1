import React, { useState, useEffect } from 'react';
import type { PostWithRelations } from '@simpleblog/shared';
import { apiClient } from '../../api/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface PostListProps {
  categoryId?: number;
  onPostClick?: (post: PostWithRelations) => void;
}

export const PostList: React.FC<PostListProps> = ({ categoryId, onPostClick }) => {
  const [posts, setPosts] = useState<PostWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await apiClient.getPosts(
          { categoryId, isPublished: true }
        );
        
        if (response.success) {
          setPosts(response.data);
        } else {
          setError(response.error);
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Nieznany błąd');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [categoryId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-lg">Ładowanie postów...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center py-8">
        <div className="text-red-500 mb-4">Błąd: {error}</div>
        <Button 
          onClick={() => window.location.reload()} 
          variant="outline"
        >
          Spróbuj ponownie
        </Button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500">Brak postów do wyświetlenia</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Card 
          key={post.id} 
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => onPostClick?.(post)}
        >
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <CardTitle className="text-xl mb-2">{post.title}</CardTitle>
                <CardDescription>
                  Autor: {post.author.firstName} {post.author.lastName} 
                  {' • '}
                  Kategoria: {post.category.name}
                  {post.publishedAt && (
                    <>
                      {' • '}
                      Opublikowano: {new Date(post.publishedAt).toLocaleDateString('pl-PL')}
                    </>
                  )}
                </CardDescription>
              </div>
              {post.category.color && (
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: post.category.color }}
                  title={post.category.name}
                />
              )}
            </div>
          </CardHeader>
          
          <CardContent>
            {post.excerpt && (
              <p className="text-gray-600 mb-4 line-clamp-3">
                {post.excerpt}
              </p>
            )}
            
            {post.coverImage && (
              <div className="mb-4">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-48 object-cover rounded-md"
                />
              </div>
            )}
            
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>Slug: {post.slug}</span>
              <span>
                Utworzono: {new Date(post.createdAt).toLocaleDateString('pl-PL')}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};