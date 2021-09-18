const { readdirSync } = require("fs");
const config = require("../config.json")
const ascii = require("ascii-table");
let table = new ascii("Commands");
const functions = require("../functions")
table.setHeading("Command", "Load status");
module.exports = (client) => {
    readdirSync("./commands/").forEach(dir => {
        const commands = readdirSync(`./commands/${dir}/`).filter(file => file.endsWith('.js'));
        for (let file of commands) {
            let pull = require(`../commands/${dir}/${file}`);
            if (pull.name) {
                client.commands.set(pull.name, pull);
                table.addRow(file, '✅')
            } else {
                table.addRow(file, '❌ -> Missing a help.name, or help.name is not a string.')
                continue;
            } if (pull.aliases && Array.isArray(pull.aliases)) pull.aliases.forEach(alias => client.aliases.set(alias, pull.name))
        }
    });

    const guildonlycounter = new Map();
    client.on("ready", () => {
        console.log(`Bot User ${client.user.username} has been logged in and is ready to use!`);
        client.user.setActivity(`${config.prefix}help`, {
            type: 'LISTENING'
        });
    });
    client.distube
        .on("playSong", async (message, queue, song) => {

            client.infos.set("global", Number(client.infos.get("global", "songs")) + 1, "songs");

            try {
                queue.connection.voice.setDeaf(true);
            } catch (error) {
                console.error(error)
            }
            try {
                queue.connection.voice.setSelfDeaf(true);
            } catch (error) {
                console.error(error)
            }
            try {
                functions.playsongyes(client, message, queue, song);
            } catch (error) {
                console.error(error)
                
            }
        })
        .on("addSong", (message, queue, song) => {
            try {
                return functions.embedbuilder(client, 7500, message, config.colors.yes, "Added a Song!", `Song: [\`${song.name}\`](${song.url})  -  \`${song.formattedDuration}\` \n\nRequested by: ${song.user}`, song.thumbnail)
            } catch (error) {
                console.error(error)
            }
        })
        .on("playList", (message, queue, playlist, song) => {
            try {
                queue.connection.voice.setDeaf(true);
            } catch (error) {
                console.error(error)
            }
            try {
                queue.connection.voice.setSelfDeaf(true);
            } catch (error) {
                console.error(error)
                
            }
            functions.embedbuilder(client, 7500, message, config.colors.yes, "Added a Playlist!", `Playlist: [\`${playlist.name}\`](${playlist.url ? playlist.url : ""})  -  \`${playlist.songs.length ? playlist.songs.length : "undefinied"} songs\` \n\nRequested by: ${queue.songs[0].user ? queue.songs[0].user : "error"}`, playlist.thumbnail.url ? playlist.thumbnail.url : "")

            try {
                functions.playsongyes(client, message, queue, queue.songs[0]);
            } catch (error) {
                console.error(error)
            }
        })
        .on("addList", (message, queue, playlist) => {
            try {
                return functions.embedbuilder(client, 7500, message, config.colors.yes, "Added a Playlist!", `Playlist: [\`${playlist.name}\`](${playlist.url ? playlist.url : ""})  -  \`${playlist.songs.length ? playlist.songs.length : "undefinied"} songs\` \n\nRequested by: ${queue.songs[0].user ? queue.songs[0].user : "error"}`, playlist.thumbnail.url ? playlist.thumbnail.url : "")
            } catch (error) {
                console.error(error)
            }
        })
        .on("searchResult", (message, result) => {
            try {
                let i = 0;
                return functions.embedbuilder(client, "null", message, config.colors.yes, "", `**Choose an option from below**\n${result.map(song => `**${++i}**. [${song.name}](${song.url}) - \`${song.formattedDuration}\``).join("\n")}\n*Enter anything else or wait 60 seconds to cancel*`)
            } catch (error) {
                console.error(error)
            }
        })
        .on("searchCancel", (message) => {
            try {
                message.reactions.removeAll();
                message.react("❌")
            } catch (error) {
                console.error(error)
            }
            try {
                return functions.embedbuilder(client, 5000, message, config.colors.yes, `Searching canceled`, "")
            } catch (error) {
                console.error(error)
                
            }
        })
        .on("error", (message, err) => {
            try {
                message.reactions.removeAll();
               // message.react("❌")
            } catch (error) {
                console.error(error)
            }
            console.log(err);
            try {
                return;
            } catch (error) {
                console.error(error)
            }
        })
        .on("noRelated", message => {
            try {
                return functions.embedbuilder(client, 5000, message, config.colors.yes, "Can't find related video to play. Stop playing music.")
            } catch (error) {
                console.error(error)
                
            }
        })
        .on("initQueue", queue => {
            try {
                queue.autoplay = false;
                queue.volume = 75;
                queue.filter = "bassboost6";
            } catch (error) {
                console.error(error)
                functions.errorbuilder(error.stack.toString().substr(0, 2000))
            }
        });

    console.log(table.toString());
}
