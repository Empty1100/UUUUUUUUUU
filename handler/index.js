const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { MessageEmbed } = require('discord.js');

/**
 * @param {Client} client
 */
module.exports = async (client) => {
    const rest = new REST({ version: '9' }).setToken(client.config.token);
    const commands = [];
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`../commands/${file}`);
        commands.push(command.data.toJSON());
        client.commands.set(command.data.name, command);
    }
    await rest.put(
        Routes.applicationCommands('970942652285599784'),
        { body: commands },
    );
    const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
    eventFiles.map((value) => require(`../events/${value}`));
    console.log(`[Event] ${eventFiles.length} loaded!`);
}   