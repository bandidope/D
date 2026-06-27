const diasValidos = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo']
const emojiDia = '※εϋ3'

const getDB = () => {
  global.db.data.sorteo = global.db.data.sorteo || {lunes:[], martes:[], miercoles:[], jueves:[], viernes:[], sabado:[], domingo:[]}
  return global.db.data.sorteo
}

// =====.lista ===== Solo para agregar
let handler = async (m, { conn, text }) => {
  if (!text.includes('|')) return m.reply(`🎯 *Formato*
.lista Nombre | Premio | Numero | Dia
↳ Ej: Cotti|Cali|+54 9 3513 61-6547|domingo`)
  
  let [nombre, premio, numero, dia] = text.split('|', 4).map(v => v.trim())
  dia = dia?.toLowerCase().replace('miércoles', 'miercoles')
  
  if (!nombre ||!premio ||!numero ||!diasValidos.includes(dia)) {
    return m.reply(`Falta un dato o día inválido.\nDias: ${diasValidos.join(', ')}`)
  }

  let db = getDB()
  numero = numero.replace(/\s/g, '')

  let existe = Object.values(db).flat().some(x => x.numero.replace(/\s/g,'') === numero)
  if(existe) return m.reply('⚠️ Ese número ya está anotado.')

  db[dia].push({nombre, premio, numero})
  await global.db.write()

  m.reply(`✅ *Anotado en ${dia.toUpperCase()}*\n# ${nombre} | ${premio} | ${numero}`)
}
handler.command = /^lista$/i // <- Solo.lista
export default handler

// =====.ganadores ===== Solo para ver
let ganadores = async (m, {conn}) => {
  let db = getDB()
  let txt = `✨ LISTA DE GANADORES ✨\n»————————> ⚪ <————————«\n\n`

  for(let dia of diasValidos){
    txt += `${emojiDia} ${dia.charAt(0).toUpperCase() + dia.slice(1)}:\n`
    if(db[dia].length){
      txt += db[dia].map(v=> `# ${v.nombre} | ${v.premio} | ${v.numero}`).join('\n')
    } else {
      txt += `# (IG: Jotaa.hrz)`
    }
    txt += '\n\n'
  }
  m.reply(txt.trim())
}
ganadores.command = /^(ganadores|verlista)$/i // <- FIX: Aquí estaba el error
export {ganadores}

// =====.dellista =====
let del = async (m, {conn, args}) => {
  let [dia, num] = args
  num = parseInt(num)
  if(!dia ||!num) return m.reply('Usa:.dellista lunes 1')
  
  let db = getDB()
  dia = dia.toLowerCase().replace('miércoles', 'miercoles')
  num = num - 1
  
  if(db?.[dia]?.[num]){
    let [out] = db[dia].splice(num, 1)
    await global.db.write()
    m.reply(`🗑️ Eliminado de ${dia}: # ${out.nombre} | ${out.premio}`)
  } else m.reply('Día o número no válido')
}
del.command = /^dellista$/i
export {del}