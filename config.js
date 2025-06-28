const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
SESSION_ID: process.env.SESSION_ID || "MUZAN~X~MD~7gRRiCBT#K20IOmHy9A4GQ1-SbcF8ek2oZ_H_juyDmbrab9cbe9s",
// add your Session Id 
MENU_IMAGE_URL: process.env.MENU_IMAGE_URL || "https://files.catbox.moe/e8pgsz.png",
// add custom menu and mention reply image url
PREFIX: process.env.PREFIX || ".",
// add your prifix for bot   
BOT_NAME: process.env.BOT_NAME || "MUZAN-X MD",
// add bot namw here for menu
STICKER_NAME: process.env.STICKER_NAME || "MUZAN-X MD",
// type sticker pack name 
WELCOME: 'false',
// Active mesaj de bienvenue & sortie
ADMIN_EVENTS: 'true', 
// Active promote/demote    
DELETE_LINKS: process.env.DELETE_LINKS || "true",
// automatic delete links witho remove member 
OWNER_NUMBER: process.env.OWNER_NUMBER || "13058962443",
// add your bot owner number
OWNER_NAME: process.env.OWNER_NAME || "DAWENS BOY",
// add bot owner name
DESCRIPTION: process.env.DESCRIPTION || "*© ᴘᴏᴡᴇʀᴇᴅ by dawens boy*",
// add bot owner name    
MODE: process.env.MODE || "public",
// make bot public-private-inbox-group 
ANTI_LINK_KICK: process.env.ANTI_LINK_KICK || "true",
// make anti link true,false for groups 
PUBLIC_MODE: process.env.PUBLIC_MODE || "true",
// make false if want private mod
AUTO_TYPING: process.env.AUTO_TYPING || "false",
// true for automatic show typing   
READ_CMD: process.env.READ_CMD || "false",
// true if want mark commands as read 
DEV: process.env.DEV || "50942241547",
//replace with your whatsapp number 
ANTI_VV: process.env.ANTI_VV || "true",
// true for anti once view  
ANTI_DEL_PATH: process.env.ANTI_DEL_PATH || "same" 
// change it to 'same' if you want to resend deleted message in same chat     
};
