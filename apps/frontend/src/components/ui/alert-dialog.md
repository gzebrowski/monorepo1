# AlertDialog - Dokumentacja

## Opis

Komponent `AlertDialog` z shadcn/ui służy do wyświetlania okien dialogowych wymagających potwierdzenia od użytkownika. Jest to modalne okno, które blokuje interakcję z resztą interfejsu do momentu podjęcia decyzji przez użytkownika.

## Podstawowe użycie

```tsx
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

function DeleteButton() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Usuń</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Czy jesteś pewien?</AlertDialogTitle>
          <AlertDialogDescription>
            Ta akcja nie może być cofnięta. Element zostanie trwale usunięty.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Anuluj</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>
            Tak, usuń
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
```

## Komponenty gotowe do użycia

### ConfirmDialog

Uniwersalny komponent potwierdzenia z konfigurowalnymi tekstami:

```tsx
import { ConfirmDialog } from '@/components/ui/confirm-dialog'

<ConfirmDialog
  title="Publikuj post"
  description="Czy na pewno chcesz opublikować ten post?"
  confirmText="Publikuj"
  cancelText="Anuluj"
  confirmVariant="default"
  onConfirm={() => console.log('Opublikowano!')}
  onCancel={() => console.log('Anulowano')}
>
  <Button>Publikuj</Button>
</ConfirmDialog>
```

### DeleteConfirmDialog

Predefiniowany dialog do usuwania elementów:

```tsx
import { DeleteConfirmDialog } from '@/components/ui/confirm-dialog'

<DeleteConfirmDialog
  itemName="post"
  onConfirm={() => deletePost(postId)}
>
  <Button variant="destructive">Usuń post</Button>
</DeleteConfirmDialog>
```

### LogoutConfirmDialog

Predefiniowany dialog do wylogowania:

```tsx
import { LogoutConfirmDialog } from '@/components/ui/confirm-dialog'

<LogoutConfirmDialog
  onConfirm={() => logout()}
>
  <Button variant="outline">Wyloguj się</Button>
</LogoutConfirmDialog>
```

### SaveConfirmDialog

Dialog do zapisywania niezapisanych zmian:

```tsx
import { SaveConfirmDialog } from '@/components/ui/confirm-dialog'

<SaveConfirmDialog
  hasUnsavedChanges={hasChanges}
  onConfirm={() => saveAndExit()}
  onCancel={() => exitWithoutSaving()}
>
  <Button>Wyjdź</Button>
</SaveConfirmDialog>
```

## Props

### ConfirmDialog Props

| Prop | Typ | Default | Opis |
|------|-----|---------|------|
| `children` | `ReactNode` | - | Element trigger (wymagany) |
| `title` | `string` | - | Tytuł dialogu (wymagany) |
| `description` | `string` | - | Opis/treść dialogu (wymagany) |
| `confirmText` | `string` | "Potwierdź" | Tekst przycisku potwierdzenia |
| `cancelText` | `string` | "Anuluj" | Tekst przycisku anulowania |
| `onConfirm` | `() => void` | - | Callback po potwierdzeniu (wymagany) |
| `onCancel` | `() => void` | - | Callback po anulowaniu |
| `confirmVariant` | `ButtonVariant` | "default" | Wariant przycisku potwierdzenia |

### DeleteConfirmDialog Props

| Prop | Typ | Default | Opis |
|------|-----|---------|------|
| `children` | `ReactNode` | - | Element trigger (wymagany) |
| `itemName` | `string` | "element" | Nazwa usuwanego elementu |
| `onConfirm` | `() => void` | - | Callback po potwierdzeniu (wymagany) |
| `onCancel` | `() => void` | - | Callback po anulowaniu |

### LogoutConfirmDialog Props

| Prop | Typ | Default | Opis |
|------|-----|---------|------|
| `children` | `ReactNode` | - | Element trigger (wymagany) |
| `onConfirm` | `() => void` | - | Callback po potwierdzeniu (wymagany) |
| `onCancel` | `() => void` | - | Callback po anulowaniu |

### SaveConfirmDialog Props

| Prop | Typ | Default | Opis |
|------|-----|---------|------|
| `children` | `ReactNode` | - | Element trigger (wymagany) |
| `onConfirm` | `() => void` | - | Callback po potwierdzeniu (wymagany) |
| `onCancel` | `() => void` | - | Callback po anulowaniu |
| `hasUnsavedChanges` | `boolean` | `true` | Czy są niezapisane zmiany |

## Przykłady użycia w aplikacji blogowej

### Usuwanie posta

```tsx
function BlogPost({ post }) {
  const handleDelete = async () => {
    try {
      await deletePost(post.id)
      toast.success('Post został usunięty')
      navigate('/posts')
    } catch (error) {
      toast.error('Błąd podczas usuwania posta')
    }
  }

  return (
    <div className="post">
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      
      <DeleteConfirmDialog
        itemName="post"
        onConfirm={handleDelete}
      >
        <Button variant="destructive" size="sm">
          <Trash2 className="w-4 h-4 mr-2" />
          Usuń post
        </Button>
      </DeleteConfirmDialog>
    </div>
  )
}
```

### Publikowanie posta

```tsx
function PostEditor({ post, onPublish }) {
  return (
    <div className="editor">
      {/* Formularz edytora */}
      
      <ConfirmDialog
        title="Publikuj post"
        description="Czy na pewno chcesz opublikować ten post? Będzie on widoczny dla wszystkich użytkowników."
        confirmText="Publikuj"
        confirmVariant="default"
        onConfirm={() => onPublish(post)}
      >
        <Button className="ml-auto">
          <Send className="w-4 h-4 mr-2" />
          Publikuj
        </Button>
      </ConfirmDialog>
    </div>
  )
}
```

### Wylogowanie z niezapisanymi zmianami

```tsx
function Header({ hasUnsavedChanges }) {
  const handleLogout = async () => {
    if (hasUnsavedChanges) {
      // Zapisz zmiany przed wylogowaniem
      await saveDraft()
    }
    await logout()
  }

  return (
    <header>
      <SaveConfirmDialog
        hasUnsavedChanges={hasUnsavedChanges}
        onConfirm={handleLogout}
      >
        <Button variant="ghost">Wyloguj się</Button>
      </SaveConfirmDialog>
    </header>
  )
}
```

## Dostępność (Accessibility)

AlertDialog automatycznie zapewnia:

- **Focus management** - focus przenosi się do dialogu przy otwarciu
- **Keyboard navigation** - ESC zamyka dialog, Tab nawiguje po elementach
- **ARIA attributes** - właściwe role i aria-* atrybuty
- **Screen reader support** - dialog jest ogłaszany przez czytniki ekranu

## Stylizacja

Dialog używa CSS classes z Tailwind i może być dostosowany:

```tsx
<AlertDialogContent className="max-w-md">
  <AlertDialogHeader>
    <AlertDialogTitle className="text-red-600">
      Błąd krytyczny!
    </AlertDialogTitle>
    <AlertDialogDescription className="text-gray-600">
      Wystąpił nieoczekiwany błąd.
    </AlertDialogDescription>
  </AlertDialogHeader>
</AlertDialogContent>
```

## Best Practices

1. **Używaj opisowych tytułów** - jasno określ co się stanie
2. **Wyjaśnij konsekwencje** - opisz co się stanie po potwierdzeniu
3. **Używaj odpowiednich wariantów** - `destructive` dla destrukcyjnych akcji
4. **Nie nadużywaj** - nie pokazuj dialoga dla każdej małej akcji
5. **Testuj dostępność** - sprawdź czy dialog działa z klawiaturą
6. **Dodawaj loading states** - pokazuj stan ładowania podczas wykonywania akcji