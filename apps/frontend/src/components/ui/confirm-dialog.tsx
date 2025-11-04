import React from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

export interface ConfirmDialogProps {
  /**
   * Element that triggers the dialog (usually a button)
   */
  children: React.ReactNode
  /**
   * Dialog title
   */
  title: string
  /**
   * Dialog description/message
   */
  description: string
  /**
   * Text for the confirm button
   */
  confirmText?: string
  /**
   * Text for the cancel button
   */
  cancelText?: string
  /**
   * Callback when user confirms
   */
  onConfirm: () => void
  /**
   * Callback when user cancels (optional)
   */
  onCancel?: () => void
  /**
   * Variant of the confirm button
   */
  confirmVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
}

/**
 * Reusable confirmation dialog component
 * 
 * @example
 * ```tsx
 * <ConfirmDialog
 *   title="Usuń post"
 *   description="Czy na pewno chcesz usunąć ten post? Ta akcja nie może być cofnięta."
 *   confirmText="Usuń"
 *   confirmVariant="destructive"
 *   onConfirm={() => deletePost(postId)}
 * >
 *   <Button variant="destructive">Usuń post</Button>
 * </ConfirmDialog>
 * ```
 */
export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  children,
  title,
  description,
  confirmText = "Potwierdź",
  cancelText = "Anuluj",
  onConfirm,
  onCancel,
  confirmVariant = "default",
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className={confirmVariant === 'destructive' ? 'bg-red-600 hover:bg-red-700' : undefined}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

/**
 * Predefined delete confirmation dialog
 */
export const DeleteConfirmDialog: React.FC<{
  children: React.ReactNode
  itemName?: string
  onConfirm: () => void
  onCancel?: () => void
}> = ({ children, itemName = "element", onConfirm, onCancel }) => {
  return (
    <ConfirmDialog
      title={`Usuń ${itemName}`}
      description={`Czy na pewno chcesz usunąć ten ${itemName}? Ta akcja nie może być cofnięta.`}
      confirmText="Usuń"
      cancelText="Anuluj"
      confirmVariant="destructive"
      onConfirm={onConfirm}
      onCancel={onCancel}
    >
      {children}
    </ConfirmDialog>
  )
}

/**
 * Predefined logout confirmation dialog
 */
export const LogoutConfirmDialog: React.FC<{
  children: React.ReactNode
  onConfirm: () => void
  onCancel?: () => void
}> = ({ children, onConfirm, onCancel }) => {
  return (
    <ConfirmDialog
      title="Wylogowanie"
      description="Czy na pewno chcesz się wylogować? Wszystkie niezapisane zmiany zostaną utracone."
      confirmText="Wyloguj się"
      cancelText="Anuluj"
      onConfirm={onConfirm}
      onCancel={onCancel}
    >
      {children}
    </ConfirmDialog>
  )
}

/**
 * Predefined save confirmation dialog
 */
export const SaveConfirmDialog: React.FC<{
  children: React.ReactNode
  onConfirm: () => void
  onCancel?: () => void
  hasUnsavedChanges?: boolean
}> = ({ children, onConfirm, onCancel, hasUnsavedChanges = true }) => {
  if (!hasUnsavedChanges) {
    // If no unsaved changes, trigger onConfirm directly
    return (
      <span onClick={onConfirm}>
        {children}
      </span>
    )
  }

  return (
    <ConfirmDialog
      title="Niezapisane zmiany"
      description="Masz niezapisane zmiany. Czy chcesz je zapisać przed opuszczeniem strony?"
      confirmText="Zapisz i kontynuuj"
      cancelText="Odrzuć zmiany"
      onConfirm={onConfirm}
      onCancel={onCancel}
    >
      {children}
    </ConfirmDialog>
  )
}