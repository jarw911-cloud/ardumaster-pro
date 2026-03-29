export const BOARD_PINS: Record<string, string[]> = {
  "Arduino Uno": ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "A0", "A1", "A2", "A3", "A4", "A5"],
  "Arduino Nano": ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "A0", "A1", "A2", "A3", "A4", "A5", "A6", "A7"],
  "Arduino Mega": Array.from({length: 54}, (_, i) => i.toString()).concat(Array.from({length: 16}, (_, i) => `A${i}`)),
  "ESP32": ["2", "4", "5", "12", "13", "14", "15", "18", "19", "21", "22", "23", "25", "26", "27", "32", "33", "34", "35", "36", "39"],
  "ESP8266": ["D0", "D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8"]
};

// PERBAIKAN: Menambahkan Arah Arus (_in, _out, _io)
export const SENSORS_DB = [
  { name: "HC-SR04 Ultrasonic", pins: 2, pinTypes: ['digital_out', 'digital_in'], lib: "None", init: (v:any, p1:any, p2:any) => `#define TRIG_${v} ${p1}\n#define ECHO_${v} ${p2}`, read: (v:any) => `getDistance(TRIG_${v}, ECHO_${v})` },
  { name: "DHT22 (Suhu)", pins: 1, pinTypes: ['digital_io'], lib: "DHT sensor library", init: (v:any, p:any) => `DHT dht_${v}(${p}, DHT22);`, read: (v:any) => `dht_${v}.readTemperature()` },
  { name: "MQ-2 Smoke/Gas", pins: 1, pinTypes: ['analog_in'], lib: "None", init: (v:any, p:any) => `#define SMOKE_${v} ${p}`, read: (v:any) => `analogRead(SMOKE_${v})` },
  { name: "RC522 RFID", pins: 5, pinTypes: ['digital_out', 'digital_in', 'digital_out', 'digital_out', 'digital_out'], lib: "MFRC522", init: (v:any) => `MFRC522 rfid_${v}(SS_PIN, RST_PIN);`, read: (v:any) => `rfid_${v}.PICC_IsNewCardPresent()` },
  { name: "LDR (Cahaya)", pins: 1, pinTypes: ['analog_in'], lib: "None", init: (v:any, p:any) => `#define LDR_${v} ${p}`, read: (v:any) => `analogRead(LDR_${v})` }
];

export const ACTUATORS_DB = [
  { name: "Servo SG90", pins: 1, pinTypes: ['pwm_out'], lib: "Servo", init: (v:any) => `Servo servo_${v};`, setup: (v:any, p:any) => `servo_${v}.attach(${p});`, action: (v:any, val:any) => `servo_${v}.write(${val});` },
  { name: "Kunci Solenoid", pins: 1, pinTypes: ['digital_out'], lib: "None", init: (v:any, p:any) => `#define LOCK_${v} ${p}`, action: (v:any, st:any) => `digitalWrite(LOCK_${v}, ${st});` },
  { name: "I2C LCD 16x2", pins: 2, pinTypes: ['i2c_io', 'i2c_io'], lib: "LiquidCrystal I2C", init: (v:any) => `LiquidCrystal_I2C lcd_${v}(0x27, 16, 2);`, setup: (v:any) => `lcd_${v}.init();`, action: (v:any, val:any) => `lcd_${v}.print(${val});` },
  { name: "Relay 5V", pins: 1, pinTypes: ['digital_out'], lib: "None", init: (v:any, p:any) => `#define RELAY_${v} ${p}`, action: (v:any, st:any) => `digitalWrite(RELAY_${v}, ${st});` },
  { name: "Buzzer Aktif", pins: 1, pinTypes: ['digital_out'], lib: "None", init: (v:any, p:any) => `#define BUZZER_${v} ${p}`, action: (v:any, st:any) => `digitalWrite(BUZZER_${v}, ${st});` }
];

export const isPinSupported = (board: string, pin: string, reqType: string) => {
  // Aturan Keras: Pin Input Only ESP32 (34, 35, 36, 39)
  const isInputOnlyESP32 = board === 'ESP32' && ["34","35","36","39"].includes(pin);

  // Jika butuh Output atau Bidirectional (I/O), tapi pakai pin Input Only -> Jangan Munculkan!
  if (isInputOnlyESP32 && (reqType.includes('_out') || reqType.includes('_io'))) {
      return false; 
  }

  if (reqType.startsWith('analog')) {
     if (board.startsWith('Arduino')) return pin.startsWith('A');
     if (board === 'ESP8266') return pin === 'A0';
     if (board === 'ESP32') return ["32","33","34","35","36","39","25","26","27","14","12","13"].includes(pin);
  }
  if (reqType.startsWith('pwm')) {
     if (board === 'Arduino Uno' || board === 'Arduino Nano') return ['3','5','6','9','10','11'].includes(pin);
     if (board === 'Arduino Mega') return ['2','3','4','5','6','7','8','9','10','11','12','13','44','45','46'].includes(pin);
     return true; // ESP dukung PWM software di semua pin output
  }
  if (reqType.startsWith('i2c')) {
     if (board === 'Arduino Uno' || board === 'Arduino Nano') return ['A4', 'A5'].includes(pin);
     if (board === 'ESP8266') return ['D1', 'D2'].includes(pin);
     if (board === 'ESP32') return ['21', '22'].includes(pin);
  }
  return true; 
};

export const getPinWarning = (board: string, pin: string, kind: string) => {
  if (board === "ESP8266") {
      if (pin === "D3") return "⚠️ D3 (GPIO0): Berisiko ganggu booting jika LOW.";
      if (pin === "D4") return "⚠️ D4 (GPIO2): HIGH saat boot (LED Built-in).";
      if (pin === "D8") return "⚠️ D8 (GPIO15): HARUS tetap LOW saat booting!";
  }
  if (board === "ESP32") {
      if (["6","7","8","9","10","11"].includes(pin)) return "⚠️ BACA FLASH MEMORY! Jangan gunakan pin ini.";
      if (["0","2","5","12","15"].includes(pin)) return "⚠️ Pin Strapping: Bisa menyebabkan gagal boot.";
  }
  return null;
};

// Cari bagian WIRING_MAP di constants.ts dan timpa dengan ini:
export const WIRING_MAP: Record<string, { label: string, type: 'vcc' | 'gnd' | 'data', color: string }[]> = {
  "HC-SR04 Ultrasonic": [
    { label: "VCC", type: 'vcc', color: "bg-red-500" },
    { label: "TRIG", type: 'data', color: "bg-orange-400" },
    { label: "ECHO", type: 'data', color: "bg-yellow-400" },
    { label: "GND", type: 'gnd', color: "bg-slate-600" }
  ],
  "DHT22 (Suhu)": [
    { label: "VCC", type: 'vcc', color: "bg-red-500" },
    { label: "DATA", type: 'data', color: "bg-blue-400" },
    { label: "NC", type: 'gnd', color: "bg-transparent" }, // Pin kosong
    { label: "GND", type: 'gnd', color: "bg-slate-600" }
  ],
  "MQ-2 Smoke/Gas": [
    { label: "VCC", type: 'vcc', color: "bg-red-500" },
    { label: "GND", type: 'gnd', color: "bg-slate-600" },
    { label: "D0", type: 'data', color: "bg-slate-500" },
    { label: "A0", type: 'data', color: "bg-cyan-400" }
  ],
  "Servo SG90": [
    { label: "PWM (Oranye)", type: 'data', color: "bg-orange-500" },
    { label: "VCC (Merah)", type: 'vcc', color: "bg-red-500" },
    { label: "GND (Cokelat)", type: 'gnd', color: "bg-amber-900" }
  ],
  "I2C LCD 16x2": [
    { label: "GND", type: 'gnd', color: "bg-slate-600" },
    { label: "VCC", type: 'vcc', color: "bg-red-500" },
    { label: "SDA", type: 'data', color: "bg-emerald-400" },
    { label: "SCL", type: 'data', color: "bg-emerald-500" }
  ]
};

// Pastikan fungsi helper ini ada
export const getWireColorClass = (color: string) => color || "bg-cyan-500";

export const getBadgeStyle = (type: string, isActuator: boolean) => {
    if(type === 'vcc') return "bg-red-500/20 text-red-400 border-red-500/50";
    if(type === 'gnd') return "bg-slate-700/50 text-slate-300 border-slate-600";
    return isActuator ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50" : "bg-cyan-500/20 text-cyan-400 border-cyan-500/50";
};

export const getWireColor = (type: string, isActuator: boolean) => {
    if(type === 'vcc') return "bg-red-500/50";
    if(type === 'gnd') return "bg-slate-500/50";
    return isActuator ? "bg-emerald-500/50" : "bg-cyan-500/50";
};