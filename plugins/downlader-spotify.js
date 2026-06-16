import fetch from 'node-fetch'

const handler = async (m, { conn, args, command, usedPrefix }) => {

if (!args[0]) return m.reply(`🌙 INGRESE UN ENLACE O NOMBRE DE SPOTIFY\n> *Ejemplo:* ${usedPrefix + command} Lupita`)

try {
let query = args.join(" ")
let searchResponse = await fetch(`https://sylphy.xyz/search/spotify?q=${encodeURIComponent(query)}&api_key=sylphy-6f150d`)
let searchData = await searchResponse.json()

if (!searchData.status || !searchData.result || searchData.result.length === 0) {
return m.reply(`🌙 No se encontraron resultados para su búsqueda.`)
}

let trackUrl = searchData.result[0].url

let downloadResponse = await fetch(`https://sylphy.xyz/download/spotify?url=${encodeURIComponent(trackUrl)}&api_key=sylphy-6f150d`)
let downloadData = await downloadResponse.json()

if (!downloadData.status) {
return m.reply(`🌙 Error al obtener el archivo de descarga.`)
}

let result = downloadData.result
let imagen = result.album.images[0].url
let artistas = result.artists.map(a => a.name).join(', ')

let info = `\`𝚂𝙿𝙾𝚃𝙸𝙵𝚈 𝑋 𝙳𝙴𝚂𝙲𝙰𝚁𝙶𝙰\`.\n\n`
info += `☪︎ *Título:* ${result.name}\n`
info += `☪︎ *Artista:* ${artistas}\n`
info += `☪︎ *ID:* ${result.id}\n`
info += `───── ･ ｡ﾟ☆: *.☽ .* :☆ﾟ. ─────`

await conn.sendFile(m.chat, imagen, 'spotify.jpg', info, m)

await conn.sendMessage(m.chat, { 
audio: { url: result.download_url }, 
mimetype: 'audio/mpeg',
fileName: `${result.name}.mp3`
}, { quoted: m })

} catch (e) {
console.error(e)
m.reply(`🌙 Ocurrió un error inesperado al procesar el JSON.`)
}
}

handler.command = ['spotifydl', 'spdl', 'spotify']

export default handler
