// Plugin: Remove Background V1.1
// Comando: .bg | .removebg | .nobg 
// Uso: Responde a una imagen con .bg
// API: https://api.evogb.org/tools/removebg
// By I'm Criss XYZ

import fetch from 'node-fetch'
import FormData from 'form-data'

let handler = async (m, { conn }) => {
  let q = m.quoted? m.quoted : m
  let mime = (q.msg || q).mimetype || q.mediaType || ''
  
  if (!mime) throw '❌ Responde a una imagen con *.bg*'
  if (!/image\/(jpe?g|png|webp)/.test(mime)) throw '❌ Manda o responde solo a imágenes JPG/PNG/WEBP'

  m.react('⏳')

  try {
    let img = await q.download?.()
    if (!img) throw '❌ No pude descargar la imagen'

    let form = new FormData()
    form.append('image', img, { filename: 'image.jpg', contentType: mime })

    let res = await fetch('https://api.evogb.org/tools/removebg', {
      method: 'POST',
      headers: form.getHeaders(),
      body: form
    })

    if (res.status !== 200) throw `❌ API Error: ${res.status}`
    
    let data = await res.buffer()
    
    await conn.sendFile(m.chat, data, 'nobg.png', '✅ *Fondo eliminado* \n> by I\'m Criss XYZ', m)
    m.react('✅')

  } catch (e) {
    console.error(e)
    m.react('❌')
    m.reply('❌ Falló al quitar el fondo. La imagen pesa mucho o la API está caída. Intenta con otra.')
  }
}

handler.help = ['bg']
handler.tags = ['tools', 'image']
handler.command = /^(bg|removebg|nobg|quitafondo)$/i
handler.limit = false
handler.premium = false
handler.group = false
handler.private = false

export default handler