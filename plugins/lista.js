// =====.lista =====
let handler = async (m, { conn, text }) => {
  if (!text) return m.reply('🏹 Usa:.lista Nombre | Numero | Premio\n ↳ Ej: Eli|+56 9 6507 5648|apk')
  let [nombre, numero, premio] = text.split('|').map(v => v.trim())
  if (!nombre ||!numero ||!premio) return m.reply('Falta un dato bro. Formato: Nombre | Numero | Premio')

  global.sorteoTemp = global.sorteoTemp || {}
  global.sorteoTemp[m.sender] = {nombre, numero, premio}

  let sections = [{
    title: "Selecciona el dia para anotar",
    rows: [
      {title: `🌈 Lunes`, rowId: `.addlunes`},
      {title: `🌈 Martes`, rowId: `.addmartes`},
      {title: `🌈 Miercoles`, rowId: `.addmiercoles`},
      {title: `🌈 Jueves`, rowId: `.addjueves`},
      {title: `🌈 Viernes`, rowId: `.addviernes`},
      {title: `🌈 Sabado`, rowId: `.addsabado`},
      {title: `⭐ Extra`, rowId: `.addextra`},
    ]
  }]

  return conn.sendList(m.chat, '⭐ ღ Sorteo anotado ღ', `Nombre: ${nombre}\nNumero: ${numero}\nPremio: ${premio}`, 'Tocar aquí', sections, m)
}
handler.command = /^lista$/i
export default handler

// ===== Función para no repetir código =====
const addDia = async (m, conn, dia) => {
  let data = global.sorteoTemp?.[m.sender]
  if(!data) return m.reply('Primero usa.lista bro')

  global.db.data.sorteo = global.db.data.sorteo || {lunes:[], martes:[], miercoles:[], jueves:[], viernes:[], sabado:[], extra:[]}
  global.db.data.sorteo[dia].push(data)
  await global.db.write() // <- Esto para que guarde
  delete global.sorteoTemp[m.sender]

  let lista = global.db.data.sorteo[dia].map((v,i)=> `⌗ ${v.nombre} | ${v.numero} | ${v.premio}`).join('\n')
  m.reply(`⨳દᵕ̈૩ *${dia.charAt(0).toUpperCase() + dia.slice(1)}:*\n${lista || '(vacío)'}`)
}

// ===== Los 7 días =====
let addLunes = async (m, {conn}) => addDia(m, conn, 'lunes')
addLunes.command = /^addlunes$/i
export {addLunes}

let addMartes = async (m, {conn}) => addDia(m, conn, 'martes')
addMartes.command = /^addmartes$/i
export {addMartes}

let addMiercoles = async (m, {conn}) => addDia(m, conn, 'miercoles')
addMiercoles.command = /^addmiercoles$/i
export {addMiercoles}

let addJueves = async (m, {conn}) => addDia(m, conn, 'jueves')
addJueves.command = /^addjueves$/i
export {addJueves}

let addViernes = async (m, {conn}) => addDia(m, conn, 'viernes')
addViernes.command = /^addviernes$/i
export {addViernes}

let addSabado = async (m, {conn}) => addDia(m, conn, 'sabado')
addSabado.command = /^addsabado$/i
export {addSabado}

let addExtra = async (m, {conn}) => addDia(m, conn, 'extra')
addExtra.command = /^addextra$/i
export {addExtra}

// =====.verlista =====
let verLista = async (m, {conn}) => {
  global.db.data.sorteo = global.db.data.sorteo || {lunes:[], martes:[], miercoles:[], jueves:[], viernes:[], sabado:[], extra:[]}
  let {lunes, martes, miercoles, jueves, viernes, sabado, extra} = global.db.data.sorteo

  let txt = `🪄 𝗟𝗜𝗦𝗧𝗔 𝗗𝗘 𝗚𝗔𝗡𝗔𝗗𝗢𝗥𝗘𝗦 🪄
»———————> ⚪ <———————«\n\n`

  let dias = {lunes, martes, miercoles, jueves, viernes, sabado, extra}
  for(let dia in dias){
    txt += `⨳દᵕ̈૩ *${dia.charAt(0).toUpperCase() + dia.slice(1)}:*\n`
    txt += dias[dia].length? dias[dia].map(v=> `⌗ ${v.nombre} | ${v.numero} | ${v.premio}`).join('\n') : '🌈 (vacío)'
    txt += '\n\n'
  }
  m.reply(txt.trim())
}
verLista.command = /^verlista$/i
export {verLista}

// =====.eliminarlista =====
let delLista = async (m, {conn, args}) => {
  if(!args[0]) return m.reply('Usa:.eliminarlista lunes/martes/.../todo')
  if(args[0] == 'todo'){
    global.db.data.sorteo = {lunes:[], martes:[], miercoles:[], jueves:[], viernes:[], sabado:[], extra:[]}
    return m.reply('🗑️ Lista borrada completa')
  }
  if(global.db.data.sorteo?.[args[0]]){
    global.db.data.sorteo[args[0]] = []
    m.reply(`🗑️ Lista de ${args[0]} borrada`)
  } else m.reply('Día no válido')
}
delLista.command = /^eliminarlista$/i
export {delLista}