import React, { useState } from 'react'
import {
  Badge,
  Alert,
  AlertDescription,
  AlertTitle,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Calendar,
  Checkbox,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  DatetimePicker,
  AutoComplete,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Textarea,
  useToast,
  ConfirmDialog,
  DeleteConfirmDialog,
  LogoutConfirmDialog,
  type AutoCompleteOption
} from '@/components/ui'
import { AlertCircle } from 'lucide-react'

const ComponentShowcase: React.FC = () => {
  const { toast } = useToast()
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [switchValue, setSwitchValue] = useState(false)
  const [checkboxValue, setCheckboxValue] = useState(false)
  const [selectValue, setSelectValue] = useState("")
  const [autoCompleteValue, setAutoCompleteValue] = useState("")

  const autoCompleteOptions: AutoCompleteOption[] = [
    { value: "react", label: "React" },
    { value: "vue", label: "Vue.js" },
    { value: "angular", label: "Angular" },
    { value: "svelte", label: "Svelte" },
    { value: "nextjs", label: "Next.js" },
  ]

  const showToast = () => {
    toast({
      title: "Powiadomienie",
      description: "To jest przykład powiadomienia toast!",
      
    })
  }

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">Komponenty shadcn/ui</h1>
      
      {/* Badges */}
      <Card>
        <CardHeader>
          <CardTitle>Badge</CardTitle>
        </CardHeader>
        <CardContent className="space-x-2">
          <Badge variant="default">Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </CardContent>
      </Card>

      {/* Alert */}
      <Card>
        <CardHeader>
          <CardTitle>Alert</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Uwaga!</AlertTitle>
            <AlertDescription>
              To jest przykład komponentu Alert z ikoną i opisem.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Form Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Kontrolki formularza</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Switch</label>
            <Switch
              checked={switchValue}
              onCheckedChange={setSwitchValue}
            />
            <p className="text-sm text-muted-foreground">
              Wartość: {switchValue ? 'Włączone' : 'Wyłączone'}
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Checkbox</label>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={checkboxValue}
                onCheckedChange={(checked) => setCheckboxValue(checked === true)}
                id="checkbox-demo"
              />
              <label htmlFor="checkbox-demo" className="text-sm">
                Zaznacz mnie
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Select</label>
            <Select value={selectValue} onValueChange={setSelectValue}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Wybierz opcję" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="opcja1">Opcja 1</SelectItem>
                <SelectItem value="opcja2">Opcja 2</SelectItem>
                <SelectItem value="opcja3">Opcja 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">AutoComplete</label>
            <AutoComplete
              options={autoCompleteOptions}
              value={autoCompleteValue}
              onValueChange={setAutoCompleteValue}
              placeholder="Wybierz technologię..."
              searchPlaceholder="Szukaj technologii..."
              emptyMessage="Nie znaleziono technologii."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Textarea</label>
            <Textarea
              placeholder="Wprowadź tekst..."
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* DateTime Picker */}
      <Card>
        <CardHeader>
          <CardTitle>DateTime Picker</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Wybierz datę i czas</label>
            <DatetimePicker
              value={selectedDate}
              onChange={setSelectedDate}
              placeholder="Wybierz datę i czas"
              showTime={true}
            />
          </div>
          {selectedDate && (
            <p className="text-sm text-muted-foreground">
              Wybrana data: {selectedDate.toLocaleString()}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Calendar */}
      <Card>
        <CardHeader>
          <CardTitle>Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
          />
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Table</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nazwa</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Akcje</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Element 1</TableCell>
                <TableCell>
                  <Badge variant="default">Aktywny</Badge>
                </TableCell>
                <TableCell>2023-12-01</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm">
                    Edytuj
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Element 2</TableCell>
                <TableCell>
                  <Badge variant="secondary">Nieaktywny</Badge>
                </TableCell>
                <TableCell>2023-12-02</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm">
                    Edytuj
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Toast Demo */}
      <Card>
        <CardHeader>
          <CardTitle>Toast</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={showToast}>
            Pokaż powiadomienie Toast
          </Button>
        </CardContent>
      </Card>

      {/* Alert Dialog Demo */}
      <Card>
        <CardHeader>
          <CardTitle>Alert Dialog</CardTitle>
        </CardHeader>
        <CardContent className="space-x-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Usuń post</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Czy jesteś pewien?</AlertDialogTitle>
                <AlertDialogDescription>
                  Ta akcja nie może być cofnięta. Post zostanie trwale usunięty 
                  z serwera wraz ze wszystkimi komentarzami.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Anuluj</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => toast({ 
                    title: "Post usunięty", 
                    description: "Post został pomyślnie usunięty." 
                  })}
                >
                  Tak, usuń
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <DeleteConfirmDialog
            itemName="post"
            onConfirm={() => toast({ 
              title: "Post usunięty", 
              description: "Post został pomyślnie usunięty przy użyciu DeleteConfirmDialog." 
            })}
          >
            <Button variant="destructive">Usuń post (ConfirmDialog)</Button>
          </DeleteConfirmDialog>

          <LogoutConfirmDialog
            onConfirm={() => toast({ 
              title: "Wylogowano", 
              description: "Zostałeś pomyślnie wylogowany przy użyciu LogoutConfirmDialog." 
            })}
          >
            <Button variant="outline">Wyloguj się (ConfirmDialog)</Button>
          </LogoutConfirmDialog>

          <ConfirmDialog
            title="Publikuj post"
            description="Czy na pewno chcesz opublikować ten post? Będzie on widoczny dla wszystkich użytkowników."
            confirmText="Publikuj"
            cancelText="Anuluj"
            onConfirm={() => toast({ 
              title: "Post opublikowany", 
              description: "Twój post został pomyślnie opublikowany!" 
            })}
          >
            <Button>Publikuj post (Custom ConfirmDialog)</Button>
          </ConfirmDialog>
        </CardContent>
      </Card>
    </div>
  )
}

export default ComponentShowcase