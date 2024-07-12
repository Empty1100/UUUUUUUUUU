const Discord = require('discord.js');
const { Client, Collection } = require('discord.js');
const client = new Discord.Client({
    intents: 32767
});
const { Player } = require("discord-player");

module.exports = client;
client.config = require('./config/config.json');
client.commands = new Collection();
client.player = new Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25
    }
});


require("./handler")(client);


client.login(client.config.token);