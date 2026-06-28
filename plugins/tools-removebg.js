import fetch from 'node-fetch';

const handler = async (m, {conn, text, usedPrefix, command}) => {
if (!text) throw `*🧑‍💻 Ingresa la URL de la imagen*\n*Ejemplo:* ${usedPrefix + command} https://i.imgur.com/xxx.jpg`;
m.react('🕒');
try {
await conn.reply(m.chat, '*🧑‍💻 Eliminando fondo, espere un momento...*', m);

const res = await fetch(`https://api.betterremovebg.com/v1/removebg?image_url=${encodeURIComponent(text)}`, {
    method: 'GET',
    headers: { 'User-Agent': 'ForThreeBot/1.0' }
});

if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API Error ${res.status}: ${errorText}`);
}

const buffer = await res.buffer();
m.react('☑️');
await conn.sendMessage(m.chat, {
    image: buffer, 
    caption: `𓈒𓏸❀ *Fondo eliminado* 🌀\n> For Three Bot | Gratis`
}, {quoted: m});

} catch (error) {
m.react('❌');
throw `*⚠️ Error:* ${error.message}\n> *Nota:* La URL debe ser directa .jpg .png .webp\n> *Ej:* Sube la imagen a https://catbox.moe primero`;
}
handler.tags = ['tools'];
handler.help = ['removebg <url>'];
handler.command = ['removebg','bg','nobg'];
export default handler;