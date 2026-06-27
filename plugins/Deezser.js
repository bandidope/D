const diasValidos = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo']
const emojiDia = '🌀'
const IMAGEN_URL = 'https://raw.githubusercontent.com/bandidope/Fotos/refs/heads/master/fotos/logo.png' // <- PEGA TU LINK AQUI. Debe ser.jpg.png directo

const getDB = () => {
  if (!global.db?.data) throw new Error('La DB no está lista. Reinicia el bot.')
  global.db.data.sorteo = global.db.data.sorteo || {lunes:[], martes:[], miercoles:[], jueves:[], viernes:[], sabado:[], domingo:[]}
  return global.db.data.sorteo
}

let handler = async (m, { conn, text, args }) => {
  try {
    let db = getDB()
    let sub = args[0]?.toLowerCase()

    // =====.sorteo ver ===== Con imagen
    if(sub === 'ver' || sub === 'lista'){
      let txt = `✨ LISTA DE GANADORES ✨\n»————————> ⚪ <————————«\n\n`
      for(let dia of diasValidos){
        txt += `${emojiDia} ${dia.charAt(0).toUpperCase() + dia.slice(1)}:\n`
        txt += db[dia].length > 0? db[dia].map(v=> `# ${v.nombre} | ${v.premio} | ${v.numero}`).join('\n') : `# (IG: Whois.yallico)`
        txt += '\n\n'
      }
      
      // <- ESTO MANDA LA IMAGEN + TEXTO
      return conn.sendMessage(m.chat, { 
        image: { url: IMAGEN_URL }, 
        caption: txt.trim(),
        mentions: [m.sender] // para que te etiquete
      }, { quoted: m })
    }

    // =====.sorteo del lunes 1 =====
    if(sub === 'del'){
      let dia = args[1]?.toLowerCase().replace('miércoles', 'miercoles')
      let num = parseInt(args[2]) - 1
      if(!dia || isNaN(num) || num < 0) return m.reply('Usa:.sorteo del lunes 1')
      if(!db?.[dia]?.[num]) return m.reply('Día o número no válido')
      let [out] = db[dia].splice(num, 1)
      await global.db.write()
      return m.reply(`🗑️ Eliminado de ${dia}: # ${out.nombre} | ${out.premio}`)
    }

    // =====.sorteo Agregar =====
    if (!text.includes('|')) return m.reply(`🎯 *SORTEO*
.sorteo Nombre | Premio | Numero | Dia
.sorteo ver -> Ver lista con imagen
.sorteo del lunes 1 -> Borrar
Dias: ${diasValidos.join(', ')}`)
    
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

  } catch(e){
    console.log(e)
    m.reply(`❌ Error: ${e.message}\nRevisa que el link de la imagen sea directo`)
  }
}

handler.help = ['sorteo']
handler.tags = ['main']
handler.command = /^sorteo$/i
export default handler