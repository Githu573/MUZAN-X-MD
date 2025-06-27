const { cmd, commands } = require('../command');
const config = require('../config');
const fs = require('fs');

cmd({
  pattern: 'menu',
  alias: ['help', 'm'],
  desc: 'Show command menu',
  category: 'main',
  react: '📜',
  filename: __filename
}, async (conn, mek, m, { from, reply, pushname }) => {
  try {
    const botName = config.BOT_NAME || 'MUZAN-X MD';
    const ownerName = config.OWNER_NAME || 'DAWENS BOY';
    const menuImage = config.MENU_IMAGE_URL || 'https://files.catbox.moe/fuoqii.png';

    // Goup commands pa kategori
    const grouped = {};
    for (const plugin of commands) {
      const category = plugin.category || 'other';
      if (!grouped[category]) grouped[category] = [];
      grouped[category].push(plugin);
    }

    // Header
    let text = `╭───〔 *${botName} MENU* 〕───⬣
│ 🤖 Bot de: ${ownerName}
│ 💬 User: ${pushname}
│ ⏺️ Mode: ${config.MODE}
│ 🔰 Prefix: (none)
╰──────────────⬣\n`;

    // Ajoute commands yo san prefix
    for (const category in grouped) {
      text += `\n╭─⟪ *${category.toUpperCase()}* ⟫\n`;

      for (const cmd of grouped[category]) {
        const name = cmd.pattern;
        const desc = cmd.desc ? `╰┈➤ ${cmd.desc}` : '';
        text += `│ 🜲 ${name}\n│ ${desc}\n`;
      }

      text += `╰──────────────⬣\n`;
    }

    // Voye mesaj ak imaj meni
    await conn.sendMessage(from, {
      image: { url: menuImage },
      caption: text.trim(),
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 777,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363419768812867@newsletter',
          newsletterName: botName,
          serverMessageId: 143
        }
      }
    }, { quoted: mek });

  } catch (e) {
    console.error("Menu Error:", e);
    reply(`❌ Error generating menu:\n${e.message}`);
  }
});