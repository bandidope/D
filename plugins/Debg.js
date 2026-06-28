// Plugin: Remove Background V4 Local | ILIMITADO
// Usa IA local con rembg. 0 APIs, 0 key, 0 límite
// Uso: Responde a una imagen con .bg
// By I'm Criss XYZ

import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const execAsync = promisify(exec)
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const tmpDir = path.join(__dirname, '../tmp')

if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir)

let handler = async (m, { conn }) => {
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  
  if (!mime) throw '❌ Responde a una imagen con *.bg*'
  if (!/image\/(jpe?g|png|webp)/.test(mime)) throw '❌ Solo imágenes JPG/PNG/WEBP'

  await m.react('⏳')
  
  let inputPath = path.join(tmpDir, `${m.sender}_in.jpg`)
  let outputPath = path.join(tmpDir, `${m.sender}_out.png`)

  try {
    let buffer = await q.download()
    fs.writeFileSync(inputPath, buffer)

    // rembg i input.jpg output.png
    await execAsync(`rembg i "${inputPath}" "${outputPath}"`)
    
    let result = fs.readFileSync(outputPath)
    await conn.sendFile(m.chat, result, 'nobg.png', '✅ *Fondo eliminado Local*\n> 0 APIs | by I\'m Criss XYZ', m)
    
    await m.react('✅')
  } catch (e) {
    console.error(e)
    await m.react('❌')
    throw '❌ Error local. ¿Instalaste `pip install rembg`?'
  } finally {
    // Borra temporales
    if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath)
    if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath)
  }
}

handler.help = ['bg']
handler.tags = ['tools']
handler.command = /^(bg|removebg|nobg)$/i
handler.limit = false // ILIMITADO
export default handler