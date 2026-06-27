const diasSemana = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado']
const diasValidos = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'extra']
const diasBorrar = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado']
const emojiDia = '🌀'
const IMAGEN_URL = 'https://raw.githubusercontent.com/bandidope/Fotos/refs/heads/master/fotos/logo.png'
const MARCA = 'For Three Bot 🌀'
const TZ = 'America/Lima'

// <- TUS AUDIOS DIRECTOS
const AUDIO_NORMAL = 'https://raw.githubusercontent.com/bandidope/Fotos/refs/heads/master/fotos/AudioNormal.mp3' // Lunes-Sab + /extra manual
const AUDIO_DOMINGO = 'https://raw.githubusercontent.com/bandidope/Fotos/refs/heads/master/fotos/AudioDomingo.mp3' // Solo Domingo 🛒

const getDB = () => {
  global.db.data.sorteo??= {lunes:[], martes:[], miercoles:[], jueves:[], viernes:[], sabado:[], extra:[]}
  return global.db.data.sorteo
}

const getHoy = () => {
  let dia = new Date().toLocaleString('en-US', { timeZone: TZ, weekday: 'long' }).toLowerCase() // <- FIX: ya no usa numeric
  return { diaReal: dia, diaDB: dia === 'domingo'? 'extra' : dia, esDomingo: dia === 'domingo' }
}

let handler = async (m, { conn, text, args, isAdmin, isOwner }) => {
  let db = getDB()
  let sub = args[0]?.toLowerCase()
  let { diaReal, diaDB, esDomingo } = getHoy()

  // =====.sorteo ver ===== Con emojis en EXTRA
  if(sub === 'ver' || sub === 'lista'){
    let txt = `🌀 GANADORES 🌀\n»————————> ⚪ <————————«\n`
    for(let dia of diasValidos){
      txt += `\n${emojiDia} ${dia.charAt(0).toUpperCase() + dia.slice(1)}:\n`
      if(db[dia].length > 0){
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

  // =====.sorteo eliminar ===== Solo borra Lunes-Sab
  if(sub === 'eliminar'){
    if(!m.isGroup) return m.reply('⚠️ Este comando solo funciona en grupos.')
    if(!isAdmin &&!isOwner) return m.reply('⚠️ Solo los *admins* del grupo pueden borrar toda la lista.')
    if(args[1]!== 'si') return m.reply(`⚠️ *PELIGRO*\nEsto borrará Lunes a Sábado.\n*EXTRA se queda intacto.*\n\nEscribe:.sorteo eliminar si\npara confirmar.`)
    for(let dia of diasBorrar){ db[dia] = [] }
    await global.db.write()
    return m.reply('🗑️ *Lista Lunes-Sábado eliminada.*\n*EXTRA se mantuvo.*')
  }

  // =====.sorteo Agregar =====
  if (!text.includes('/')) return m.reply(`🎯 *SORTEO GRUPO*
.sorteo Nombre / Numero / Premio
.sorteo Nombre / Numero / Premio / extra
*Auto: ${diaDB.toUpperCase()}*
.sorteo ver |.sorteo eliminar`)

  let partes = text.split('/').map(v => v.trim())
  let [nombre, numero, premio, diaForzado] = partes
  let dia = diaForzado?.toLowerCase() === 'extra'? 'extra' : diaDB
  let tipo = dia === 'extra'? (esDomingo? 'domingo' : 'manual') : '' // <- Guarda tipo para el emoji

  if (!nombre ||!numero ||!premio) {
    return m.reply(`Formato mal.\nUsa:.sorteo Nombre / Numero / Premio`)
  }

  numero = numero.replace(/\s/g, '')
  let existe = Object.values(db).flat().some(x => x.numero.replace(/\s/g,'') === numero)
  if(existe) return m.reply('⚠️ Ese número ya está anotado.')

  db[dia].push({nombre, premio, numero, tipo})
  await global.db.write()

  let emojiTag = dia === 'extra'? (esDomingo? '🛒' : '📦') : '✅'
  let msg = `${emojiTag} *Anotado en ${dia.toUpperCase()}*\n# ${nombre} / ${numero} / ${premio}`

  // <- AUDIO TODOS LOS DIAS. DOMINGO SUENA OTRO
  let audioUsar = esDomingo? AUDIO_DOMINGO : AUDIO_NORMAL
  await conn.sendMessage(m.chat, { audio: { url: audioUsar }, mimetype: 'audio/mpeg', ptt: true }, { quoted: m })

  m.reply(msg)
}

handler.help = ['sorteo']
handler.tags = ['main']
handler.command = /^sorteo$/i
handler.group = true
export default handler