
// ==========================================
// 1. DAFTAR MIKROKONTROLER (PAPAN UTAMA)
// ==========================================
export const BOARD_PINS: Record<string, string[]> = {
  // --- KELUARGA ARDUINO (AVR Classic) ---
  "Arduino Uno R3": ["2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "A0", "A1", "A2", "A3", "A4", "A5"],
  "Arduino Nano V3": ["2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "A0", "A1", "A2", "A3", "A4", "A5", "A6", "A7"],
  "Arduino Mega 2560": [
    "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", 
    "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52", "53",
    "A0", "A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10", "A11", "A12", "A13", "A14", "A15"
  ],
  "Arduino Pro Mini": ["2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "A0", "A1", "A2", "A3"],
  "Arduino Leonardo": ["2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "A0", "A1", "A2", "A3", "A4", "A5"],

  // --- KELUARGA ESP (Internet of Things) ---
  "NodeMCU ESP8266 (v2/v3)": ["D0", "D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8"],
  "Wemos D1 Mini (ESP8266)": ["D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8"],
  "ESP32 DEVKIT V1 (30 Pin)": ["2", "4", "5", "12", "13", "14", "15", "18", "19", "21", "22", "23", "25", "26", "27", "32", "33", "34", "35"],
  "ESP32 CAM": ["2", "4", "12", "13", "14", "15"], // Pin yang aman dipakai saat kamera aktif

  // --- KELUARGA MODERN (ARM / Lainnya) ---
  "Raspberry Pi Pico (RP2040)": [
    "GP0", "GP1", "GP2", "GP3", "GP4", "GP5", "GP6", "GP7", "GP8", "GP9", "GP10", "GP11", "GP12", "GP13", "GP14", "GP15", 
    "GP16", "GP17", "GP18", "GP19", "GP20", "GP21", "GP22", "GP26", "GP27", "GP28"
  ],
  "STM32 Blue Pill": ["PA0", "PA1", "PA2", "PA3", "PA4", "PA5", "PA6", "PA7", "PB0", "PB1", "PB10", "PB11", "PC13"]
};

// ==========================================
// 2. DAFTAR SENSOR (INPUT)
// ==========================================
export const SENSORS_DB = [
  // --- Sensor Robotika Dasar ---
  {
    name: "Ultrasonik (HC-SR04)",
    pinTypes: ["digital", "digital"], // Butuh 2 pin: Trig & Echo
    lib: "None"
  },
  {
    name: "Infrared (Line Follower)",
    pinTypes: ["digital"],
    lib: "None"
  },
  // --- Sensor Lingkungan & Pertanian ---
  {
    name: "Suhu & Kelembaban (DHT11/DHT22)",
    pinTypes: ["digital"],
    lib: "DHT.h"
  },
  {
    name: "Kelembaban Tanah (Soil Moisture)",
    pinTypes: ["analog"],
    lib: "None"
  },
  {
    name: "Cahaya (LDR)",
    pinTypes: ["analog"],
    lib: "None"
  },
  {
    name: "Gas & Asap (MQ-2)",
    pinTypes: ["analog"],
    lib: "None"
  },
  // --- Sensor Keamanan ---
  {
    name: "Gerak (PIR)",
    pinTypes: ["digital"],
    lib: "None"
  },
  {
    name: "RFID Reader (RC522)",
    pinTypes: ["digital", "digital", "digital", "digital"], // SDA, SCK, MOSI, MISO (Contoh penyederhanaan pin SPI)
    lib: "MFRC522.h"
  },
  // --- Sensor Mekanik ---
  {
    name: "Push Button / Limit Switch",
    pinTypes: ["digital"],
    lib: "None"
  }
];

// ==========================================
// 3. DAFTAR AKTUATOR (OUTPUT)
// ==========================================
export const ACTUATORS_DB = [
  // --- Penggerak / Motor ---
  {
    name: "Driver Motor (L298N)",
    pinTypes: ["digital", "digital", "pwm", "digital", "digital", "pwm"], // IN1, IN2, ENA, IN3, IN4, ENB
    lib: "None"
  },
  {
    name: "Driver Stepper (A4988)",
    pinTypes: ["digital", "digital"], // STEP & DIR
    lib: "None"
  },
  {
    name: "Motor Servo (SG90/MG996R)",
    pinTypes: ["pwm"],
    lib: "Servo.h"
  },
  // --- Saklar Listrik / Irigasi ---
  {
    name: "Relay 5V (1 Channel)",
    pinTypes: ["digital"],
    lib: "None"
  },
  {
    name: "Pompa Air Mini 5V",
    pinTypes: ["digital"], // Biasanya dikendalikan lewat Relay atau Transistor
    lib: "None"
  },
  {
    name: "Kunci Solenoid 12V",
    pinTypes: ["digital"], // Sama, butuh Relay
    lib: "None"
  },
  // --- Indikator Visual & Suara ---
  {
    name: "Lampu LED",
    pinTypes: ["digital"],
    lib: "None"
  },
  {
    name: "Buzzer Aktif",
    pinTypes: ["digital"],
    lib: "None"
  },
  {
    name: "Layar LCD 16x2 (I2C)",
    pinTypes: ["digital", "digital"], // SDA & SCL
    lib: "LiquidCrystal_I2C.h"
  }
];

// ==========================================
// 4. LOGIKA PENGECEKAN PIN
// ==========================================
// ==========================================
// 5. PANDUAN KABEL (WIRING MAP)
// ==========================================
export const WIRING_MAP: Record<string, string> = {
  // Sensor Dasar
  "Ultrasonik (HC-SR04)": "VCC ke 5V, GND ke GND, Trig ke Pin Digital, Echo ke Pin Digital.",
  "Infrared (Line Follower)": "VCC ke 5V, GND ke GND, OUT ke Pin Digital.",
  "Suhu & Kelembaban (DHT11/DHT22)": "VCC ke 5V, GND ke GND, DATA ke Pin Digital.",
  "Kelembaban Tanah (Soil Moisture)": "VCC ke 5V (atau 3.3V), GND ke GND, A0 ke Pin Analog.",
  "Cahaya (LDR)": "Rangkai sebagai pembagi tegangan (voltage divider) dengan Resistor 10k ohm. Hubungkan titik tengah ke Pin Analog.",
  "Gas & Asap (MQ-2)": "VCC ke 5V, GND ke GND, A0 ke Pin Analog.",
  
  // Keamanan
  "Gerak (PIR)": "VCC ke 5V, GND ke GND, OUT ke Pin Digital.",
  "RFID Reader (RC522)": "Hati-hati, gunakan tegangan 3.3V! SDA, SCK, MOSI, MISO ke pin SPI mikrokontroler.",
  "Push Button / Limit Switch": "Gunakan Resistor Pull-up/Pull-down (10k ohm), atau aktifkan INPUT_PULLUP di kode. Hubungkan ke Pin Digital dan GND.",
  
  // Aktuator
  "Driver Motor (L298N)": "12V/5V IN ke Baterai, GND ke GND (gabung dengan GND Arduino), IN1-IN4 ke Pin Digital, ENA/ENB ke Pin PWM.",
  "Driver Stepper (A4988)": "VMOT ke sumber daya motor (misal 12V), VDD ke 5V Arduino, GND ke GND. STEP dan DIR ke Pin Digital.",
  "Motor Servo (SG90/MG996R)": "Kabel Merah ke 5V, Coklat/Hitam ke GND, Kuning/Oranye ke Pin PWM.",
  "Relay 5V (1 Channel)": "VCC ke 5V, GND ke GND, IN ke Pin Digital. Sisi terminal terhubung ke beban (misal pompa air).",
  "Pompa Air Mini 5V": "Jangan hubungkan langsung ke pin Arduino! Gunakan modul Relay atau Transistor sebagai saklar.",
  "Kunci Solenoid 12V": "Butuh power supply terpisah (12V) dan dikendalikan lewat Relay.",
  "Lampu LED": "Kaki panjang (Anoda) ke Pin Digital (lewat Resistor 220 ohm), Kaki pendek (Katoda) ke GND.",
  "Buzzer Aktif": "Kaki panjang (+) ke Pin Digital, Kaki pendek (-) ke GND.",
  "Layar LCD 16x2 (I2C)": "VCC ke 5V, GND ke GND, SDA ke pin SDA (A4 pada Uno), SCL ke pin SCL (A5 pada Uno)."
};