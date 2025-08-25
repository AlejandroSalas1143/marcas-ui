'use client';

import "./globals.css";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Cerrar sidebar en mobile cuando cambie la ruta
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <html lang="es">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
          <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
            {/* Logo - Opción con imagen */}
            <Link href="/" className="flex items-center gap-3">
              {/* Opción A: Solo imagen */}
              <div className="relative h-10 w-auto">
                <Image
                  src="/image/logo.webp"
                  alt="SIGNA - Registro de Marcas"
                  width={120}
                  height={40}
                  className="h-10 w-auto object-contain"
                  priority
                />
              </div>
            </Link>

            {/* Navigation - Desktop */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition">
                Soluciones
              </Link>
              <Link href="/" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition">
                Precios
              </Link>
              <Link href="/" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition">
                Clientes
              </Link>
              <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-rose-500 to-pink-600 text-white text-sm font-semibold shadow-lg hover:shadow-xl hover:from-rose-600 hover:to-pink-700 transition-all">
                <span>Solicitar Demo</span>
              </button>
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </header>

        {/* Layout Container */}
        <div className="flex min-h-[calc(100vh-4rem)] relative">
          {/* Overlay para mobile */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Sidebar - Fija con ancho fijo */}
          <aside
            className={`
    fixed inset-y-0 left-0 top-16
    w-full md:w-64   /* 👈 full en mobile, 64 en desktop */
    bg-white border-r border-gray-200 shadow-sm z-50
    transform transition-transform duration-300 ease-in-out
    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
    md:translate-x-0
    flex flex-col
    h-[calc(100vh-4rem)]
  `}
          >
            {/* User Section */}
            <div className="p-6 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white font-semibold text-sm">
                  JD
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">John Doe</p>
                  <p className="text-xs text-gray-500 truncate">john@company.com</p>
                </div>
                {/* Botón para cerrar en mobile */}
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 rounded-md hover:bg-gray-100 md:hidden"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Navigation - Con scroll independiente */}
            <nav className="flex-1 overflow-y-auto p-4">
              {/* Dashboard */}
              <div className="mb-6">
                <Link
                  href="/"
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-200 group
                    ${isActive('/')
                      ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-rose-50 hover:text-rose-700'
                    }
                  `}
                >
                  <svg className={`w-5 h-5 transition-colors ${isActive('/') ? 'text-white' : 'text-gray-500 group-hover:text-rose-500'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v4H8V5z" />
                  </svg>
                  <span>Dashboard</span>
                  {isActive('/') && (
                    <div className="ml-auto">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </Link>
              </div>

              {/* Services Section */}
              <div>
                <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Servicios
                </div>
                <div className="space-y-1">
                  <Link
                    href="/registro-marca"
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-200 group
                      ${isActive('/registro-marca')
                        ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }
                    `}
                  >
                    <svg className={`w-5 h-5 transition-colors ${isActive('/registro-marca') ? 'text-white' : 'text-gray-500 group-hover:text-gray-600'
                      }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Registro de Marca</span>
                    {isActive('/registro-marca') && (
                      <div className="ml-auto">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </Link>
                </div>
              </div>
            </nav>

            {/* Footer - Fijo en la parte inferior */}
            <div className="p-4 border-t border-gray-200 flex-shrink-0">
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm font-medium text-gray-700">Configuración</span>
              </div>
            </div>
          </aside>

          {/* Main Content - Con padding left para compensar sidebar en desktop */}
          <main className="flex-1 md:ml-64 overflow-auto bg-gray-50">
            {/* Page Content */}
            <div className="max-w-7xl mx-auto p-6">
              {children}
            </div>
          </main>
        </div>

        <style jsx global>{`
          /* Scrollbar personalizado para la sidebar */
          .sidebar-nav::-webkit-scrollbar {
            width: 4px;
          }
          .sidebar-nav::-webkit-scrollbar-track {
            background: transparent;
          }
          .sidebar-nav::-webkit-scrollbar-thumb {
            background: #d1d5db;
            border-radius: 2px;
          }
          .sidebar-nav::-webkit-scrollbar-thumb:hover {
            background: #9ca3af;
          }
        `}</style>
      </body>
    </html>
  );
}