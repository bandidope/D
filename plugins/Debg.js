// Plugin: Remove Background V3
// API: remove.bg Key Publica de Prueba | 50 usos/mes
// Uso: Responde a una imagen con .bg
// By I'm Criss XYZ

import fetch from 'node-fetch'
import FormData from 'form-data'

let handler = async (m, { conn }) => {
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || q.mediaType || ''
  
  if (!mime) throw '❌ Responde a una imagen con *.bg*'
  if (!/image\/(jpe?g|png|webp)/.test(mime)) throw '❌ Solo imágenes JPG/PNG/WEBP'
  if (q.fileLength > 10000000) throw '❌ Imagen muy pesada. Máx 10MB'

  await m.react('⏳')

  try {
    let img = await q.download()
    if (!img) throw '❌ No pude descargar la imagen'

    let form = new FormData()
    form.append('image_file', img, { filename: 'image.png', contentType: mime })
    form.append('size', 'auto') // auto = mejor recorte

    let res = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: { 
        'X-Api-Key': 'qK6VJz5P7R3x8W2n', // Key gratis 50/mes
        ...form.getHeaders()
      },
      body: form
    })

    if (!res.ok) {
      let err = await res.json().catch(() => res.text())
      throw `API Error ${res.status}: ${JSON.stringify(err)}`
    }
    
    let buffer = await res.buffer()
    await conn.sendFile(m.chat, buffer, 'nobg.png', '✅ *Fondo eliminado*\n> by I\'m Criss XYZ', m)
    await m.react('✅')

  } catch (e) {
    console.error(e)
    await m.react('❌')
    if (String(e).includes('402')) throw '❌ Se acabaron los 50 usos gratis de la key. Toca usar V4 Local.'
    throw '❌ Falló al quitar el fondo. Intenta con otra imagen menos pesada.'
  }
}

handler.help = ['bg']
handler.tags = ['tools', 'image']
handler.command = /^(bg|removebg|nobg|quitafondo)$/i
handler.limit = false
handler.premium = false
handler.group = false

export default handler