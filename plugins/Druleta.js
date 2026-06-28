// Plugin: Ruleta Aleatoria by I'm Criss XYZ - V2 FIX
// Sin bloqueo de grupo | Solo Admins

let ruletaDB = global.db.data.ruleta || (global.db.data.ruleta = {})

const Emojis = ['🟥', '🟦', '🟩', '🟨', '🟪', '🟧', '🟫', '⬛']

let handler = async (m, { conn, args, command, isAdmin }) => {
    if (!isAdmin) throw '❌ *Solo administradores del grupo* by I\'m Criss XYZ'

    let chatId = m.chat
    ruletaDB[chatId]??= []

    let texto = args.join(' ').trim()

    switch (command) {
        case 'addrl': {
            if (!texto) throw `ꕤ *Uso:* #addrl Nombre1 / Nombre2 / Nombre3`
            let nombres = [...new Set(texto.split('/').map(v => v.trim()).filter(v => v))]
            let agregados = []
            for (let name of nombres) {
                if (!ruletaDB[chatId].some(v => v.toLowerCase() === name.toLowerCase())) {
                    ruletaDB[chatId].push(name)
                    agregados.push(name)
                }
            }
            if (agregados.length === 0) throw '⚠️ Todos esos nombres ya estaban'
            let lista = ruletaDB[chatId].map((v,i) => `${Emojis[i % Emojis.length]} ${v}`).join('\n')
            m.reply(`✅ *Agregados:* ${agregados.join(', ')}\n\n╭━━〔 *🎡 RULETA* 〕━━┈⊷\n${lista}\n╰ *Total:* ${ruletaDB[chatId].length}`)
        }
        break

        case 'delusrl': {
            if (!texto) throw `ꕤ *Uso:* #delusrl Nombre`
            let antes = ruletaDB[chatId].length
            ruletaDB[chatId] = ruletaDB[chatId].filter(v => v.toLowerCase()!== texto.toLowerCase())
            if (ruletaDB[chatId].length === antes) throw `⚠️ ${texto} no está en la ruleta`
            m.reply(`🗑️ *Quitado:* ${texto}\n*Restantes:* ${ruletaDB[chatId].length}`)
        }
        break

        case 'listrl': {
            if (ruletaDB[chatId].length === 0) throw '🧹 La ruleta está vacía'
            let lista = ruletaDB[chatId].map((v,i) => `${Emojis[i % Emojis.length]} ${v}`).join('\n')
            m.reply(`╭━━〔 *🎡 PARTICIPANTES* 〕━━┈⊷\n${lista}\n╰ *Total:* ${ruletaDB[chatId].length}`)
        }
        break

        case 'spinrl': {
            if (ruletaDB[chatId].length < 2) throw '❌ *Mínimo 2 personas*'
            let ruletaVisual = ruletaDB[chatId].map((v,i) => `${Emojis[i % Emojis.length]} ${v}`).join('\n')
            await conn.reply(m.chat, `🎡 *Girando...*\n\n${ruletaVisual}`, m)
            await delay(2000 + Math.random() * 1500)
            let idx = Math.floor(Math.random() * ruletaDB[chatId].length)
            let ganador = ruletaDB[chatId].splice(idx, 1)[0]
            m.reply(`╭━━〔 *🎯 RESULTADO* 〕━━┈⊷\n┃\n┃ 🏆 *GANADOR:* *${ganador}*\n┃\n┃ Restantes: ${ruletaDB[chatId].length}\n╰━━━━━━━━━━┈⊷`)
        }
        break

        case 'clearrl': {
            ruletaDB[chatId] = []
            m.reply('🧹 *Ruleta borrada.*')
        }
        break
    }
}

handler.help = ['addrl', 'delusrl', 'spinrl', 'clearrl', 'listrl']
handler.tags = ['sorteos']
handler.command = /^(addrl|delusrl|spinrl|clearrl|listrl)$/i
handler.admin = true
// handler.group = true <-- Lo quité

export default handler
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))