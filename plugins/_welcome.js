import { WAMessageStubType } from '@whiskeysockets/baileys';
import { readFileSync } from 'fs';
import { join } from 'path';
import fetch from 'node-fetch'; // <- Lo necesitas para descargar la foto

export async function before(m, { conn, groupMetadata }) {
  try {
    if (!m.messageStubType ||!m.isGroup) return true;

    const chat = global.db?.data?.chats?.[m.chat];
    if (!chat ||!chat.bienvenida) return true;

    // --- Ficha de contacto fake para el quoted ---
    const fkontak = {
      key: {
        participants: '0@s.whatsapp.net',
        remoteJid: 'status@broadcast',
        fromMe: false,
        id: '𝐅𝐨𝐫 𝐓𝐡𝐫𝐞 𝐁𝐨𝐭 🌀'
      },
      message: {
        contactMessage: {
          vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN: 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐅𝐨𝐫 𝐓𝐡𝐫𝐞 🌀\nitem1.TEL;waid=${
            conn.user.jid.split('@')[0]
          }:${conn.user.jid.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
        }
      },
      participant: '0@s.whatsapp.net'
    };

    // --- Agarrar el JID del usuario que entró/salió ---
    let userJid;
    switch (m.messageStubType) {
      case WAMessageStubType.GROUP_PARTICIPANT_ADD:
      case WAMessageStubType.GROUP_PARTICIPANT_REMOVE:
        userJid = m.messageStubParameters?.[0];
        break;
      case WAMessageStubType.GROUP_PARTICIPANT_LEAVE:
        userJid = m.key.participant;
        break;
      default:
        return true;
    }

    if (!userJid) return true;

    const user = `@${userJid.split('@')[0]}`;
    const groupName = groupMetadata.subject;
    const groupDesc = groupMetadata.desc || 'Sin descripción disponible.';
    const { customWelcome, customBye, customKick } = chat;

    // --- ARREGLO CLAVE: Foto del usuario, no del bot ---
    let imgBuffer;
    try {
      let ppUser = await conn.profilePictureUrl(userJid, 'image'); // Foto del @user que entró
      let res = await fetch(ppUser);
      imgBuffer = await res.buffer();
    } catch {
      // Si el user no tiene foto o falla, usa la imagen por defecto
      imgBuffer = readFileSync(join(process.cwd(), 'storage', 'img', 'catalogo.png'));
    }

    // --- 🟢 BIENVENIDA ---
    if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) {
      const welcomeText = customWelcome
       ? customWelcome.replace(/@user/gi, user).replace(/@group/gi, groupName).replace(/@desc/gi, groupDesc)
        : `✨ *¡Bienvenido/a!* ✨\n\nHola ${user}, es un gusto tenerte en *${groupName}*.\n\n📝 *REGLAS Y INFO:*\n${groupDesc}\n\n> *𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐅𝐨𝐫 𝐓𝐡𝐫𝐞 🌀*`;

      await conn.sendMessage(m.chat, {
        image: imgBuffer, // <- Foto del que entró
        caption: welcomeText,
        mentions: [userJid]
      }, { quoted: fkontak });
    }

    // --- 🔴 SALIDA VOLUNTARIA ---
    if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_LEAVE) {
      const goodbyeText = customBye
       ? customBye.replace(/@user/gi, user).replace(/@group/gi, groupName)
        : `*Adiós ${user} Estorbo 🤝🏼*\n\n_*-1 Planta En Este Hermoso Grupo 😮‍💨*_\n\n> *${groupName}*`;

      await conn.sendMessage(m.chat, {
        image: imgBuffer, // <- Foto del que salió
        caption: goodbyeText,
        mentions: [userJid]
      }, { quoted: fkontak });
    }

    // --- 🚫 ELIMINADO/KICK ---
    if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_REMOVE) {
      const kickText = customKick
       ? customKick.replace(/@user/gi, user).replace(/@group/gi, groupName)
        : `*¡Fue Expulsado ${user}!* 🌀\n\n_*-1 Perro En Este Grupo*_\n\n> *${groupName}*`;

      await conn.sendMessage(m.chat, {
        image: imgBuffer, // <- Foto del que sacaron
        caption: kickText,
        mentions: [userJid]
      }, { quoted: fkontak });
    }
  } catch (error) {
    console.error('❌ Error en el sistema de bienvenida:', error);
  }
}