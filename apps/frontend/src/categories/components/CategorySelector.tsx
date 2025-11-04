import React, { useState, useEffect } from 'react';
import type { Category } from '@simpleblog/shared';
import { apiService } from '../../api/client';
import { Button } from '@/components/ui/button';

interface CategorySelectorProps {
  selectedCategoryId?: number;
  onCategorySelect: (categoryId: number | undefined) => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategoryId,
  onCategorySelect,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await apiService.getCategories();
        
        if (response.success) {
          setCategories(response.data);
        } else {
          setError(response.error);
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Nieznany błąd');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (isLoading) {
    return <div className="text-center py-4">Ładowanie kategorii...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">Błąd: {error}</div>;
  }

  return (
    <div className="flex flex-wrap gap-2 p-4">
      <Button
        variant={selectedCategoryId === undefined ? "default" : "outline"}
        onClick={() => onCategorySelect(undefined)}
        className="mb-2"
      >
        Wszystkie kategorie
      </Button>
      
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategoryId === category.id ? "default" : "outline"}
          onClick={() => onCategorySelect(category.id)}
          className="mb-2"
          style={{
            borderColor: category.color,
            ...(selectedCategoryId === category.id && {
              backgroundColor: category.color,
              color: 'white',
            }),
          }}
        >
          {category.name}
        </Button>
      ))}
    </div>
  );
};