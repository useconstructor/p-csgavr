'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Book, Plus, X, Check, Menu, BookOpen, CheckCircle, Clock, Send } from 'lucide-react'

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
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [formSuccess, setFormSuccess] = useState(false)
  const [formError, setFormError] = useState('')

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
      setBooks(books.map(b => b.id === book.id ? { ...b, status: newStatus } : b))
    } catch {
      console.error('Error updating book')
    }
  }

  async function deleteBook(id: number) {
    try {
      await fetch(`/api/books/${id}`, { method: 'DELETE' })
      setBooks(books.filter(b => b.id !== id))
      setDeleteConfirm(null)
    } catch {
      console.error('Error deleting book')
    }
  }

  async function handleContactSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormSubmitting(true)
    setFormError('')
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_CONSTRUCTOR_API}/v1/forms/${process.env.NEXT_PUBLIC_PROJECT_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        setFormSuccess(true)
      } else {
        setFormError('Error al enviar el mensaje. Intenta de nuevo.')
      }
    } catch {
      setFormError('Error al enviar el mensaje. Intenta de nuevo.')
    } finally {
      setFormSubmitting(false)
    }
  }

  const getInitials = (author: string) => {
    return author.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
  }

  const totalBooks = books.length
  const pendingBooks = books.filter(b => b.status === 'Pendiente').length
  const completedBooks = books.filter(b => b.status === 'Leído').length

  const navLinks = [
    { label: 'Inicio', href: '#inicio' },
    { label: 'Mis Libros', href: '#mis-libros' },
    { label: 'Contacto', href: '#contacto' },
    { label: 'Acerca de', href: '#acerca' },
  ]

  return (
    <div className="min-h-screen">
      {/* Sticky Nav */}
      <nav className="sticky top-0 z-50 bg-[#F9F7F4]/95 backdrop-blur-sm border-b border-[#e5e2de]">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-[#D97757]" />
            <span className="font-semibold text-lg" style={{ fontFamily: 'Poppins, sans-serif' }}>Libros Leídos</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <a key={link.href} href={link.href} className="text-sm text-[#7A756F] hover:text-[#2C2C2C] transition-colors">
                {link.label}
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-white rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Nav Panel */}
        <div className={`md:hidden overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${mobileMenuOpen ? 'opacity-100 translate-y-0 pointer-events-auto max-h-64' : 'opacity-0 -translate-y-4 pointer-events-none max-h-0'}`}>
          <div className="px-4 pb-4 space-y-2">
            {navLinks.map((link, index) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-[#7A756F] hover:text-[#2C2C2C] transition-all duration-300"
                style={{ transitionDelay: mobileMenuOpen ? `${index * 60}ms` : '0ms' }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="inicio" className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-sm text-[#D97757] font-medium mb-4">Tu biblioteca personal</p>
          <h1 className="text-3xl md:text-5xl font-bold text-[#2C2C2C] mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Mi Biblioteca Personal
          </h1>
          <p className="text-[#7A756F] text-lg mb-8 max-w-xl mx-auto">
            Organiza tus libros pendientes y completados. Lleva un registro de todo lo que lees.
          </p>
          <Button
            onClick={() => setShowModal(true)}
            className="bg-[#D97757] hover:bg-[#c56646] text-white px-6 py-3 h-auto text-base"
          >
            <Plus className="w-5 h-5 mr-2" />
            Agregar Libro
          </Button>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-6 border-y border-[#e5e2de] bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 text-sm">
            <div className="flex items-center gap-2">
              <Book className="w-4 h-4 text-[#7A756F]" />
              <span className="text-[#7A756F]">Total de libros:</span>
              <span className="font-semibold text-[#2C2C2C]">{totalBooks}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#F5A962]" />
              <span className="text-[#7A756F]">Pendientes:</span>
              <span className="font-semibold text-[#2C2C2C]">{pendingBooks}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#6BAA75]" />
              <span className="text-[#7A756F]">Completados:</span>
              <span className="font-semibold text-[#2C2C2C]">{completedBooks}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Books Grid */}
      <section id="mis-libros" className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-[#2C2C2C] mb-8" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Mis Libros
          </h2>

          {loading ? (
            <div className="text-center py-12 text-[#7A756F]">Cargando...</div>
          ) : books.length === 0 ? (
            <div className="text-center py-12">
              <Book className="w-12 h-12 text-[#e5e2de] mx-auto mb-4" />
              <p className="text-[#7A756F]">No tienes libros registrados aún.</p>
              <Button
                onClick={() => setShowModal(true)}
                className="mt-4 bg-[#D97757] hover:bg-[#c56646] text-white"
              >
                Agregar tu primer libro
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {books.map(book => (
                <Card key={book.id} className="bg-white border-[#e5e2de] hover:shadow-md transition-shadow relative group">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#F9F7F4] flex items-center justify-center text-[#D97757] font-semibold text-sm shrink-0">
                        {getInitials(book.author)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-[#2C2C2C] truncate">{book.title}</h3>
                          {deleteConfirm === book.id ? (
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() => deleteBook(book.id)}
                                className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                aria-label="Confirmar eliminar"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(null)}
                                className="p-1 text-[#7A756F] hover:bg-[#F9F7F4] rounded transition-colors"
                                aria-label="Cancelar"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirm(book.id)}
                              className="p-1 text-[#e5e2de] hover:text-[#7A756F] rounded transition-colors opacity-0 group-hover:opacity-100"
                              aria-label="Eliminar libro"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <p className="text-sm text-[#7A756F] mb-3">{book.author}</p>
                        <div className="flex items-center justify-between">
                          <Badge
                            className={`${
                              book.status === 'Leído'
                                ? 'bg-[#6BAA75] text-white border-[#6BAA75]'
                                : 'bg-[#F5A962] text-white border-[#F5A962]'
                            }`}
                          >
                            {book.status}
                          </Badge>
                          <button
                            onClick={() => toggleStatus(book)}
                            className="text-sm text-[#D97757] hover:text-[#c56646] font-medium transition-colors flex items-center gap-1"
                          >
                            {book.status === 'Pendiente' ? (
                              <>
                                <Check className="w-4 h-4" />
                                Marcar como Leído
                              </>
                            ) : (
                              'Desmarcar'
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Form */}
      <section id="contacto" className="py-16 bg-white border-y border-[#e5e2de]">
        <div className="max-w-xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-[#2C2C2C] mb-2 text-center" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Contacto
          </h2>
          <p className="text-[#7A756F] text-center mb-8">
            ¿Tienes sugerencias o comentarios? Escríbenos.
          </p>

          {formSuccess ? (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-[#6BAA75] mx-auto mb-4" />
              <p className="text-[#2C2C2C] font-medium">Mensaje enviado</p>
              <p className="text-[#7A756F] text-sm">Te contactaremos pronto.</p>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[#2C2C2C] mb-1">Nombre</label>
                <Input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="bg-[#F9F7F4] border-[#e5e2de] focus:border-[#D97757] focus:ring-[#D97757]"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#2C2C2C] mb-1">Correo electrónico</label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="bg-[#F9F7F4] border-[#e5e2de] focus:border-[#D97757] focus:ring-[#D97757]"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-[#2C2C2C] mb-1">Mensaje</label>
                <Textarea
                  id="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  className="bg-[#F9F7F4] border-[#e5e2de] focus:border-[#D97757] focus:ring-[#D97757]"
                />
              </div>
              {formError && <p className="text-red-600 text-sm">{formError}</p>}
              <Button
                type="submit"
                disabled={formSubmitting}
                className="w-full bg-[#D97757] hover:bg-[#c56646] text-white"
              >
                {formSubmitting ? 'Enviando...' : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Enviar mensaje
                  </>
                )}
              </Button>
            </form>
          )}
        </div>
      </section>

      {/* CTA Split */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-[#2C2C2C] rounded-xl p-8 md:p-12 md:flex md:items-center md:justify-between">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Empieza a organizar tu lectura
              </h2>
              <p className="text-gray-400">Agrega tus primeros libros y lleva un registro de todo lo que lees.</p>
            </div>
            <Button
              onClick={() => setShowModal(true)}
              className="bg-[#D97757] hover:bg-[#c56646] text-white px-6"
            >
              <Plus className="w-5 h-5 mr-2" />
              Agregar Libro
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="acerca" className="py-16 bg-white border-y border-[#e5e2de]">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-[#2C2C2C] mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Acerca de Libros Leídos
          </h2>
          <p className="text-[#7A756F] leading-relaxed">
            Esta es una aplicación personal para registrar los libros que lees. Guarda el título, autor y estado de cada libro,
            permitiéndote distinguir fácilmente entre lecturas pendientes y completadas. Una herramienta simple para lectores
            que quieren mantener un registro organizado de su colección.
          </p>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-[#2C2C2C] mb-8 text-center" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Cómo funciona
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-[#D97757] text-white flex items-center justify-center mx-auto mb-4 font-bold">1</div>
              <h3 className="font-semibold text-[#2C2C2C] mb-2">Agrega un libro</h3>
              <p className="text-sm text-[#7A756F]">Ingresa el título y autor del libro que estás leyendo o quieres leer.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-[#D97757] text-white flex items-center justify-center mx-auto mb-4 font-bold">2</div>
              <h3 className="font-semibold text-[#2C2C2C] mb-2">Marca tu progreso</h3>
              <p className="text-sm text-[#7A756F]">Actualiza el estado cuando termines de leer un libro.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-[#D97757] text-white flex items-center justify-center mx-auto mb-4 font-bold">3</div>
              <h3 className="font-semibold text-[#2C2C2C] mb-2">Organiza tu colección</h3>
              <p className="text-sm text-[#7A756F]">Visualiza fácilmente tus lecturas pendientes y completadas.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-[#e5e2de]">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#D97757]" />
              <span className="font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>Libros Leídos</span>
            </div>
            <div className="flex gap-6 text-sm text-[#7A756F]">
              <a href="#inicio" className="hover:text-[#2C2C2C] transition-colors">Inicio</a>
              <a href="#mis-libros" className="hover:text-[#2C2C2C] transition-colors">Mis Libros</a>
              <a href="#contacto" className="hover:text-[#2C2C2C] transition-colors">Contacto</a>
            </div>
            <p className="text-xs text-[#7A756F]">© 2026 Libros Leídos. Todos los derechos reservados.</p>
          </div>
        </div>
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
