import { xpRange } from '../lib/levelling.js';

const clockString = ms => {
  const h = isNaN(ms) ? '--' : Math.floor(ms / 3600000);
  const m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60;
  const s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60;
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
};

const saludarSegunHora = () => {
  const hora = new Date().getHours();
  if (hora >= 5 && hora < 12) return '🌅 ¡Buenos días!';
  if (hora >= 12 && hora < 19) return '☀️ ¡Buenas tardes!';
  return '🌙 ¡Buenas noches!';
};

// Pon acá tu link de Catbox o Imgur del logo de Storm
const imgMenu = 'https://raw.githubusercontent.com/bandidope/Fotos/refs/heads/master/fotos/logo.png'; 

const handler = async (m, { conn, usedPrefix }) => {
  try {
    const tag = `@${m.sender.split('@')[0]}`;
    const saludo = saludarSegunHora();
    const user = global.db.data.users[m.sender] || {};
    const { exp = 0, level = 1 } = user;
    const { min, xp } = xpRange(level, global.multiplier || 1);
    const totalreg = Object.keys(global.db.data.users || {}).length;
    const uptime = clockString(process.uptime() * 1000);

    const categorizedCommands = {};
    for (const plugin of Object.values(global.plugins)) {
      if (plugin?.help && !plugin.disabled) {
        const tags = Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags || 'otros'];
        const cmds = Array.isArray(plugin.help) ? plugin.help : [plugin.help];
        const tagName = tags[0];
        if (!categorizedCommands[tagName]) categorizedCommands[tagName] = [];
        cmds.forEach(cmd => categorizedCommands[tagName].push(usedPrefix + cmd));
      }
    }

    let menu = `${saludo} ${tag} ✨\n\n`;
    menu += `︵᷼     ⿻ *Storm* ࣪   ࣭ ࣪ *Wa Bot* ࣭  🐈 ࣪\n`;
    menu += `✿ *Hᴏʟᴀ ${tag}*\n*${saludo}*\n`;
    menu += `> ꒰꛱ ͜Desarrollado por *Whois Yallico* +51 936 994 155\n`;
    menu += `𓈒𓏸🌴 *Bot Name:* Storm Bot 🇦🇱\n`;
    menu += `*𓈒𓏸🌵 *Nivel:* ${level} | *Exp:* ${exp - min}/${xp}\n`;
    menu += `*𓈒𓏸🌵 *Activo:* ${uptime}\n`;
    menu += `*𓈒𓏸🍃 *Usuarios:* ${totalreg}\n\n`;

    for (const [category, cmds] of Object.entries(categorizedCommands)) {
      if (cmds.length > 0) {
        menu += `*❒ ${category.toUpperCase()}*\n`;
        menu += cmds.map(cmd => `│ ◦ ${cmd}`).join('\n') + '\n\n';
      }
    }
    
    menu += `> 😸 Si encuentras un comando con errores repórtalo con el Creador\n`;

    await conn.sendMessage(m.chat, {
      image: { url: imgMenu },
      caption: menu,
      mentions: [m.sender]
    }, { quoted: m });

  } catch (e) {
    console.error('❌ Error en el menú:', e);
    // Si falla la imagen, manda solo texto
    await conn.reply(m.chat, `⚠️ Error con la imagen. Te mando el menú en texto:\n\n${menu}`, m);
  }
};

handler.help = ['menu'];
handler.tags = ['main'];
handler.command = ['menu', 'help', 'menú'];
export default handler;