import './globals.css' // Jika ada file CSS
import type { Metadata } from 'next'
import './globals.css' // Pastikan import css-nya tetap ada

// --- INI KTP WEB KANG MAS ---
export const metadata: Metadata = {
  title: 'ArduMaster Pro - Generator Kode Arduino & IoT',
  description: 'Platform visual pembuat logika mikrokontroler (Arduino, ESP32, ESP8266) tanpa repot ngetik kode dari nol. Cocok untuk edukasi robotika dan proyek IoT.',
  keywords: [
    // --- 1. Kata Kunci Utama & Bawaan ---
    'Arduino', 'Generator Kode Arduino', 'Belajar IoT', 'Robotika', 'ESP32', 'NodeMCU', 'Logika IoT', 'The Micromice', 'Generate Code Arduino', 'Arduino Code Otomatis', 'Coding Mudah', 'Generator Gratis', 'Simulasi Arduino', 'ArduMaster Pro',
    
    // --- 2. Gaya Pemrograman & Alat (Tools) ---
    'No-Code IoT', 'Low-Code Microcontroller', 'Visual Programming Arduino', 'Arduino Block Coding', 'Web Based Arduino IDE', 'Pembuat Program Arduino', 'Aplikasi Koding Arduino', 'Drag and Drop Coding', 'Sketch Arduino Otomatis', 'Software Pembuat Kode C++', 'IoT Dashboard', 'Arduino Web Editor', 'Bikin Koding Tanpa Ngetik',
    
    // --- 3. Komponen Spesifik (Sensor & Aktuator) ---
    'Sensor Ultrasonik HC-SR04', 'Sensor Suhu DHT11', 'Sensor Kelembaban DHT22', 'Sensor Gerak PIR', 'Sensor Cahaya LDR', 'Sensor Kelembaban Tanah', 'Soil Moisture Sensor', 'Sensor Garis TCRT5000', 'Modul Relay 5V', 'Motor Servo SG90', 'Motor Servo MG996R', 'Driver Motor DC L298N', 'LCD 16x2 I2C', 'Modul Waktu RTC DS3231', 'Sensor Kartu RFID RC522', 'Buzzer Arduino', 'Pompa Air Mini 5V',
    
    // --- 4. Ide Proyek & Kompetisi ---
    'Robot Labirin', 'Mobile Robot', 'Robot Line Follower', 'Wall Follower', 'Micromouse Robot', 'Otomatisasi Pertanian', 'Smart Agriculture', 'Sistem IoT Tambak Ikan', 'Smart Home IoT', 'Penyiram Tanaman Otomatis', 'Tempat Sampah Pintar', 'Jemuran Otomatis', 'Sistem Keamanan Rumah IoT', 'Monitoring Suhu Jarak Jauh', 'Tugas Akhir Mikrokontroler', 'Skripsi IoT', 'Proyek Arduino Sederhana', 'Madrasah Robotic Competition', 'Lomba Robotik',
    
    // --- 5. Edukasi & Target Audiens (Indonesia) ---
    'Tutorial Arduino Bahasa Indonesia', 'Cara Mudah Belajar Arduino', 'Belajar Koding Pemula', 'Modul Arduino SMK', 'Prakarya Rekayasa', 'Ekstrakurikuler Robotik', 'Komunitas Maker Indonesia', 'Koding IoT Anak', 'Pendidikan STEM Indonesia', 'Belajar Elektronika Dasar', 'Guru Robotika', 'Panduan Lengkap Arduino'
  ],
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