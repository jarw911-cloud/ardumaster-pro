export const generateExplanation = (elements: any[], board: string) => {
  if (elements.length === 0) return "Belum ada komponen yang ditambahkan ke Workspace.";

  let intro = `Proyek ini menggunakan papan **${board}** sebagai otak utama. `;
  let sensorSection = `### 1. Input (Sensor)\n`;
  let logicSection = `### 2. Alur Logika (Otak)\n`;
  let utilitySection = `### 3. Tambahan (Utilitas)\n`;

  const sensors = elements.filter(e => e.kind === 'Sensor');
  const logics = elements.filter(e => e.kind === 'Logic');
  const utilities = elements.filter(e => e.kind === 'Utility');
  const variables = elements.filter(e => e.kind === 'Variable');

  // Penjelasan Sensor
  if (sensors.length > 0) {
    sensors.forEach(s => {
      sensorSection += `* **${s.name}**: Menggunakan sensor **${s.type}**. Mikrokontroler akan membaca data dari Pin **${s.pin}**${s.pin2 ? ` dan Pin **${s.pin2}**` : ''} secara terus-menerus.\n`;
    });
  } else {
    sensorSection += `* Tidak ada sensor yang digunakan.\n`;
  }

  // Penjelasan Variabel
  if (variables.length > 0) {
    sensorSection += `\n**Variabel Penyimpanan:**\n`;
    variables.forEach(v => {
      if (v.sourceSensor) {
        sensorSection += `* Data dari **${v.sourceSensor}** akan disimpan otomatis ke dalam variabel \`${v.name}\` (tipe ${v.varType}).\n`;
      } else {
        sensorSection += `* Variabel \`${v.name}\` disiapkan dengan nilai awal \`${v.value}\`.\n`;
      }
    });
  }

  // Penjelasan Logika
  if (logics.length > 0) {
    logics.forEach((l, i) => {
      logicSection += `${i + 1}. **Syarat**: Jika nilai dari **${l.source}** terpantau **${l.operator} ${l.threshold}**,\n`;
      logicSection += `    * **Maka**: Perangkat **${l.target}** akan diperintahkan ke kondisi **${l.actionTrue}**.\n`;
      logicSection += `    * **Jika Tidak**: Perangkat **${l.target}** akan tetap/kembali ke kondisi **${l.actionFalse}**.\n`;
    });
  } else {
    logicSection += `* Belum ada logika otomatis yang diatur.\n`;
  }

  // Penjelasan Utilitas
  if (utilities.length > 0) {
    utilities.forEach(u => {
      if (u.type === 'Delay') {
        utilitySection += `* Program akan berhenti sejenak (Pause) selama **${u.value} milidetik** di titik ini sebelum lanjut ke perintah berikutnya.\n`;
      } else {
        utilitySection += `* Mengirimkan pesan \`"${u.value}"\` ${u.source ? `beserta nilai dari **${u.source}**` : ''} ke Serial Monitor untuk dipantau di laptop.\n`;
      }
    });
  } else {
    utilitySection = ""; // Sembunyikan jika kosong
  }

  return `${intro}\n\n${sensorSection}\n${logicSection}\n${utilitySection}\n\n**Kesimpulan:** Program ini bekerja dengan cara membaca input sensor, mengolahnya sesuai aturan logika di atas, dan memberikan perintah kepada perangkat output (aktuator) secara berulang-ulang (looping).`;
};