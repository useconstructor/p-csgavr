'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Plus, X, BookOpen, Search, Check } from 'lucide-react'

interface BookType {
  id: number
  title: string
  author: string
  status: 'Pendiente' | 'Leído'
}

export default function HomePage() {
  const [books, setBooks] = useState<BookType[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [newBook, setNewBook] = useState({ title: '', author: '', status: 'Pendiente' })
  const [saving, setSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchBooks()
  }, [])

  async function fetchBooks() {
    try {
      const res = await fetch('/api/books')
      const data = await res.json()
      setBooks(data)
    } catch {
      console.error('Error fetching books')
    } finally {
      setLoading(false)
    }
  }

  async function addBook() {
    if (!newBook.title.trim() || !newBook.author.trim()) return
    setSaving(true)
    try {
      await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBook)
      })
      setNewBook({ title: '', author: '', status: 'Pendiente' })
      setShowModal(false)
      fetchBooks()
    } catch {
      console.error('Error adding book')
    } finally {
      setSaving(false)
    }
  }

  async function toggleStatus(book: BookType) {
    const newStatus = book.status === 'Pendiente' ? 'Leído' : 'Pendiente'
    try {
      await fetch(`/api/books/${book.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      fetchBooks()
    } catch {
      console.error('Error updating book')
    }
  }

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const pendingBooks = filteredBooks.filter(b => b.status === 'Pendiente')
  const readBooks = filteredBooks.filter(b => b.status === 'Leído')

  return (
    <div className="min-h-screen bg-[#F9F7F4]">
      {/* Header */}
      <header className="bg-white border-b border-[#e5e2de]">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BookOpen className="w-7 h-7 text-[#D97757]" />
              <h1 className="text-2xl font-bold text-[#2C2C2C]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Libros Leídos
              </h1>
            </div>
            <Button
              onClick={() => setShowModal(true)}
              className="bg-[#D97757] hover:bg-[#c56646] text-white"
            >
              <Plus className="w-4 h-4 mr-1" />
              Agregar
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A756F]" />
            <Input
              type="text"
              placeholder="Buscar por título o autor..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10 bg-[#F9F7F4] border-[#e5e2de] focus:border-[#D97757] focus:ring-[#D97757]"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {loading ? (
          <p className="text-center text-[#7A756F]">Cargando...</p>
        ) : books.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-[#e5e2de] mx-auto mb-4" />
            <p className="text-[#7A756F]">No hay libros. Agrega tu primer libro.</p>
          </div>
        ) : (
          <>
            {/* Pending Books */}
            {pendingBooks.length > 0 && (
              <section className="mb-8">
                <h2 className="text-lg font-semibold text-[#2C2C2C] mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Pendientes ({pendingBooks.length})
                </h2>
                <div className="space-y-3">
                  {pendingBooks.map(book => (
                    <Card key={book.id} className="bg-white border-[#e5e2de]">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-[#2C2C2C] truncate">{book.title}</h3>
                          <p className="text-sm text-[#7A756F] truncate">{book.author}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleStatus(book)}
                          className="ml-4 border-[#D97757] text-[#D97757] hover:bg-[#D97757] hover:text-white"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Marcar leído
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* Read Books */}
            {readBooks.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold text-[#2C2C2C] mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Leídos ({readBooks.length})
                </h2>
                <div className="space-y-3">
                  {readBooks.map(book => (
                    <Card key={book.id} className="bg-white border-[#e5e2de]">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-[#2C2C2C] truncate">{book.title}</h3>
                          <p className="text-sm text-[#7A756F] truncate">{book.author}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleStatus(book)}
                          className="ml-4 border-[#7A756F] text-[#7A756F] hover:bg-[#7A756F] hover:text-white"
                        >
                          Marcar pendiente
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {filteredBooks.length === 0 && searchQuery && (
              <p className="text-center text-[#7A756F] py-8">
                No se encontraron libros para &quot;{searchQuery}&quot;
              </p>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#e5e2de] py-6 mt-auto">
        <p className="text-center text-[#7A756F] text-sm">
          © 2026 Libros Leídos
        </p>
      </footer>

      {/* Add Book Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 transition-opacity"
            onClick={() => setShowModal(false)}
          />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6 transform transition-all">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#2C2C2C]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Agregar Libro
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-[#F9F7F4] rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-[#7A756F]" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="book-title" className="block text-sm font-medium text-[#2C2C2C] mb-1">
                  Título <span className="text-red-500">*</span>
                </label>
                <Input
                  id="book-title"
                  type="text"
                  required
                  value={newBook.title}
                  onChange={e => setNewBook({ ...newBook, title: e.target.value })}
                  placeholder="Ej: Cien años de soledad"
                  className="bg-[#F9F7F4] border-[#e5e2de] focus:border-[#D97757] focus:ring-[#D97757]"
                />
              </div>
              <div>
                <label htmlFor="book-author" className="block text-sm font-medium text-[#2C2C2C] mb-1">
                  Autor <span className="text-red-500">*</span>
                </label>
                <Input
                  id="book-author"
                  type="text"
                  required
                  value={newBook.author}
                  onChange={e => setNewBook({ ...newBook, author: e.target.value })}
                  placeholder="Ej: Gabriel García Márquez"
                  className="bg-[#F9F7F4] border-[#e5e2de] focus:border-[#D97757] focus:ring-[#D97757]"
                />
              </div>
              <div>
                <label htmlFor="book-status" className="block text-sm font-medium text-[#2C2C2C] mb-1">
                  Estado
                </label>
                <select
                  id="book-status"
                  value={newBook.status}
                  onChange={e => setNewBook({ ...newBook, status: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-[#e5e2de] bg-[#F9F7F4] text-[#2C2C2C] text-sm focus:outline-none focus:ring-2 focus:ring-[#D97757] focus:border-[#D97757]"
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="Leído">Leído</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowModal(false)}
                className="flex-1 border-[#e5e2de] text-[#7A756F] hover:bg-[#F9F7F4]"
              >
                Cancelar
              </Button>
              <Button
                onClick={addBook}
                disabled={saving || !newBook.title.trim() || !newBook.author.trim()}
                className="flex-1 bg-[#D97757] hover:bg-[#c56646] text-white"
              >
                {saving ? 'Guardando...' : 'Guardar'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
