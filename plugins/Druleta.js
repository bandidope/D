let ruletaDB = global.db.data.ruleta || (global.db.data.ruleta = {})

let handler = async (m, { conn, args, usedPrefix, command, isAdmin, isBotAdmin }) => {
    if (!isAdmin) throw '❌ Solo admins del grupo pueden usar la ruleta'
    if (!isBotAdmin) throw '❌ Necesito ser admin para borrar mensajes'

    let chatId = m.chat
    if (!ruletaDB[chatId]) ruletaDB[chatId] = []

    switch (command) {
        case 'addrl': {
            let who = m.mentionedJid[0] || (m.quoted? m.quoted.sender : null)
            if (!who) throw `ꕤ *Uso:* #addrl @tag\nAgrega a alguien a la ruleta`
            if (ruletaDB[chatId].includes(who)) throw '⚠️ Ya está en la ruleta'
            ruletaDB[chatId].push(who)
            m.reply(`✅ Se agregó 1 usuario a la ruleta.\nTotal: ${ruletaDB[chatId].length}`)
        }
        break

        case 'delusrl': {
            let who = m.mentionedJid[0] || (m.quoted? m.quoted.sender : null)
            if (!who) throw `ꕤ *Uso:* #delusrl @tag`
            ruletaDB[chatId] = ruletaDB[chatId].filter(v => v!== who)
            m.reply(`🗑️ Usuario quitado. Total: ${ruletaDB[chatId].length}`)
        }
        break

        case 'spinrl': {
            if (ruletaDB[chatId].length < 2) throw '❌ Mínimo 2 personas en la ruleta'

            await conn.reply(m.chat, '🔄 *La ruleta se está girando...*', m)
            await delay(3000)

            let ganador = ruletaDB[chatId][Math.floor(Math.random() * ruletaDB[chatId].length)]
            let nombres = ruletaDB[chatId].map(jid => `@${jid.split('@')[0]}`).join('\n')

            // Aquí se generaría la imagen de la ruleta como en tu captura
            await conn.reply(m.chat, `🎡 *Ruleta Girada!*\n\nParticipantes:\n${nombres}\n\n🏆 Ganador: @${ganador.split('@')[0]}`, m, { mentions: [ganador,...ruletaDB[chatId]] })

            // Elimina al ganador como en tu #spinrl
            ruletaDB[chatId] = ruletaDB[chatId].filter(v => v!== ganador)
        }
        break

        case 'clearrl': {
            ruletaDB[chatId] = []
            m.reply('🧹 Ruleta borrada. Puedes crear otra.')
        }
        break
    }
}

handler.command = ['addrl', 'delusrl', 'spinrl', 'clearrl']
handler.admin = true
handler.botAdmin = true
handler.group = true

export default handler

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))