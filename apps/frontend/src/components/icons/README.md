# 🎨 System Ikon - SimpleBlog

Kompletny system ikon oparty na **Lucide React** dla aplikacji SimpleBlog.

## 📦 Co zawiera

### 1. **Podstawowe ikony (`/components/icons/index.ts`)**
- Re-eksport najczęściej używanych ikon z Lucide React
- Ponad 100 ikon podzielonych na kategorie:
  - Nawigacja & Akcje
  - Treść & Media  
  - Użytkownicy & Autoryzacja
  - Komunikacja & Social Media
  - Status & Alerty
  - Wyszukiwanie & Filtry
  - Data & Czas
  - Biznes & Analityka
  - Technologia
  - Layout & UI
  - Kategorie & Tagi
  - Blog Specific
  - System

### 2. **Komponenty ikon (`/components/icons/Icon.tsx`)**
- `Icon` - uniwersalny komponent ikony
- `IconButton` - ikona z funkcjonalnością przycisku
- Wsparcie dla różnych rozmiarów, kolorów i stanów

### 3. **Ikony blogowe (`/components/icons/blog-icons.tsx`)**
- Zestaw ikon specyficznych dla aplikacji blogowej
- Wrapery z konsystentną nazwą i stylizacją

## 🚀 Jak używać

### Podstawowe użycie

```tsx
import { Search, Heart, Edit3 } from 'lucide-react'
import { Icon, IconButton } from '@/components/icons'

// Prosta ikona
<Icon icon={Search} size="md" className="text-blue-500" />

// Ikona z funkcjonalnością przycisku
<IconButton 
  icon={Settings} 
  onClick={handleClick}
  variant="ghost"
/>
```

### Ikony blogowe

```tsx
import { blogIcons } from '@/components/icons'

// Używanie predefiniowanych ikon blogowych
<blogIcons.post size={20} className="text-gray-600" />
<blogIcons.like className="text-red-500" />
<blogIcons.comment className="text-blue-500" />
```

### Rozmiary

```tsx
// Predefiniowane rozmiary
<Icon icon={Heart} size="xs" />  // 12px
<Icon icon={Heart} size="sm" />  // 16px  
<Icon icon={Heart} size="md" />  // 20px (domyślny)
<Icon icon={Heart} size="lg" />  // 24px
<Icon icon={Heart} size="xl" />  // 32px
<Icon icon={Heart} size="2xl" /> // 48px

// Niestandardowy rozmiar
<Icon icon={Heart} size={28} />
```

### Interaktywność

```tsx
// Klikalna ikona
<Icon 
  icon={Search} 
  clickable 
  onClick={() => console.log('Szukaj')}
  className="text-gray-500 hover:text-gray-700"
/>

// Przycisk z ikoną
<IconButton 
  icon={Plus}
  variant="outline"
  onClick={handleAdd}
/>
```

## 🎯 Przykłady użycia w aplikacji

### Post blogowy

```tsx
function BlogPost() {
  return (
    <article>
      <header className="flex items-center space-x-2 mb-4">
        <Icon icon={User} size="sm" className="text-gray-500" />
        <span>Jan Kowalski</span>
        <Icon icon={Calendar} size="sm" className="text-gray-500" />
        <span>2023-11-03</span>
      </header>
      
      <footer className="flex items-center space-x-4 mt-6">
        <button className="flex items-center space-x-1">
          <Icon icon={Heart} size="sm" className="text-red-500" />
          <span>42</span>
        </button>
        
        <button className="flex items-center space-x-1">
          <Icon icon={MessageCircle} size="sm" className="text-blue-500" />
          <span>12</span>
        </button>
        
        <IconButton icon={Share2} variant="ghost" />
      </footer>
    </article>
  )
}
```

### Nawigacja

```tsx
function Navigation() {
  return (
    <nav className="flex space-x-4">
      <Button variant="ghost">
        <Icon icon={Home} size="sm" className="mr-2" />
        Strona główna
      </Button>
      
      <Button variant="ghost">
        <Icon icon={Edit3} size="sm" className="mr-2" />
        Napisz post
      </Button>
      
      <IconButton icon={Search} />
      <IconButton icon={Bell} />
      <IconButton icon={Settings} />
    </nav>
  )
}
```

## 📋 Dostępne ikony blogowe

| Klucz | Komponent | Opis |
|-------|-----------|------|
| `post` | `BlogPostIcon` | Ikona posta |
| `write` | `WritePostIcon` | Pisanie posta |
| `read` | `ReadPostIcon` | Czytanie |
| `category` | `CategoryIcon` | Kategoria |
| `tags` | `TagsIcon` | Tagi |
| `author` | `AuthorIcon` | Autor |
| `comment` | `CommentIcon` | Komentarz |
| `like` | `LikeIcon` | Polubienie |
| `share` | `ShareIcon` | Udostępnienie |
| `view` | `ViewIcon` | Wyświetlenia |
| `date` | `DateIcon` | Data |
| `trending` | `TrendingIcon` | Trendy |
| `search` | `SearchIcon` | Wyszukiwanie |
| `filter` | `FilterIcon` | Filtr |
| `menu` | `MenuIcon` | Menu |
| `add` | `AddIcon` | Dodaj |
| `settings` | `SettingsIcon` | Ustawienia |

## 🎨 Warianty IconButton

- `ghost` - przezroczyste tło, hover effect
- `outline` - z obramowaniem
- `default` - z tłem

## 🔗 Przydatne linki

- [Lucide React](https://lucide.dev/) - oficjalna dokumentacja
- [Lucide Icons Browser](https://lucide.dev/icons/) - przeglądaj wszystkie ikony
- [Tailwind CSS](https://tailwindcss.com/) - do stylizacji

## ⚡ Performance

- Tree shaking - importowane są tylko używane ikony
- SVG based - skalowalne ikony wektorowe
- Lazy loading - ikony ładowane na żądanie
- Minimal bundle impact - ~2-3KB per icon