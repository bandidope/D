import fetch from 'node-fetch'

let handler = m => m
handler.before = async function (m, { conn }) {
    if (!m.messageStubType ||!m.isGroup) return

    const marca = '*𝐅𝐨𝐫 𝐓𝐡𝐫𝐞 𝐁𝐨𝐭🌀*' // <-- Tu marca

    const fkontak = {
        key: {
            participants: "0@s.whatsapp.net",
            remoteJid: "status@broadcast",
            fromMe: false,
            id: "ForThreeBot"
        },
        message: {
            locationMessage: {
                name: marca,
                jpegThumbnail: await (await fetch('https://raw.githubusercontent.com/bandidope/Fotos/refs/heads/master/fotos/logo.png')).buffer(),
                vcard:
                    "BEGIN:VCARD\n" +
                    "VERSION:3.0\n" +
                    "N:;For Three Bot;;;\n" +
                    "FN:For Three Bot 🌀\n" +
                    "ORG:For Three Developers\n" +
                    "TITLE:\n" +
                    "item1.TEL;waid=51936994155:+51 936 994 155\n" + // FIX 1: Le quité la 't'
                    "item1.X-ABLabel:For Three Bot\n" +
                    "X-WA-BIZ-DESCRIPTION:🚀 Notificador oficial de actividad grupal.\n" +
                    "X-WA-BIZ-NAME:For Three Bot 🌀\n" +
                    "END:VCARD"
            }
        },
        participant: "0@s.whatsapp.net"
    }

    let chat = global.db.data.chats[m.chat]
    if (!chat.detect) return // Si está apagado, no hace nada

    let usuario = `@${m.sender.split`@`[0]}`
    let pp = await conn.profilePictureUrl(m.chat, 'image').catch(_ => 'https://raw.githubusercontent.com/bandidope/Fotos/refs/heads/master/fotos/logo.png')

    let text, mentions = [m.sender]

    switch (m.messageStubType) {
        case 21: // Cambiar nombre
            text = `> ✨ ${usuario} *ha cambiado el nombre del grupo* ✨\n\n> 📝 *Nuevo nombre:* _${m.messageStubParameters[0]}_`
            break
        case 22: // Cambiar foto
            return await conn.sendMessage(m.chat, { image: { url: pp }, caption: `> 📸 *¡Nueva foto de grupo!* 📸\n\n> 💫 Acción realizada por: ${usuario}`, mentions }, { quoted: fkontak })
        case 23: // Nuevo link
            text = `> 🔗 *¡El enlace del grupo ha sido restablecido!* 🔗\n\n> 💫 Acción realizada por: ${usuario}`
            break
        case 25: // Cambiar ajustes
            text = `> ⚙️ ${usuario} ha ajustado la configuración del grupo.\n\n> 🔒 Ahora *${m.messageStubParameters[0] == 'on'? 'solo los administradores' : 'todos'}* pueden configurar el grupo.`
            break
        case 26: // Cerrar/Abrir grupo
            text = `> 🗣️ El grupo ha sido *${m.messageStubParameters[0] == 'on'? 'cerrado' : 'abierto'}* por ${usuario}!\n\n> 💬 Ahora *${m.messageStubParameters[0] == 'on'? 'solo los administradores' : 'todos'}* pueden enviar mensajes.`
            break
        case 29: // Dar admin
            text = `> 👑 @${m.messageStubParameters[0].split`@`[0]} *¡Ahora es administrador del grupo!* 👑\n\n> 💫 Acción realizada por: ${usuario}`
            mentions.push(m.messageStubParameters[0])
            break
        case 30: // Quitar admin
            text = `> 🗑️ @${m.messageStubParameters[0].split`@`[0]} *ha dejado de ser administrador.* 🗑️\n\n> 💫 Acción realizada por: ${usuario}`
            mentions.push(m.messageStubParameters[0])
            break
        default:
            return // FIX 2: Ya no loguea todo, solo lo que importa
    }

    if (text) await conn.sendMessage(m.chat, { text, mentions }, { quoted: fkontak }) // FIX 3: conn en vez de this
}

handler.command = /^(detect)$/i
export default handler