import axios from 'axios'
import jimp from 'jimp' // npm i jimp

const frases = [
  'Cuando pides',
  'Cuando entras al grupo y hay 999+',
  'Cuando tu ex te ve online',
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

  // 2. Memes: Tu imagen + 2 más de respaldo
  let memes = [
    {
      name: 'Cuando pides',
      template: 'attachment://0', // <- Tu foto subida
      x: 85, y: 130, w: 190, h: 190, textY: 25 // <- Coords exactas para tu meme
    },
    {
      name: 'Crying',
      template: 'https://i.imgur.com/W8f1z8Q.png', 
      x: 120, y: 80, w: 280, h: 280, textY: 20 
    },
    {
      name: 'Gigachad',
      template: 'https://i.imgur.com/2x3bH8k.png', 
      x: 100, y: 50, w: 300, h: 300, textY: 15 
    }
  ]
  
  let meme = memes[Math.floor(Math.random() * memes.length)]
  let base

  // Si es tu meme local, lo lee directo. Si es url, lo descarga.
  if (meme.template.startsWith('attachment://')) {
    base = await jimp.read('/mnt/data/An-_tOEl0Lr1-tD-Bo9c7uvavpx1NeqwXS0xKa7RBzKl7wf_HVhATTqWPAcf8zq4PWduzvBma24c5jdtEcZ_SQqCn7Ul1N0lTSpnyvLl3T7C-vneLERYqu6G')
  } else {
    base = await jimp.read(meme.template)
  }

  // 3. Pegar cara
  face.resize(meme.w, meme.h)
  base.composite(face, meme.x, meme.y)

  // 4. Texto arriba
  const font = await jimp.loadFont(jimp.FONT_SANS_32_WHITE)
  const stroke = await jimp.loadFont(jimp.FONT_SANS_32_BLACK)
  const frase = frases[Math.floor(Math.random() * frases.length)]

  base.print(stroke, 2, meme.textY + 2, { text: frase, alignmentX: jimp.HORIZONTAL_ALIGN_CENTER }, base.bitmap.width)
  base.print(font, 0, meme.textY, { text: frase, alignmentX: jimp.HORIZONTAL_ALIGN_CENTER }, base.bitmap.width)

  let buffer = await base.getBufferAsync(jimp.MIME_PNG)

  await conn.sendMessage(m.chat, {
    image: buffer,
    caption: `🤣 *${meme.name}*\n@${who.split('@')[0]}`,
    mentions: [who]
  }, { quoted: m })
}

handler.help = ['me']
handler.tags = ['fun']
handler.command = ['me']
handler.group = true

export default handler