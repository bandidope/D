let handler = async (m, { conn, text }) => {
  if (!global.owner.some(([id]) => id === m.sender.split('@')[0])) throw '❌ Solo el Owner'

  let id = text? text : m.chat
  let chat = global.db.data.chats[id] || {}
  const marca = 'For Three Bot' // <-- Tu marca

  try {
    if (global.db.data.chats[id]) chat.welcome = false

    let ownerMention = `@${m.sender.split('@')[0]}`
    let txt = `🚩 *${marca} 🌀* Abandona El Grupo\nFué Genial Estar Aquí ${ownerMention} 👋`

    await conn.reply(id, txt, null, { mentions: [m.sender] }) // Te menciona al salir
    await delay(1500)
    await conn.groupLeave(id)

    if (global.db.data.chats[m.chat]) global.db.data.chats[m.chat].welcome = true

  } catch (e) {
    console.log(e)
    await m.reply(`❌ Error: ${e.message || e}`)
    if (global.db.data.chats[m.chat]) global.db.data.chats[m.chat].welcome = true
  }
}

handler.command = /^(salir|leavegc|salirdelgrupo|leave)$/i
handler.group = true
handler.rowner = true
handler.help = ['salir [id]']
handler.tags = ['owner']

const delay = ms => new Promise(res => setTimeout(res, ms))
export default handler