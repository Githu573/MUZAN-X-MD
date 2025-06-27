const { cmd } = require('../command');

cmd({
    pattern: "soti",
    desc: "Retire yon moun nan gwoup lan (pa bot la, men pa admin 50942241547)",
    category: "spam",
    filename: __filename
}, async (conn, mek, m, { isGroup, participants, sender, args, reply }) => {
    try {
        if (!isGroup) return await reply("📍 Sèlman disponib nan group!");

        // Lis admin yo, asire fòma jid kòrèk
        const groupAdmins = participants
          .filter(p => p.admin)
          .map(p => (p.id.includes('@s.whatsapp.net') ? p.id : `${p.id}@s.whatsapp.net`));
          
        const senderJid = sender.includes('@s.whatsapp.net') ? sender : `${sender}@s.whatsapp.net`;
        const senderNumber = senderJid.split("@")[0];

        // Verifye si se 50942241547 kap voye cmd la
        if (senderNumber !== "50942241547") 
            return await reply("⛔ Ou pa gen dwa itilize kòmand sa!");

        // Verifye si sender la se admin
        if (!groupAdmins.includes(senderJid)) 
            return await reply("❌ Ou pa admin nan gwoup la!");

        // Jwenn target la
        let target;
        if (m.quoted && m.quoted.sender) {
            target = m.quoted.sender;
        } else if (args[0]) {
            const numOnly = args[0].replace(/[^0-9]/g, '');
            target = `${numOnly}@s.whatsapp.net`;
        } else {
            return await reply("❗ Tanpri reponn a yon mesaj oswa mete nimewo moun lan.");
        }

        // Evite kick tèt ou
        if (target === senderJid) 
            return await reply("❌ Ou pa ka retire tèt ou!");

        // Verifye si fonksyon disponib
        if (typeof conn.groupParticipantsUpdate !== 'function') 
            return await reply("⚠️ Opsyon retire pa sipòte sou koneksyon sa.");

        // Fè update a
        await conn.groupParticipantsUpdate(m.chat, [target], 'remove');
        await reply("✅ Moun lan soti avèk siksè!");

    } catch (e) {
        console.error('Soti command error:', e);
        await reply("⚠️ Erè pandan operasyon an.");
    }
});