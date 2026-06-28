import fg from 'api-dylux'
import fetch from 'node-fetch'
import axios from 'axios'

// Tu logo de Vans
const imgComprar = 'https://raw.githubusercontent.com/bandidope/Fotos/refs/heads/master/fotos/logo.png'

let handler = async (m, { conn, args, command, usedPrefix }) => {
if (!args[0]) {
  let menu = `︵᷼ ⿻ *For Three* ࣪ ࣭ ࣪ *Wa Bot* ࣭ 🌀 ࣪\n\n`;
  menu += `✿ *Hᴏʟᴀ* 👋, ¿Quieres Saber Los Precios? ¿O Quieres Revender El Bot? 🥴\n\n`;
  menu += `𓈒𓏸❀ *PRECIOS FOR THREE BOT* 🇵🇪\n\n`;
  menu += `𓈒𓏸🌴 *GRUPO PERMANENTE:*\n`;
  menu += `│ ◦ 🌀 Grupo X1 = 5 Soles\n`;
  menu += `│ ◦ 🌀 Grupo X3 = 10 Soles\n`;
  menu += `│ ◦ 🌀 Grupo X5 = 15 Soles\n`;
  menu += `𓈒𓏸🌵 *BOT PERSONALIZADO:*\n`;
  menu += `│ ◦ 🌀 Bot Personalizado ( Termux ) = 18 Soles\n`;
  menu += `│ ◦ 🌀 Servidor Mensual : 10 Soles\n`;
  menu += `│ ◦ 🌀 Archivos Premium Bot = 35 Soles\n`;
  menu += `│ ◦ 🌀 Bot + Servidor = 25 Soles\n`;
  menu += `> ꒰꛱ ͜ *Nota:* Al revender ganarás el 40% de lo que vendas. Menos el producto *Servidor*\n\n`;
  menu += `> 😸 Creador: Whois Yallico +51 936 994 155\n\n`;
  menu += `https://chat.whatsapp.com/Fi6FHZ8VSGnAT7CKJkcd9r?mode=gi_t`;

  await conn.sendMessage(m.chat, {
    image: { url: imgComprar },
    caption: menu,
    mentions: [m.sender]
  }, { quoted: m });
}
handler.help = ['comprar']
handler.tags = ['main']
handler.command = /^(comprar|buy|precios)$/i
handler.group = false
handler.admin = false
export default handler