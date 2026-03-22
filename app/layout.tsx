import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Toaster } from "sonner"
import './globals.css'

const _inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const _jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" })

export const metadata: Metadata = {
  title: 'AgroLink - API Empresarial para la Cadena Agroalimentaria',
  description: 'Plataforma B2B que conecta huertas con restaurantes, supermercados y distribuidores. API REST profesional para gestion de productos agricolas, pedidos y empresas.',
  keywords: ['agrolink', 'API', 'agricultura', 'B2B', 'productos agricolas', 'web service'],
}

export const viewport: Viewport = {
  themeColor: '#166534',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${_inter.variable} ${_jetbrains.variable} font-sans antialiased`}>
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
