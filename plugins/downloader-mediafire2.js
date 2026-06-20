import axios from 'axios';
import fetch from 'node-fetch';

// Decodificar la API desde Base64
const apiBase64 = 'aHR0cHM6Ly9yZXN0YXBpLmFwaWJvdHdhLmJpei5pZC9hcGkvbWVkaWFmaXJlP3VybD0=';
const apiUrl = Buffer.from(apiBase64, 'base64').toString('utf-8');

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) return conn.reply(m.chat, '🚩 Ingrese el enlace de un archivo de Mediafire.', m);
  if (!args[0].match(/mediafire/gi)) return conn.reply(m.chat, '🌸 El enlace debe ser de un archivo de Mediafire.', m);

  try {
    await m.react('⚡');
    
    // Llamada a la API
    let response = await axios.get(`${apiUrl}${args[0]}`);
    let { datos } = response.data;
    let { respuesta } = datos;
    let { 
      "Nombre del archivo": title, 
      tipo, 
      tamaño: size, 
      subido: uploaded, 
      mimetype, 
      descargar: downloadUrl 
    } = respuesta;
    
    // Mensaje informativo
    let txt = `乂  *¡MEDIAFIRE - DESCARGAS!*  乂\n\n`;
    txt += `✩ *Nombre* : ${title}\n`;
    txt += `✩ *Peso* : ${size}\n`;
    txt += `✩ *Publicado* : ${uploaded || 'Desconocido'}\n`;
    txt += `✩ *MimeType* : ${mimetype}\n\n`;
    txt += `*- ↻ El archivo se está enviando, espera un momento...*\n`;

    let img = await (await fetch('https://i.ibb.co/wLQFn7q/logo-mediafire.jpg')).buffer();

    // Envío del archivo y mensaje
    await conn.sendFile(m.chat, img, 'thumbnail.jpg', txt, null, null, { asDocument: false });
    await conn.sendFile(m.chat, downloadUrl, title, null, null, null, { mimetype, asDocument: true });
    
    await m.react('✅');
  } catch (err) {
    console.error(err);
    await conn.reply(m.chat, '❌ Hubo un error al procesar tu solicitud.', m);
    await m.react('✖️');
  }
};

handler.help = ['mediafire2'];
handler.tags = ['descargas'];
handler.command = ['mediafire2', 'mdfire2', 'mf2'];
handler.premium = false;

export default handler;
