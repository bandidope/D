// Plugin: Hidetag / Notify by I'm Criss XYZ
// V2 Optimizado | Anti-Crash | Solo Admins
// Comandos: #hidetag #notify #n #aviso #avisar #noti #notificar #notif

let handler = async (m, { conn, text, participants, isAdmin }) => {
  if (!isAdmin) throw '❌ *Solo administradores* by I\'m Criss XYZ'

  let users = participants.map(u => conn.decodeJid(u.id))
  let q = m.quoted? m.quoted : m
  let mime = (q.msg || q).mimetype || q.mediaType || ''
  let isMedia = /image|video|sticker|audio/.test(mime)
  let htext = text? text : '🔔 *Notificación para todos*'

  try {
    if (isMedia && q.download) {
      let media = await q.download?.()
      let type = mime.split('/')[0]

      if (type === 'sticker') {
        // Los stickers no aceptan caption, se manda aparte
        await conn.sendMessage(m.chat, { sticker: media }, { quoted: m })
        await conn.sendMessage(m.chat, { text: htext, mentions: users }, { quoted: m })
      } else {
        await conn.sendMessage(m.chat, {
          [type]: media,
          caption: htext,
          mentions: users
        }, { quoted: m })
      }
    } else {
      // Solo texto
      await conn.sendMessage(m.chat, {
        text: htext,
        mentions: users
      }, { quoted: m })
    }
  } catch (e) {
    console.log(e)
    // Si falla la media, manda solo texto mencionando a todos
    await conn.sendMessage(m.chat, { text: htext, mentions: users }, { quoted: m })
  }
}

handler.help = ['hidetag', 'notify', 'n', 'aviso']
handler.tags = ['grupo']
handler.command = /^(hidetag|notify|n|noti|notificar|notif|aviso|avisar)$/i
handler.admin = true
handler.group = true

export default handler