const { Player, QueueRepeatMode, QueryType } = require('discord-player');
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");


module.exports = {
    data: new SlashCommandBuilder()
    .setName("loop")
    .setDescription("loop a song")
    .addStringOption(options =>
        options
        .setName("mode")
        .setDescription("loop mode")
        .setRequired(true)
        .addChoices(
            {
                name: "off",
                value: `off`
            },
            {
                name: "track",
                value: `track`
            },
            {
                name: "queue",
                value: `queue`
            },
        )
    ),
    async execute (client, interaction) {
        const queue = await client.player.getQueue(interaction.guild.id);
        if (!queue) return interaction.reply({ content: "ไม่มีเพลงที่กำลังเล่นอยู่", ephemeral: true });
        const loopmode = interaction.options.getString("mode");
        if(loopmode === `off`) {
            queue.setRepeatMode(QueueRepeatMode.OFF);
            interaction.reply({ content: `ปิดลูบแล้ว!`, ephemeral: true });
        } else if(loopmode === `track`) {
            queue.setRepeatMode(QueueRepeatMode.TRACK);;
            interaction.reply({ content: `เปิดลูบแล้ว! เฉพาะเพลงที่กำลังเล่นอยู่`, ephemeral: true });
        } else if(loopmode === `queue`) {
            queue.setRepeatMode(QueueRepeatMode.QUEUE);
            interaction.reply({ content: `เปิดลูบแล้ว! เฉพาะคิวที่กำลังเล่นอยู่`, ephemeral: true });
        }
    }
}