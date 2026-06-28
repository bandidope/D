import fetch from 'node-fetch'

const MARCA = 'For Three Bot 💱'
const TZ = 'America/Lima'

// <- Ya no hay lista cerrada. Acepta cualquier código ISO
// Ej: COP, MXN, ARS, BRL, CLP, JPY, GBP, etc

let handler = async (m, { conn, text }) => {
  await conn.sendMessage(m.chat, { react: { text: '💱', key: m.key } }).catch(_=>{})

  if (!text ||!text.includes('/')) {
    return m.reply(`💱 *CAMBIO GLOBAL ${MARCA}*

Uso:.cambio [monto] / [CODIGO] / [CODIGO]

Ejemplos:
.cambio 100 / PEN / USD -> Soles a Dolares
.cambio 50 / USD / COP -> Dolares a Pesos Colombianos
.cambio 200 / EUR / MXN -> Euros a Pesos Mexicanos

Códigos: https://www.xe.com/iso4217.php
Usa el código de 3 letras: PEN, USD, EUR, COP, MXN...`)
  }

  let [montoStr, de, a] = text.split('/').map(v => v.trim().toUpperCase())
  let monto = parseFloat(montoStr.replace(/,/g, ''))

  if (isNaN(monto) || monto <= 0) {
    return m.reply(`⚠️ Monto inválido bro.\nEj:.cambio 100 / PEN / USD`)
  }

  if (de.length!== 3 || a.length!== 3) {
    return m.reply(`⚠️ Usa códigos de 3 letras.\nEj: PEN, USD, EUR, COP, MXN`)
  }

  if (de === a) {
    return m.reply(`✅ ${monto} ${de} = ${monto} ${a}`)
  }

  try {
    let res = await fetch(`https://api.exchangerate-api.com/v4/latest/${de}`)
    let json = await res.json()

    if(json.result === 'error') throw new Error('Moneda inválida')
    let tasa = json.rates[a]

    if(!tasa) return m.reply(`⚠️ Código ${a} no válido. Revisa los códigos en el link de arriba.`)

    let total = (monto * tasa).toFixed(2)
    let fecha = new Date().toLocaleDateString('es-PE', { timeZone: TZ })

    let txt = `💱 *CAMBIO ${MARCA}*\n»————————> 💵 <————————«\n
💰 ${monto} ${de} = *${total} ${a}*
📊 1 ${de} = ${tasa.toFixed(4)} ${a}
📅 ${fecha}`

    m.reply(txt)

  } catch(e) {
    console.log(e)
    m.reply(`⚠️ Error: Moneda inválida o API caída.\nVerifica los códigos: PEN, USD, EUR, COP, MXN...`)
  }
}

handler.help = ['cambio']
handler.tags = ['main']
handler.command = /^cambio$/i
handler.group = true
export default handler