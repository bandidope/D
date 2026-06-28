import axios from 'axios'
import jimp from 'jimp' // npm i jimp

// Lista de textos random para "Cuando..."
const frases = [
  'Cuando te dicen: es la última',
  'Cuando entras al grupo y hay 999+',
  'Cuando tu ex te ve online',
  'Cuando pides saldo y te dejan en visto',
  'Cuando el profe dice: examen sorpresa',
  'Cuando For Three Bot 🌀 entra al grupo'
]

let handler = async (m, { conn }) => {
  let who = m.mentionedJid[0]? m.mentionedJid[0] : m.quoted? m.quoted.sender : m.sender
  await m.reply('🌀 Renderizando meme...')

  // 1. Foto del user
  let pp
  try { pp = await conn.profilePictureUrl(who, 'image') }
  catch { pp = 'https://i.imgur.com/2WZ3h2K.png' }
  let ppBuffer = await axios.get(pp, { responseType: 'arraybuffer' }).then(r => r.data)
  let face = await jimp.read(ppBuffer)
  face.circle()

  // 2. Memes con coords + fuente para texto
  let memes = [
    { template: 'https://i.imgur.com/8KmNpWZ.png', x: 120, y: 80, w: 280, h: 280, textY: 20 }, // Crying
    { template: 'https://i.imgur.com/4k4H6jG.png', x: 100, y: 50, w: 300, h: 300, textY: 15 }, // Gigachad
    { template: 'https://i.imgur.com/v4zYQZb.png', x: 45, y: 45, w: 200, h: 200, textY: 10 } // Drake
  ]
  let meme = memes[Math.floor(Math.random() * memes.length)]
  let base = await jimp.read(meme.template)

  // 3. Pegar cara
  face.resize(meme.w, meme.h)
  base.composite(face, meme.x, meme.y)

  // 4. Poner texto arriba estilo meme
  const font = await jimp.loadFont(jimp.FONT_SANS_32_WHITE) // Fuente blanca grande
  const frase = frases[Math.floor(Math.random() * frases.length)]

  // Contorno negro para que se lea
  const stroke = await jimp.loadFont(jimp.FONT_SANS_32_BLACK)
  base.print(stroke, 2, meme.textY + 2, { text: frase, alignmentX: jimp.HORIZONTAL_ALIGN_CENTER }, base.bitmap.width)
  base.print(font, 0, meme.textY, { text: frase, alignmentX: jimp.HORIZONTAL_ALIGN_CENTER }, base.bitmap.width)

  let buffer = await base.getBufferAsync(jimp.MIME_PNG)

  await conn.sendMessage(m.chat, {
    image: buffer,
    caption: `🤣 @${who.split('@')[0]}`,
    mentions: [who]
  }, { quoted: m })
}

handler.help = ['me']
handler.tags = ['fun']
handler.command = ['me']
handler.group = true

export default handler