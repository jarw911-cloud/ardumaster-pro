// ==========================================
// ARDUMASTER PRO: ENGINE GENERATOR C++
// ==========================================

export const generateArduinoCode = (
  elements: any[], 
  projectName: string, 
  username: string, 
  baudRate: string, 
  requiredLibs: string[]
) => {
  let libs = ``;
  // Tambahkan library yang dibutuhkan
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
      // Deklarasi Global Sensor
      if (el.type === "Ultrasonik (HC-SR04)") {
        defines += `#define TRIG_${el.name} ${el.pin}\n#define ECHO_${el.name} ${el.pin2}\n`;
        setup += `  pinMode(TRIG_${el.name}, OUTPUT);\n  pinMode(ECHO_${el.name}, INPUT);\n`;
      } 
      else if (el.type === "Suhu & Kelembaban (DHT11/DHT22)") {
        defines += `#define DHTPIN_${el.name} ${el.pin}\n#define DHTTYPE DHT11\nDHT dht_${el.name}(DHTPIN_${el.name}, DHTTYPE);\n`;
        setup += `  dht_${el.name}.begin();\n`;
      }
      else if (el.type === "RFID Reader (RC522)") {
        defines += `#define SS_PIN_${el.name} ${el.pin}\n#define RST_PIN_${el.name} ${el.pin2}\nMFRC522 rfid_${el.name}(SS_PIN_${el.name}, RST_PIN_${el.name});\n`;
        setup += `  SPI.begin();\n  rfid_${el.name}.PCD_Init();\n`;
      }
      else {
        // Sensor standar (Infrared, LDR, PIR, Soil Moisture, dll)
        defines += `#define PIN_${el.name} ${el.pin}\n`;
        setup += `  pinMode(PIN_${el.name}, INPUT);\n`;
      }
    } 
    
    else if (el.kind === 'Actuator') {
      // Deklarasi Global Aktuator
      if (el.type === "Motor Servo (SG90/MG996R)") {
        defines += `Servo servo_${el.name};\n`;
        setup += `  servo_${el.name}.attach(${el.pin});\n`;
      } 
      else if (el.type === "Driver Motor (L298N)") {
        defines += `#define IN1_${el.name} ${el.pin}\n#define IN2_${el.name} ${el.pin2}\n#define ENA_${el.name} ${el.pin3}\n`;
        setup += `  pinMode(IN1_${el.name}, OUTPUT);\n  pinMode(IN2_${el.name}, OUTPUT);\n  pinMode(ENA_${el.name}, OUTPUT);\n`;
      }
      else if (el.type === "Layar LCD 16x2 (I2C)") {
        defines += `LiquidCrystal_I2C lcd_${el.name}(0x27, 16, 2);\n`;
        setup += `  lcd_${el.name}.init();\n  lcd_${el.name}.backlight();\n`;
      }
      else {
        // Aktuator standar (LED, Relay, Buzzer, Pompa Air)
        defines += `#define PIN_${el.name} ${el.pin}\n`;
        setup += `  pinMode(PIN_${el.name}, OUTPUT);\n`;
      }
    }
  });

  // --- 2. BACA SENSOR (Di awal fungsi loop) ---
  if (elements.some(e => e.kind === 'Sensor')) {
    loop += `\n  // --- BACA DATA SENSOR ---\n`;
  }
  
  elements.filter(e => e.kind === 'Sensor').forEach(el => {
      if (el.type === "Ultrasonik (HC-SR04)") {
        loop += `  long duration_${el.name};\n  float val_${el.name};\n`;
        loop += `  digitalWrite(TRIG_${el.name}, LOW);\n  delayMicroseconds(2);\n`;
        loop += `  digitalWrite(TRIG_${el.name}, HIGH);\n  delayMicroseconds(10);\n  digitalWrite(TRIG_${el.name}, LOW);\n`;
        loop += `  duration_${el.name} = pulseIn(ECHO_${el.name}, HIGH);\n`;
        loop += `  val_${el.name} = duration_${el.name} * 0.034 / 2;\n`;
      } 
      else if (el.type === "Suhu & Kelembaban (DHT11/DHT22)") {
        loop += `  float val_${el.name} = dht_${el.name}.readTemperature();\n`;
      }
      else if (el.type === "Kelembaban Tanah (Soil Moisture)" || el.type === "Cahaya (LDR)" || el.type === "Gas & Asap (MQ-2)") {
        loop += `  int val_${el.name} = analogRead(PIN_${el.name});\n`;
      }
      else {
        // Digital Read untuk sensor lainnya (Infrared, PIR, Button)
        loop += `  int val_${el.name} = digitalRead(PIN_${el.name});\n`;
      }
  });

  // --- 3. PROSES EKSEKUSI (Logika & Utility) ---
  loop += `\n  // --- ALUR EKSEKUSI PROGRAM ---\n`;
  elements.forEach(el => {
    
    // A. LOGIKA (IF-ELSE)
    if (el.kind === 'Logic') {
        const targetActuator = elements.find(x => x.name === el.target);
        const tType = targetActuator?.type || "";
        
        // Fungsi pembantu untuk menerjemahkan perintah ke kode Arduino
        const getActionCode = (targetName: string, type: string, actionVal: string) => {
           if (type === "Motor Servo (SG90/MG996R)") return `servo_${targetName}.write(${actionVal});`;
           if (type === "Driver Motor (L298N)") {
               if (actionVal.toUpperCase() === "MAJU") return `digitalWrite(IN1_${targetName}, HIGH); digitalWrite(IN2_${targetName}, LOW); analogWrite(ENA_${targetName}, 255);`;
               if (actionVal.toUpperCase() === "MUNDUR") return `digitalWrite(IN1_${targetName}, LOW); digitalWrite(IN2_${targetName}, HIGH); analogWrite(ENA_${targetName}, 255);`;
               return `digitalWrite(IN1_${targetName}, LOW); digitalWrite(IN2_${targetName}, LOW); analogWrite(ENA_${targetName}, 0);`; // Stop
           }
           if (type === "Layar LCD 16x2 (I2C)") return `lcd_${targetName}.clear(); lcd_${targetName}.print("${actionVal}");`;
           
           // Aktuator standar (HIGH/LOW atau PWM)
           if (actionVal.toUpperCase() === "HIGH" || actionVal.toUpperCase() === "LOW" || actionVal === "1" || actionVal === "0") {
               return `digitalWrite(PIN_${targetName}, ${actionVal.toUpperCase() === "1" ? "HIGH" : actionVal.toUpperCase() === "0" ? "LOW" : actionVal.toUpperCase()});`;
           }
           // Jika value berupa angka (misal untuk PWM LED)
           return `analogWrite(PIN_${targetName}, ${actionVal});`;
        };

        let actCodeTrue = getActionCode(el.target, tType, el.actionTrue);
        let actCodeFalse = getActionCode(el.target, tType, el.actionFalse);
        
        loop += `  if (${el.source} ${el.operator} ${el.threshold}) {\n    ${actCodeTrue}\n  } else {\n    ${actCodeFalse}\n  }\n`;
    } 
    
    // B. UTILITAS (Delay / Print)
    else if (el.kind === 'Utility') {
        if (el.type === 'Delay') {
            loop += `  delay(${el.value || 1000});\n`;
        } else if (el.type === 'Serial Print') {
            if (el.value && el.source) {
                loop += `  Serial.print("${el.value}: ");\n  Serial.println(${el.source});\n`;
            } else if (el.value) {
                loop += `  Serial.println("${el.value}");\n`;
            } else if (el.source) {
                loop += `  Serial.println(${el.source});\n`;
            }
        }
    }
    
    // C. UPDATE VARIABLE
    else if (el.kind === 'Variable' && el.sourceSensor) {
        loop += `  ${el.name} = val_${el.sourceSensor};\n`;
    }
  });

  return `${libs}\n${defines}\n${setup}}\n\n${loop}\n  delay(10); // Stabilitas loop\n}`;
};