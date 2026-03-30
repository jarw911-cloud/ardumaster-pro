// ==========================================
// 1. DAFTAR MIKROKONTROLER (PAPAN UTAMA)
// ==========================================
export const BOARD_PINS: Record<string, string[]> = {
  "Arduino Uno R3": ["2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "A0", "A1", "A2", "A3", "A4", "A5"],
  "Arduino Nano V3": ["2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "A0", "A1", "A2", "A3", "A4", "A5", "A6", "A7"],
  "Arduino Mega 2560": [
    "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", 
    "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52", "53",
    "A0", "A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10", "A11", "A12", "A13", "A14", "A15"
  ],
  "Arduino Pro Mini": ["2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "A0", "A1", "A2", "A3"],
  "Arduino Leonardo": ["2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "A0", "A1", "A2", "A3", "A4", "A5"],
  "NodeMCU ESP8266 (v2/v3)": ["D0", "D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8"],
  "Wemos D1 Mini (ESP8266)": ["D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8"],
  "ESP32 DEVKIT V1 (30 Pin)": ["2", "4", "5", "12", "13", "14", "15", "18", "19", "21", "22", "23", "25", "26", "27", "32", "33", "34", "35"],
  "ESP32 CAM": ["2", "4", "12", "13", "14", "15"],
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
  { name: "Ultrasonik (HC-SR04)", pinTypes: ["digital", "digital"], lib: "None" },
  { name: "Infrared (Line Follower)", pinTypes: ["digital"], lib: "None" },
  { name: "Suhu & Kelembaban (DHT11/DHT22)", pinTypes: ["digital"], lib: "DHT.h" },
  { name: "Kelembaban Tanah (Soil Moisture)", pinTypes: ["analog"], lib: "None" },
  { name: "Cahaya (LDR)", pinTypes: ["analog"], lib: "None" },
  { name: "Gas & Asap (MQ-2)", pinTypes: ["analog"], lib: "None" },
  { name: "Gerak (PIR)", pinTypes: ["digital"], lib: "None" },
  { name: "RFID Reader (RC522)", pinTypes: ["digital", "digital", "digital", "digital"], lib: "MFRC522.h" },
  { name: "Push Button / Limit Switch", pinTypes: ["digital"], lib: "None" }
];

// ==========================================
// 3. DAFTAR AKTUATOR (OUTPUT)
// ==========================================
export const ACTUATORS_DB = [
  { name: "Driver Motor (L298N)", pinTypes: ["digital", "digital", "pwm", "digital", "digital", "pwm"], lib: "None" },
  { name: "Driver Stepper (A4988)", pinTypes: ["digital", "digital"], lib: "None" },
  { name: "Motor Servo (SG90/MG996R)", pinTypes: ["pwm"], lib: "Servo.h" },
  { name: "Relay 5V (1 Channel)", pinTypes: ["digital"], lib: "None" },
  { name: "Pompa Air Mini 5V", pinTypes: ["digital"], lib: "None" },
  { name: "Kunci Solenoid 12V", pinTypes: ["digital"], lib: "None" },
  { name: "Lampu LED", pinTypes: ["digital"], lib: "None" },
  { name: "Buzzer Aktif", pinTypes: ["digital"], lib: "None" },
  { name: "Layar LCD 16x2 (I2C)", pinTypes: ["digital", "digital"], lib: "LiquidCrystal_I2C.h" }
];

// ==========================================
// 4. LOGIKA PENGECEKAN PIN
// ==========================================
export const isPinSupported = (board: string, pin: string, type: string) => {
    if (type === 'analog' && !board.includes("ESP") && !board.includes("Pico") && !board.includes("STM32")) {
        return pin.startsWith('A');
    }
    if (type === 'pwm') {
      if (board === "Arduino Uno R3" || board === "Arduino Nano V3" || board === "Arduino Pro Mini" || board === "Arduino Leonardo") {
        return ["3", "5", "6", "9", "10", "11"].includes(pin);
      }
      if (board === "Arduino Mega 2560") {
        return ["2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "44", "45", "46"].includes(pin);
      }
      return true; 
    }
    return true; 
};

// ==========================================
// 5. PANDUAN KABEL (WIRING MAP)
// ==========================================
export const WIRING_MAP: Record<string, string> = {
  "Ultrasonik (HC-SR04)": "VCC ke 5V, GND ke GND, Trig ke Pin Digital, Echo ke Pin Digital.",
  "Infrared (Line Follower)": "VCC ke 5V, GND ke GND, OUT ke Pin Digital.",
  "Suhu & Kelembaban (DHT11/DHT22)": "VCC ke 5V, GND ke GND, DATA ke Pin Digital.",
  "Kelembaban Tanah (Soil Moisture)": "VCC ke 5V (atau 3.3V), GND ke GND, A0 ke Pin Analog.",
  "Cahaya (LDR)": "Rangkai sebagai pembagi tegangan (voltage divider) dengan Resistor 10k ohm. Hubungkan titik tengah ke Pin Analog.",
  "Gas & Asap (MQ-2)": "VCC ke 5V, GND ke GND, A0 ke Pin Analog.",
  "Gerak (PIR)": "VCC ke 5V, GND ke GND, OUT ke Pin Digital.",
  "RFID Reader (RC522)": "Hati-hati, gunakan tegangan 3.3V! SDA, SCK, MOSI, MISO ke pin SPI mikrokontroler.",
  "Push Button / Limit Switch": "Gunakan Resistor Pull-up/Pull-down (10k ohm), atau aktifkan INPUT_PULLUP di kode. Hubungkan ke Pin Digital dan GND.",
  "Driver Motor (L298N)": "12V/5V IN ke Baterai, GND ke GND (gabung dengan GND Arduino), IN1-IN4 ke Pin Digital, ENA/ENB ke Pin PWM.",
  "Driver Stepper (A4988)": "VMOT ke sumber daya motor (misal 12V), VDD ke 5V Arduino, GND ke GND. STEP dan DIR ke Pin Digital.",
  "Motor Servo (SG90/MG996R)": "Kabel Merah ke 5V, Coklat/Hitam ke GND, Kuning/Oranye ke Pin PWM.",
  "Relay 5V (1 Channel)": "VCC ke 5V, GND ke GND, IN ke Pin Digital. Sisi terminal terhubung ke beban (misal pompa air).",
  "Pompa Air Mini 5V": "Jangan hubungkan langsung ke pin Arduino! Gunakan modul Relay atau Transistor sebagai saklar.",
  "Kunci Solenoid 12V": "Butuh power supply terpisah (12V) dan dikendalikan lewat Relay.",
  "Lampu LED": "Kaki panjang (Anoda) ke Pin Digital (lewat Resistor 220 ohm), Kaki pendek (Katoda) ke GND.",
  "Buzzer Aktif": "Kaki panjang (+) ke Pin Digital, Kaki pendek (-) ke GND.",
  "Layar LCD 16x2 (I2C)": "VCC ke 5V, GND ke GND, SDA ke pin SDA, SCL ke pin SCL."
};

// ==========================================
// 6. PERINGATAN PIN TABRAKAN (PIN WARNING)
// ==========================================
export const getPinWarning = (board: string, pin: string, type: string) => {
    if (type === 'analog' && !board.includes("ESP") && !board.includes("Pico") && !board.includes("STM32") && !pin.startsWith('A')) {
        return "Peringatan: Komponen ini butuh pin Analog (A0-A5).";
    }
    if (type === 'pwm') {
      if (board === "Arduino Uno R3" || board === "Arduino Nano V3" || board === "Arduino Pro Mini" || board === "Arduino Leonardo") {
         if(!["3", "5", "6", "9", "10", "11"].includes(pin)) return "Peringatan: Butuh pin PWM (~).";
      }
      if (board === "Arduino Mega 2560") {
         if(!["2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "44", "45", "46"].includes(pin)) return "Peringatan: Butuh pin PWM (~).";
      }
    }
    return null;
};
// ==========================================
// 7. TEMPLATE PROYEK (RESEP KODINGAN)
// ==========================================
export const PROJECT_TEMPLATES = [
  {
    id: "template_1",
    name: "🚗 Robot Line Follower",
    description: "Robot pengikut garis sederhana menggunakan 2 sensor infrared dan motor driver L298N.",
    board: "Arduino Uno R3",
    elements: [
      { id: 101, kind: "Sensor", type: "Infrared (Line Follower)", name: "ir_kiri", pin: "2" },
      { id: 102, kind: "Sensor", type: "Infrared (Line Follower)", name: "ir_kanan", pin: "3" },
      { id: 103, kind: "Actuator", type: "Driver Motor (L298N)", name: "motor_driver", pin: "4", pin2: "5", pin3: "6", pin4: "7", pin5: "8", pin6: "9" },
      { id: 104, kind: "Logic", name: "logic_maju", source: "val_ir_kiri", operator: "==", threshold: "0", target: "motor_driver", actionTrue: "MAJU", actionFalse: "STOP" }
      // Catatan: Logika asli line follower lebih kompleks, ini hanya contoh dasar
    ]
  },
  {
    id: "template_2",
    name: "🏠 Smart Home (Kipas Otomatis)",
    description: "Menyalakan kipas (lewat relay) secara otomatis jika suhu ruangan di atas 30 derajat.",
    board: "Arduino Uno R3",
    elements: [
      { id: 201, kind: "Sensor", type: "Suhu & Kelembaban (DHT11/DHT22)", name: "sensor_suhu", pin: "2" },
      { id: 202, kind: "Actuator", type: "Relay 5V (1 Channel)", name: "relay_kipas", pin: "8" },
      { id: 203, kind: "Logic", name: "logic_suhu", source: "val_sensor_suhu", operator: ">", threshold: "30", target: "relay_kipas", actionTrue: "HIGH", actionFalse: "LOW" },
      { id: 204, kind: "Utility", type: "Serial Print", name: "print_suhu", value: "Suhu Saat Ini", source: "val_sensor_suhu" },
      { id: 205, kind: "Utility", type: "Delay", name: "delay_loop", value: "2000" }
    ]
  },
  {
    id: "template_3",
    name: "🚨 Alarm Jarak (Parkir Mundur)",
    description: "Buzzer akan berbunyi jika ada benda mendekat kurang dari 20 cm.",
    board: "Arduino Uno R3",
    elements: [
      { id: 301, kind: "Sensor", type: "Ultrasonik (HC-SR04)", name: "sensor_jarak", pin: "2", pin2: "3" },
      { id: 302, kind: "Actuator", type: "Buzzer Aktif", name: "buzzer_alarm", pin: "8" },
      { id: 303, kind: "Logic", name: "logic_jarak", source: "val_sensor_jarak", operator: "<", threshold: "20", target: "buzzer_alarm", actionTrue: "HIGH", actionFalse: "LOW" },
      { id: 304, kind: "Utility", type: "Delay", name: "delay_baca", value: "500" }
    ]
  }
];