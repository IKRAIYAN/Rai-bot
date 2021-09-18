const {  Message, MessageEmbed, Client } = require('discord.js');
const config = require('../../config.json')
const os = require("os")
module.exports = {
    name: 'botinfo',
    aliases: ['botstats'],
    description: 'Get my Info',
    useage: 'botinfo',
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async (client, message, args) => {
      function formatBytes(a, b) {
		let c = 1024; // 1 GB = 1024 MB
		d = b || 2;
		e = ['B', 'KB', 'MB', 'GB', 'TB'];
		f = Math.floor(Math.log(a) / Math.log(c));

		return parseFloat((a / Math.pow(c, f)).toFixed(d)) + '' + e[f];
	}
	const core = os.cpus()[0];
  let days = Math.floor(client.uptime / 86400000);
    let hours = Math.floor(client.uptime / 3600000) % 24;
    let minutes = Math.floor(client.uptime / 60000) % 60;
    let seconds = Math.floor(client.uptime / 1000) % 60;
  const embed = new MessageEmbed()
  .setColor(`BLUE`)
		  .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
		  .setAuthor(`User info for ${client.user.username}`, client.user.displayAvatarURL({ dynamic: true }))
      .addField("Username", client.user.username, true)
      .addField("Discriminator", `#${client.user.discriminator}`, true)
      .addField("Bot ID", client.user.id, true)
      .addField("🏓 Bot Latency", `${Date.now() - message.createdTimestamp} ms`, true)
      .addField("🏓 Api Latency", `${client.ws.ping}ms`, true)
      .addField("Uptime", `\`${days}d\` \`${hours}h\` \`${minutes}m\` \`${seconds}s\``, true)
      .addField("Cores", `${os.cpus().length}`, true)
      .addField("Core Model", `${core.model}`, true)
      .addField("Core Speed", `${core.speed} MHz`, true)
      .addField("Memory Usage", formatBytes(process.memoryUsage().heapUsed), true)
      .addField("Node Version", process.version, true)
      .addField("Users", `${client.guilds.cache
					.reduce((a, b) => a + b.memberCount, 0)
					.toLocaleString()}`, true)
      .addField("Servers", ` ${client.guilds.cache.size}`, true)
      .addField("Joined Discord", new Date(client.user.createdAt).toLocaleDateString(), true)
      .addField("Developer", `<@772443932646178836>`, true)

	await message.channel.send(embed);
    }
}