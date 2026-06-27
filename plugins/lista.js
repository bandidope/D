// =====.lista =====
let handler = async (m, { conn, text }) => {
  if (!text) return m.reply('🏹 Usa:.lista Nombre | Numero | Premio | Dia\n ↳ Ej: Eli|+56 9 6507 5648|apk|lunes')
  
  let [nombre, numero, premio, dia] = text.split('|', 4).map(v => v.trim().toLowerCase()) // <- 4 datos ahora
  dia = dia?.replace('miércoles', 'miercoles') // por si lo escriben con tilde
  
  const diasValidos = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'extra']
  if (!nombre ||!numero ||!premio ||!diasValidos.includes(dia)) {
    return m.reply(`Falta un dato bro. Formato: Nombre | Numero | Premio | Dia
Dias validos: ${diasValidos.join(', ')}`)
  }

  numero = numero.replace(/\s/g, '')
  global.db.data.sorteo = global.db.data.sorteo || {lunes:[], martes:[], miercoles:[], jueves:[], viernes:[], sabado:[], extra:[]}

  // Anti-duplicado
  let existe = Object.values(global.db.data.sorteo).flat().some(x => x.numero === numero)
  if(existe) return m.reply('⚠️ Ese número ya está anotado en algún día.')

  global.db.data.s