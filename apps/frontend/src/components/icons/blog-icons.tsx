import React from 'react'
import { 
  BookOpen,
  Edit3,
  Tag,
  Calendar,
  User,
  MessageCircle,
  Heart,
  Share2,
  Eye,
  TrendingUp,
  FileText,
  Search,
  Filter,
  MoreHorizontal,
  Plus,
  Settings,
} from 'lucide-react'

// Blog-specific icon components with consistent styling
interface BlogIconProps {
  className?: string
  size?: number
  color?: string
}

// Blog post related icons
export const BlogPostIcon: React.FC<BlogIconProps> = (props) => (
  <FileText {...props} />
)

export const WritePostIcon: React.FC<BlogIconProps> = (props) => (
  <Edit3 {...props} />
)

export const ReadPostIcon: React.FC<BlogIconProps> = (props) => (
  <BookOpen {...props} />
)

// Category and tags
export const CategoryIcon: React.FC<BlogIconProps> = (props) => (
  <Tag {...props} />
)

export const TagsIcon: React.FC<BlogIconProps> = (props) => (
  <Tag {...props} />
)

// User interactions
export const AuthorIcon: React.FC<BlogIconProps> = (props) => (
  <User {...props} />
)

export const CommentIcon: React.FC<BlogIconProps> = (props) => (
  <MessageCircle {...props} />
)

export const LikeIcon: React.FC<BlogIconProps> = (props) => (
  <Heart {...props} />
)

export const ShareIcon: React.FC<BlogIconProps> = (props) => (
  <Share2 {...props} />
)

export const ViewIcon: React.FC<BlogIconProps> = (props) => (
  <Eye {...props} />
)

// Utility icons
export const DateIcon: React.FC<BlogIconProps> = (props) => (
  <Calendar {...props} />
)

export const TrendingIcon: React.FC<BlogIconProps> = (props) => (
  <TrendingUp {...props} />
)

export const SearchIcon: React.FC<BlogIconProps> = (props) => (
  <Search {...props} />
)

export const FilterIcon: React.FC<BlogIconProps> = (props) => (
  <Filter {...props} />
)

export const MenuIcon: React.FC<BlogIconProps> = (props) => (
  <MoreHorizontal {...props} />
)

export const AddIcon: React.FC<BlogIconProps> = (props) => (
  <Plus {...props} />
)

export const SettingsIcon: React.FC<BlogIconProps> = (props) => (
  <Settings {...props} />
)

// Icon mapping for easy access
export const blogIcons = {
  post: BlogPostIcon,
  write: WritePostIcon,
  read: ReadPostIcon,
  category: CategoryIcon,
  tags: TagsIcon,
  author: AuthorIcon,
  comment: CommentIcon,
  like: LikeIcon,
  share: ShareIcon,
  view: ViewIcon,
  date: DateIcon,
  trending: TrendingIcon,
  search: SearchIcon,
  filter: FilterIcon,
  menu: MenuIcon,
  add: AddIcon,
  settings: SettingsIcon,
} as const

export type BlogIconName = keyof typeof blogIcons