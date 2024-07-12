const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js')
const { Player, QueueRepeatMode, QueryType } = require('discord-player');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("resume")
    .setDescription("resume a song"),
    async execute (client, interaction) {
        const queue = await client.player.getQueue(interaction.guild);
        if (!queue.playing) return interaction.reply({ content: "ไม่มีเพลงที่กำลังเล่นอยู่", ephemeral: true });
        await queue.setPaused(false);
        interaction.reply({ content: "เริ่มเพลงแล้ว", ephemeral: true });
    }
}