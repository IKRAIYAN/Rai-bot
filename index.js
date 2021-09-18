
const config = require("./config.json");
const { Client, Collection, } = require("discord.js");
//const keepAlive = require('./keepalive')
const Discord = require('discord.js');
const fs = require("fs");
const DisTube = require("distube");
//creating the client
const client = new Client({
    fetchAllMembers: false,
    restTimeOffset: 0,
    shards: "auto",
    disableEveryone: true
});

client.commands = new Collection();
client.queue = new Map();
client.aliases = new Collection();
const cooldowns = new Collection();
let prefix = config.prefix;
client.distube = new DisTube(client, {
    youtubeCookie: config.cookie,
    emitNewSongOnly: true,
    highWaterMark: 1024 * 1024 * 64,
    leaveOnEmpty: false,
    leaveOnFinish: false,
    leaveOnStop: false,
    searchSongs: false,
    youtubeDL: true,
    updateYouTubeDL: false,
    customFilters: config.customs
})
client.setMaxListeners(0);
require('events').defaultMaxListeners = 0;
//Externalfiles setups
client.categories = fs.readdirSync("./commands/");
["command"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});
const functions = require("./functions")
//databases setups
const Enmap = require("enmap");
client.settings = new Enmap({
    name: "settings",
    dataDir: "./databases/settings"
});
client.infos = new Enmap({
    name: "infos",
    dataDir: "./databases/infos"
});
client.custom = new Enmap({
    name: "custom",
    dataDir: "./databases/playlist"
});
client.custom2 = new Enmap({
    name: "custom",
    dataDir: "./databases/playlist2"
});

function escapeRegex(str) {
    try {
        return str.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
    } catch (e) {
        console.log(String(e.stack).bgRed)
    }
}


client.on("message", async message => {
    if (message.author.bot) return;
    if (!message.guild) return;
    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);

    if (!prefixRegex.test(message.content)) return;
    const [, matchedPrefix] = message.content.match(prefixRegex);

    prefix = matchedPrefix;

    if (!message.content.startsWith(prefix) && message.content.includes(client.user.id))
        if (!message.guild.me.permissionsIn(message.channel).has("EMBED_LINKS"))
            message.reply(new Discord.MessageEmbed().setColor("BLUE").setAuthor(message.author.username, message.author.displayAvatarURL({
                dynamic: true
            })));
        else
            message.reply(`${message.author.username},  Type <@883576766503997440> help
 for all the commands`)
    if (!message.content.startsWith(prefix)) return;

    //if not allowed to send embeds, return that
    if (!message.guild.me.permissionsIn(message.channel).has("EMBED_LINKS"))
        return message.reply("**:x: I am missing the Permission to `EMBED_LINKS`**")

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    if (cmd.length === 0) return;
    let command = client.commands.get(cmd);
    if (!command) command = client.commands.get(client.aliases.get(cmd));
    if (command) {
        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Collection());
        }

        const now = Date.now();
        const timestamps = cooldowns.get(command.name);
        const cooldownAmount = (command.cooldown || 2) * 1000;

        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return message.reply(
                    `Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`
                );
            }
        }

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

        client.infos.set("global", Number(client.infos.get("global", "cmds")) + 1, "cmds");

        message.react("✅").catch(e => console.log("COULD NOT REACT F"))

        try {
            command.run(client, message, args);
        } catch (error) {
            console.error(error)
        }
    } else
        return;
});


client.on('message', async (message) => {
    if (!message.guild) return;
    if (message.author.bot) return;
    if (message.channel.partial) await message.channel.fetch();
    if (message.partial) await message.fetch();
    let prefix = config.prefix
    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
    if (!prefixRegex.test(message.content)) return;
    const [, matchedPrefix] = message.content.match(prefixRegex);
    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
    const cmd = args.shift().toLowerCase();
    if (cmd.length === 0) {
        if (matchedPrefix.includes(client.user.id)) {
            return message.channel.send(new Discord.MessageEmbed()
                .setColor("BLUE")
                .setDescription(`Hello there buddy, Want some musiccc???  Type <@883576766503997440> help
 for all my commands`)
            )
        }
    }
})


client.on("guildCreate", (guild) => {
  let channelToSend;

  guild.channels.cache.forEach((channel) => {
    if(channel.type === 'text' &&
    !channelToSend &&
    channel.permissionsFor(guild.me).has('SEND_MESSAGES')
    ) channelToSend = channel;
  });

  if(!channelToSend) return;
  channelToSend.send(
    new Discord.MessageEmbed()
    .setAuthor(guild.name, guild.iconURL({ dynamic: true }))
     .setThumbnail(client.user.displayAvatarURL())
    .setDescription(`Hello there. I am Rai. A Music Bot written in Javascript. It has so many music commands and custom music filters, 24/7 vc stay, spotify and soundcloud support, 360kbps audio quality and many more. Thank you so much for inviting me. <@883576766503997440> help
 :kissing:\n Join my support server - [Support Server](https://discord.gg/fanZGVFYmn) Thank you so much. Love you all UwU`)
    .setColor('BLUE')
    .setFooter("DM the bot developer: I_K_RAIYAN#9742")
    .setTimestamp()
  )
})


//keepAlive();
client.login(config.token);
