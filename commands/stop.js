const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("stop the music"),
    async execute (client, interaction) {
        const queue = await client.player.getQueue(interaction.guild);
        if (!queue.playing) return interaction.reply({ content: "ไม่มีเพลงที่กำลังเล่นอยู่", ephemeral: true });
        queue.destroy();
        interaction.reply({ content: "หยุดเพลงแล้ว", ephemeral: true });
    }
}