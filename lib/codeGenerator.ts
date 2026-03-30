// ==========================================
// ARDUMASTER PRO: ENGINE GENERATOR C++ (V3 - FULL TRUE SEQUENTIAL)
// ==========================================

export const generateArduinoCode = (
  elements: any[], 
  projectName: string, 
  username: string, 
  baudRate: string, 
  requiredLibs: string[]
) => {
  let libs = ``;
  if (requiredLibs.includes("LiquidCrystal_I2C.h")) libs += `#include <Wire.h>\n#include <LiquidCrystal_I2C.h>\n`;
  if (requiredLibs.includes("Servo.h")) libs += `#include <Servo.h>\n`;
  if (requiredLibs.includes("DHT.h")) libs += `#include <DHT.h>\n`;
  if (requiredLibs.includes("MFRC522.h")) libs += `#include <SPI.h>\n#include <MFRC522.h>\n`;
  
  let defines = `// --- ARDUMASTER PRO GENERATED ---\n// Project: ${projectName}\n// Author: ${username}\n\n`;
  let setup = `void setup() {\n  Serial.begin(${baudRate});\n`;
  let loop = `void loop() {\n`;

  // --- 1. SETUP & GLOBAL DEFINITIONS ---
  elements.forEach(el => {
    if (el.kind === 'Variable') {
      defines += `${el.varType} ${el.name}${el.sourceSensor ? '' : ` = ${el.value}`};\n`;
    } 
    else if (el.kind === 'Sensor') {
      // DEKLARASI NILAI SENSOR SEBAGAI GLOBAL VARIABEL (Agar bisa diakses kapanpun)
      defines += `float val_${el.name} = 0;\n`;

      if (el.type === "Ultrasonik (HC-SR04)") {
        defines += `#define TRIG_${el.name} ${el.pin}\n#define ECHO_${el.name} ${el.pin2}\n`;
        setup += `  pinMode(TRIG_${el.name}, OUTPUT);\n  pinMode(ECHO_${el.name}, INPUT);\n`;
      } else if (el.type === "Suhu & Kelembaban (DHT11/DHT22)") {
        defines += `#define DHTPIN_${el.name} ${el.pin}\n#define DHTTYPE DHT11\nDHT dht_${el.name}(DHTPIN_${el.name}, DHTTYPE);\n`;
        setup += `  dht_${el.name}.begin();\n`;
      } else if (el.type === "RFID Reader (RC522)") {
        defines += `#define SS_PIN_${el.name} ${el.pin}\n#define RST_PIN_${el.name} ${el.pin2}\nMFRC522 rfid_${el.name}(SS_PIN_${el.name}, RST_PIN_${el.name});\n`;
        setup += `  SPI.begin();\n  rfid_${el.name}.PCD_Init();\n`;
      } else {
        defines += `#define PIN_${el.name} ${el.pin}\n`;
        setup += `  pinMode(PIN_${el.name}, INPUT);\n`;
      }
    } 
    else if (el.kind === 'Actuator') {
      if (el.type.includes("Servo")) {
        defines += `Servo servo_${el.name};\n`;
        setup += `  servo_${el.name}.attach(${el.pin});\n`;
      } else if (el.type === "Driver Motor (L298N)") {
        defines += `#define IN1_${el.name} ${el.pin}\n#define IN2_${el.name} ${el.pin2}\n#define ENA_${el.name} ${el.pin3}\n`;
        setup += `  pinMode(IN1_${el.name}, OUTPUT);\n  pinMode(IN2_${el.name}, OUTPUT);\n  pinMode(ENA_${el.name}, OUTPUT);\n`;
      } else if (el.type === "Layar LCD 16x2 (I2C)") {
        defines += `LiquidCrystal_I2C lcd_${el.name}(0x27, 16, 2);\n`;
        setup += `  lcd_${el.name}.init();\n  lcd_${el.name}.backlight();\n`;
      } else {
        defines += `#define PIN_${el.name} ${el.pin}\n`;
        setup += `  pinMode(PIN_${el.name}, OUTPUT);\n`;
      }
    }
  });

  // --- 2. EKSEKUSI SEKUENSIAL TOTAL (Berurutan persis dari atas ke bawah) ---
  loop += `\n  // --- ALUR EKSEKUSI PROGRAM ---\n`;
  
  const getActionCode = (targetName: string, type: string, actionVal: string) => {
     if (!targetName || !type) return `// Menunggu target aktuator`;
     if (type.includes("Servo")) return `servo_${targetName}.write(${actionVal});`;
     if (type === "Driver Motor (L298N)") {
         if (actionVal.toUpperCase() === "MAJU") return `digitalWrite(IN1_${targetName}, HIGH); digitalWrite(IN2_${targetName}, LOW); analogWrite(ENA_${targetName}, 255);`;
         if (actionVal.toUpperCase() === "MUNDUR") return `digitalWrite(IN1_${targetName}, LOW); digitalWrite(IN2_${targetName}, HIGH); analogWrite(ENA_${targetName}, 255);`;
         return `digitalWrite(IN1_${targetName}, LOW); digitalWrite(IN2_${targetName}, LOW); analogWrite(ENA_${targetName}, 0);`;
     }
     if (type === "Layar LCD 16x2 (I2C)") return `lcd_${targetName}.clear(); lcd_${targetName}.print("${actionVal}");`;
     
     if (actionVal.toUpperCase() === "HIGH" || actionVal.toUpperCase() === "LOW" || actionVal === "1" || actionVal === "0") {
         return `digitalWrite(PIN_${targetName}, ${actionVal.toUpperCase() === "1" ? "HIGH" : actionVal.toUpperCase() === "0" ? "LOW" : actionVal.toUpperCase()});`;
     }
     return `analogWrite(PIN_${targetName}, ${actionVal});`;
  };

  // KITA LOOP SEMUA ELEMEN BERURUTAN (Termasuk saat mengambil data sensor)
  elements.forEach((el, index) => {
    
    // A. BACA SENSOR (Tepat di mana kartu ini diletakkan!)
    if (el.kind === 'Sensor') {
        loop += `  // [Langkah ${index + 1}] Baca data ${el.name}\n`;
        if (el.type === "Ultrasonik (HC-SR04)") {
          loop += `  digitalWrite(TRIG_${el.name}, LOW); delayMicroseconds(2);\n`;
          loop += `  digitalWrite(TRIG_${el.name}, HIGH); delayMicroseconds(10); digitalWrite(TRIG_${el.name}, LOW);\n`;
          loop += `  val_${el.name} = pulseIn(ECHO_${el.name}, HIGH) * 0.034 / 2;\n\n`;
        } else if (el.type === "Suhu & Kelembaban (DHT11/DHT22)") {
          loop += `  val_${el.name} = dht_${el.name}.readTemperature();\n\n`;
        } else if (el.type === "Kelembaban Tanah (Soil Moisture)" || el.type === "Cahaya (LDR)" || el.type === "Gas & Asap (MQ-2)") {
          loop += `  val_${el.name} = analogRead(PIN_${el.name});\n\n`;
        } else {
          loop += `  val_${el.name} = digitalRead(PIN_${el.name});\n\n`;
        }
    }
    
    // B. LOGIKA AKTUATOR
    else if (el.kind === 'Logic') {
        loop += `  // [Langkah ${index + 1}] Cek Logika ${el.name}\n`;
        const targetActuator = elements.find(x => x.name === el.target);
        const tType = targetActuator?.type || "";
        let actCodeTrue = getActionCode(el.target, tType, el.actionTrue);
        let actCodeFalse = getActionCode(el.target, tType, el.actionFalse);
        
        const isSensor = elements.some(x => x.kind === 'Sensor' && `val_${x.name}` === el.source);
        const sourceVar = isSensor ? el.source : (el.source || "0");

        loop += `  if (${sourceVar} ${el.operator} ${el.threshold}) {\n    ${actCodeTrue}\n  } else {\n    ${actCodeFalse}\n  }\n\n`;
    } 
    
    // C. UTILITAS / JEDA WAKTU
    else if (el.kind === 'Utility') {
        loop += `  // [Langkah ${index + 1}] Utilitas\n`;
        if (el.type === 'Delay') {
            loop += `  delay(${el.value || 1000});\n\n`;
        } else if (el.type === 'Serial Print') {
            if (el.value && el.source) {
                loop += `  Serial.print("${el.value}: "); Serial.println(${el.source});\n\n`;
            } else if (el.value) {
                loop += `  Serial.println("${el.value}");\n\n`;
            } else if (el.source) {
                loop += `  Serial.println(${el.source});\n\n`;
            }
        }
    }
    
    // D. UPDATE VARIABEL
    else if (el.kind === 'Variable' && el.sourceSensor) {
        loop += `  // [Langkah ${index + 1}] Update Variabel\n`;
        loop += `  ${el.name} = val_${el.sourceSensor};\n\n`;
    }
  });

  return `${libs}\n${defines}\n${setup}}\n\n${loop}\n  // Akhir dari loop, akan mengulang ke Langkah 1\n}`;
};