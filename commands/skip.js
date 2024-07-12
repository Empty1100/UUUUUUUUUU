const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { Player, QueueRepeatMode, QueryType } = require('discord-player');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("skip a song"),
    async execute (client, interaction) {
        const queue = await client.player.getQueue(interaction.guild);
        if (!queue.playing) return interaction.reply({ content: "ไม่มีเพลงที่กำลังเล่นอยู่", ephemeral: true });
        await queue.skip();
        interaction.reply({ content: `ข้ามเพลง ${queue.current.title} แล้ว`, ephemeral: true });
    }
}