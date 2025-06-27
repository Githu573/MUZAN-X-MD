const { cmd } = require('../command');

cmd({
  pattern: 'device',
  desc: 'Detect the user\'s device type',
  category: 'spam',
  react: '📲',
  filename: __filename
}, async (client, message) => {
  try {
    const msgId = message.key.id;
    let deviceType;

    if (msgId?.startsWith('3EB0')) {
      deviceType = 'Android Device';
    } else if (msgId?.startsWith('3EB1')) {
      deviceType = 'iOS Device (iPhone)';
    } else if (msgId?.includes(':')) {
      deviceType = 'WhatsApp Web/Desktop';
    }

    if (!deviceType) return; // Do nothing if device is not detected

    await client.sendMessage(message.key.remoteJid, {
      text: `📱 *This user is using:* ${deviceType}`
    }, { quoted: message });

  } catch (err) {
    await client.sendMessage(message.key.remoteJid, {
      text: `❌ Error detecting device: ${err.message}`
    }, { quoted: message });
  }
});