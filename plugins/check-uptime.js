const { cmd } = require('../command');
const { runtime } = require('../lib/functions');
const config = require('../config');

cmd({
  pattern: "uptime",
  alias: ["runtime", "up"],
  desc: "Show bot uptime with styles",
  category: "info",
  react: "🕐",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  try {
    const uptime = runtime(process.uptime());
    const startTime = new Date(Date.now() - process.uptime() * 1000).toLocaleString();

    const botName = 'MUZAN-X MD';
    const owner = config.OWNER_NAME || 'DAWENS BOY';

    const styles = [

`┏━━━━━━━━━━━━━━━━━━━━━━━┓
┃ 🤖 *${botName} Uptime*
┣━━━━━━━━━━━━━━━━━━━━━━━┫
┃ ⏳ *Runtime:* ${uptime}
┃ 🕐 *Since:* ${startTime}
┗━━━━━━━━━━━━━━━━━━━━━━━┛
⭐ Powered by *${owner}*`,

`╭───────『 *⏱ UPTIME* 』───────╮
│  🤖 Bot: ${botName}
│  📆 Since: ${startTime}
│  ⏳ Uptime: ${uptime}
╰──────────────────────────────╯`,

`==============================
   ⚙️  ${botName} STATUS
==============================
⏱️ Uptime: ${uptime}
📆 Started At: ${startTime}
==============================
💠 Owner: ${owner}
🔗 GitHub: https://github.com/DAWENS-BOY96
==============================`
    ];

    const randomStyle = styles[Math.floor(Math.random() * styles.length)];

    await conn.sendMessage(from, {
      text: randomStyle,
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
    console.error("Uptime Error:", e);
    reply(`❌ Error: ${e.message}`);
  }
});