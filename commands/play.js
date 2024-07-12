const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js')
const { Player, QueueRepeatMode, QueryType } = require('discord-player');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("play a song")
    .addStringOption(options =>
        options
        .setName("song")
        .setDescription("the song to play")
        .setRequired(true)
    ),
    async execute (client, interaction) {
        await interaction.deferReply();
        const user_id = interaction.user.id;
        const song = interaction.options.getString("song");
        const queue = await client.player.createQueue(interaction.guild);
        if (!queue.connection) await queue.connect(interaction.member.voice.channel);
        const result = await client.player.search(song, {
            requestedBy: user_id,
            searchEngine: QueryType.AUTO
        });
        if(!result.tracks[0]) return interaction.reply({ content: "ไม่พบเพลงที่คุณต้องการ" });
        await queue.addTrack(result.tracks[0]);

        const trackaddembed = new MessageEmbed()
        .setDescription(`**[${result.tracks[0].title}](${result.tracks[0].url}) ถูกเพิ่มในคิวแล้ว 🎶**`)
        .setColor("GREEN")
        interaction.followUp({ embeds: [trackaddembed] });
        if(!queue.playing) await queue.play();
    }
};