const axios = require('axios');
const os = require('os');
const fs = require('fs');
const path = require('path');
const { cmd, commands } = require('../command');
const { runtime } = require('../lib/functions');

cmd({
  pattern: 'version',
  alias: ['check', 'update', 'changelog'],
  desc: 'Show current version and system info.',
  category: 'info',
  react: '🧬',
  filename: __filename,
}, async (conn, mek, m, { from, reply, pushname }) => {
  try {
    const versionFile = path.join(__dirname, '../data/version.json');
    const pluginPath = path.join(__dirname, '../plugins');

    // Local Version Info
    let localVersion = '0.0.0';
    let localChangelog = 'N/A';
    if (fs.existsSync(versionFile)) {
      const versionData = JSON.parse(fs.readFileSync(versionFile));
      localVersion = versionData.version;
      localChangelog = versionData.changelog;
    }

    // Remote Version Info
    let remoteVersion = localVersion;
    let remoteChangelog = localChangelog;
    try {
      const { data } = await axios.get('https://raw.githubusercontent.com/DAWENS-BOY96/JESUS-CRASH-V1/main/data/version.json');
      remoteVersion = data.version;
      remoteChangelog = data.changelog;
    } catch (err) {
      console.warn('[WARN] Cannot fetch remote version:', err.message);
    }

    const updateStatus = localVersion === remoteVersion
      ? '✅ *Up-to-date!*'
      : `🛑 *Outdated!*\n🔸 Local: ${localVersion}\n🔸 Latest: ${remoteVersion}\n🔄 Use *.update* to upgrade.`;

    const uptime = runtime(process.uptime());
    const ramUsed = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1);
    const ramTotal = (os.totalmem() / 1024 / 1024).toFixed(1);
    const totalPlugins = fs.readdirSync(pluginPath).filter(f => f.endsWith('.js')).length;
    const totalCommands = commands.length;
    const host = os.hostname();

    const message = `
🧠 *Bot Version Info*
────────────────────
📌 *Bot:* MUZAN-X MD
🧩 *Local Version:* ${localVersion}
🌐 *Latest Version:* ${remoteVersion}
🔧 *Plugins Loaded:* ${totalPlugins}
📦 *Commands Registered:* ${totalCommands}

💾 *System Stats*
⏱ *Uptime:* ${uptime}
📟 *RAM:* ${ramUsed}MB / ${ramTotal}MB
🖥 *Host:* ${host}

📋 *Changelog:*\n${remoteChangelog.trim()}

${updateStatus}
`.trim();

    await conn.sendMessage(from, {
      image: { url: 'https://i.ibb.co/KhYC4FY/1221bc0bdd2354b42b293317.jpg' }, // optional
      caption: message,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363419768812867@newsletter',
          newsletterName: 'MUZAN-X MD',
          serverMessageId: 143
        }
      }
    }, { quoted: mek });
  } catch (err) {
    console.error(err);
    reply('❌ Error fetching version info. Please try again.');
  }
});