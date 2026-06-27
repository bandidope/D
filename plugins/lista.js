import fs from 'fs'
const dbFile = './database/sorteo.json'
const admins = ['51936994155@s.whatsapp.net'] // <- Pon aquí el número del bot/staff sin +

const loadDB = () => fs.existsSync(dbFile)? JSON.parse(fs.readFileSync(dbFile)) : { dias: {} }
const saveDB = (data) => fs.writeFileSync(dbFile, JSON.stringify(data, null, 2))
const isAdmin = (sender) => admins.includes(sender)

let handler = async (m, { sock, text }) => {
  if (!text.includes('|')) {
    return m.reply(`🚫 𝗙𝗼𝗿𝗺𝗮𝘁𝗼 𝗶𝗻𝗰𝗼𝗿𝗲𝗰𝘁𝗼

─⋆ 𝑼𝒔𝒆 🍄
.lista tu nombre | número del ganador | premio

─⋆ 𝑬𝒋𝒆𝒎𝒑𝒍𝒐 ✅
.lista Eli | +56 9 6507 5648 | apk`)
  }

  let [nombre, numero, premio] = text.split('|').map(v => v.trim())
  numero = numero.replace(/\s/g, '')

  global.sorteoTemp = global.sorteoTemp || {}
  global.sorteoTemp[m.sender] = { nombre, numero, premio }

  const buttons = [
    {buttonId: '.dia lunes', buttonText: {displayText: '↩️ ˚₊⋆🏹 Lunes'}, type: 1},
    {buttonId: '.dia martes', buttonText: {displayText: '↩️ ˚₊⋆🍿 Martes'}, type: 1},
    {buttonId: '.dia miercoles', buttonText: {displayText: '↩️ ˚₊⋆🌷 Miercoles'}, type: 1},
    {buttonId: '.dia jueves', buttonText: {displayText: '↩️ ˚₊⋆🫧 Jueves'}, type: 1},
    {buttonId: '.dia viernes', buttonText: {displayText: '↩️ ˚₊⋆🌐 Viernes'}, type: 1}, // Gris si no es admin
    {buttonId: '.dia sabado', buttonText: {displayText: '↩️ ˚₊⋆🌈 Sabado'}, type: 1},
    {buttonId: '.dia extra', buttonText: {displayText: '↩️ ˚₊⋆⭐ Extra'}, type: 1},
  ]

  await sock.sendMessage(m.chat, {
    text: `★.꒰ঌ Sorteo anotado 🧍‍♀️🧍‍♀️
    °°₊.+.° ✧ °₊.+.°°

—★🌈 *Nombre:* ${nombre}
—★🧺 *Numero:* ${numero}
—★🍒 *Premio:* ${premio}

** Selecciona el dia para anotar`,
    footer: 'Staff KittyRolls',
    buttons: buttons,
    headerType: 1
  }, { quoted: m })
}
handler.command = /^(lista)$/i
export default handler


let diaHandler = async (m, { sock, args }) => {
  const dia = args[0]?.toLowerCase()
  const diasValidos = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'extra']
  if (!diasValidos.includes(dia)) return
  
  // Bloquear viernes si no es admin
  if (dia === 'viernes' &&!isAdmin(m.sender)) {
    return m.reply('🚫 *Viernes bloqueado.* Solo staff puede anotar.')
  }
  
  const data = global.sorteoTemp?.[m.sender]
  if (!data) return m.reply('Primero usa.lista nombre | numero | premio')

  const db = loadDB()
  db.dias[dia] = db.dias[dia] || []
  db.dias[dia].push(`${data.nombre}/${data.numero}/${data.premio}`)
  saveDB(db)
  delete global.sorteoTemp[m.sender]

  m.reply(`★.꒰ঌ Sorteo anotado 🧍‍♀️🧍‍♀️\n\n—★🌈 *Nombre:* ${data.nombre}\n—★🧺 *Numero:* ${data.numero}\n—★🍒 *Premio:* ${data.premio}\n\n*Anotado para:* ${dia.charAt(0).toUpperCase() + dia.slice(1)}`)
}
diaHandler.command = /^(dia)$/i
export { diaHandler }


let verLista = async (m, { sock }) => {
  const db = loadDB()
  let txt = `+. ✨ 🍒 *Lista de ganadores*\n\n∞-----∞-----∞-----∞\n\n`
  txt += `˖.★🏹 *Anotar asi*\n*Numero|Nombre|Premio*\n⟵★ ▸ Ejemplo\n*Rosee|+541131533445|Cali*\n\n`

  for (const dia of ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'extra']) {
    txt += `˖+!! ☀️ ${dia.charAt(0).toUpperCase() + dia.slice(1)}\n`
    if (db.dias[dia]?.length) {
      db.dias[dia].forEach(x => txt += `★🌈 ${x}\n`)
    } else {
      txt += `★🌈 (Jota el mejor)\n`
    }
    txt += `\n`
  }
  m.reply(txt)
}
verLista.command = /^(listaganadores|ganadores)$/i
export { verLista }


// --- NUEVO: Borrar una entrada --- Solo admin
let borrar = async (m, { args }) => {
  if (!isAdmin(m.sender)) return m.reply('🚫 Solo staff')
  const [dia, num] = args
  const db = loadDB()
  if (!db.dias[dia] ||!db.dias[dia][num-1]) return m.reply('No existe esa entrada')
  
  let eliminado = db.dias[dia].splice(num-1, 1)
  saveDB(db)
  m.reply(`🗑️ Eliminado de ${dia}: ${eliminado[0]}`)
}
borrar.command = /^(borrarlista)$/i
borrar.help = ['borrarlista viernes 2'] // día + número de línea
export { borrar }