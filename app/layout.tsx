import './globals.css' // Jika ada file CSS
import type { Metadata } from 'next'
import './globals.css' // Pastikan import css-nya tetap ada

// --- INI KTP WEB KANG MAS ---
export const metadata: Metadata = {
  title: 'ArduMaster Pro - Generator Kode Arduino & IoT',
  description: 'Platform visual pembuat logika mikrokontroler (Arduino, ESP32, ESP8266) tanpa repot ngetik kode dari nol. Cocok untuk edukasi robotika dan proyek IoT.',
  keywords: ['Arduino', 'Generator Kode Arduino', 'Belajar IoT', 'Robotika', 'ESP32', 'NodeMCU', 'Logika IoT', 'The Micromice', 'Generate Code Arduino','Arduino Code Otomatis', 'Coding Mudah', 'Generator Gratis', 'Simulasi Arduino'],
  authors: [{ name: 'Kang Mas Tech' }],
  openGraph: {
    title: 'ArduMaster Pro - Merakit Logika IoT',
    description: 'Bikin program Arduino semudah menyusun puzzle.',
    url: 'https://ardumaster-pro-zuwl.vercel.app/', // Ganti dengan link Vercel Kang Mas
    siteName: 'ArduMaster Pro',
    locale: 'id_ID',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className="bg-[#020617] text-slate-400">{children}</body>
    </html>
  )
}