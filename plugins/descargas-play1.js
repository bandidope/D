/**
 * 📂 COMANDO: Uchiha YouTube MP3 Downloader
 * 📝 DESCRIPCIÓN: Extrae y descarga el audio de YouTube con el mapeo del JSON de la API.
 * 👤 CREADOR: Barboza Developer
 * ⚡ CANAL: Barboza Developer x Zona Developers
 * 🔌 API: https://api.evogb.org
 */
import fetch from "node-fetch"

let handler = async (m, { conn, text, usedPrefix, command }) => {
    const key = Buffer.from('c2FzdWtl', 'base64').toString('utf-8')
    if (!text) return conn.reply(m.chat, `*☁️ Uchiha Cloud Download*\n\n*Uso correcto:*\n> *${usedPrefix + command} https://youtu.be/XXXXXX*`, m)

    await m.react('⏳')
    try {
        let resDl = await fetch(`https://api.evogb.org/dl/ytmp3?url=${encodeURIComponent(text)}&key=${key}`)
        let jsonDl = await resDl.json()
        if (!jsonDl.status || !jsonDl.data || !jsonDl.data.dl) {
            await m.react('❌')
            return m.reply('❌ Error al procesar la descarga del audio de YouTube.')
        }

        let { title, thumbnail, author, dl, quality } = jsonDl.data
        let info = `*☁️ Uchiha Cloud - Audio Localizado*\n\n📌 *Título:* ${title}\n👤 *Canal:* ${author?.name || 'Desconocido'}\n💿 *Calidad:* ${quality || '128kbps'}\n\n📂 *COMANDO:* Uchiha YouTube MP3 Downloader\n👤 *CREADOR:* Barboza Developer\n⚡ *CANAL:* Barboza Developer x Zona Developers\n🔌 *API:* https://api.evogb.org`

        if (thumbnail) {
            await conn.sendMessage(m.chat, { image: { url: thumbnail }, caption: info }, { quoted: m })
        } else {
            await conn.reply(m.chat, info, m)
        }

        await conn.sendMessage(m.chat, { audio: { url: dl }, mimetype: 'audio/mpeg', fileName: `${title}.mp3` }, { quoted: m })
        await m.react('✅')
    } catch (e) {
        await m.react('❌')
        m.reply('❌ Ocurrió un error interno en los servidores de Uchiha Cloud.')
    }
}

handler.help = ['ytmp3']
handler.tags = ['downloader']
handler.command = /^(ytmp3|yta|playmp3)$/i

export default handler