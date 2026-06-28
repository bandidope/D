import fetch from 'node-fetch'

export async function before(m, { conn }) { 
    if (!m.isGroup) return // <-- Ya no pide chat.detect
    
    let chat = global.db.data.chats[m.chat]
    if (chat.detect === false) return // <-- Solo se apaga si pones .off detect manual

    const marca = '*𝐅𝐨𝐫 𝐓𝐡𝐫𝐞 𝐁𝐨𝐭🌀*'
    const fkontak = {
        key: { participants: "0@s.whatsapp.net", remoteJid: "status@broadcast", fromMe: false, id: "FTB" },
        message: { contactMessage: { displayName: marca, vcard: "BEGIN:VCARD\nVERSION:3.0\nFN:For Three Bot 🌀\nEND:VCARD", jpegThumbnail: await (await fetch('https://raw.githubusercontent.com/bandidope/Fotos/refs/heads/master/fotos/logo.png')).buffer().catch(_=>null) } },
        participant: "0@s.whatsapp.net"
    }
    
    // DETECTA: nombre, foto, cerrar/abrir, solo admins
    if (m.mtype == 'groupUpdateNotification') {
        let user = `@${m.participant.split`@`[0]}`
        let pp = await conn.profilePictureUrl(m.chat, 'image').catch(_ => 'https://raw.githubusercontent.com/bandidope/Fotos/refs/heads/master/fotos/logo.png')
        let type = m.message.groupUpdateNotification.type
        let txt = ''

        if (type == 'subject') txt = `> ✨ ${user} *cambió el nombre del grupo*\n\n> 📝 *Nuevo:* _${m.message.groupUpdateNotification.subject}_`
        if (type == 'icon') return await conn.sendMessage(m.chat, { image: { url: pp }, caption: `> 📸 *¡Nueva foto de grupo!*\n\n> 💫 Por: ${user}`, mentions:  }, { quoted: fkontak })
        if (type == 'announce') txt = `> 🗣️ El grupo fue *${m.message.groupUpdateNotification.announce == 'true'? 'cerrado' : 'abierto'}* por ${user}!\n\n> 💬 Ahora *${m.message.groupUpdateNotification.announce == 'true'? 'solo admins' : 'todos'}* pueden escribir.`
        if (type == 'restrict') txt = `> ⚙️ ${user} cambió los ajustes.\n\n> 🔒 Ahora *${m.message.groupUpdateNotification.restrict == 'true'? 'solo admins' : 'todos'}* pueden editar info.`
        
        if(txt) await conn.sendMessage(m.chat, { text: txt, mentions:  }, { quoted: fkontak })
    }
}

export async function participantsUpdate({ id, participants, action }) {
    let chat = global.db.data.chats[id]
    if (chat.detect === false || !global.conn) return // <-- Solo se apaga si es false

    const marca = '*𝐅𝐨𝐫 𝐓𝐡𝐫𝐞 𝐁𝐨𝐭🌀*'
    const fkontak = { key: { participants: "0@s.whatsapp.net", remoteJid: "status@broadcast", fromMe: false, id: "FTB" }, message: { contactMessage: { displayName: marca, vcard: "BEGIN:VCARD\nVERSION:3.0\nFN:For Three Bot 🌀\nEND:VCARD" } }, participant: "0@s.whatsapp.net" }

    for (let user of participants) {
        if (action == 'promote') {
            let txt = `> 👑 @${user.split`@`[0]} *¡Ahora es administrador!* 👑`
            await global.conn.sendMessage(id, { text: txt, mentions:  }, { quoted: fkontak })
        }
        if (action == 'demote') {
            let txt = `> 🗑️ @${user.split`@`[0]} *ya no es administrador.* 🗑️`
            await global.conn.sendMessage(id, { text: txt, mentions:  }, { quoted: fkontak })
        }
    }
}
export default () => true