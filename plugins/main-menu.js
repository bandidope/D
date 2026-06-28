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

// Tu logo de Vans
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

    let menu = `╭─♡─✧─♡─✧─♡─✧─♡─╮\n`;
    menu += ` ${saludo} ${tag} ✨\n`;
    menu += `╰─♡─✧─♡─✧─♡─✧─♡─╯\n\n`;
    menu += `❀ STORM BOT ࿐ྂ 🇦🇱\n`;
    menu += `╰─➤ Creador: Whois Yallico\n`;
    menu += `╰─➤ Nivel: ${level} ✧ Exp: ${exp - min}/${xp}\n`;
    menu += `╰─➤ Activo: ${uptime}\n`;
    menu += `╰─➤ Usuarios: ${totalreg}\n\n`;

    for (const [category, cmds] of Object.entries(categorizedCommands)) {
      if (cmds.length > 0) {
        menu += `◆─〔 ${category.toUpperCase()} 〕\n`;
        menu += cmds.map(cmd => `├─ ${cmd}`).join('\n') + '\n╰─────────\n\n';
      }
    }

    menu += `> 😸 Repórta errores con el Creador +51 936 994 155\n`;

    await conn.sendMessage(m.chat, {
      image: { url: imgMenu },
      caption: menu,
      mentions: [m.sender]
    }, { quoted: m });

  } catch (e) {
    console.error('❌ Error en el menú:', e);
    await conn.reply(m.chat, `⚠️ Error al cargar el menú.`, m);
  }
};

handler.help = ['menu'];
handler.tags = ['main'];
handler.command = ['menu', 'help', 'menú'];
export default handler;