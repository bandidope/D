const diasValidos = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo']
const emojiDia = '🌀'
const IMAGEN_URL = 'https://raw.githubusercontent.com/bandidope/Fotos/refs/heads/master/fotos/logo.png' // <- IMAGEN DE PRUEBA. Cambiala después

const getDB = () => {
  global.db.data.sorteo??= {lunes:[], martes:[], miercoles:[], jueves:[], viernes:[], sabado:[], domingo:[]}
  return global.db.data.sorteo
}

let handler = async (m, { conn, text, args, isOwner }) => {
  let db = getDB()
  let sub = args[0]?.toLowerCase()

  // =====.sorteo ver =====
  if(sub === 'ver' || sub === 'lista'){
    let txt = `🌀 GANADORES 🌀\n»————————> ⚪ <————————«\n\n`
    for(let dia of diasValidos){
      txt += `${emojiDia} ${dia.charAt(0).toUpperCase() + dia.slice(1)}:\n`
      txt += db[dia].length > 0? db[dia].map((v,i)=> `#${i+1} ${v.nombre} | ${v.premio} | ${v.numero}`).join('\n') : `# (For Three Bot 🌀)`
      txt += '\n\n'
    }
    
    try {
      return await conn.sendMessage(m.chat, { 
        image: { url: IMAGEN_URL }, 
        caption: txt.trim()
      }, { quoted: m })
    } catch(e) {
      console.log('Error Imagen:', e.message)
      return m.reply(`⚠️ Falló la imagen. Te mando solo texto:\n\n${txt.trim()}`) // <- No crashea
    }
  }

  // =====.sorteo eliminar =====
  if(sub === 'eliminar'){
    if(!isAdmin) return m.reply('⚠️ Solo los administradores pueden eliminar.')
    if(args[1]!== 'si') return m.reply(`⚠️ *PELIGRO*\nEscribe:.sorteo eliminar si\npara borrar TODO.`)
    global.db.data.sorteo = {lunes:[], martes:[], miercoles:[], jueves:[], viernes:[], sabado:[], domingo:[]}
    await global.db.write()
    return m.reply('🗑️ Lista eliminada por completo.')
  }

  // =====.sorteo del lunes 1 =====
  if(sub === 'del'){
    let dia = args[1]?.toLowerCase().replace('miércoles', 'miercoles')
    let num = parseInt(args[2]) - 1
    if(!dia || isNaN(num)) return m.reply('Usa:.sorteo del lunes 1')
    if(!db?.[dia]?.[num]) return m.reply('Número no válido.')
    let [out] = db[dia].splice(num, 1)
    await global.db.write()
    return m.reply(`🗑️ Eliminado de ${dia}: # ${out.nombre}`)
  }

  // =====.sorteo Agregar =====
  if (!text.includes('|')) return m.reply(`🎯 *SORTEO*
.sorteo Nombre | Premio | Numero | Dia
.sorteo ver -> Ver lista
.sorteo del lunes 1 -> Borrar 1
.sorteo eliminar -> Borrar TODO`)
  
  let [nombre, premio, numero, dia] = text.split('|', 4).map(v => v.trim())
  dia = dia?.toLowerCase().replace('miércoles', 'miercoles')
  
  if (!nombre ||!premio ||!numero ||!diasValidos.includes(dia)) {
    return m.reply(`Dato inválido.\nDias: ${diasValidos.join(', ')}`)
  }

  numero = numero.replace(/\s/g, '')
  let existe = Object.values(db).flat().some(x => x.numero.replace(/\s/g,'') === numero)
  if(existe) return m.reply('⚠️ Ese número ya está anotado.')

  db[dia].push({nombre, premio, numero})
  await global.db.write()
  m.reply(`✅ *Anotado en ${dia.toUpperCase()}*\n# ${nombre} | ${premio} | ${numero}`)
}

handler.command = /^sorteo$/i
export default handler