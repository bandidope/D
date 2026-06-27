import fs from 'fs'
import path from 'path'

const diasSemana = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado']
const diasValidos = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'extra']
const diasBorrar = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado']
const emojiDia = '🌀'
const IMAGEN_URL = 'https://raw.githubusercontent.com/bandidope/Fotos/refs/heads/master/fotos/logo.png'
const MARCA = 'For Three Bot 🌀'
const TZ = 'America/Lima'
const MAX_USOS = 3

// <- AUDIOS LOCALES. 0 ERROR DE LINK
const AUDIO_NORMAL = fs.readFileSync('./storage/AudioNormal.mp3')
const AUDIO_DOMINGO = fs.readFileSync('./storage/audioDomingo.mp3')

const getDB = () => {
  global.db.data.sorteo??= {lunes:[], martes:[], miercoles:[], jueves:[], viernes:[], sabado:[], extra:[]}
  return global.db.data.sorteo
}

const getHoy = () => {
  let dia = new Date().toLocaleString('en-US', { timeZone: TZ, weekday: 'long' }).toLowerCase()
  return { diaReal: dia, diaDB: dia === 'domingo'? 'extra' : dia, esDomingo: dia === 'domingo' }
}

let handler = async (m, { conn, text, args, isAdmin, isOwner }) => {
  await conn.sendMessage(m.chat, { react: { text: '🌀', key: m.key } }).catch(_=>{})

  let db = getDB()
  let sub = args[0]?.toLowerCase()
  let { diaReal, diaDB, esDomingo } = getHoy()

  if(sub === 'ver' || sub === 'lista'){
    let txt = `🌀 GANADORES 🌀\n»————————> ⚪ <————————«\n`
    for(let dia of diasValidos){
      txt += `\n${emojiDia} ${dia.charAt(0).toUpperCase() + dia.slice(1)}:\n`
      if(db[dia]?.length > 0){
        txt += db[dia].map((v,i)=> {
          let emojiFinal = v.tipo === 'domingo'? '🛒' : v.tipo === 'manual'? '📦' : ''
          return `# ${v.nombre} / ${v.numero} / ${v.premio} ${emojiFinal}`.trim()
        }).join('\n')
      } else {
        txt += `# (${MARCA})`
      }
    }
    try {
      return await conn.sendMessage(m.chat, { image: { url: IMAGEN_URL }, caption: txt.trim() }, { quoted: m })
    } catch(e) {
      return m.reply(`⚠️ Falló la imagen. Te mando solo texto:\n\n${txt.trim()}`)
    }
  }

  if(sub === 'eliminar'){
    if(!m.isGroup) return m.reply('⚠️ Este comando solo funciona en grupos.')
    if(!isAdmin &&!isOwner) return m.reply('⚠️ Solo los *admins* del grupo pueden borrar toda la lista.')
    if(args[1]!== 'si') return m.reply(`⚠️ *PELIGRO*\nEsto borrará Lunes a Sábado.\n*EXTRA se queda intacto.*\n\nEscribe:.sorteo eliminar si\npara confirmar.`)
    for(let dia of diasBorrar){ db[dia] = [] }
    await global.db.write()
    return m.reply('🗑️ *Lista Lunes-Sábado eliminada.*\n*EXTRA se mantuvo.*')
  }

  if (!text.includes('/')) return m.reply(`🎯 *SORTEO GRUPO*
.sorteo Nombre / Numero / Premio
.sorteo Nombre / Numero / Premio / extra
*Auto: ${diaDB.toUpperCase()}* | Máx: ${MAX_USOS} en Lunes-Sab
.sorteo ver |.sorteo eliminar`)

  let partes = text.split('/').map(v => v.trim())
  let [nombre, numero, premio, diaForzado] = partes
  let dia = diaForzado?.toLowerCase() === 'extra'? 'extra' : diaDB
  let tipo = dia === 'extra'? (esDomingo? 'domingo' : 'manual') : ''

  if (!nombre ||!numero ||!premio) {
    return m.reply(`Formato mal.\nUsa:.sorteo Nombre / Numero / Premio`)
  }

  numero = numero.replace(/\s/g, '')

  if(dia!== 'extra'){
    let usos = Object.values(db).flat().filter(x => x.numero.replace(/\s/g,'') === numero && x.tipo!== 'domingo' && x.tipo!== 'manual').length
    if(usos >= MAX_USOS) return m.reply(`⛔ *Rechazado*\nEl número ${numero} ya llegó a ${MAX_USOS}/3 usos en Lunes-Sab.\nUsa /extra si quieres anotarlo igual.`)
  }

  db[dia]??= []
  db[dia].push({nombre, premio, numero, tipo})
  await global.db.write()

  let emojiTag = dia === 'extra'? (esDomingo? '🛒' : '📦') : '✅'
  let contador = dia === 'extra'? '' : ` [${(Object.values(db).flat().filter(x => x.numero === numero && x.tipo!== 'domingo' && x.tipo!== 'manual').length)}/3]`
  let msg = `${emojiTag} *Anotado en ${dia.toUpperCase()}${contador}*\n# ${nombre} / ${numero} / ${premio}`

  let audioBuffer = esDomingo? AUDIO_DOMINGO : AUDIO_NORMAL
  // <- Mandamos el Buffer directo. WhatsApp ya no se queja
  await conn.sendMessage(m.chat, { audio: audioBuffer, mimetype: 'audio/mpeg', ptt: true }, { quoted: m })

  m.reply(msg)
}

handler.help = ['sorteo']
handler.tags = ['main']
handler.command = /^sorteo$/i
handler.group = true
export default handler