const { Player, QueueRepeatMode, QueryType } = require('discord-player');
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("volume")
    .setDescription("set volume")
    .addNumberOption(options =>
        options
        .setName("volume")
        .setDescription("volume")
        .setRequired(true)
    ),
    async execute (client, interaction) {
        const number = interaction.options.getNumber("volume");
        const queue = client.player.getQueue(interaction.message.guild.id);
        if (!queue.playing) return interaction.reply({ content: "ไม่มีเพลงที่กำลังเล่นอยู่", ephemeral: true });
        if (number < 0 || number > 100) return interaction.reply({ content: `ไม่สามารถตั้งค่าเสียงให้เป็นค่า ${number} ได้ | 0-100`, ephemeral: true });
        const success = queue.setVolume(number);
        interaction.reply({ content: success ? `ปรับเสียงเป็น ${number}/100 แล้ว!` : "ไม่สามารถปรับเสียงได้", ephemeral: true });
    }
}