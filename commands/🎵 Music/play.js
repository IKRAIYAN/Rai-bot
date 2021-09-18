const { Client, Message, MessageEmbed } = require('discord.js');
const functions = require("../../functions")
const config = require("../../config.json")
var {
  getData,
  getPreview,
  getTracks
} = require("spotify-url-info");
//const DeezerPublicApi = require('deezer-public-api');
//let deezer = new DeezerPublicApi();
/** 
  * @param {Client} client 
  * @param {Message} message 
  * @param {String[]} args 
  */
module.exports = {
  name: "play",
  category: "MUSIC COMMANDS",
  aliases: ["p"],
  cooldown: 0,
  useage: "play <URL/NAME>",
  description: "Plays a song, from youtube, soundcloud or whatever, or search it, or play a playlist",
  run: async (client, message, args, song) => {
    //if not a dj, return error Disabled - Because not needed 
    //if(functions.check_if_dj(message))
    //return functions.embedbuilder(client, 6000, message, config.colors.no, "DJ-ROLE", `❌ You don\'t have permission for this Command! You need to have: ${functions.check_if_dj(message)}`)

    //if member not connected return error
    if (!message.member.voice.channel) return functions.embedbuilder(client, 5000, message, config.colors.no, "`" + message.author.tag + "`" + " You must join a Voice Channel")

    //if they are not in the same channel, return error only check if connected
    if (message.guild.me.voice.channel && message.member.voice.channel.id != message.guild.me.voice.channel.id) return functions.embedbuilder(client, 5000, message, config.colors.no, "`" + message.author.tag + "`" + " You must join my Voice Channel: " + ` \`${message.guild.me.voice.channel.name ? message.guild.me.voice.channel.name : ""}\``)

    //if no arguments return error
    if (!args[0]) return functions.embedbuilder(client, 5000, message, config.colors.no, "`" + message.author.tag + "`" + " Please add something you wanna search to")

    //if not allowed to CONNECT to the CHANNEL
    if (!message.guild.me.permissionsIn(message.member.voice.channel).has("CONNECT")) return functions.embedbuilder(client, 5000, message, config.colors.no, "`" + message.author.tag + "`" + " I am not allowed to \`join\` your Channel")

    //If bot not connected, join the channel
    if (!message.guild.me.voice.channel)
      message.member.voice.channel.join().catch(e => {
        //send error if not possible
        return functions.embedbuilder(client, 5000, message, config.colors.no, "`" + message.author.tag + "`" + " I am not allowed to \`join\` your Channel")
      })

    //if not allowed to CONNECT to the CHANNEL
    if (!message.guild.me.permissionsIn(message.member.voice.channel).has("SPEAK")) return functions.embedbuilder(client, 5000, message, config.colors.no, "`" + message.author.tag + "`" + " I am not allowed to \`speak\` your Channel")

    //send information message
    functions.embedbuilder(client, 5000, message, config.colors.yes, "🎶  I AM Searching Your Song , Hehe!!")

    //do things for deezer
    if (args.join(" ").includes("deezer")) {
      //Get album list for the given artist id
      message.reply("Sadly I don't support Deezer playlist :(")
    }
    //do things for spotify track
     else if (args.join(" ").includes("track") && args.join(" ").includes("open.spotify.com")) {
      //get data
      let info = await getPreview(args.join(" "));
      //play track
      return client.distube.play(message, info.artist + " " + info.title);
    }

    //do things for spotify playlist
    else if(args.join(" ").toLowerCase().includes("spotify") && args.join(" ").toLowerCase().includes("playlist")){
      let song = await getTracks(args.join(" ")).then(result => {
        for(const song of result)
        client.distube.play(message, song.name)
      })
    }
    //just play it
    else {
      return client.distube.play(message, args.join(" "));
    }
  }
};
