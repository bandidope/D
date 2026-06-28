// Plugin: Remove Background V2 Multi-API
// Comando: .bg | .removebg 
// By I'm Criss XYZ

import fetch from 'node-fetch'
import FormData from 'form-data'

const APIS = [
  'https://api.evogb.org/tools/removebg', // 1. Principal
  'https://api.popcat.xyz/removebg?image=' // 2. Respaldo 1 - Por URL
]

let handler = async (m, { conn }) => {
  let q = m.quoted? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  
  if (!mime) throw '❌ Responde a una imagen con *.bg*'
  if (!/image\/(jpe?g|png)/.test(mime)) throw '❌ Solo JPG/PNG'

  m.react('⏳')
  let img = await q.download()
  let lastError = ''

  for (let api of APIS) {
    try {
      let buffer;
      
      if (api.includes('popcat')) {
        // Popcat pide URL, así que subimos a catbox primero
        let url = await uploadImage(img)
        let res = await fetch(api + encodeURIComponent(url))
        if (!res.ok) throw res.status
        buffer = await res.buffer()
      } else {
        // Evogb pide FormData
        let form = new FormData()
        form.append('image', img, 'img.jpg')
        let res = await fetch(api, { method: 'POST', body: form, headers: form.getHeaders() })
        if (!res.ok) throw res.status
        buffer = await res.buffer()
      }

      await conn.sendFile(m.chat, buffer, 'nobg.png', '✅ *Fondo eliminado* \n> by I\'m Criss XYZ', m)
      return m.react('✅')

    } catch (e) {
      console.log(`Falló ${api}:`, e)
      lastError = e
      continue // Intenta la siguiente API
    }
  }
  
  m.react('❌')
  throw `❌ Todas las APIs fallaron. Intenta más tarde.\n> Error: ${lastError}`
}

// Sube a catbox para usar con Popcat
async function uploadImage(buffer) {
  let form = new FormData()
  form.append('reqtype', 'fileupload')
  form.append('fileToUpload', buffer, 'img.jpg')
  let res = await fetch('https://catbox.moe/user/api.php', { method: 'POST', body: form })
  return await res.text()
}

handler.help = ['bg']
handler.tags = ['tools']
handler.command = /^(bg|removebg|nobg)$/i
handler.limit = false
export default handler