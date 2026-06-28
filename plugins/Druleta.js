// Plugin: Ruleta Aleatoria by I'm Criss XYZ
// Optimizado | Solo Texto | Solo Admins
// Comandos: #addrl #delusrl #spinrl #clearrl #listrl

let ruletaDB = global.db.data.ruleta || (global.db.data.ruleta = {})

const Emojis = ['🟥', '🟦', '🟩', '🟨', '🟪', '🟧', '🟫', '⬛'] // Simula los gajos de la ruleta

let handler = async (m, { conn, args, command, isAdmin, isGroup }) => {
    if (!isGroup) throw '❌ Este comando solo funciona en grupos'
    if (!isAdmin) throw '❌ *Solo administradores del grupo* by I\'m Criss XYZ'

    let chatId = m.chat
    ruletaDB[chatId]??= [] // Crea la ruleta si no existe

    let texto = args.join(' ').trim()

    switch (command) {
        case 'addrl': {
            if (!texto) throw `ꕤ *Uso:* #addrl Nombre1 / Nombre2 / Nombre3\n*Ejemplo:* #addrl Whois / Lu / Romi`

            let nombres = [...new Set(texto.split('/').map(v => v.trim()).filter(v => v))] // Separa por / y quita duplicados
            if (nombres.length === 0) throw 'Mete al menos 1 nombre'

            let agregados = []
            for (let name of nombres) {
                if (!ruletaDB[chatId].some(v => v.toLowerCase() === name.toLowerCase())) {
                    ruletaDB[chatId].push(name)
                    agregados.push(name)
                }
            }

            if (agregados.length === 0) throw '⚠️ Todos esos nombres ya estaban en la ruleta'

            let lista = ruletaDB[chatId].map((v,i) => `${Emojis[i % Emojis.length]} ${v}`).join('\n')
            m.reply(`✅ *Agregados:* ${agregados.join(', ')}\n\n╭━━〔 *🎡 RULETA ACTUAL* 〕━━┈⊷\n${lista}\n╰ *Total:* ${ruletaDB[chatId].length} participantes`)
        }
        break

        case 'delusrl': {
            if (!texto) throw `ꕤ *Uso:* #delusrl Nombre\n*Ejemplo:* #delusrl Lu`
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
            if (ruletaDB[chatId].length < 2) throw '❌ *Mínimo 2 personas en la ruleta*'

            let ruletaVisual = ruletaDB[chatId].map((v,i) => `${Emojis[i % Emojis.length]} ${v}`).join('\n')
            await conn.reply(m.chat, `🎡 *Girando la ruleta...*\n\n${ruletaVisual}`, m)
            await delay(2000 + Math.random() * 1500) // Animación 2-3.5s random

            let idx = Math.floor(Math.random() * ruletaDB[chatId].length)
            let ganador = ruletaDB[chatId].splice(idx, 1)[0] // Saca y elimina al ganador

            m.reply(`╭━━〔 *🎯 RESULTADO* 〕━━┈⊷\n┃\n┃ 🏆 *GANADOR:* *${ganador}*\n┃\n┃ Participantes restantes: ${ruletaDB[chatId].length}\n╰━━━━━━━━━━┈⊷`)
        }
        break

        case 'clearrl': {
            ruletaDB[chatId] = []
            m.reply('🧹 *Ruleta borrada por completo.*\nPuedes crear una nueva con #addrl')
        }
        break
    }
}

handler.help = ['addrl', 'delusrl', 'spinrl', 'clearrl', 'listrl']
handler.tags = ['sorteos']
handler.command = /^(addrl|delusrl|spinrl|clearrl|listrl)$/i
handler.admin = true
handler.group = false

export default handler
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))