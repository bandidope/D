// Plugin: Hidetag / Notify V4
// .n responde a un mensaje = lo reenvía + tag a todos
// By I'm Criss XYZ

let handler = async (m, { conn, text, participants, isAdmin, isOwner }) => {
  if (!isAdmin &&!isOwner) throw '❌ *Solo admins*'

  let users = participants.map(u => conn.decodeJid(u.id)).slice(0, 200) // Anti-ban
  let q = m.quoted? m.quoted : null
  
  if (!q) return m.reply('❌ Responde a un mensaje/foto/video con *.n* para reenviarlo')

  let htext = text? `\n\n${text}` : '' // Tu texto extra va abajo

  // CLONA el mensaje citado con todas las menciones
  await conn.copyNForward(m.chat, q.fakeObj, false, {
    mentions: users,
    contextInfo: {
      mentionedJid: users,
      forwardingScore: 256,
      isForwarded: true
    }
  })

  // Si pusiste texto después de .n, lo manda aparte mencionando
  if (text) {
    await conn.sendMessage(m.chat, { 
      text: `> ${users.map(v => '@' + v.split('@')[0]).join(' ')}${htext}`,
      mentions: users 
    })
  }
}

handler.help = ['n <texto opcional>']
handler.tags = ['grupo']
handler.command = /^(n|hidetag|notify|noti|aviso)$/i
handler.admin = true 
handler.group = true
handler.botAdmin = false

export default handler