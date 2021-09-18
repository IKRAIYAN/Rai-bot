const { Client, Message, MessageEmbed } = require('discord.js');
const config = require('../../config.json')

module.exports = {
    name: 'invite',
    aliases: ['inv'],
    description: 'get my invite link',
    useage: 'invite',
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async (client, message, args) => {
        const invite = new MessageEmbed()
		.setTitle('Invite Link')
		.setURL(
			'https://discord.com/api/oauth2/authorize?client_id=883576766503997440&permissions=8&scope=bot%20applications.commands'
		)
		.setDescription(
			`Hello there.So you wanna invite me in your cool server UwU`
		)
    	.addField('Total Servers', client.guilds.cache.size, true)
    	.addField('Total Users', client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString(), true)
		.setAuthor(message.author.username)
		.setColor('BLUE');

	message.channel.send(invite);
    }
}