const functions = require("../../functions")
const Discord = require("discord.js")
const config = require("../../config.json")
//const length = require("length")
//const ksoft = new KSoftClient('AIzaSyAAg3GHxipuyDz7KsCAv434yoFT56TR9LQ');
module.exports = {
  name: "lyrics",
  category: "MUSIC COMMANDS",
  aliases: ["ly"],
  cooldown: 0,
  useage: "lyrics",
  description: "Shows the lyrics of the current song",
  run: async (client, message, args) => {
    /*if (!message.guild.me.voice.channel) return functions.embedbuilder(client, 3000, message, config.colors.no, "Nothing playing!")

        //if member not connected return error
        if (!message.member.voice.channel) return functions.embedbuilder(client, 5000, message, config.colors.no, "`" + message.author.tag + "`" + " You must join a Voice Channel")

        //if they are not in the same channel, return error
        if (message.member.voice.channel.id != message.guild.me.voice.channel.id) return functions.embedbuilder(client, 5000, message, config.colors.no, "`" + message.author.tag + "`" + " You must join my Voice Channel: " + ` \`${message.guild.me.voice.channel.name ? message.guild.me.voice.channel.name : ""}\``)

        //get the queue
        let queue = client.distube.getQueue(message);

        //if no queue return error
        if (!queue) return functions.embedbuilder("null", message, config.colors.no, "There is nothing playing!");

        let cursong = queue.songs[0];
        functions.embedbuilder(client, 3000, message, config.colors.yes, "Searching!", cursong.name);
        let lyrics;

         ksoft.lyrics.get(cursong.name).then(
            async track => {
                if (!track.lyrics) return message.reply("NO LYRICS FOUND!");
                lyrics = track.lyrics;


                let currentPage = 0;
                const embeds = functions.lyricsEmbed(client, message, lyrics, cursong);

                const queueEmbed = await message.channel.send(
                    `**Current Page - ${currentPage + 1}/${embeds.length}**`,
                    embeds[currentPage]
                );

                try {
                    await queueEmbed.react("⬅️");
                    await queueEmbed.react("➡️");
                    await queueEmbed.react("⏹");
                } catch (error) {
                    console.error(error);
                }

                const filter = (reaction, user) => ["⬅️", "⏹", "➡️"].includes(reaction.emoji.id || reaction.emoji.name) && message.author.id === user.id;
                const collector = queueEmbed.createReactionCollector(filter, {
                    time: 60000
                });

                collector.on("collect", async (reaction, user) => {
                    try {
                        if (reaction.emoji.id === "➡️" || reaction.emoji.name === "➡️") {
                            if (currentPage < embeds.length - 1) {
                                currentPage++;
                                queueEmbed.edit(`**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds[currentPage]);
                            }
                        } else if (reaction.emoji.id === "➡️" || reaction.emoji.name === "⬅️") {
                            if (currentPage !== 0) {
                                --currentPage;
                                queueEmbed.edit(`**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds[currentPage]);
                            }
                        } else {
                            collector.stop();
                            reaction.message.reactions.removeAll();
                        }
                        await reaction.users.remove(message.author.id);
                    } catch (error) {
                        console.log(error)
                    }
                });

            });
            */
    message.channel.send("Unfortunately the lyrics command is still under construction :(")
  }
  }
