import fetch from 'node-fetch'

export async function before(m, { conn, isAdmin, isBotAdmin }) {
    if (!m.isGroup) return
    let chat = global.db.data.chats[m.chat]
    if (!chat.detect) return // Necesitas tener.on detect

    const marca = '*𝐅𝐨𝐫 𝐓𝐡𝐫𝐞 𝐁𝐨𝐭🌀*'

    const fkontak = {
        key: { participants: "0@s.whatsapp.net", remoteJid: "status@broadcast", fromMe: false, id: "ForThreeBot" },
        message: { locationMessage: { name: marca, jpegThumbnail: await (await fetch('https://raw.githubusercontent.com/bandidope/Fotos/refs/heads/master/fotos/logo.png')).buffer().catch(_=>null), vcard: "BEGIN:VCARD\nVERSION:3.0\nN:;For Three Bot;;;\nFN:For Three Bot 🌀\nEND:VCARD" } },
        participant: "0@s.whatsapp.net"
    }

    // 1. DETECTAR CAMBIOS DE GRUPO: Nombre, Foto, Anuncio
    if (m.messageStubType && m.messageStubType!== 21 && m.messageStubType!== 22 && m.messageStubType!== 25 && m.messageStubType!== 26) return

    let pp = await conn.profilePictureUrl(m.chat, 'image').catch(_ => 'https://raw.githubusercontent.com/bandidope/Fotos/refs/heads/master/fotos/logo.png')
    let usuario = `@${(m.participant || m.key.participant || m.sender).split`@`[0]}`

    if (m.messageStubType == 21) { // Nombre
        let name = m.messageStubParameters[0]
        await conn.sendMessage(m.chat, { text: `> ✨ ${usuario} *cambió el nombre del grupo*\n\n> 📝 *Nuevo:* _${name}_`, mentions: [usuario+'@s.whatsapp.net'] }, { quoted: fkontak })
    }
    if (m.messageStubType == 22) { // Foto
        await conn.sendMessage(m.chat, { image: { url: pp }, caption: `> 📸 *¡Nueva foto de grupo!*\n\n> 💫 Por: ${usuario}`, mentions: [usuario+'@s.whatsapp.net'] }, { quoted: fkontak })
    }
    if (m.messageStubType == 25) { // Settings
        let on = m.messageStubParameters[0] === 'on'
        await conn.sendMessage(m.chat, { text: `> ⚙️ ${usuario} cambió los ajustes.\n\n> 🔒 Ahora *${on? 'solo admins' : 'todos'}* pueden editar info.`, mentions: [usuario+'@s.whatsapp.net'] }, { quoted: fkontak })
    }
    if (m.messageStubType == 26) { // Anuncio
        let on = m.messageStubParameters[0] === 'on'
        await conn.sendMessage(m.chat, { text: `> 🗣️ El grupo fue *${on? 'cerrado' : 'abierto'}* por ${usuario}!\n\n> 💬 Ahora *${on? 'solo admins' : 'todos'}* pueden escribir.`, mentions: [usuario+'@s.whatsapp.net'] }, { quoted: fkontak })
    }
}

export async function participantsUpdate({ id, participants, action }) {
    let chat = global.db.data.chats[id]
    if (!chat.detect) return
    if (!global.conn) return

    const marca = '*𝐅𝐨𝐫 𝐓𝐡𝐫𝐞 𝐁𝐨𝐭🌀*'
    const fkontak = { key: { participants: "0@s.whatsapp.net", remoteJid: "status@broadcast", fromMe: false, id: "ForThreeBot" }, message: { locationMessage: { name: marca, vcard: "BEGIN:VCARD\nVERSION:3.0\nN:;For Three Bot;;;\nFN:For Three Bot 🌀\nEND:VCARD" } }, participant: "0@s.whatsapp.net" }

    let botNumber = await global.conn.decodeJid(global.conn.user.id)
    let metadata = await global.conn.groupMetadata(id)

    for (let user of participants) {
        let pp = await global.conn.profilePictureUrl(user, 'image').catch(_ => 'https://raw.githubusercontent.com/bandidope/Fotos/refs/heads/master/fotos/logo.png')

        if (action == 'promote') { // Dar admin
            let txt = `> 👑 @${user.split`@`[0]} *¡Ahora es administrador!* 👑`
            await global.conn.sendMessage(id, { text: txt, mentions: [user] }, { quoted: fkontak })
        }
        if (action == 'demote') { // Quitar admin
            let txt = `> 🗑️ @${user.split`@`[0]} *ya no es administrador.* 🗑️`
            await global.conn.sendMessage(id, { text: txt, mentions: [user] }, { quoted: fkontak })
        }
    }
}
export default function() {}