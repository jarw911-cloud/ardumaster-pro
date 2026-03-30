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
  // --- KATEGORI: TRAFFIC LIGHT SYSTEM ---
  {
    id: "tl_1",
    name: "🚦 Pertigaan: Standar 3 Arah",
    description: "Sistem lampu lalu lintas untuk pertigaan. Mengatur giliran jalan dari sisi A, B, lalu C secara berurutan.",
    board: "Arduino Uno R3",
    elements: [
      { id: 101, kind: "Actuator", type: "Traffic Light Side A", name: "jalur_a", pin: "2" },
      { id: 102, kind: "Utility", type: "Delay", name: "durasi_a", value: "5000" },
      { id: 103, kind: "Actuator", type: "Traffic Light Side B", name: "jalur_b", pin: "3" },
      { id: 104, kind: "Utility", type: "Delay", name: "durasi_b", value: "5000" },
      { id: 105, kind: "Actuator", type: "Traffic Light Side C", name: "jalur_c", pin: "4" },
      { id: 106, kind: "Utility", type: "Delay", name: "durasi_c", value: "5000" }
    ]
  },
  {
    id: "tl_2",
    name: "🚥 Perempatan: Jalur Padat",
    description: "Siklus 4 arah untuk perempatan besar. Menggunakan delay presisi agar tidak terjadi tabrakan logika.",
    board: "Arduino Uno R3",
    elements: [
      { id: 107, kind: "Actuator", type: "Green LED Side 1", name: "utara", pin: "2" },
      { id: 108, kind: "Utility", type: "Delay", name: "jeda_utara", value: "4000" },
      { id: 109, kind: "Actuator", type: "Green LED Side 2", name: "selatan", pin: "3" },
      { id: 110, kind: "Utility", type: "Delay", name: "jeda_selatan", value: "4000" },
      { id: 111, kind: "Actuator", type: "Green LED Side 3", name: "timur", pin: "4" },
      { id: 112, kind: "Utility", type: "Delay", name: "jeda_timur", value: "4000" },
      { id: 113, kind: "Actuator", type: "Green LED Side 4", name: "barat", pin: "5" },
      { id: 114, kind: "Utility", type: "Delay", name: "jeda_barat", value: "4000" }
    ]
  },
  {
    id: "tl_5",
    name: "🔘 Pelican Crossing (Tombol Tekan)",
    description: "Lampu merah kendaraan HANYA akan aktif jika penyeberang menekan tombol.",
    board: "Arduino Uno R3",
    elements: [
      { id: 115, kind: "Sensor", type: "Tombol (Push Button)", name: "tombol_seberang", pin: "4" },
      { id: 116, kind: "Actuator", type: "Lampu Merah Mobil", name: "stop_mobil", pin: "5" },
      { id: 117, kind: "Actuator", type: "Lampu Hijau Orang", name: "jalan_orang", pin: "6" },
      { id: 118, kind: "Logic", name: "cek_tombol", source: "val_tombol_seberang", operator: "==", threshold: "1", target: "stop_mobil", actionTrue: "HIGH", actionFalse: "LOW" },
      { id: 119, kind: "Utility", type: "Delay", name: "durasi_nyebrang", value: "5000" }
    ]
  },

  // --- KATEGORI: SMART HOME & CITY ---
  {
    id: "home_1",
    name: "🏠 Smart Home: Lampu Otomatis",
    description: "Lampu akan menyala otomatis saat ruangan gelap menggunakan sensor LDR.",
    board: "Arduino Uno R3",
    elements: [
      { id: 201, kind: "Sensor", type: "Cahaya (LDR)", name: "sensor_cahaya", pin: "A0" },
      { id: 202, kind: "Actuator", type: "Relay 5V (1 Channel)", name: "lampu_teras", pin: "8" },
      { id: 203, kind: "Logic", name: "logika_lampu", source: "val_sensor_cahaya", operator: ">", threshold: "700", target: "lampu_teras", actionTrue: "HIGH", actionFalse: "LOW" }
    ]
  },
  {
    id: "home_2",
    name: "🚗 Smart Garage: Pintu Otomatis",
    description: "Pintu garasi terbuka saat mobil terdeteksi di depan pintu menggunakan sensor Infrared.",
    board: "Arduino Uno R3",
    elements: [
      { id: 204, kind: "Sensor", type: "Infrared (Obstacle Avoidance)", name: "deteksi_mobil", pin: "4" },
      { id: 205, kind: "Actuator", type: "Motor Servo (SG90/MG996R)", name: "pintu_garasi", pin: "10" },
      { id: 206, kind: "Logic", name: "logika_pintu", source: "val_deteksi_mobil", operator: "==", threshold: "0", target: "pintu_garasi", actionTrue: "90", actionFalse: "0" }
    ]
  },
  {
    id: "home_3",
    name: "🅿️ Smart Parking: Deteksi Slot",
    description: "Palang pintu terbuka otomatis (Servo) jika ada kendaraan masuk.",
    board: "Arduino Uno R3",
    elements: [
      { id: 207, kind: "Sensor", type: "Infrared (Obstacle Avoidance)", name: "sensor_masuk", pin: "2" },
      { id: 208, kind: "Actuator", type: "Motor Servo (SG90/MG996R)", name: "palang_pintu", pin: "9" },
      { id: 209, kind: "Logic", name: "buka_palang", source: "val_sensor_masuk", operator: "==", threshold: "0", target: "palang_pintu", actionTrue: "90", actionFalse: "0" }
    ]
  },

  // --- KATEGORI: AGRICULTURE & FARMING ---
  {
    id: "farm_1",
    name: "🌱 Smart Farming: Penyiram Otomatis",
    description: "Pompa air aktif jika tanah kering untuk menjaga kelembaban tanaman.",
    board: "Arduino Uno R3",
    elements: [
      { id: 301, kind: "Sensor", type: "Kelembaban Tanah (Soil Moisture)", name: "sensor_tanah", pin: "A1" },
      { id: 302, kind: "Actuator", type: "Relay 5V (1 Channel)", name: "pompa", pin: "9" },
      { id: 303, kind: "Logic", name: "logika_siram", source: "val_sensor_tanah", operator: ">", threshold: "800", target: "pompa", actionTrue: "HIGH", actionFalse: "LOW" }
    ]
  },
  {
    id: "farm_2",
    name: "☀️ Solar Tracker: Panel Surya Pintar",
    description: "Panel surya bergerak mengikuti arah datangnya cahaya matahari.",
    board: "Arduino Uno R3",
    elements: [
      { id: 304, kind: "Sensor", type: "Cahaya (LDR)", name: "ldr_kiri", pin: "A1" },
      { id: 305, kind: "Sensor", type: "Cahaya (LDR)", name: "ldr_kanan", pin: "A2" },
      { id: 306, kind: "Actuator", type: "Motor Servo (SG90/MG996R)", name: "servo_solar", pin: "9" },
      { id: 307, kind: "Logic", name: "ke_kiri", source: "val_ldr_kiri", operator: "<", threshold: "val_ldr_kanan", target: "servo_solar", actionTrue: "180", actionFalse: "0" }
    ]
  },

  // --- KATEGORI: SECURITY & SAFETY ---
  {
    id: "sec_1",
    name: "👤 Anti Maling: Detektor PIR",
    description: "Membunyikan sirine jika sensor PIR mendeteksi gerakan manusia.",
    board: "Arduino Uno R3",
    elements: [
      { id: 401, kind: "Sensor", type: "Gerak (PIR)", name: "sensor_gerak", pin: "12" },
      { id: 402, kind: "Actuator", type: "Buzzer Aktif", name: "sirine", pin: "13" },
      { id: 403, kind: "Logic", name: "logika_maling", source: "val_sensor_gerak", operator: "==", threshold: "1", target: "sirine", actionTrue: "HIGH", actionFalse: "LOW" }
    ]
  },
  {
    id: "sec_2",
    name: "🔥 Fire Alarm: Deteksi Api",
    description: "Sistem peringatan dini yang aktif saat sensor api mendeteksi gelombang panas api.",
    board: "Arduino Uno R3",
    elements: [
      { id: 404, kind: "Sensor", type: "Api (Flame Sensor)", name: "sensor_api", pin: "A5" },
      { id: 405, kind: "Actuator", type: "LED Merah", name: "led_bahaya", pin: "5" },
      { id: 406, kind: "Logic", name: "logika_api", source: "val_sensor_api", operator: "<", threshold: "200", target: "led_bahaya", actionTrue: "HIGH", actionFalse: "LOW" }
    ]
  },

  // --- KATEGORI: HEALTH & AUTOMATION ---
  {
    id: "auto_1",
    name: "🧴 Smart Sanitizer: Sanitizer Otomatis",
    description: "Mengeluarkan cairan pembersih tangan tanpa sentuh menggunakan servo.",
    board: "Arduino Uno R3",
    elements: [
      { id: 501, kind: "Sensor", type: "Infrared (Obstacle Avoidance)", name: "deteksi_tangan", pin: "3" },
      { id: 502, kind: "Actuator", type: "Motor Servo (SG90/MG996R)", name: "tuas_botol", pin: "9" },
      { id: 503, kind: "Logic", name: "tekan_tuas", source: "val_deteksi_tangan", operator: "==", threshold: "0", target: "tuas_botol", actionTrue: "45", actionFalse: "0" }
    ]
  },
  {
    id: "auto_2",
    name: "🌊 Water Control: Pengisi Tandon",
    description: "Mematikan pompa air secara otomatis jika tandon air sudah penuh.",
    board: "Arduino Uno R3",
    elements: [
      { id: 504, kind: "Sensor", type: "Level Air (Water Level Sensor)", name: "sensor_air", pin: "A3" },
      { id: 505, kind: "Actuator", type: "Relay 5V (1 Channel)", name: "pompa_tandon", pin: "7" },
      { id: 506, kind: "Logic", name: "cek_penuh", source: "val_sensor_air", operator: ">", threshold: "500", target: "pompa_tandon", actionTrue: "LOW", actionFalse: "HIGH" }
    ]
  },

  // --- KATEGORI: INDUSTRIAL & SCIENCE ---
  {
    id: "sci_1",
    name: "📦 Logistik: Penghitung Barang",
    description: "Menghitung jumlah barang yang lewat di conveyor menggunakan sensor Infrared.",
    board: "Arduino Uno R3",
    elements: [
      { id: 601, kind: "Variable", name: "total_barang", varType: "int", value: "0" },
      { id: 602, kind: "Sensor", type: "Infrared (Obstacle Avoidance)", name: "sensor_conveyor", pin: "6" },
      { id: 603, kind: "Logic", name: "hitung", source: "val_sensor_conveyor", operator: "==", threshold: "0", target: "total_barang", actionTrue: "1", actionFalse: "0" },
      { id: 604, kind: "Utility", type: "Serial Print", name: "print_total", value: "Barang Terdeteksi", source: "total_barang" }
    ]
  },
  {
    id: "sci_2",
    name: "📏 Height Meter: Ukur Tinggi",
    description: "Mengukur jarak dari plafon ke kepala untuk mengetahui tinggi badan.",
    board: "Arduino Uno R3",
    elements: [
      { id: 605, kind: "Sensor", type: "Ultrasonik (HC-SR04)", name: "jarak_kepala", pin: "5", pin2: "6" },
      { id: 606, kind: "Utility", type: "Serial Print", name: "print_tinggi", value: "Tinggi Badan", source: "val_jarak_kepala" }
    ]
  },

  // --- KATEGORI: AQUARIUM & PETS ---
  {
    id: "pet_1",
    name: "🐟 Auto Feeder: Makan Ikan",
    description: "Beri makan ikan otomatis setiap jeda waktu tertentu menggunakan servo.",
    board: "Arduino Uno R3",
    elements: [
      { id: 701, kind: "Actuator", type: "Motor Servo (SG90/MG996R)", name: "servo_pakan", pin: "9" },
      { id: 702, kind: "Utility", type: "Delay", name: "jeda_makan", value: "10000" },
      { id: 703, kind: "Logic", name: "buka_katup", source: "0", operator: "==", threshold: "0", target: "servo_pakan", actionTrue: "90", actionFalse: "0" }
    ]
  },
  {
    id: "pet_2",
    name: "🐕 Smart Door: Pintu Hewan RFID",
    description: "Pintu hanya terbuka jika hewan peliharaan memakai kalung RFID yang benar.",
    board: "Arduino Uno R3",
    elements: [
      { id: 704, kind: "Sensor", type: "RFID Reader (RC522)", name: "pet_tag", pin: "10", pin2: "5" },
      { id: 705, kind: "Actuator", type: "Motor Servo (SG90/MG996R)", name: "cat_door", pin: "9" },
      { id: 706, kind: "Logic", name: "unlock", source: "val_pet_tag", operator: ">", threshold: "0", target: "cat_door", actionTrue: "90", actionFalse: "0" }
    ]
  }
];
export const SENSOR_EXAMPLES = [
  {
    id: "sn_1",
    name: "🔊 Ultrasonik (HC-SR04)",
    description: "Membaca jarak objek dalam satuan CM dan menampilkannya ke Serial Monitor.",
    elements: [
      { id: 1, kind: "Sensor", type: "Ultrasonik (HC-SR04)", name: "sonar", pin: "2", pin2: "3" },
      { id: 2, kind: "Utility", type: "Serial Print", name: "monitor", value: "Jarak (cm)", source: "val_sonar" },
      { id: 3, kind: "Utility", type: "Delay", name: "jeda", value: "500" }
    ]
  },
  {
    id: "sn_2",
    name: "🌡️ Suhu & Kelembaban (DHT)",
    description: "Membaca suhu ruangan secara realtime.",
    elements: [
      { id: 1, kind: "Sensor", type: "Suhu & Kelembaban (DHT11/DHT22)", name: "dht", pin: "2" },
      { id: 2, kind: "Utility", type: "Serial Print", name: "monitor", value: "Suhu", source: "val_dht" },
      { id: 3, kind: "Utility", type: "Delay", name: "jeda", value: "2000" }
    ]
  },
  {
    id: "sn_3",
    name: "☀️ Sensor Cahaya (LDR)",
    description: "Melihat nilai intensitas cahaya (0-1023).",
    elements: [
      { id: 1, kind: "Sensor", type: "Cahaya (LDR)", name: "ldr", pin: "A0" },
      { id: 2, kind: "Utility", type: "Serial Print", name: "monitor", value: "Nilai LDR", source: "val_ldr" }
    ]
  },
  {
    id: "sn_4",
    name: "💨 Sensor Gas (MQ-2)",
    description: "Memonitor kadar asap atau gas di sekitar sensor.",
    elements: [
      { id: 1, kind: "Sensor", type: "Gas & Asap (MQ-2)", name: "asap", pin: "A1" },
      { id: 2, kind: "Utility", type: "Serial Print", name: "monitor", value: "Kadar Gas", source: "val_asap" }
    ]
  }
];
export const ACTUATOR_EXAMPLES = [
  {
    id: "ac_1",
    name: "⚙️ Motor Servo (SG90)",
    description: "Tes pergerakan motor servo ke posisi sudut tertentu (0, 90, 180 derajat).",
    elements: [
      { id: 1, kind: "Actuator", type: "Motor Servo (SG90/MG996R)", name: "servo_tes", pin: "9" },
      { id: 2, kind: "Utility", type: "Delay", name: "jeda", value: "2000" },
      { id: 3, kind: "Logic", name: "ke_90", source: "0", operator: "==", threshold: "0", target: "servo_tes", actionTrue: "90", actionFalse: "0" }
    ]
  },
  {
    id: "ac_2",
    name: "💡 LED Blinking",
    description: "Tes dasar kedip lampu (Blink) untuk memastikan pin output bekerja.",
    elements: [
      { id: 1, kind: "Actuator", type: "LED Merah", name: "led_tes", pin: "13" },
      { id: 2, kind: "Utility", type: "Delay", name: "on", value: "1000" },
      { id: 3, kind: "Logic", name: "nyala", source: "0", operator: "==", threshold: "0", target: "led_tes", actionTrue: "HIGH", actionFalse: "LOW" },
      { id: 4, kind: "Utility", type: "Delay", name: "off", value: "1000" }
    ]
  },
  {
    id: "ac_3",
    name: "🔌 Relay (Saklar Elektronik)",
    description: "Tes bunyi 'klik' pada relay untuk memastikan sistem switching bekerja.",
    elements: [
      { id: 1, kind: "Actuator", type: "Relay 5V (1 Channel)", name: "relay_tes", pin: "8" },
      { id: 2, kind: "Logic", name: "toggle", source: "0", operator: "==", threshold: "0", target: "relay_tes", actionTrue: "HIGH", actionFalse: "LOW" },
      { id: 3, kind: "Utility", type: "Delay", name: "jeda", value: "3000" }
    ]
  },
  {
    id: "ac_4",
    name: "🔊 Buzzer Alert",
    description: "Menghasilkan bunyi beep berulang untuk indikator suara.",
    elements: [
      { id: 1, kind: "Actuator", type: "Buzzer Aktif", name: "buzzer_tes", pin: "11" },
      { id: 2, kind: "Logic", name: "bunyi", source: "0", operator: "==", threshold: "0", target: "buzzer_tes", actionTrue: "HIGH", actionFalse: "LOW" },
      { id: 3, kind: "Utility", type: "Delay", name: "durasi", value: "500" }
    ]
  }
];