const diasValidos = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'extra']
const emojiDia = '🌀'
const IMAGEN_URL = 'https://raw.githubusercontent.com/bandidope/Fotos/refs/heads/master/fotos/logo.png' // <- PEGA AQUÍ TU LINK DIRECTO.jpg o.png

const getDB = () => {
  if (!global.db?.data) throw new Error('La DB no está sorteo. Reinicia el bot.')
  global.db.data.sorteo = global.db.data.sorteo || {
    lunes: [], 
    martes: [], 
    miercoles: [], 
    jueves: [], 
    viernes: [], 
    sabado: [], 
    extra: []
  }
  return global.db.data.sorteo
}

let handler = async (m, { conn, text, args, isOwner }) => {
  try {
    let db = getDB()
    let sub = args[0]?.toLowerCase()

    // ===== 1..sorteo ver ===== Muestra sorteo con imagen
    if(sub === 'ver' || sub === 'sorteo'){
      let txt = `✨ sorteo DE GANADORES ✨\n»————————> ⚪ <————————«\n\n`
      for(let dia of diasValidos){
        txt += `${emojiDia} ${dia.charAt(0).toUpperCase() + dia.slice(1)}:\n`
        if(db[dia].length > 0){
          txt += db[dia].map(v=> `# ${v.nombre} | ${v.premio} | ${v.numero}`).join('\n')
        } else {
          txt += `# (IG: Whois.yallico)` // Placeholder como tu foto
        }
        txt += '\n\n'
      }
      
      return conn.sendMessage(m.chat, { 
        image: { url: IMAGEN_URL }, 
        caption: txt.trim()
      }, { quoted: m })
    }

    // ===== 2..sorteo eliminar ===== BORRA TODA LA sorteo
    if(sub === 'eliminar'){
      if(!isAdmin return m.reply('⚠️ Solo el owner puede borrar toda la sorteo.')
      if(args[1]!== 'si'){
        return m.reply(`⚠️ *PELIGRO* ⚠️\nEsto borrará TODA la sorteo de los 7 días y no se puede recuperar.\n\nEscribe:.sorteo eliminar si\npara confirmar.`)
      }
      global.db.data.sorteo = {lunes:[], martes:[], miercoles:[], jueves:[], viernes:[], sabado:[], extra:[]}
      await global.db.write()
      return m.reply('🗑️ *sorteo eliminada por completo.* Todos los días quedaron vacíos.')
    }

    // ===== 3..sorteo del lunes 1 ===== Borra 1 solo por número
    if(sub === 'del'){
      let dia = args[1]?.toLowerCase().replace('miércoles', 'miercoles')
      let num = parseInt(args[2]) - 1
      if(!dia || isNaN(num) || num < 0) return m.reply('Usa:.sorteo del lunes 1\n ↳ Dia + Número de la sorteo')
      if(!diasValidos.includes(dia)) return m.reply(`Día inválido. Usa: ${diasValidos.join(', ')}`)
      if(!db?.[dia]?.[num]) return m.reply('Número no válido para ese día.')
      
      let [out] = db[dia].splice(num, 1)
      await global.db.write()
      return m.reply(`🗑️ Eliminado de ${dia}: # ${out.nombre} | ${out.premio}`)
    }

    // ===== 4..sorteo Agregar ===== Formato: Nombre | Premio | Numero | Dia
    if (!text.includes('|')) return m.reply(`🎯 *sorteo For Three*
    
.sorteo Nombre | Premio | Numero | Dia

.sorteo ver -> Ver sorteo
.sorteo del lunes 1 -> Borrar 1

.sorteo eliminar -> Borrar TODO

*Ej:*.sorteo Whois|Bot|+51 936 994 155|extra
*Dias:* ${diasValidos.join(', ')}`)
    
    let [nombre, premio, numero, dia] = text.split('|', 4).map(v => v.trim())
    dia = dia?.toLowerCase().replace('miércoles', 'miercoles')
    
    if (!nombre ||!premio ||!numero ||!diasValidos.includes(dia)) {
      return m.reply(`Falta un dato o día inválido.\n*Dias válidos:* ${diasValidos.join(', ')}`)
    }

    numero = numero.replace(/\s/g, '') // Quita espacios para duplicados
    let existe = Object.values(db).flat().some(x => x.numero.replace(/\s/g,'') === numero)
    if(existe) return m.reply('⚠️ Ese número ya está anotado en algún día.')

    db[dia].push({nombre, premio, numero})
    await global.db.write()
    m.reply(`✅ *Anotado en ${dia.toUpperCase()}*\n# ${nombre} | ${premio} | ${numero}`)

  } catch(e){
    console.log(e) // Mira la consola si falla
    m.reply(`❌ Error: ${e.message}`)
  }
}

handler.help = ['sorteo']
handler.tags = ['main']
handler.command = /^sorteo$/i
export default handler