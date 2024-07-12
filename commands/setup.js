const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const fs = require("fs");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("ตั้งค่าห้องเล่นเพลง"),
    async execute(client, interaction) {
        const user_id = interaction.user.id;
        const setudata = JSON.parse(fs.readFileSync("./db/setup.json", "utf8"));
        const chname = `omg-music`;
        const havch = await interaction.guild.channels.cache.find(c => c.name === chname);
        if (havch) return interaction.reply({ content: `มีห้องเล่นเพลงอยู่แล้วครับ | จะลบอัตโนมัติใน 10 วินาที` })
        .then(m => {
            setTimeout(() => {
                interaction.deleteReply();
            }, 10000);
        });

        const success = new MessageEmbed()
        .setTitle("OMG-MUSIC")
        .setDescription(`\`พิมพ์ชื่อเพลง หรือ ลิ้ง ในห้องนี้เพื่อเล่นเพลงที่ต้องการ\``)
        .setColor("BLUE")

        const loopb = new MessageButton()
        .setCustomId("loopb-id")
        .setEmoji("🔁")
        .setStyle("PRIMARY")

        const shuffleb = new MessageButton()
        .setCustomId("shuffleb-id")
        .setEmoji("🔀")
        .setStyle("SECONDARY")

        const pauseb = new MessageButton()
        .setCustomId("pauseb-id")
        .setEmoji("⏸")
        .setStyle("SUCCESS")

        const skipb = new MessageButton()
        .setCustomId("skipb-id")
        .setEmoji("⏭")
        .setStyle("SECONDARY")

        const stopallmusicb = new MessageButton()
        .setCustomId("stopallmusicb-id")
        .setEmoji("✖")
        .setStyle("DANGER")

        const increase_volumeb = new MessageButton()
        .setCustomId("increase_volumeb-id")
        .setLabel("เพิ่มเสียง")
        .setEmoji("🔊")
        .setStyle("PRIMARY")

        const decrease_volumeb = new MessageButton()
        .setCustomId("decrease_volumeb-id")
        .setLabel("ลดเสียง")
        .setEmoji("🔉")
        .setStyle("PRIMARY")

        const muteb = new MessageButton()
        .setCustomId("muteb-id")
        .setLabel("ปิด/เปิดเสียง")
        .setEmoji("🔇")
        .setStyle("PRIMARY")

        const queueallb = new MessageButton()
        .setCustomId("queueallb-id")
        .setEmoji("📄")
        .setStyle("SECONDARY")

        const row = new MessageActionRow()
        .addComponents(loopb, shuffleb, pauseb, skipb, stopallmusicb)

        const row2 = new MessageActionRow()
        .addComponents(increase_volumeb, decrease_volumeb, muteb, queueallb)

        const ch = await interaction.guild.channels.create(chname, {
            type: "GUILD_TEXT",
            reason: "OMG-MUSIC",
            topic: "พิมพ์ชื่อเพลง หรือ ลิ้ง ในห้องนี้เพื่อเล่นเพลงที่ต้องการ"
        }).then(async (ch) => {
            loopb.setDisabled(true);
            shuffleb.setDisabled(true);
            pauseb.setDisabled(true);
            skipb.setDisabled(true);
            stopallmusicb.setDisabled(true);
            increase_volumeb.setDisabled(true);
            decrease_volumeb.setDisabled(true);
            muteb.setDisabled(true);
            queueallb.setDisabled(true);
            const msg = await ch.send({ embeds: [success], components: [row, row2] });
            setudata[interaction.guild.id] = {
                chid: ch.id,
                msg: msg.id
            }
            fs.writeFileSync("./db/setup.json", JSON.stringify(setudata, null, "\t"));
        });
        interaction.reply({ content: `สร้างห้องเล่นเพลงเรียบร้อยแล้วครับ | จะลบอัตโนมัติใน 10 วินาที` })
        .then(m => {
            setTimeout(() => {
                interaction.deleteReply();
            }, 10000);
        });
    }
}
