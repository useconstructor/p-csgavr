'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Plus, X, Menu, BookOpen, Send, CheckCircle } from 'lucide-react'

interface BookType {
  id: number
  title: string
  author: string
  status: 'Pendiente' | 'Leído'
  completedDate?: string
  coverColor?: string
}

const recentBooks = [
  { id: 1, title: 'Cien años de soledad', author: 'Gabriel García Márquez', completedDate: '15 Sep 2026', coverColor: '#E8D5B7' },
  { id: 2, title: 'El amor en los tiempos del cólera', author: 'Gabriel García Márquez', completedDate: '28 Ago 2026', coverColor: '#E5D4B3' },
  { id: 3, title: '1984', author: 'George Orwell', completedDate: '10 Ago 2026', coverColor: '#DED0B8' },
  { id: 4, title: 'Rayuela', author: 'Julio Cortázar', completedDate: '22 Jul 2026', coverColor: '#E8D5B7' },
  { id: 5, title: 'La sombra del viento', author: 'Carlos Ruiz Zafón', completedDate: '05 Jul 2026', coverColor: '#E5D4B3' },
  { id: 6, title: 'Don Quijote de la Mancha', author: 'Miguel de Cervantes', completedDate: '18 Jun 2026', coverColor: '#DED0B8' },
  { id: 7, title: 'El principito', author: 'Antoine de Saint-Exupéry', completedDate: '02 Jun 2026', coverColor: '#E8D5B7' },
  { id: 8, title: 'Pedro Páramo', author: 'Juan Rulfo', completedDate: '15 May 2026', coverColor: '#E5D4B3' },
]

export default function HomePage() {
  const [books, setBooks] = useState<BookType[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [newBook, setNewBook] = useState({ title: '', author: '', status: 'Pendiente' })
  const [saving, setSaving] = useState(false)
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

  const navLinks = [
    { label: 'Mis Libros', href: '#lecturas' },
    { label: 'Estadísticas', href: '#estadisticas' },
    { label: 'Listas', href: '#listas' },
    { label: 'Sobre mí', href: '#sobre-mi' },
  ]

  return (
    <div className="min-h-screen">
      {/* Sticky Nav */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#e5e2de]">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
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
            <Button
              onClick={() => setShowModal(true)}
              className="bg-[#D97757] hover:bg-[#c56646] text-white text-sm px-4 py-2 h-auto"
            >
              <Plus className="w-4 h-4 mr-1" />
              Nuevo Libro
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-[#F9F7F4] rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Nav Panel */}
        <div className={`md:hidden overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${mobileMenuOpen ? 'opacity-100 translate-y-0 pointer-events-auto max-h-80' : 'opacity-0 -translate-y-4 pointer-events-none max-h-0'}`}>
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
            <Button
              onClick={() => { setShowModal(true); setMobileMenuOpen(false) }}
              className="w-full mt-2 bg-[#D97757] hover:bg-[#c56646] text-white"
            >
              <Plus className="w-4 h-4 mr-1" />
              Nuevo Libro
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="inicio" className="py-20 md:py-28 bg-[#F5F0E8]">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-[#2C2C2C] mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Tu historia de lectura
          </h1>
          <p className="text-[#7A756F] text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Registra cada libro, recuerda cada historia. Tu biblioteca personal te espera.
          </p>
          <Button
            onClick={() => setShowModal(true)}
            className="bg-[#D97757] text-white hover:bg-[#c56646] px-8 py-4 h-auto text-lg font-semibold"
          >
            <Plus className="w-5 h-5 mr-2" />
            Comenzar ahora
          </Button>
        </div>
      </section>

      {/* Lecturas recientes - Book Grid */}
      <section id="lecturas" className="py-16 bg-[#F9F7F4]">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-[#2C2C2C] mb-8" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Lecturas recientes
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {recentBooks.map(book => (
              <Card key={book.id} className="bg-white border-[#e5e2de] hover:shadow-lg transition-shadow overflow-hidden">
                <CardContent className="p-0">
                  {/* Book Cover */}
                  <div
                    className="h-40 md:h-48 flex items-center justify-center"
                    style={{ backgroundColor: book.coverColor }}
                  >
                    <BookOpen className="w-12 h-12 text-white/60" />
                  </div>
                  {/* Book Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-[#2C2C2C] text-sm md:text-base line-clamp-2 mb-1">
                      {book.title}
                    </h3>
                    <p className="text-xs md:text-sm text-[#7A756F] mb-2 truncate">
                      {book.author}
                    </p>
                    <p className="text-xs text-[#D97757]">
                      Completado: {book.completedDate}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contacto" className="py-16 bg-white border-y border-[#e5e2de]">
        <div className="max-w-xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-[#2C2C2C] mb-2 text-center" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Hablemos
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      {/* CTA Banner */}
      <section className="py-16 bg-[#D97757]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Haz de la lectura un hábito para siempre
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Comienza a registrar tus lecturas hoy y descubre patrones en tus hábitos de lectura.
          </p>
          <Button
            onClick={() => setShowModal(true)}
            className="bg-white text-[#D97757] hover:bg-white/90 px-8 py-4 h-auto text-lg font-semibold"
          >
            <Plus className="w-5 h-5 mr-2" />
            Empezar ahora
          </Button>
        </div>
      </section>

      {/* Multi-column Footer */}
      <footer className="py-12 bg-[#2C2C2C]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-6 h-6 text-[#D97757]" />
                <span className="font-semibold text-lg text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>Libros Leídos</span>
              </div>
              <p className="text-gray-400 text-sm">
                Tu biblioteca personal para registrar y organizar todas tus lecturas.
              </p>
            </div>

            {/* Navegación */}
            <div>
              <h3 className="font-semibold text-white mb-4">Navegación</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#inicio" className="text-gray-400 hover:text-white transition-colors">Inicio</a></li>
                <li><a href="#lecturas" className="text-gray-400 hover:text-white transition-colors">Lecturas recientes</a></li>
                <li><a href="#biblioteca" className="text-gray-400 hover:text-white transition-colors">Mi Biblioteca</a></li>
                <li><a href="#estadisticas" className="text-gray-400 hover:text-white transition-colors">Estadísticas</a></li>
              </ul>
            </div>

            {/* Cuenta */}
            <div>
              <h3 className="font-semibold text-white mb-4">Cuenta</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#perfil" className="text-gray-400 hover:text-white transition-colors">Mi Perfil</a></li>
                <li><a href="#configuracion" className="text-gray-400 hover:text-white transition-colors">Configuración</a></li>
                <li><a href="#privacidad" className="text-gray-400 hover:text-white transition-colors">Privacidad</a></li>
                <li><a href="#ayuda" className="text-gray-400 hover:text-white transition-colors">Ayuda</a></li>
              </ul>
            </div>

            {/* Contacto */}
            <div>
              <h3 className="font-semibold text-white mb-4">Contacto</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#contacto" className="text-gray-400 hover:text-white transition-colors">Formulario de contacto</a></li>
                <li><span className="text-gray-400">hola@librosleidos.com</span></li>
                <li><a href="#soporte" className="text-gray-400 hover:text-white transition-colors">Soporte técnico</a></li>
                <li><a href="#sugerencias" className="text-gray-400 hover:text-white transition-colors">Sugerencias</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-gray-700 pt-8">
            <p className="text-center text-gray-500 text-sm">
              © 2026 Libros Leídos. Todos los derechos reservados.
            </p>
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
