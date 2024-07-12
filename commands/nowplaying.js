const { Player, QueueRepeatMode, QueryType } = require('discord-player');
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("nowplaying")
    .setDescription("show the current song"),
    async execute (client, interaction) {
        const queue = await client.player.getQueue(interaction.guild);
        if (!queue) return interaction.reply({ content: "ไม่มีเพลงอยู่ในคิว", ephemeral: true });
        const track = queue.current;

        let queuerepeat = "ปิด";
        if(queue.repeatMode === QueueRepeatMode.OFF) {
            queuerepeat = "ปิด";
        } else if(queue.repeatMode === QueueRepeatMode.TRACK) {
            queuerepeat = "เปิด เฉพาะเพลงที่กำลังเล่นอยู่";
        } else if(queue.repeatMode === QueueRepeatMode.QUEUE) {
            queuerepeat = "เปิด เฉพาะคิวที่กำลังเล่นอยู่";
        }
        const embed = new MessageEmbed()
        .setTitle(`[${track.duration}] | ${track.title}`)
        .addFields(
            {
                name: `🎧 \`ห้องเสียง\``,
                value: `└ **${interaction.member.voice.channel}**`,
                inline: false
            },
            {
                name: `🔊 \`ระดับเสียง\``,
                value: `└ **${queue.volume}%**`,
                inline: false
            },
            {
                name: `🔄 \`เล่นซ้ำ\``,
                value: `└ **${queuerepeat}**`,
                inline: false
            },
            {
                name: `🔎 \`ขอเพลงโดย\``,
                value: `└ **${interaction.user}**`,
                inline: false
            }
        )
        .setColor("#0099ff")
        .setThumbnail(track.thumbnail)

        interaction.reply({ embeds: [embed], ephemeral: true });
    }
}