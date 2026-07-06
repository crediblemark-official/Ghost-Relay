import { chatCompletion } from './ai-chat.js'

const VALID_FOLDERS = ['Kontrak', 'Desain', 'Dokumen_Teknis', 'Laporan', 'Lainnya']

export async function classifyFolder(
  filename: string,
  chatContext: string,
  userId?: number,
): Promise<string> {
  try {
    const answer = await chatCompletion('', [
      {
        role: 'user',
        content: `Berdasarkan konteks chat berikut:\n${chatContext}\n\nDan nama file: ${filename}\nTentukan folder terbaik untuk file ini. Pilih HANYA SATU dari: ${VALID_FOLDERS.join(', ')}\nBalas hanya dengan nama folder, tanpa penjelasan.`,
      },
    ], { temperature: 0.1, userId })
    for (const v of VALID_FOLDERS) {
      if (answer.toLowerCase().includes(v.toLowerCase())) return v
    }
  } catch { /* fallback */ }
  return 'Lainnya'
}

export async function extractIntent(
  commandText: string,
  userId?: number,
): Promise<Record<string, string>> {
  try {
    const content = await chatCompletion('', [
      {
        role: 'user',
        content: `Teks: ${commandText}
Ekstrak informasi berikut dan kembalikan dalam format JSON:
{
  "platform": "WhatsApp, Telegram, Slack, atau All",
  "receiver": "nama grup atau penerima",
  "message": "isi pesan yang akan dikirim"
}
Kembalikan SATU objek JSON dan TIDAK ADA teks lain di luar JSON.`,
      },
    ], { responseFormat: { type: 'json_object' }, temperature: 0.2, userId })
    return JSON.parse(content)
  } catch {
    return { platform: '', receiver: '', message: commandText, error: 'intent_extraction_failed' }
  }
}

export async function decomposeTasks(
  text: string,
  userId?: number,
): Promise<Record<string, unknown>> {
  try {
    const content = await chatCompletion('', [
      {
        role: 'user',
        content: `Kamu adalah asisten AI yang bertugas mengubah transkrip voice note rapat menjadi daftar tugas yang terstruktur.
Ekstrak informasi berikut dari teks yang diberikan dan kembalikan **hanya dalam format JSON** yang valid.

Schema JSON yang harus diikuti:
{
  "ringkasan": "string, ringkasan keseluruhan voice note dalam 1-2 kalimat",
  "tanggal_deadline": "string atau null, format YYYY-MM-DD jika disebutkan",
  "daftar_tugas": [
    {
      "divisi": "string, divisi yang bertanggung jawab (backend, frontend, desain, qa, devops, atau general)",
      "deskripsi": "string, deskripsi tugas yang jelas dan ringkas",
      "prioritas": "string, salah satu dari: tinggi, sedang, rendah"
    }
  ]
}

Aturan:
- Jika sebuah field tidak disebutkan dalam teks, gunakan null.
- Jangan menambahkan fakta atau informasi yang tidak ada dalam teks.
- Kembalikan SATU objek JSON dan TIDAK ADA teks lain di luar JSON.
- Gunakan kata-kata asli dari teks sebisa mungkin.

Teks Voice Note:
${text}`,
      },
    ], { temperature: 0.2, responseFormat: { type: 'json_object' }, userId })
    return JSON.parse(content)
  } catch {
    return { ringkasan: '', tanggal_deadline: null, daftar_tugas: [] }
  }
}
