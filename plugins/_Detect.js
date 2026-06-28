import fetch from 'node-fetch'

const marca = '*𝐅𝐨𝐫 𝐓𝐡𝐫𝐞 𝐁𝐨𝐭🌀*'
const fkontak = {
    key: { participants: "0@s.whatsapp.net", remoteJid: "status@broadcast", fromMe: false, id: "FTB" },
    message: { contactMessage: { displayName: marca, vcard: "BEGIN:VCARD\nVERSION:3.0\nFN:For Three Bot 🌀\nEND:VCARD", jpegThumbnail: await (await fetch('https://raw.githubusercontent.com/bandidope/Fotos/refs/heads/master/fotos/logo.png')).buffer().catch(_=>null) } },
    participant: "0@s.whatsapp.net"
}

// 1. WELCOME + BYE [Entra/Sale]
export async function participantsUpdate({ id, participants, action }) {
    if (!global.conn) return
    let metadata = await global.conn.groupMetadata(id).catch(_ => null)
    if (!metadata) return

    for (let user of participants) {
        let pp = await global.conn.profilePictureUrl(user, 'image').catch(_ => 'https://raw.githubusercontent.com/bandidope/Fotos/refs/heads/master/fotos/logo.png')
        let userMention = `@${user.split`@`[0]}`

        if (action == 'add') {
            let text = `> 👋 *Bienvenido(a)* ${userMention}\n\n> 📛 *Grupo:* ${metadata.subject}\n> 👥 *Miembros:* ${metadata.participants.length}\n\n> 🌀 ${marca} activo`
            await global.conn.sendMessage(id, { image: { url: pp }, caption: text, mentions:  }, { quoted: fkontak })
        }
        if (action == 'remove' || action == 'leave') {
            let text = `> 👋 *Se fue del grupo* ${userMention}\n\n> 🌀 ${marca}`
            await global.conn.sendMessage(id, { text, mentions:  }, { quoted: fkontak })
        }
        if (action == 'promote') {
            let text = `> 👑 ${userMention} *¡Ahora es administrador!* 👑`
            await global.conn.sendMessage(id, { text, mentions:  }, { quoted: fkontak })
        }
        if (action == 'demote') {
            let text = `> 🗑️ ${userMention} *ya no es administrador.* 🗑️`
            await global.conn.sendMessage(id, { text, mentions:  }, { quoted: fkontak })
        }
    }
}

// 2. DETECT [Nombre/Foto/Cerrar/SoloAdmins]
export async function before(m, { conn }) { 
    if (!m.isGroup || m.mtype!== 'groupUpdateNotification') return
    
    let user = `@${m.participant.split`@`[0]}`
    let pp = await conn.profilePictureUrl(m.chat, 'image').catch(_ => 'https://raw.githubusercontent.com/bandidope/Fotos/refs/heads/master/fotos/logo.png')
    let type = m.message.groupUpdateNotification.type
    let txt = ''

    if (type == 'subject') txt = `> ✨ ${user} *cambió el nombre*\n\n> 📝 *Nuevo:* _${m.message.groupUpdateNotification.subject}_`
    if (type == 'icon') return await conn.sendMessage(m.chat, { image: { url: pp }, caption: `> 📸 *¡Nueva foto de grupo!*\n\n> 💫 Por: ${user}`, mentions:  }, { quoted: fkontak })
    if (type == 'announce') txt = `> 🗣️ Grupo *${m.message.groupUpdateNotification.announce == 'true'? 'cerrado' : 'abierto'}* por ${user}`
    if (type == 'restrict') txt = `> ⚙️ ${user} cambió ajustes. Ahora *${m.message.groupUpdateNotification.restrict == 'true'? 'solo admins' : 'todos'}* editan info.`
    
    if(txt) await conn.sendMessage(m.chat, { text: txt, mentions:  }, { quoted: fkontak })
}
export default () => true