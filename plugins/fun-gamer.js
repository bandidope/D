import fetch from "node-fetch";
import fs from "fs";
import path from "path";

const handler = async (msg, { conn, text, usedPrefix, command }) => {
  const chatID = msg.key.remoteJid;

  // Efecto de "escribiendo"
  await conn.sendPresenceUpdate("composing", chatID);

  // Validación de texto de entrada
  if (!text) {
    return conn.sendMessage(chatID, {
      text: `╭╾━━━━╼ 〔 ⚡ 〕 ╾━━━━╼╮\n┃ ⚡ *𝐃𝐈𝐃𝐈𝐄𝐑 𝐁𝐎𝐓*\n┃\n┃ 📌 *Uso correcto:*\n┃ ${usedPrefix + command} <número>\n┃\n┃ 📍 *Ejemplo:*\n┃ ${usedPrefix + command} 584120000000\n╰╾━━━━╼ 〔 🚀 〕 ╾━━━━╼╯`,
    }, { quoted: msg });
  }

  const cleanNumber = text.replace(/[^0-9]/g, "");
  if (cleanNumber.length < 8 || cleanNumber.length > 15) {
    return conn.sendMessage(chatID, {
      text: "❌ *Número inválido.* Asegúrate de incluir el código de país sin espacios ni símbolos.",
    }, { quoted: msg });
  }

  // Reacción de búsqueda
  await conn.sendMessage(chatID, { react: { text: "⚡", key: msg.key } });

  try {
    const url = `https://io.tylarz.top/v1/bancheck?number=${cleanNumber}&lang=es`;
    const res = await fetch(url, {
      headers: { 
        "Accept": "application/json",
        "X-Api-Key": "nami" 
      },
      timeout: 10000,
    });

    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);

    const data = await res.json();
    if (!data.status || !data.data) throw new Error("Respuesta de API inválida");

    const { isBanned } = data.data;
    const estado = isBanned ? "🚫 *BANEADO / SUSPENDIDO*" : "✅ *ACTIVO / LIBRE*";
    const emojiEstado = isBanned ? "❌" : "✨";

    const mensaje = `╭╾━━━━╼ 〔 ⚡ 〕 ╾━━━━╼╮\n` +
                    `┃  🛡️ *𝐖𝐀 𝐁𝐀𝐍 𝐂𝐇𝐄𝐂𝐊𝐄𝐑*\n` +
                    `┃\n` +
                    `┃ 📱 *Número:* ${cleanNumber}\n` +
                    `┃ ${emojiEstado} *Estado:* ${estado}\n` +
                    `┃\n` +
                    `╰╾━━━━╼ 〔 🚀 〕 ╾━━━━╼╯\n\n` +
                    `*By Didier Developers • 𝐃𝐈𝐃𝐈𝐄𝐑 𝐁𝐎𝐓*`;

    await conn.sendMessage(chatID, { text: mensaje }, { quoted: msg });
    await conn.sendMessage(chatID, { react: { text: "✅", key: msg.key } });

  } catch (error) {
    console.error("Error en bancheck:", error);

    let errMsg = "❌ *Error al verificar el número.*";
    if (error.type === 'request-timeout') errMsg = "⏰ *El servidor tardó demasiado en responder.*";

    await conn.sendMessage(chatID, { text: `${errMsg}\n\n> Inténtelo de nuevo más tarde.` }, { quoted: msg });
    await conn.sendMessage(chatID, { react: { text: "❌", key: msg.key } });
  }
};

handler.help = ['wa <número>'];
handler.tags = ['tools'];
handler.command = ["wa", "bancheck", "check"];

export default handler;
