const { MessageEmbed, MessageButton, MessageActionRow, Interaction } = require("discord.js");
const { QueueRepeatMode } = require("discord-player");
const client = require("../index.js");
const fs = require("fs");

client.on("messageCreate", async (message) => {
    const setupdata = JSON.parse(fs.readFileSync("./db/setup.json", "utf8"));
    if(!setupdata[message.channel.guild.id]) return;
    const ch = message.guild.channels.cache.find(c => c.id === setupdata[message.guild.id].chid);

    let ezembed = new MessageEmbed()
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

    if (ch) {
        if(message.channel.id !== ch.id) return;
        if(message.author.bot) return;
        setTimeout(() => {
            message.delete();
        }, 100);
        if(!message.member.voice.channel) return
        const queue = await client.player.createQueue(message.guild)
        if (!queue.connection) await queue.connect(message.member.voice.channel)
        const result = await client.player.search(message.content, {
            requestedBy: message.author.id
        });
        if (!result.tracks[0]) return;
        await queue.addTrack(result.tracks[0]);
        if(!queue.playing) {
            await queue.play();
        }

        let queuerepeat = "ปิด";
        if(queue.repeatMode === QueueRepeatMode.OFF) {
            queuerepeat = "ปิด";
        } else if(queue.repeatMode === QueueRepeatMode.TRACK) {
            queuerepeat = "เปิด เฉพาะเพลงที่กำลังเล่นอยู่";
        } else if(queue.repeatMode === QueueRepeatMode.QUEUE) {
            queuerepeat = "เปิด เฉพาะคิวที่กำลังเล่นอยู่";
        }
        
        client.player.on("trackStart", () => {
            loopb.setDisabled(false);
            shuffleb.setDisabled(false);
            pauseb.setDisabled(false);
            skipb.setDisabled(false);
            stopallmusicb.setDisabled(false);
            increase_volumeb.setDisabled(false);
            decrease_volumeb.setDisabled(false);
            muteb.setDisabled(false);
            queueallb.setDisabled(false);
            message.channel.messages.fetch(setupdata[message.guild.id].msg)
            .then(async (msg) => {
                const queue = await client.player.getQueue(message.guild)
                msg.edit({ embeds: [
                    new MessageEmbed()
                    .setTitle(`[${queue.current.duration}] ${queue.current.title}`)
                    .addFields(
                        {
                            name: `🎧 \`ห้องเสียง\``,
                            value: `└ **${message.member.voice.channel}**`,
                            inline: false
                        },
                        {
                            name: `🔊 \`ระดับเสียง\``,
                            value: `└ **100%**`,
                            inline: false
                        },
                        {
                            name: `🔄 \`เล่นซ้ำ\``,
                            value: `└ **${queuerepeat}**`,
                            inline: false
                        },
                        {
                            name: `🔎 \`ขอเพลงโดย\``,
                            value: `└ **${result.tracks[0].requestedBy}**`,
                            inline: false
                        }
                    )
                    .setColor("#0099ff")
                    .setImage(queue.current.thumbnail)
                    .setColor("BLUE")
                ], components: [row, row2]})
            })
        })

        client.player.on("trackEnd", () => {
            message.channel.messages.fetch(setupdata[message.guild.id].msg)
            .then(msg => {
                loopb.setDisabled(true);
                shuffleb.setDisabled(true);
                pauseb.setDisabled(true);
                skipb.setDisabled(true);
                stopallmusicb.setDisabled(true);
                increase_volumeb.setDisabled(true);
                decrease_volumeb.setDisabled(true);
                muteb.setDisabled(true);
                queueallb.setDisabled(true);
                msg.edit({ embeds: [ezembed], components: [row, row2]})
            });
        })
    }
});








client.on("interactionCreate", async (i) => {

    const setupdata = JSON.parse(fs.readFileSync("./db/setup.json", "utf8"));
    const queue = await client.player.getQueue(i.guild)

    let ezembed = new MessageEmbed()
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

    //---โซนปุ่ม---//

    if(i.isButton() && i.customId === "stopallmusicb-id") {
        await i.deferUpdate();
        const queue = await client.player.getQueue(i.guildId);
        await queue.stop()

        i.channel.messages.fetch(setupdata[i.guild.id].msg)
        .then(msg => {
            loopb.setDisabled(true);
            shuffleb.setDisabled(true);
            pauseb.setDisabled(true);
            skipb.setDisabled(true);
            stopallmusicb.setDisabled(true);
            increase_volumeb.setDisabled(true);
            decrease_volumeb.setDisabled(true);
            muteb.setDisabled(true);
            queueallb.setDisabled(true);
            msg.edit({ embeds: [ezembed], components: [row, row2]})
        })
    }
    if(i.isButton() && i.customId === "skipb-id") {
        await i.deferUpdate();
        const queue = await client.player.getQueue(i.guildId);
        await queue.skip();
    }
    if(i.isButton() && i.customId === "pauseb-id") {
        await i.deferUpdate();
        const queue = await client.player.getQueue(i.guildId);
        if(queue.setPaused() === false) {
            await queue.setPaused(true);
        } else {
            await queue.setPaused(false);
        }
    }
    if(i.isButton() && i.customId === "loopb-id") {
        await i.deferUpdate();
        const queue = await client.player.getQueue(i.guildId);
        if(queue.repeatMode === QueueRepeatMode.QUEUE) {
            await queue.setRepeatMode(QueueRepeatMode.OFF);
            yo(queue.volume);
        } else {
            await queue.setRepeatMode(QueueRepeatMode.QUEUE);
            yo(queue.volume);
        }
    }

    if(i.isButton() && i.customId === "shuffleb-id") {
        await i.deferUpdate();
        const queue = await client.player.getQueue(i.guildId);
        queue.shuffle();
    }
    
    if(i.isButton() && i.customId === "increase_volumeb-id") {
        await i.deferUpdate();
        const queue = await client.player.getQueue(i.guildId);
        let volnum = parseInt(queue.volume);
        let omg = parseInt(volnum+10);
        if (queue.volume == 200) return i.followUp({ content: `ไม่สามารถปรับระดับเสียงได้แล้วครับ`, ephemeral: true});
        await queue.setVolume(omg);
        yo(omg);
    }
    if(i.isButton() && i.customId === "decrease_volumeb-id") {
        await i.deferUpdate();
        const queue = await client.player.getQueue(i.guildId);
        let volnum = parseInt(queue.volume);
        let omg = parseInt(volnum-10);
        if (queue.volume == 0) return i.followUp({ content: `ไม่สามารถปรับระดับเสียงได้แล้วครับ`, ephemeral: true});
        await queue.setVolume(omg);
        yo(omg);
    }
    if(i.isButton() && i.customId === "muteb-id") {
        await i.deferUpdate();
        const queue = await client.player.getQueue(i.guildId);
        if (queue.volume == "0"){
            await queue.setVolume(100);
            yo(100);
        } else {
            await queue.setVolume(0);
            yo(0);
        }
    }
    if(i.isButton() && i.customId === "queueallb-id") {
        await i.deferUpdate();
        const queue = await client.player.getQueue(i.guildId);
        if(queue.tracks.length === 0) return i.followUp({ content: `ไม่มีเพลงในคิวนี้ครับ`, ephemeral: true});
        const allsong_embed = new MessageEmbed()
        .setDescription(`${queue.tracks.map((track, index) => `${index + 1}. [${track.title}](${track.url}) | (ขอโดย ${track.requestedBy})`).join("\n")}`)
        .setColor("BLUE")
        await i.followUp({ embeds: [allsong_embed], ephemeral: true})
    }

    //---โซนปุ่ม---//
    async function yo(volume) {
        i.channel.messages.fetch(setupdata[i.guild.id].msg)
        .then(msg => {
            msg.edit({ embeds: [
                new MessageEmbed()
                .setTitle(`[${queue.current.duration}] ${queue.current.title}`)
                .addFields(
                    {
                        name: `🎧 \`ห้องเสียง\``,
                        value: `└ **${i.member.voice.channel}**`,
                        inline: false
                    },
                    {
                        name: `🔊 \`ระดับเสียง\``,
                        value: `└ **${volume}%**`,
                        inline: false
                    },
                    {
                        name: `🔄 \`เล่นซ้ำ\``,
                        value: `└ **${queue.repeatMode === QueueRepeatMode.QUEUE ? "เปิด" : "ปิด"}**`,
                        inline: false
                    },
                    {
                        name: `🔎 \`ขอเพลงโดย\``,
                        value: `└ **${queue.current.requestedBy}**`,
                        inline: false
                    }
                )
                .setColor("#0099ff")
                .setImage(queue.current.thumbnail)
                .setColor("BLUE")
            ]})
        })
    }
})