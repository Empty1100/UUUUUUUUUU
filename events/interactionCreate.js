const { MessageEmbed } = require('discord.js');
const client = require("../index.js");

client.on("interactionCreate", async (interaction) => {
    if(!interaction.isCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if(!command) return;
    try {
        await command.execute(client, interaction);
    } catch(err) {
        if (err) console.error(err);
        await interaction.reply({ embeds: [new MessageEmbed().setTitle('สถานะ: ผิดพลาด').setDescription(`\`\`\`มีบางอย่างผิดพลาด\`\`\``).setColor('#ff0000')], ephemeral: true });
    }
});