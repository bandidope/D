const diasValidos = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo']
const emojiDia = '※εϋ3'

const getDB = () => {
  global.db.data.sorteo = global.db.data.sorteo || {lunes:[], martes:[], miercoles:[], jueves:[], viernes:[], sabado:[], domingo:[]}
  return global.db.data.sorteo
}

let handler = async (m, { conn, text, command, args }) => {
  let db = getDB()
  let sub = args[0]?.toLowerCase() //.sorteo agregar / ver / del

  // =====.sorteo ver ===== Formato de tu foto
  if(sub === 'ver' || sub === 'lista'){
    let txt = `✨ LISTA DE GANADORES ✨\n»————————> ⚪ <————————«\n\n`
    for(let dia of diasValidos){
      txt += `${emojiDia} ${dia.charAt(0).toUpperCase() + dia.slice(1)}:\n`
      txt += db[dia].length? db[dia].map(v=> `# ${v.nombre} | ${v.premio} | ${v.numero}`).join('\n') : `# (IG: Jotaa.hrz)`
      txt += '\n\n'
    }
    return m.reply(txt.trim())
  }

  // =====.sorteo del lunes 1 =====
  if(sub === 'del'){
    let [_, dia, num] = args
    num = parseInt(num)
    if(!dia ||!num) return m.reply('Usa:.sorteo del lunes 1')
    dia = dia.toLowerCase().replace('miércoles', 'miercoles')
    num = num - 1
    if(db?.[dia]?.[num]){
      let [out] = db[dia].splice(num, 1)
      await global.db.write()
      return m.reply(`🗑️ Eliminado de ${dia}: # ${out.nombre} | ${out.premio}`)
    } else return m.reply('Día o número no válido')
  }

  // =====.sorteo Nombre | Premio | Numero | Dia =====
  if (!text.includes('|')) return m.reply(`🎯 *SORTEO MICKEY PRO*
.sorteo Nombre | Premio | Numero | Dia
.sorteo ver -> Ver lista
.sorteo del lunes 1 -> Borrar

↳ Ej:.sorteo Cotti|Cali|+54 9 3513 61-6547|domingo`)
  
  let [nombre, premio, numero, dia] = text.split('|', 4).map(v => v.trim())
  dia = dia?.toLowerCase().replace('miércoles', 'miercoles')
  
  if (!nombre ||!premio ||!numero ||!diasValidos.includes(dia)) {
    return m.reply(`Falta un dato o día inválido.\nDias: ${diasValidos.join(', ')}`)
  }

  numero = numero.replace(/\s/g, '')
  let existe = Object.values(db).flat().some(x => x.numero.replace(/\s/g,'') === numero)
  if(existe) return m.reply('⚠️ Ese número ya está anotado.')

  db[dia].push({nombre, premio, numero})
  await global.db.write()
  m.reply(`✅ *Anotado en ${dia.toUpperCase()}*\n# ${nombre} | ${premio} | ${numero}`)
}

handler.command = /^sorteo$/i // <- UN SOLO COMANDO
export default handler