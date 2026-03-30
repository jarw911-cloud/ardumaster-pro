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
  // --- KATEGORI: SMART HOME & CITY ---
  {
    id: "ex_1",
    name: "🏠 Smart Home: Lampu Otomatis",
    description: "Lampu akan menyala otomatis saat ruangan gelap menggunakan sensor LDR.",
    board: "Arduino Uno R3",
    elements: [
      { id: 11, kind: "Sensor", type: "Cahaya (LDR)", name: "sensor_cahaya", pin: "A0" },
      { id: 12, kind: "Actuator", type: "Relay 5V (1 Channel)", name: "lampu_teras", pin: "8" },
      { id: 13, kind: "Logic", name: "logika_lampu", source: "val_sensor_cahaya", operator: ">", threshold: "700", target: "lampu_teras", actionTrue: "HIGH", actionFalse: "LOW" }
    ]
  },
  {
    id: "ex_11",
    name: "🗑️ Smart Bin: Tempat Sampah Otomatis",
    description: "Tutup tempat sampah terbuka otomatis menggunakan Servo saat tangan terdeteksi di atas sensor Ultrasonik.",
    board: "Arduino Uno R3",
    elements: [
      { id: 111, kind: "Sensor", type: "Ultrasonik (HC-SR04)", name: "sensor_tangan", pin: "2", pin2: "3" },
      { id: 112, kind: "Actuator", type: "Motor Servo (SG90/MG996R)", name: "tutup_sampah", pin: "9" },
      { id: 113, kind: "Logic", name: "buka_tutup", source: "val_sensor_tangan", operator: "<", threshold: "15", target: "tutup_sampah", actionTrue: "90", actionFalse: "0" }
    ]
  },
  {
    id: "ex_12",
    name: "🚗 Smart Garage: Pintu Garasi Otomatis",
    description: "Pintu garasi terbuka saat mobil terdeteksi di depan pintu menggunakan sensor Infrared.",
    board: "Arduino Uno R3",
    elements: [
      { id: 121, kind: "Sensor", type: "Infrared (Obstacle Avoidance)", name: "deteksi_mobil", pin: "4" },
      { id: 122, kind: "Actuator", type: "Motor Servo (SG90/MG996R)", name: "pintu_garasi", pin: "10" },
      { id: 123, kind: "Logic", name: "logika_pintu", source: "val_deteksi_mobil", operator: "==", threshold: "0", target: "pintu_garasi", actionTrue: "90", actionFalse: "0" }
    ]
  },
  {
    id: "ex_13",
    name: "🏢 Smart Lift: Deteksi Lantai",
    description: "Menampilkan pesan di Serial Monitor saat sensor mendeteksi lift sampai di lantai tujuan.",
    board: "Arduino Uno R3",
    elements: [
      { id: 131, kind: "Sensor", type: "Infrared (Obstacle Avoidance)", name: "sensor_lantai", pin: "5" },
      { id: 132, kind: "Utility", type: "Serial Print", name: "log_lift", value: "Lift Sampai di Lantai 1", source: "" },
      { id: 133, kind: "Logic", name: "cek_posisi", source: "val_sensor_lantai", operator: "==", threshold: "0", target: "log_lift", actionTrue: "PRINT", actionFalse: "LOW" }
    ]
  },

  // --- KATEGORI: AGRICULTURE & FARMING ---
  {
    id: "ex_2",
    name: "🌱 Smart Farming: Penyiram Otomatis",
    description: "Pompa air aktif jika tanah kering untuk menjaga kelembaban tanaman.",
    board: "Arduino Uno R3",
    elements: [
      { id: 21, kind: "Sensor", type: "Kelembaban Tanah (Soil Moisture)", name: "sensor_tanah", pin: "A1" },
      { id: 22, kind: "Actuator", type: "Relay 5V (1 Channel)", name: "pompa", pin: "9" },
      { id: 23, kind: "Logic", name: "logika_siram", source: "val_sensor_tanah", operator: ">", threshold: "800", target: "pompa", actionTrue: "HIGH", actionFalse: "LOW" }
    ]
  },
  {
    id: "ex_17",
    name: "🌡️ Greenhouse: Pengatur Suhu Tanaman",
    description: "Kipas angin menyala otomatis jika suhu di dalam Greenhouse terlalu panas.",
    board: "Arduino Uno R3",
    elements: [
      { id: 171, kind: "Sensor", type: "Suhu & Kelembaban (DHT11/DHT22)", name: "dht_greenhouse", pin: "7" },
      { id: 172, kind: "Actuator", type: "Relay 5V (1 Channel)", name: "kipas_exhaust", pin: "6" },
      { id: 173, kind: "Logic", name: "logika_suhu", source: "val_dht_greenhouse", operator: ">", threshold: "32", target: "kipas_exhaust", actionTrue: "HIGH", actionFalse: "LOW" }
    ]
  },
  {
    id: "ex_14",
    name: "☔ Rain Detector: Penutup Jemuran Otomatis",
    description: "Menggerakkan Servo untuk menutup atap jemuran saat sensor mendeteksi adanya air hujan.",
    board: "Arduino Uno R3",
    elements: [
      { id: 141, kind: "Sensor", type: "Sensor Hujan (Rain Sensor)", name: "sensor_hujan", pin: "A2" },
      { id: 142, kind: "Actuator", type: "Motor Servo (SG90/MG996R)", name: "atap_jemuran", pin: "11" },
      { id: 143, kind: "Logic", name: "logika_hujan", source: "val_sensor_hujan", operator: "<", threshold: "500", target: "atap_jemuran", actionTrue: "180", actionFalse: "0" }
    ]
  },

  // --- KATEGORI: SECURITY & SAFETY ---
  {
    id: "ex_4",
    name: "🚨 Security: Alarm Jarak Parkir",
    description: "Buzzer berbunyi jika ada objek mendekat kurang dari 20cm.",
    board: "Arduino Uno R3",
    elements: [
      { id: 41, kind: "Sensor", type: "Ultrasonik (HC-SR04)", name: "sensor_jarak", pin: "2", pin2: "3" },
      { id: 42, kind: "Actuator", type: "Buzzer Aktif", name: "alarm", pin: "11" },
      { id: 43, kind: "Logic", name: "cek_jarak", source: "val_sensor_jarak", operator: "<", threshold: "20", target: "alarm", actionTrue: "HIGH", actionFalse: "LOW" }
    ]
  },
  {
    id: "ex_20",
    name: "👤 Intruder Alarm: Deteksi Maling",
    description: "Lampu Merah berkedip dan Buzzer menyala jika sensor PIR mendeteksi gerakan manusia.",
    board: "Arduino Uno R3",
    elements: [
      { id: 201, kind: "Sensor", type: "Gerak (PIR)", name: "sensor_gerak", pin: "12" },
      { id: 202, kind: "Actuator", type: "Buzzer Aktif", name: "sirine", pin: "13" },
      { id: 203, kind: "Logic", name: "logika_maling", source: "val_sensor_gerak", operator: "==", threshold: "1", target: "sirine", actionTrue: "HIGH", actionFalse: "LOW" }
    ]
  },
  {
    id: "ex_9",
    name: "🚭 Gas Detector: Deteksi Kebocoran Gas",
    description: "Memberikan peringatan suara jika terdeteksi kebocoran gas LPG atau asap.",
    board: "Arduino Uno R3",
    elements: [
      { id: 91, kind: "Sensor", type: "Gas & Asap (MQ-2)", name: "mq_sensor", pin: "A4" },
      { id: 92, kind: "Actuator", type: "Buzzer Aktif", name: "alarm_gas", pin: "4" },
      { id: 93, kind: "Logic", name: "cek_gas", source: "val_mq_sensor", operator: ">", threshold: "400", target: "alarm_gas", actionTrue: "HIGH", actionFalse: "LOW" }
    ]
  },
  {
    id: "ex_15",
    name: "🔥 Fire Alarm: Deteksi Api",
    description: "Sistem peringatan dini yang aktif saat sensor api mendeteksi adanya gelombang panas api.",
    board: "Arduino Uno R3",
    elements: [
      { id: 151, kind: "Sensor", type: "Api (Flame Sensor)", name: "sensor_api", pin: "A5" },
      { id: 152, kind: "Actuator", type: "LED Merah", name: "led_bahaya", pin: "5" },
      { id: 153, kind: "Logic", name: "logika_api", source: "val_sensor_api", operator: "<", threshold: "200", target: "led_bahaya", actionTrue: "HIGH", actionFalse: "LOW" }
    ]
  },

  // --- KATEGORI: HEALTH & AUTOMATION ---
  {
    id: "ex_10",
    name: "🧴 Smart Sanitizer: Hand Sanitizer Otomatis",
    description: "Mengeluarkan cairan pembersih tangan tanpa sentuh menggunakan servo.",
    board: "Arduino Uno R3",
    elements: [
      { id: 101, kind: "Sensor", type: "Infrared (Obstacle Avoidance)", name: "deteksi_tangan", pin: "3" },
      { id: 102, kind: "Actuator", type: "Motor Servo (SG90/MG996R)", name: "tuas_botol", pin: "9" },
      { id: 103, kind: "Logic", name: "tekan_tuas", source: "val_deteksi_tangan", operator: "==", threshold: "0", target: "tuas_botol", actionTrue: "45", actionFalse: "0" }
    ]
  },
  {
    id: "ex_5",
    name: "🧼 Smart Tap: Kran Air Otomatis",
    description: "Membuka kran air otomatis saat tangan berada di bawah sensor.",
    board: "Arduino Uno R3",
    elements: [
      { id: 51, kind: "Sensor", type: "Infrared (Obstacle Avoidance)", name: "sensor_kran", pin: "4" },
      { id: 52, kind: "Actuator", type: "Pompa Air DC", name: "kran", pin: "12" },
      { id: 53, kind: "Logic", name: "logika_kran", source: "val_sensor_kran", operator: "==", threshold: "0", target: "kran", actionTrue: "HIGH", actionFalse: "LOW" }
    ]
  },
  {
    id: "ex_19",
    name: "🌊 Water Control: Pengisi Tandon Otomatis",
    description: "Mematikan pompa air secara otomatis jika tandon air sudah penuh.",
    board: "Arduino Uno R3",
    elements: [
      { id: 191, kind: "Sensor", type: "Level Air (Water Level Sensor)", name: "sensor_air", pin: "A3" },
      { id: 192, kind: "Actuator", type: "Relay 5V (1 Channel)", name: "pompa_tandon", pin: "7" },
      { id: 193, kind: "Logic", name: "cek_penuh", source: "val_sensor_air", operator: ">", threshold: "500", target: "pompa_tandon", actionTrue: "LOW", actionFalse: "HIGH" }
    ]
  },

  // --- KATEGORI: INDUSTRIAL & SCIENCE ---
  {
    id: "ex_21",
    name: "📦 Logistik: Penghitung Barang",
    description: "Menghitung jumlah barang yang lewat di conveyor menggunakan sensor Infrared.",
    board: "Arduino Uno R3",
    elements: [
      { id: 211, kind: "Variable", name: "total_barang", varType: "int", value: "0" },
      { id: 212, kind: "Sensor", type: "Infrared (Obstacle Avoidance)", name: "sensor_conveyor", pin: "6" },
      { id: 213, kind: "Logic", name: "hitung", source: "val_sensor_conveyor", operator: "==", threshold: "0", target: "total_barang", actionTrue: "1", actionFalse: "0" },
      { id: 214, kind: "Utility", type: "Serial Print", name: "print_total", value: "Barang Terdeteksi", source: "total_barang" }
    ]
  },
  {
    id: "ex_25",
    name: "🛑 Safety: Tombol Emergency Stop",
    description: "Mematikan seluruh sistem secara instan saat tombol darurat ditekan.",
    board: "Arduino Uno R3",
    elements: [
      { id: 251, kind: "Sensor", type: "Tombol (Push Button)", name: "tombol_stop", pin: "2" },
      { id: 252, kind: "Actuator", type: "Motor DC", name: "mesin_pabrik", pin: "3" },
      { id: 253, kind: "Logic", name: "e_stop", source: "val_tombol_stop", operator: "==", threshold: "1", target: "mesin_pabrik", actionTrue: "LOW", actionFalse: "HIGH" }
    ]
  },
  {
    id: "ex_16",
    name: "🫨 Earthquake: Deteksi Gempa",
    description: "Buzzer akan berteriak kencang jika sensor getaran mendeteksi adanya guncangan tanah.",
    board: "Arduino Uno R3",
    elements: [
      { id: 161, kind: "Sensor", type: "Getaran (Vibration Sensor)", name: "sensor_getar", pin: "10" },
      { id: 162, kind: "Actuator", type: "Buzzer Aktif", name: "alarm_gempa", pin: "11" },
      { id: 163, kind: "Logic", name: "cek_guncangan", source: "val_sensor_getar", operator: "==", threshold: "1", target: "alarm_gempa", actionTrue: "HIGH", actionFalse: "LOW" }
    ]
  },

  // --- KATEGORI: AQUARIUM & PETS ---
  {
    id: "ex_3",
    name: "🐠 Aquascape: Pemberi Pakan Ikan",
    description: "Memberi pakan ikan secara berkala menggunakan motor servo.",
    board: "Arduino Uno R3",
    elements: [
      { id: 31, kind: "Actuator", type: "Motor Servo (SG90/MG996R)", name: "servo_pakan", pin: "10" },
      { id: 32, kind: "Utility", type: "Delay", name: "jeda_makan", value: "10000" },
      { id: 33, kind: "Logic", name: "aksi_makan", source: "0", operator: "==", threshold: "0", target: "servo_pakan", actionTrue: "90", actionFalse: "0" }
    ]
  },
  {
    id: "ex_24",
    name: "🐈 Pet Care: Dispenser Minum Kucing",
    description: "Mengeluarkan air ke wadah minum saat kucing mendekat ke sensor ultrasonik.",
    board: "Arduino Uno R3",
    elements: [
      { id: 241, kind: "Sensor", type: "Ultrasonik (HC-SR04)", name: "deteksi_kucing", pin: "A0", pin2: "A1" },
      { id: 242, kind: "Actuator", type: "Pompa Air DC", name: "pompa_minum", pin: "6" },
      { id: 243, kind: "Logic", name: "beri_minum", source: "val_deteksi_kucing", operator: "<", threshold: "10", target: "pompa_minum", actionTrue: "HIGH", actionFalse: "LOW" }
    ]
  },

  // --- KATEGORI: ENERGY & LIGHTING ---
  {
    id: "ex_22",
    name: "💡 City: Lampu Jalan Pintar",
    description: "Lampu jalan yang hanya menyala jika ada kendaraan lewat di malam hari.",
    board: "Arduino Uno R3",
    elements: [
      { id: 221, kind: "Sensor", type: "Cahaya (LDR)", name: "cek_malam", pin: "A0" },
      { id: 222, kind: "Sensor", type: "Infrared (Obstacle Avoidance)", name: "cek_kendaraan", pin: "2" },
      { id: 223, kind: "Actuator", type: "LED Lampu Jalan", name: "lampu_jalan", pin: "3" },
      { id: 224, kind: "Logic", name: "logika_hemat", source: "val_cek_kendaraan", operator: "==", threshold: "0", target: "lampu_jalan", actionTrue: "HIGH", actionFalse: "LOW" }
    ]
  },
  {
    id: "ex_18",
    name: "🪟 Smart Window: Tirai Otomatis",
    description: "Menutup tirai (Servo) saat matahari terlalu terik agar ruangan tetap sejuk.",
    board: "Arduino Uno R3",
    elements: [
      { id: 181, kind: "Sensor", type: "Cahaya (LDR)", name: "sensor_surya", pin: "A0" },
      { id: 182, kind: "Actuator", type: "Motor Servo (SG90/MG996R)", name: "tirai_jendela", pin: "5" },
      { id: 183, kind: "Logic", name: "logika_tirai", source: "val_sensor_surya", operator: "<", threshold: "300", target: "tirai_jendela", actionTrue: "180", actionFalse: "0" }
    ]
  },
// --- KATEGORI KHUSUS: TRAFFIC LIGHT SYSTEM ---
  {
    id: "ex_tl_1",
    name: "🚦 Pertigaan: Standar 3 Arah",
    description: "Sistem lampu lalu lintas untuk pertigaan. Mengatur giliran jalan dari sisi A, B, lalu C secara berurutan.",
    board: "Arduino Uno R3",
    elements: [
      { id: 221, kind: "Actuator", type: "Traffic Light Side A", name: "jalur_a", pin: "2" }, // Pin Hijau Jalur A
      { id: 222, kind: "Utility", type: "Delay", name: "durasi_a", value: "5000" },
      { id: 223, kind: "Actuator", type: "Traffic Light Side B", name: "jalur_b", pin: "3" }, // Pin Hijau Jalur B
      { id: 224, kind: "Utility", type: "Delay", name: "durasi_b", value: "5000" },
      { id: 225, kind: "Actuator", type: "Traffic Light Side C", name: "jalur_c", pin: "4" }, // Pin Hijau Jalur C
      { id: 226, kind: "Utility", type: "Delay", name: "durasi_c", value: "5000" }
    ]
  },
  {
    id: "ex_tl_2",
    name: "🚥 Perempatan: Jalur Padat",
    description: "Siklus 4 arah untuk perempatan besar. Menggunakan delay presisi agar tidak terjadi tabrakan logika.",
    board: "Arduino Uno R3",
    elements: [
      { id: 231, kind: "Actuator", type: "Green LED Side 1", name: "utara", pin: "2" },
      { id: 232, kind: "Utility", type: "Delay", name: "jeda_utara", value: "4000" },
      { id: 233, kind: "Actuator", type: "Green LED Side 2", name: "selatan", pin: "3" },
      { id: 234, kind: "Utility", type: "Delay", name: "jeda_selatan", value: "4000" },
      { id: 235, kind: "Actuator", type: "Green LED Side 3", name: "timur", pin: "4" },
      { id: 236, kind: "Utility", type: "Delay", name: "jeda_timur", value: "4000" },
      { id: 237, kind: "Actuator", type: "Green LED Side 4", name: "barat", pin: "5" },
      { id: 238, kind: "Utility", type: "Delay", name: "jeda_barat", value: "4000" }
    ]
  },
  {
    id: "ex_tl_3",
    name: "🚶 Pertigaan + Penyeberang Jalan",
    description: "Lampu hijau kendaraan akan berhenti sejenak untuk memberi waktu pejalan kaki menyeberang (Lampu Hijau Pedestrian).",
    board: "Arduino Uno R3",
    elements: [
      { id: 241, kind: "Actuator", type: "Lampu Kendaraan", name: "mobil", pin: "2" },
      { id: 242, kind: "Utility", type: "Delay", name: "jalan_mobil", value: "8000" },
      { id: 243, kind: "Actuator", type: "Lampu Kendaraan", name: "mobil_stop", pin: "2" }, // Low logic
      { id: 244, kind: "Actuator", type: "Lampu Pejalan", name: "pedestrian", pin: "3" },
      { id: 245, kind: "Utility", type: "Delay", name: "waktu_seberang", value: "5000" }
    ]
  },
  {
    id: "ex_tl_4",
    name: "🚸 Perempatan + All-Red Pedestrian",
    description: "Siklus perempatan di mana semua lampu kendaraan menjadi MERAH saat jalur pejalan kaki aktif.",
    board: "Arduino Uno R3",
    elements: [
      { id: 251, kind: "Actuator", type: "Lampu Hijau Kendaraan", name: "semua_jalur", pin: "2" },
      { id: 252, kind: "Utility", type: "Delay", name: "kendaraan_jalan", value: "10000" },
      { id: 253, kind: "Actuator", type: "Lampu Merah Semua", name: "semua_stop", pin: "2" }, 
      { id: 254, kind: "Actuator", type: "Lampu Hijau Orang", name: "orang_jalan", pin: "3" },
      { id: 255, kind: "Utility", type: "Delay", name: "durasi_aman", value: "7000" }
    ]
  },
  {
    id: "ex_tl_5",
    name: "🔘 Pelican Crossing (Tombol Tekan)",
    description: "Lampu merah kendaraan HANYA akan aktif jika penyeberang menekan tombol. Sangat hemat energi dan efisien.",
    board: "Arduino Uno R3",
    elements: [
      { id: 261, kind: "Sensor", type: "Tombol (Push Button)", name: "tombol_seberang", pin: "4" },
      { id: 262, kind: "Actuator", type: "Lampu Merah Mobil", name: "stop_mobil", pin: "5" },
      { id: 263, kind: "Actuator", type: "Lampu Hijau Orang", name: "jalan_orang", pin: "6" },
      { id: 264, kind: "Logic", name: "cek_tombol", source: "val_tombol_seberang", operator: "==", threshold: "1", target: "stop_mobil", actionTrue: "HIGH", actionFalse: "LOW" },
      { id: 265, kind: "Utility", type: "Delay", name: "durasi_nyebrang", value: "5000" }
    ]
  }
]