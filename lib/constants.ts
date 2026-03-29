
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
export const isPinSupported = (board: string, pin: string, type: string) => {
    // Jika komponen butuh pin Analog, pastikan pinnya berawalan huruf 'A' (kecuali untuk ESP)
    if (type === 'analog' && !board.includes("ESP")) return pin.startsWith('A');
    
    // Jika komponen butuh pin PWM, pastikan masuk daftar pin bergelombang (~) untuk Arduino
    if (type === 'pwm') {
      if (board === "Arduino Uno R3" || board === "Arduino Nano") {
        return ["3", "5", "6", "9", "10", "11"].includes(pin);
      }
      if (board === "Arduino Mega 2560") {
        return ["2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "44", "45", "46"].includes(pin);
      }
      // ESP8266 dan ESP32 mendukung PWM di hampir semua pin digitalnya
      return true; 
    }
    
    // Pin Digital bisa dicolok di mana saja
    return true; 
};