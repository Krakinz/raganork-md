/* Copyright (C) 2022 Sourav KL11.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
Raganork MD - Sourav KL11
*/
const {
    getString
} = require('./misc/lang');
const {
      saveMessage
  } = require('./misc/saveMessage');
const Lang = getString('group');
const {
    isAdmin,
    isNumeric,
    mentionjid
} = require('./misc/misc');
const {
    Module
} = require('../main')
Module({
    pattern: 'kick ?(.*)',
    fromMe: true,
    desc: Lang.KICK_DESC
}, (async (message, match) => {
    if (!message.jid.endsWith('@g.us')) return await message.sendMessage(Lang.GROUP_COMMAND)
    var {
        participants
    } = await message.client.groupMetadata(message.jid)
    if (match[1]) {
        if (isNumeric(match[1])) {
            var admin = await isAdmin(message);
            if (!admin) return await message.sendReply(Lang.NOT_ADMIN)
            await message.sendMessage(`_Removing all numbers starting with ${match[1]}_`)
            await new Promise((r) => setTimeout(r, 3000))
            let users = participants.filter((member) => member.id.startsWith(match[1]))
            for (let member of users) {
                await new Promise((r) => setTimeout(r, 1000))
                await message.client.groupParticipantsUpdate(message.jid, [member.id], "remove")
            }
            return;
        }
    }
    const user = message.mention[0] || message.reply_message.jid
    if (!user) return await message.sendReply(Lang.NEED_USER)
    var admin = await isAdmin(message);
    if (!admin) return await message.sendReply(Lang.NOT_ADMIN)
    await message.client.sendMessage(message.jid, {
        text: mentionjid(user) + Lang.KICKED,
        mentions: [user]
    })
    await message.client.groupParticipantsUpdate(message.jid, [user], "remove")
}))
Module({
    pattern: 'add ?(.*)',
    fromMe: true,
    desc: Lang.ADD_DESC
}, (async (message, match) => {
    if (!message.jid.endsWith('@g.us')) return await message.sendMessage(Lang.GROUP_COMMAND)
    var init = match[1]
    if (!init) return await message.sendReply(Lang.NEED_USER)
    var admin = await isAdmin(message);
    if (!admin) return await message.sendReply(Lang.NOT_ADMIN)
    var initt = init.split(" ").join("")
    var user = initt.replace(/\+/g, '').replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', '').replace(/\(/g, '').replace(/\)/g, '').replace(/-/g, '')
    var jids = [];
    var msg = '';
    numbers = user.split(',');
    numbers.map((number) => {
        msg += '@' + number + '\n'
        jids.push(number + '@s.whatsapp.net');
    });
    await message.client.groupParticipantsUpdate(message.jid, jids, "add")
    await message.client.sendMessage(message.jid, {
        text: msg + ' ' + Lang.ADDED,
        mentions: jids
    })
}))
Module({
    pattern: 'promote',
    fromMe: true,
    desc: Lang.PROMOTE_DESC
}, (async (message, match) => {
    const user = message.mention[0] || message.reply_message.jid
    if (!user) return await message.sendReply(Lang.NEED_USER)
    if (!message.jid.endsWith('@g.us')) return await message.sendMessage(Lang.GROUP_COMMAND)
    var admin = await isAdmin(message);
    if (!admin) return await message.sendReply(Lang.NOT_ADMIN)
    await message.client.sendMessage(message.jid, {
        text: mentionjid(user) + Lang.PROMOTED,
        mentions: [user]
    })
    await message.client.groupParticipantsUpdate(message.jid, [user], "promote")
}))
Module({
    pattern: 'leave',
    fromMe: true,
    desc: Lang.LEAVE_DESC
}, (async (message, match) => {
    
    return await message.client.groupLeave(message.jid);
}))
Module({
    pattern: 'demote',
    fromMe: true,
    desc: Lang.DEMOTE_DESC
}, (async (message, match) => {
    if (!message.jid.endsWith('@g.us')) return await message.sendMessage(Lang.GROUP_COMMAND)
    const user = message.mention[0] || message.reply_message.jid
    if (!user) return await message.sendReply(Lang.NEED_USER)
    var admin = await isAdmin(message);
    if (!admin) return await message.sendReply(Lang.NOT_ADMIN)
    await message.client.sendMessage(message.jid, {
        text: mentionjid(user) + Lang.DEMOTED,
        mentions: [user]
    })
    await message.client.groupParticipantsUpdate(message.jid, [message.reply_message.jid], "demote")
}))
Module({
    pattern: 'mute',
    fromMe: true,
    desc: Lang.MUTE_DESC
}, (async (message, match) => {
    if (!message.jid.endsWith('@g.us')) return await message.sendMessage(Lang.GROUP_COMMAND)
    var admin = await isAdmin(message);
    if (!admin) return await message.sendReply(Lang.NOT_ADMIN)
    await message.client.groupSettingUpdate(message.jid, 'announcement')
    await message.sendMessage(Lang.MUTED)
}))
Module({
    pattern: 'unmute',
    fromMe: true,
    desc: Lang.UNMUTE_DESC
}, (async (message, match) => {
    if (!message.jid.endsWith('@g.us')) return await message.sendMessage(Lang.GROUP_COMMAND)
    var admin = await isAdmin(message);
    if (!admin) return await message.sendReply(Lang.NOT_ADMIN)
    await message.client.groupSettingUpdate(message.jid, 'not_announcement')
    await message.sendMessage(Lang.UNMUTED)
}))
Module({
    pattern: 'jid',
    fromMe: true,
    desc: Lang.JID_DESC
}, (async (message, match) => {
    var jid = message.reply_message.jid || message.jid
    await message.sendReply(jid)
}))
Module({
    pattern: 'invite',
    fromMe: true,
    desc: Lang.INVITE_DESC
}, (async (message, match) => {
    if (!message.jid.endsWith('@g.us')) return await message.sendMessage(Lang.GROUP_COMMAND)
    var admin = await isAdmin(message);
    if (!admin) return await message.sendReply(Lang.NOT_ADMIN)
    var code = await message.client.groupInviteCode(message.jid)
    await message.client.sendMessage(message.jid, {
        text: "https://chat.whatsapp.com/" + code
    })
}))
Module({
    pattern: 'revoke',
    fromMe: true,
    desc: Lang.REVOKE_DESC
}, (async (message, match) => {
    if (!message.jid.endsWith('@g.us')) return await message.sendMessage(Lang.GROUP_COMMAND)
    var admin = await isAdmin(message);
    if (!admin) return await message.sendReply(Lang.NOT_ADMIN)
    await message.client.groupRevokeInvite(message.jid)
    await message.sendMessage(Lang.REVOKED)
}))
Module({
    pattern: 'common ?(.*)',
    fromMe: true,
    desc: "Get common participants in two groups"
}, (async (message, match) => {
var co = match[1].split(",")
var g1 = (await message.client.groupMetadata(co[0])).participants
var g2 = (await message.client.groupMetadata(co[1])).participants 
var common = g1.filter(({ value: jid1 }) => g2.some(({ value: jid2 }) => jid2 === jid1));
var msg = "*Common participants*\n_count: "+common.length+"_ \n"
common.map(async s => {
msg += "```"+s.id.split("@")[0]+"```\n"
})    
return await message.sendReply(msg)
}));
Module({
    pattern: 'diff ?(.*)',
    fromMe: true,
    desc: "Get difference of participants in two groups"
}, (async (message, match) => {
var co = match[1].split(",")
var g1 = (await message.client.groupMetadata(co[0])).participants
var g2 = (await message.client.groupMetadata(co[1])).participants 
var common = g1.filter(({ value: jid1 }) => !g2.some(({ value: jid2 }) => jid2 === jid1));
var msg = "*Difference of participants*\n_count: "+common.length+"_ \n"
common.map(async s => {
msg += "```"+s.id.split("@")[0]+"``` \n"
})    
return await message.sendReply(msg)
}));
Module({
    pattern: 'tagall',
    fromMe: true,
    desc: Lang.TAGALL_DESC
}, (async (message, match) => {
    if (!message.jid.endsWith('@g.us')) return await message.sendMessage(Lang.GROUP_COMMAND)
    var group = await message.client.groupMetadata(message.jid)
    var jids = [];
    var mn = '';
    group.participants.map(async (user) => {
        mn += '@' + user.id.split('@')[0] + '\n';
        jids.push(user.id.replace('c.us', 's.whatsapp.net'));
    });
    var msg = message.reply_message.message || mn
    await message.client.sendMessage(message.jid, {
        text: msg,
        mentions: jids
    })
}))
Module({
    pattern: 'block ?(.*)',
    fromMe: true
}, (async (message, match) => {
    var isGroup = message.jid.endsWith('@g.us')
    var user = message.jid
    if (isGroup) user = message.mention[0] || message.reply_message.jid
    await message.client.updateBlockStatus(user, "block");
}));
Module({
    pattern: 'join ?(.*)',
    fromMe: true
}, (async (message, match) => {
    var rgx = /^(https?:\/\/)?chat\.whatsapp\.com\/(?:invite\/)?([a-zA-Z0-9_-]{22})$/
    if (!match[1] || !rgx.test(match[1])) return await message.sendReply("*Need group link*");
    await message.client.groupAcceptInvite(match[1].split("/")[3])
}));
Module({
    pattern: 'unblock ?(.*)',
    fromMe: true
}, (async (message, match) => {
    var isGroup = message.jid.endsWith('@g.us')
    if (!isGroup) return;
    var user = message.mention[0] || message.reply_message.jid
    await message.client.updateBlockStatus(user, "unblock");
}));
Module({
    pattern: 'pp ?(.*)',
    fromMe: true,
    desc: "Change/Get profile picture with replied message"
}, (async (message, match) => {
    if (message.reply_message && message.reply_message.image) {
    var image = await saveMessage(message.reply_message)
    await message.client.updateProfilePicture(message.client.user.id.split(":")[0]+"@s.whatsapp.net",{url: image});
    return await message.sendReply("*Updated profile pic ✅*")
}
if (message.reply_message && !message.reply_message.image) {
   try { var image = await message.client.profilePictureUrl(message.reply_message.jid,'image') } catch {return await message.sendReply("Profile pic not found!")}
   return await message.sendReply({url:image},"image")
}
}));
