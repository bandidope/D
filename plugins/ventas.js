import fetch from 'node-fetch'
import axios from 'axios'

const imgComprar = 'https://raw.githubusercontent.com/bandidope/Fotos/refs/heads/master/fotos/logo.png'

let handler = async (m, { conn }) => {
    const menu = `︵᷼ ⿻ *For Three* ࣪ ࣭ ࣪ *Wa Bot* ࣭ 🌀 ࣪

✿ *Hᴏʟᴀ* 👋, ¿Quieres Saber Los Precios? ¿O Quieres Revender El Bot? 🥴

𓈒𓏸❀ *PRECIOS FOR THREE BOT* 🇵🇪

𓈒𓏸🌴 *GRUPO PERMANENTE:*
│ ◦ 🌀 Grupo X1 = 5 Soles
│ ◦ 🌀 Grupo X3 = 10 Soles
│ ◦ 🌀 Grupo X5 = 15 Soles

𓈒𓏸🌵 *BOT PERSONALIZADO:*
│ ◦ 🌀 Bot Personalizado ( Termux ) = 18 Soles
│ ◦ 🌀 Servidor Mensual : 10 Soles
│ ◦ 🌀 Archivos Premium Bot = 35 Soles
│ ◦ 🌀 Bot + Servidor = 25 Soles

> ꒰꛱ ͜ *Nota:* Al revender ganarás el 40% de lo que vendas. Menos el producto *Servidor*

> 😸 Creador: Whois Yallico +51 936 994 155

https://chat.whatsapp.com/LjPhgjqCM934QEzYz3vrVk`

    await conn.sendMessage(m.chat, {
      image: { url: imgComprar },
      caption: menu,
      mentions: [m.sender]
    }, { quoted: m })
}
handler.help = ['comprar']
handler.tags = ['main']
handler.command = /^(comprar|buy|precios)$/i
export default handler