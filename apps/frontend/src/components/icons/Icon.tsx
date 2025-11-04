import React from 'react'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface IconProps {
  /**
   * The Lucide icon component to render
   */
  icon: LucideIcon
  /**
   * Size of the icon
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | number
  /**
   * Additional CSS classes
   */
  className?: string
  /**
   * Icon color (use Tailwind classes like 'text-blue-500')
   */
  color?: string
  /**
   * Click handler
   */
  onClick?: () => void
  /**
   * Whether the icon is clickable (adds hover effects)
   */
  clickable?: boolean
}

const sizeMap = {
  xs: 'h-3 w-3',
  sm: 'h-4 w-4', 
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
  xl: 'h-8 w-8',
  '2xl': 'h-12 w-12',
} as const

/**
 * Universal Icon component for consistent icon rendering
 * 
 * @example
 * ```tsx
 * import { Search } from 'lucide-react'
 * import { Icon } from '@/components/icons/Icon'
 * 
 * <Icon icon={Search} size="md" className="text-gray-500" />
 * <Icon icon={Search} size="lg" clickable onClick={() => console.log('clicked')} />
 * ```
 */
export const Icon: React.FC<IconProps> = ({
  icon: IconComponent,
  size = 'md',
  className,
  color,
  onClick,
  clickable = false,
}) => {
  const sizeClass = typeof size === 'number' ? undefined : sizeMap[size]
  const sizeStyle = typeof size === 'number' ? { width: size, height: size } : undefined

  return (
    <IconComponent
      className={cn(
        sizeClass,
        color,
        clickable && 'cursor-pointer hover:opacity-75 transition-opacity',
        onClick && 'cursor-pointer',
        className
      )}
      style={sizeStyle}
      onClick={onClick}
    />
  )
}

// Predefined icon variants for common use cases
export const IconButton: React.FC<IconProps & { variant?: 'ghost' | 'outline' | 'default' }> = ({
  variant = 'ghost',
  className,
  clickable = true,
  ...props
}) => {
  const variantClasses = {
    ghost: 'hover:bg-gray-100 rounded-md p-1',
    outline: 'border border-gray-300 hover:bg-gray-50 rounded-md p-1',
    default: 'bg-gray-100 hover:bg-gray-200 rounded-md p-1',
  }

  return (
    <Icon
      {...props}
      clickable={clickable}
      className={cn(variantClasses[variant], className)}
    />
  )
}