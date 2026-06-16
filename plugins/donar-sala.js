let toM = a => '@' + a.split('@')[0]

function handler(m, { groupMetadata }) {
    let ps = groupMetadata.participants.map(v => v.id)
    let a = ps.getRandom()
    let b
    do b = ps.getRandom()
    while (b === a)

    m.reply(`✨ *𝐃𝐈𝐃𝐈𝐄𝐑 𝐁𝐎𝐓* ✨

*${toM(a)},* ¡Busca la salita bebé que ya viene el VS! 🏁📌

> 🚀 *By Didier Developers*`, null, {
        mentions: [a, b]
    })
}

handler.help = ['donarsala']
handler.tags = ['freefire']
handler.command = ['donarsala', 'sala']
handler.group = true 

export default handler
