import React, { useState } from 'react'
import { 
  Search,
  Heart,
  MessageCircle,
  Share2,
  BookOpen,
  Edit3,
  Tag,
  Calendar,
  User,
  Eye,
  TrendingUp,
  Settings,
  Plus,
  Filter,
  Bell,
  Home,
} from 'lucide-react'

import { Icon, IconButton } from '@/components/icons/Icon'
import { blogIcons, type BlogIconName } from '@/components/icons/blog-icons'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui'

const IconShowcase: React.FC = () => {
  const { toast } = useToast()
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set())

  const handleIconClick = (iconName: string) => {
    toast({
      title: "Ikona kliknięta!",
      description: `Kliknięto ikonę: ${iconName}`,
    })
  }

  const handleLike = (id: string) => {
    setLikedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const commonIcons = [
    { icon: Search, name: 'Search', description: 'Wyszukiwanie' },
    { icon: Heart, name: 'Heart', description: 'Polubienia' },
    { icon: MessageCircle, name: 'MessageCircle', description: 'Komentarze' },
    { icon: Share2, name: 'Share2', description: 'Udostępnianie' },
    { icon: BookOpen, name: 'BookOpen', description: 'Czytanie' },
    { icon: Edit3, name: 'Edit3', description: 'Edycja' },
    { icon: Tag, name: 'Tag', description: 'Tagi' },
    { icon: Calendar, name: 'Calendar', description: 'Data' },
    { icon: User, name: 'User', description: 'Użytkownik' },
    { icon: Eye, name: 'Eye', description: 'Wyświetlenia' },
    { icon: TrendingUp, name: 'TrendingUp', description: 'Trendy' },
    { icon: Settings, name: 'Settings', description: 'Ustawienia' },
    { icon: Plus, name: 'Plus', description: 'Dodaj' },
    { icon: Filter, name: 'Filter', description: 'Filtr' },
    { icon: Bell, name: 'Bell', description: 'Powiadomienia' },
    { icon: Home, name: 'Home', description: 'Strona główna' },
  ]

  const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const

  const blogIconEntries = Object.entries(blogIcons) as Array<[BlogIconName, React.ComponentType<any>]>

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">🎨 Biblioteka Ikon</h1>
        <p className="text-gray-600 text-lg">
          Kompletny zestaw ikon dla aplikacji SimpleBlog przy użyciu Lucide React
        </p>
      </div>

      {/* Icon Sizes */}
      <Card>
        <CardHeader>
          <CardTitle>Rozmiary ikon</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-8">
            {sizes.map((size) => (
              <div key={size} className="text-center">
                <Icon icon={Heart} size={size} className="text-red-500 mx-auto mb-2" />
                <Badge variant="outline">{size}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Common Icons Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Popularne ikony</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
            {commonIcons.map((item) => (
              <div
                key={item.name}
                className="text-center p-3 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => handleIconClick(item.name)}
              >
                <Icon icon={item.icon} size="lg" className="text-gray-700 mx-auto mb-2" />
                <p className="text-xs font-medium text-gray-600">{item.name}</p>
                <p className="text-xs text-gray-400">{item.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Blog-specific Icons */}
      <Card>
        <CardHeader>
          <CardTitle>Ikony blogowe</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
            {blogIconEntries.map(([key, IconComponent]) => (
              <div
                key={key}
                className="text-center p-3 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => handleIconClick(key)}
              >
                <IconComponent size={24} className="text-blue-600 mx-auto mb-2" />
                <Badge variant="secondary" className="text-xs">
                  {key}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Interactive Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Interaktywne przykłady</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Icon Buttons */}
          <div>
            <h3 className="font-semibold mb-3">Przyciski z ikonami</h3>
            <div className="flex space-x-2">
              <IconButton icon={Search} onClick={() => handleIconClick('search')} />
              <IconButton icon={Settings} variant="outline" onClick={() => handleIconClick('settings')} />
              <IconButton icon={Plus} variant="default" onClick={() => handleIconClick('add')} />
            </div>
          </div>

          {/* Blog Post Actions */}
          <div>
            <h3 className="font-semibold mb-3">Akcje posta blogowego</h3>
            <div className="flex items-center space-x-4 p-4 border rounded-lg">
              <button
                onClick={() => handleLike('post1')}
                className="flex items-center space-x-1 hover:bg-red-50 px-2 py-1 rounded transition-colors"
              >
                <Icon
                  icon={Heart}
                  size="sm"
                  className={likedItems.has('post1') ? 'text-red-500 fill-current' : 'text-gray-500'}
                />
                <span className="text-sm">42</span>
              </button>

              <button
                onClick={() => handleIconClick('comment')}
                className="flex items-center space-x-1 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
              >
                <Icon icon={MessageCircle} size="sm" className="text-gray-500" />
                <span className="text-sm">12</span>
              </button>

              <button
                onClick={() => handleIconClick('share')}
                className="flex items-center space-x-1 hover:bg-green-50 px-2 py-1 rounded transition-colors"
              >
                <Icon icon={Share2} size="sm" className="text-gray-500" />
                <span className="text-sm">Share</span>
              </button>

              <div className="flex items-center space-x-1 text-gray-500">
                <Icon icon={Eye} size="sm" />
                <span className="text-sm">1,234</span>
              </div>
            </div>
          </div>

          {/* Navigation Icons */}
          <div>
            <h3 className="font-semibold mb-3">Nawigacja</h3>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" onClick={() => handleIconClick('home')}>
                <Icon icon={Home} size="sm" className="mr-2" />
                Strona główna
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleIconClick('write')}>
                <Icon icon={Edit3} size="sm" className="mr-2" />
                Napisz post
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleIconClick('profile')}>
                <Icon icon={User} size="sm" className="mr-2" />
                Profil
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Jak używać</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Import ikon:</h4>
              <code className="text-sm">
                {`import { Search, Heart } from 'lucide-react'`}<br/>
                {`import { Icon, IconButton } from '@/components/icons/Icon'`}<br/>
                {`import { blogIcons } from '@/components/icons/blog-icons'`}
              </code>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Użycie:</h4>
              <code className="text-sm">
                {`<Icon icon={Search} size="md" className="text-blue-500" />`}<br/>
                {`<IconButton icon={Settings} onClick={handleClick} />`}<br/>
                {`<blogIcons.post size={20} className="text-gray-600" />`}
              </code>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default IconShowcase