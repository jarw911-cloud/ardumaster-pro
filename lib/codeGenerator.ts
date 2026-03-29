import { SENSORS_DB, ACTUATORS_DB } from './constants';

export const generateArduinoCode = (
  elements: any[], 
  projectName: string, 
  username: string, 
  baudRate: string, 
  requiredLibs: string[]
) => {
  let libs = ``;
  if (requiredLibs.includes("LiquidCrystal I2C")) libs += `#include <Wire.h>\n`;
  requiredLibs.forEach(l => libs += `#include <${l.replace(/\s/g, '')}.h>\n`);
  
  let defines = `// --- ARDUMASTER PRO GENERATED ---\n// Project: ${projectName}\n// Author: ${username}\n\n`;
  let setup = `void setup() {\n  Serial.begin(${baudRate});\n`;
  let loop = `void loop() {\n`;

  // --- 1. SETUP & GLOBAL ---
  elements.forEach(el => {
    if (el.kind === 'Variable') {
      defines += `${el.varType} ${el.name}${el.sourceSensor ? '' : ` = ${el.value}`};\n`;
    } else if (el.kind === 'Sensor') {
      const s = SENSORS_DB.find(x => x.name === el.type);
      defines += (s?.init(el.name, el.pin, el.pin2) || "") + "\n";
    } else if (el.kind === 'Actuator') {
      const a = ACTUATORS_DB.find(x => x.name === el.type);
      defines += (a?.init(el.name, el.pin) || "") + "\n";
      setup += a?.setup ? `  ${a.setup(el.name, el.pin)}\n` : `  pinMode(${el.pin}, OUTPUT);\n`;
    }
  });

  // --- 2. BACA SENSOR (Selalu di paling atas loop agar data segar) ---
  elements.filter(e => e.kind === 'Sensor').forEach(el => {
      const s = SENSORS_DB.find(x => x.name === el.type);
      loop += `  float val_${el.name} = ${s?.read(el.name)};\n`;
  });

  // --- 3. PROSES EKSEKUSI BERURUTAN ---
  // Kita sisir semua elemen. Hanya Logic dan Utility yang kita tulis di sini sesuai urutan Card.
  loop += `\n  // --- ALUR EKSEKUSI ---\n`;
  elements.forEach(el => {
    // A. Jika ketemu Logika
    if (el.kind === 'Logic') {
        const targetActuator = elements.find(x => x.name === el.target);
        const targetDb = ACTUATORS_DB.find(x => x.name === targetActuator?.type);
        let actCodeTrue = targetDb?.action(el.target, el.actionTrue) || `// Target tidak valid`;
        let actCodeFalse = targetDb?.action(el.target, el.actionFalse) || `// Target tidak valid`;
        loop += `  if (${el.source} ${el.operator} ${el.threshold}) {\n    ${actCodeTrue}\n  } else {\n    ${actCodeFalse}\n  }\n`;
    } 
    // B. Jika ketemu Utilitas (Delay / Print)
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
    // C. Jika ketemu Variable yang butuh update dari sensor
    else if (el.kind === 'Variable' && el.sourceSensor) {
        loop += `  ${el.name} = val_${el.sourceSensor};\n`;
    }
  });

  return `${libs}\n${defines}\n${setup}}\n\n${loop}  delay(100);\n}`;
};