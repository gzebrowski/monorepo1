// Common icons for SimpleBlog application
// Re-export frequently used Lucide icons for consistency

export {
  // Navigation & Actions
  Menu,
  X,
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  MoreHorizontal,
  MoreVertical,
  
  // Content & Media
  Plus,
  Minus,
  Edit,
  Edit2,
  Edit3,
  Trash2,
  Copy,
  Save,
  Download,
  Upload,
  Share,
  Share2,
  Image,
  FileText,
  File,
  Folder,
  
  // User & Authentication
  User,
  Users,
  UserPlus,
  UserMinus,
  LogIn,
  LogOut,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Shield,
  
  // Communication & Social
  Mail,
  MessageCircle,
  MessageSquare,
  Send,
  Phone,
  Video,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Star,
  
  // Status & Alerts
  Check,
  CheckCircle,
  CheckCircle2,
  X as XIcon,
  XCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  HelpCircle,
  
  // Search & Filter
  Search,
  Filter,
  SlidersHorizontal,
  Settings,
  Settings2,
  
  // Date & Time
  Calendar,
  Clock,
  Timer,
  
  // Business & Analytics
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  TrendingDown,
  Activity,
  
  // Technology
  Code,
  Code2,
  Database,
  Server,
  Globe,
  Link,
  Link2,
  ExternalLink,
  
  // Layout & UI
  Grid,
  List,
  Columns,
  Sidebar,
  PanelLeft,
  PanelRight,
  Maximize,
  Minimize,
  
  // Categories & Tags
  Tag,
  Tags,
  Bookmark,
  BookmarkPlus,
  Flag,
  
  // Blog Specific
  BookOpen,
  Newspaper,
  PenTool,
  Feather,
  Type,
  
  // System
  Home,
  Bell,
  BellRing,
  Zap,
  Power,
  RefreshCw,
  Loader,
  Loader2,
  
  // Directional
  MoveUp,
  MoveDown,
  MoveLeft,
  MoveRight,
  
} from "lucide-react"

// Custom icon type for consistency
export type IconComponent = React.ComponentType<{
  className?: string
  size?: number | string
  color?: string
}>

// Common icon sizes
export const iconSizes = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  '2xl': 48,
} as const

// Icon helper component with default props
export interface IconProps {
  className?: string
  size?: keyof typeof iconSizes | number
  color?: string
}

// Simple utility function to get icon size
export const getIconSize = (size: keyof typeof iconSizes | number = 'md'): number => {
  return typeof size === 'number' ? size : iconSizes[size]
}

// Re-export icon components
export { Icon, IconButton } from './Icon'
export { blogIcons, type BlogIconName } from './blog-icons'