const {
    MessageEmbed
} = require("discord.js");
const {
    stripIndents
} = require("common-tags");

const config = require("../../config.json")
const devname = config.devname
const { readdirSync } = require("fs");
const prefix = require("../../config.json").prefix;
module.exports = {
    name: "help",
    aliases: ["h"],
    cooldown: 3,
    category: "INFORMATION COMMANDS",
    description: "Returns all commands, or one specific command info",
    useage: "help [Command]",
    run: async (client, message, args) => {
        const roleColor =
            message.guild.me.displayHexColor === "#000000"
                ? "#ffffff"
                : message.guild.me.displayHexColor;

        if (!args[0]) {
            let categories = [];

            readdirSync("./commands/").forEach((dir) => {
                const commands = readdirSync(`./commands/${dir}/`).filter((file) =>
                    file.endsWith(".js")
                );

                const cmds = commands.map((command) => {
                    let file = require(`../../commands/${dir}/${command}`);

                    if (!file.name) return "No command name.";

                    let name = file.name.replace(".js", "");

                    return `\`${name}\``;
                });

                let data = new Object();

                data = {
                    name: dir.toUpperCase(),
                    value: cmds.length === 0 ? "In progress." : cmds.join(" "),
                };

                categories.push(data);
            });

            const embed = new MessageEmbed()
                .setTitle(`Need some Music?? ${message.author.username}`)
                //.addFields(categories)
                .addField("🌀 Info - 3", `\`botinfo\` | \`help\` | \`invite\` |`)
                .addField("🎵 Music - 23", `\`autoplay\` | \`clearqueue\` | \`grab\` | \`join\` | \`jump\` | \`loop\` | \`lyrics\` | \`moveme\` | \`pause\` | \`play\` | \`playskip\` | \`queue\` | \`removetrack\` | \`replay\` | \`resume\` | \`rewind\` | \`search\` | \`seek\` | \`shuffle\` | \`skip\` | \`nowplaying\` | \`stop\` | \`volume\` | `)
                .addField("🎵 Music Filters - 22", `\`8d\` | \`bassboost\` | \`clear\` | \`earrape\` | \`echo\` | \`flanger\` | \`gate\` | \`heavybass\` | \`lightbass\` | \`karaoke\` | \`mcompand\` | \`nightcore\` | \`phaser\` | \`pulsator\` | \`purebass\` | \`reverse\` | \`subboost\` | \`surrounding\` | \`treble\` | \`tremolo\` | \`vaporwave\` | \`vibrato\` | `)
                .addField('🔗 Links', `
  **[Support Server](https://discord.gg/fanZGVFYmn)** | **[Invite Me](https://discord.com/api/oauth2/authorize?client_id=883576766503997440&permissions=8&scope=bot%20applications.commands)** |
  `, false)
                .setDescription(
                    `Use \`${prefix}help\` followed by a command name to get more additional information on a command. For example: \`${prefix}help play\`.`
                )
                .setThumbnail(client.user.displayAvatarURL())
                .setColor("BLUE")
            return message.channel.send(embed);
        } else {
            const command =
                client.commands.get(args[0].toLowerCase()) ||
                client.commands.find(
                    (c) => c.aliases && c.aliases.includes(args[0].toLowerCase())
                );

            if (!command) {
                const embed = new MessageEmbed()
                    .setTitle(`Invalid command! Use <@883576766503997440> help
 for all of my commands!`)
                    .setColor(config.colors.yes)
                return message.channel.send(embed);
            }

            const embed = new MessageEmbed()
                .setTitle("Command Details:")
                .setThumbnail(client.user.displayAvatarURL())
                .addField("PREFIX:", `<@883576766503997440> help
`, true)
                .addField(
                    "COMMAND:",
                    command.name ? `\`${command.name}\`` : "No name for this command.", true
                )
                .addField(
                    "ALIASES:",
                    command.aliases
                        ? `\`${command.aliases.join("` `")}\``
                        : "No aliases for this command.", true
                )
                .addField(
                    "USAGE:",
                    command.usage
                        ? `<@883576766503997440> help
${command.name} ${command.usage}`
                        : `<@883576766503997440> help
${command.name}`, true
                )
                .addField(
                    "DESCRIPTION:",
                    command.description
                        ? command.description
                        : "No description for this command."
                )
                .setFooter(
                    `Requested by ${message.author.tag}`,
                    message.author.displayAvatarURL({ dynamic: true })
                )
                .setTimestamp()
                .setColor(config.colors.yes)
            return message.channel.send(embed);
        }
    }
}
