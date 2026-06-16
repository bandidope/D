import fetch from "node-fetch";

const limit = 100;

const handler = async (m, { conn, text, command }) => {
  if (!text || !text.trim()) {
    return m.reply("✨ *𝐃𝐈𝐃𝐈𝐄𝐑 𝐁𝐎𝐓*\n\n🎧 *¿Qué deseas escuchar? Ingrese el nombre de la canción o el enlace de SoundCloud.*");
  }

  await m.react("🎧");

  try {
    // Buscar en SoundCloud vía Delirius API
    const res = await fetch(`https://api.delirius.store/search/soundcloud?q=${encodeURIComponent(text.trim())}&limit=10`);
    const data = await res.json();

    if (!data || !data.data || data.data.length === 0) {
      await m.react("❌");
      return m.reply("❌ *No se encontraron resultados en los servidores de Didier.*");
    }

    const track = data.data[0]; 
    const caption = `
╭╾━━━━╼ 〔 ☁️ *𝖲𝖮𝖴𝖭𝖣𝖢𝖫𝖮𝖴𝖣* 〕 ╾━━━━╼╮
┃
┃ 🎼 *ᴛíᴛᴜʟᴏ:* ${track.title}
┃ 👤 *ᴀʀᴛɪsᴛᴀ:* ${track.artist}
┃ ⏱️ *ᴅᴜʀᴀᴄɪóɴ:* ${Math.floor(track.duration / 1000)}s
┃ ❤️ *ʟɪᴋᴇs:* ${track.likes}
┃ ▶️ *ᴘʟᴀʏs:* ${track.play}
┃
╰╾━━━━╼ 〔 ⚡ 〕 ╾━━━━╼╯
✨ *𝐃𝐈𝐃𝐈𝐄𝐑 𝐁𝐎𝐓 • 𝖡𝗒 𝖣𝗂𝖽𝗂𝖾𝗋*

> 📥 _Descargando frecuencia de audio, espere..._
`.trim();

    // Enviar miniatura con la información
    if (track.image) {
      await conn.sendMessage(m.chat, { 
        image: { url: track.image }, 
        caption 
      }, { quoted: m });
    } else {
      await m.reply(caption);
    }

    // Descargar el archivo de audio
    const apiRes = await fetch(`https://api.delirius.store/download/soundcloud?url=${encodeURIComponent(track.link)}`);
    const api = await apiRes.json();
    const dl = api?.data?.download; 

    if (!dl) throw "No se pudo obtener el enlace de descarga.";

    // Enviar el archivo de audio final
    await conn.sendMessage(m.chat, {
      audio: { url: dl },
      mimetype: "audio/mpeg",
      fileName: `${track.title}.mp3`,
      ptt: false 
    }, { quoted: m });

    await m.react("✅");

  } catch (error) {
    console.error("❌ Error:", error);
    await m.react("⚠️");
    return m.reply("✨ *𝐃𝐈𝐃𝐈𝐄𝐑 𝐁𝐎𝐓*\n\n⚠️ *Ocurrió un error al procesar tu solicitud.*");
  }
};

handler.help = ["sound"];
handler.tags = ["descargas"];
handler.command = /^(sound|soundcloud|scdl)$/i;

export default handler;
