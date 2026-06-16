import { xpRange } from '../lib/levelling.js';
import axios from 'axios';

const clockString = ms => {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor(ms / 60000) % 60;
  const s = Math.floor(ms / 1000) % 60;
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
};

const saludarSegunHora = () => {
  const hora = new Date().getHours();
  if (hora >= 5 && hora < 12) return '🌅 ¡Buenos días!';
  if (hora >= 12 && hora < 19) return '☀️ ¡Buenas tardes!';
  return '🌙 ¡Buenas noches!';
};

// Imagen Actualizada y Diseño Didier Bot
const imgDidier = 'https://files.catbox.moe/dpofx7.jpg';
const borderTop = '╭╾━━━━╼ 〔 ⚡ 〕 ╾━━━━╼╮';
const borderBottom = '╰╾━━━━╼ 〔 🚀 〕 ╾━━━━╼╯';

const menuFooter = `
${borderTop}
┃  ✨ *𝐃𝐈𝐃𝐈𝐄𝐑 𝐁𝐎𝐓 𝐒𝐘𝐒𝐓𝐄𝐌*
┃  🛠️ *By Didier Developers*
┃  ⚡ *Power & Speed*
${borderBottom}
`.trim();

Array.prototype.getRandom = function () {
  return this[Math.floor(Math.random() * this.length)];
};

const handler = async (m, { conn, usedPrefix }) => {
  try {
    const saludo = saludarSegunHora();
    const user = global.db.data.users[m.sender] || { level: 1, exp: 0, limit: 5 };
    const { exp, level, limit } = user;
    const { min, xp } = xpRange(level, global.multiplier || 1);
    const totalUsers = Object.keys(global.db.data.users).length;
    const uptime = clockString(process.uptime() * 1000);
    const tagUsuario = `@${m.sender.split('@')[0]}`;
    const userName = (await conn.getName?.(m.sender)) || tagUsuario;

    const adText = ["Didier System", "Interface V3", "Cyber Bot"].getRandom();

    let thumbnailBuffer;
    try {
      const response = await axios.get(imgDidier, { responseType: 'arraybuffer' });
      thumbnailBuffer = Buffer.from(response.data);
    } catch {
      thumbnailBuffer = Buffer.alloc(0);
    }

    const fkontak = {
      key: { participants: "0@s.whatsapp.net", fromMe: false, id: "DidierBot" },
      message: {
        locationMessage: {
          name: adText,
          jpegThumbnail: thumbnailBuffer,
          vcard: "BEGIN:VCARD\nVERSION:3.0\nN:;Didier;;;\nFN:Didier\nORG:DidierBot\nEND:VCARD"
        }
      },
      participant: "0@s.whatsapp.net"
    };

    let categorizedCommands = {};
    Object.values(global.plugins)
      .filter(p => p?.help && !p.disabled)
      .forEach(p => {
        const tag = Array.isArray(p.tags) ? p.tags[0] : p.tags || 'Otros';
        const cmds = Array.isArray(p.help) ? p.help : [p.help];
        categorizedCommands[tag] = categorizedCommands[tag] || new Set();
        cmds.forEach(cmd => categorizedCommands[tag].add(usedPrefix + cmd));
      });

    // Diseño de Emojis por Categoría - Full Variados
    const categoryEmojis = {
      anime: '🏮', info: 'ℹ️', search: '🔭', diversión: '🎮', subbots: '🤖',
      rpg: '🛡️', registro: '📝', sticker: '🎭', imagen: '🖼️', logo: '💎',
      premium: '👑', configuración: '⚙️', descargas: '📥', herramientas: '🛠️',
      nsfw: '🔞', 'base de datos': '📁', audios: '🎵', freefire: '🔫', 
      group: '👥', owner: '💻', otros: '🧩'
    };

    const menuBody = Object.entries(categorizedCommands).map(([title, cmds]) => {
      const emoji = categoryEmojis[title.toLowerCase()] || '🔹';
      const list = [...cmds].map(cmd => `┃  ⚡ ${cmd}`).join('\n');
      return `╭╾━━╼ 〔 ${emoji} *${title.toUpperCase()}* 〕\n${list}\n╰╾━━╼ 〔 ⚡ 〕`;
    }).join('\n\n');

    const header = `
${saludo} ${tagUsuario} ✨

${borderTop}
┃  ⚡ *𝐃𝐈𝐃𝐈𝐄𝐑 𝐁𝐎𝐓 𝐌𝐄𝐍𝐔*
┃  👤 *Usuario:* ${userName}
┃  📈 *Nivel:* ${level}
┃  ✨ *Exp:* ${exp - min}/${xp}
┃  💎 *Diamantes:* ${limit}
┃  ⏳ *Activo:* ${uptime}
┃  👥 *Usuarios:* ${totalUsers}
${borderBottom}
`.trim();

    const fullMenu = `${header}\n\n${menuBody}\n\n${menuFooter}`;

    await conn.sendMessage(m.chat, {
      image: { url: imgDidier },
      caption: fullMenu,
      mentions: [m.sender]
    }, { quoted: fkontak });

  } catch (e) {
    console.error('❌ Error en el menú:', e);
    await conn.reply(m.chat, `⚠️ Ocurrió un error al cargar el menú.`, m);
  }
};

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menu', 'help', 'menú']

export default handler;
