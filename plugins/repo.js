 const axios = require('axios');
const fetch = require('node-fetch');
const config = require('../config');
const { cmd } = require('../command');

cmd({
    pattern: "repo",
    alias: ["sc", "script", "info"],
    desc: "Obtenir les infos du dépôt GitHub",
    react: "📂",
    category: "spam",
    filename: __filename,
},
async (conn, mek, m, { from, reply }) => {

    const githubRepoURL = 'https://github.com/DAWENS-BOY96/MUZAN-X-MD';
    const sender = m.sender;

    try {
        const match = githubRepoURL.match(/github\.com\/([^/]+)\/([^/]+)/);
        if (!match) return reply("❌ Lien GitHub invalide.");

        const [, username, repoName] = match;

        const res = await fetch(`https://api.github.com/repos/${username}/${repoName}`);
        if (!res.ok) throw new Error(`GitHub API Error: ${res.status}`);

        const repoData = await res.json();

        const info = {
            stars: repoData.stargazers_count,
            forks: repoData.forks_count,
            author: repoData.owner.login,
            created: new Date(repoData.created_at).toLocaleDateString(),
            updated: new Date(repoData.updated_at).toLocaleDateString(),
            url: repoData.html_url,
        };

        const msg = `
╭─────『 *MUZAN-X MD* 』─────╮
│👤 *Owner:* ${info.author}
│🌟 *Stars:* ${info.stars}
│🍴 *Forks:* ${info.forks}
│📅 *Créé:* ${info.created}
│♻️ *Mis à jour:* ${info.updated}
│🌐 *Repo:* ${info.url}
│🔗 *Session:* https://jesus-crash-v1-session-id2.onrender.com
╰────────────────────────────╯

*➤ MUZAN-X MD est un bot WhatsApp rapide, puissant et blindé par Dawens Tech. Fork-le et laisse une 🌟 !*
        `.trim();

        const imgBuffer = await axios.get('https://files.catbox.moe/l0xrah.png', {
            responseType: 'arraybuffer'
        }).then(res => res.data);

        await conn.sendMessage(from, {
            image: imgBuffer,
            caption: msg,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363419768812867@newsletter',
                    newsletterName: 'MUZAN-X MD',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("❌ Repo Error:", e);
        reply(`❌ Erreur : ${e.message}`);
    }
});
