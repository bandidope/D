import fetch from 'node-fetch';

let handler = async (m, { conn }) => {
    const thumbUrl = `https://files.evogb.win/ddfwuH.jpg` 
    const thumbBuffer = await fetch(thumbUrl).then(res => res.buffer());

    let mensaje = `
╭─❏ ✿ *Creador del Bot*
┊ 👤 *Nombre:* Yallico
┊ 🌐 *Fb:* Whois Yallico
┊ 📱 *Instagram:* @whois.yallico
┊ 📞 *WhatsApp:* wa.me/51936994155
╰─❏ ✿`;

    await conn.sendMessage(m.chat, {
        text: mensaje,
        contextInfo: {
            externalAdReply: {
                title: "Creador del Bot",
                body: "Información de contacto",
                thumbnail: thumbBuffer,
                sourceUrl: `xvideos.com` 
            }
        }
    }, { quoted: m })
}

handler.help = ['creador']
handler.tags = ['info']
handler.command = ['creador', 'owner']
handler.owner = false

export default handler