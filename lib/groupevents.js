// Credits DAWENS-BOY96 - MUZAN-X MD 💜 
// https://whatsapp.com/channel/0029VbCHd5V1dAw132PB7M1B

const { isJidGroup } = require('@whiskeysockets/baileys');
const config = require('../config');

const fallbackPP = 'https://i.ibb.co/KhYC4FY/1221bc0bdd2354b42b293317ff2adbcf-icon.png';

const getContextInfo = (m) => ({
    mentionedJid: [m.sender],
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363419768812867@newsletter',
        newsletterName: 'MUZAN-X MD',
        serverMessageId: 143,
    },
});

// Helper pou voye mesaj avèk retry si gen timeout oswa erè tanporè
async function safeSendMessage(conn, jid, msg) {
  try {
    await conn.sendMessage(jid, msg);
  } catch (err) {
    console.error('Failed to send message, retrying...', err);
    try {
      await new Promise(r => setTimeout(r, 1500)); // Tann 1.5s avan retry
      await conn.sendMessage(jid, msg);
    } catch (e) {
      console.error('Retry failed:', e);
    }
  }
}

const GroupEvents = async (conn, update) => {
    try {
        if (!isJidGroup(update.id) || !Array.isArray(update.participants)) return;

        const metadata = await conn.groupMetadata(update.id);
        const groupName = metadata.subject;
        const groupDesc = metadata.desc || 'No description available.';
        const memberCount = metadata.participants.length;

        let groupPP;
        try {
            groupPP = await conn.profilePictureUrl(update.id, 'image');
        } catch {
            groupPP = fallbackPP;
        }

        for (const user of update.participants) {
            const username = user.split('@')[0];
            const time = new Date().toLocaleString();
            let userPP;

            try {
                userPP = await conn.profilePictureUrl(user, 'image');
            } catch {
                userPP = groupPP;
            }

            const sendMessage = async (caption, withImage = false, mentions = [user]) => {
                const contextInfo = {
                  mentionedJid: mentions,
                  forwardingScore: 999,
                  isForwarded: true,
                  forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363419768812867@newsletter',
                    newsletterName: 'MUZAN-X MD',
                    serverMessageId: 143,
                  },
                };

                let msg;
                if (withImage) {
                    msg = {
                      image: { url: userPP },
                      caption,
                      contextInfo,
                      mentions,
                    };
                } else {
                    msg = {
                      text: caption,
                      contextInfo,
                      mentions,
                    };
                }
                await safeSendMessage(conn, update.id, msg);
            };

            if (update.action === 'add' && config.WELCOME === 'true') {
                const welcome = 
`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   🎉 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗡𝗘𝗪 𝗠𝗘𝗠𝗕𝗘𝗥 🎉
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ 👤 User      : @${username}
┃ 📅 Joined    : ${time}
┃ 👥 Members   : ${memberCount}
┃ 🏷️ Group     : ${groupName}
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ 📋 Description:
┃ ${groupDesc.length > 70 ? groupDesc.slice(0, 70) + '...' : groupDesc}
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ 💬 Please read the group rules and enjoy your stay!
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
`;

                await sendMessage(welcome, true);

            } else if (update.action === 'remove' && config.WELCOME === 'true') {
                const goodbye = 
`╭─────────────◇
│ 👋 𝐌𝐄𝐌𝐁𝐄𝐑 𝐄𝐗𝐈𝐓𝐄𝐃
├─────────────────────
│ 👤 ᴜꜱᴇʀ: @${username}
│ 🕓 ʟᴇꜰᴛ ᴀᴛ: ${time}
│ 👥 ɴᴏᴡ ᴍᴇᴍʙᴇʀꜱ: ${memberCount}
╰───────────────◆`;

                await sendMessage(goodbye, true);

            } else if (update.action === 'promote' && config.ADMIN_EVENTS === 'true') {
                const promoter = update.author ? update.author.split('@')[0] : 'Inconnu';
                const promoteMsg = 
`▂▃▄▅▆▇█⟩ 𝗣𝗥𝗢𝗠𝗢𝗧𝗘𝗗 🎖️
┃ 👤 @${username}
┃ 👑 By: @${promoter}
┃ ⏰ Time: ${time}
▔▔▔▔▔▔▔▔▔▔▔▔▔▔`;

                await sendMessage(promoteMsg, false, [user, update.author].filter(Boolean));

            } else if (update.action === 'demote' && config.ADMIN_EVENTS === 'true') {
                const demoter = update.author ? update.author.split('@')[0] : 'Inconnu';
                const demoteMsg = 
`╔═════ ∘◦ ❴ ⚠️ 𝗗𝗘𝗠𝗢𝗧𝗘𝗗 ❵ ◦∘ ═════╗
║ 🧑‍💼 𝗨𝘀𝗲𝗿   : @${username}
║ 😞 𝗗𝗲𝗺𝗼𝘁𝗲𝗱 𝗕𝘆 : @${demoter}
║ ⏰ 𝗧𝗶𝗺𝗲   : ${time}
╚═══════════════════════════╝`;

                await sendMessage(demoteMsg, false, [user, update.author].filter(Boolean));
            }
        }
    } catch (err) {
        console.error('Group event error:', err);
    }
};

module.exports = GroupEvents;
