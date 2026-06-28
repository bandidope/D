import fetch from 'node-fetch';
import FormData from 'form-data'; // <-- Esto faltaba

const handler = async (m, {conn, text, usedPrefix, command}) => {
if (!text) throw `*🧑‍💻 Ingresa la URL de la imagen*\n*Ejemplo:* ${usedPrefix + command} https://i.imgur.com/xxx.jpg`;
m.react('🕒');

const APIKEY = 'pZoqmwkwmMSJAVdJFDnMgWB8' // <-- Pon tu nueva key aquí, NO la expongas

try {
await conn.reply(m.chat, '*🧑‍💻 Eliminando fondo, espere un momento...*', m);

const formData = new FormData();
formData.append("size", "auto");
formData.append("image_url", text);

const response = await fetch("https://api.remove.bg/v1.0/removebg", {
method: "POST",
headers: { "X-Api-Key": APIKEY },
body: formData,
});

if (!response.ok) {
    const err = await response.text();
    throw new Error(`Remove.bg: ${err}`);
}

const buffer = await response.buffer(); // <-- .buffer() es mejor en node
m.react('☑️');
await conn.sendMessage(m.chat, {image: buffer, caption: `𓈒𓏸❀ *Listo ${m.pushName}* 🌀\n> For Three Bot`}, {quoted: m});

} catch (error) {
m.react('❌');
throw `*⚠️ Error:* ${error.message}`;
}
handler.tags = ['tools'];
handler.help = ['removebg <url>'];
handler.command = ['removebg','bg','nobg'];
export default handler;