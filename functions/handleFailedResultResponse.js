const { EmbedBuilder, AttachmentBuilder, MessageFlags } = require("discord.js");

function handleFailedResultResponse(
  data,
  interaction,
  image = "assets/speedtest.png"
) {
  const attachment = new AttachmentBuilder(image);

  const embed = new EmbedBuilder()
    .setTitle("⚠️ Speedtest Failed")
    .setColor("Red")
    .setTimestamp()
    .setThumbnail("attachment://speedtest.png")
    .setDescription("This test did not complete successfully.")
    .addFields(
      { name: "ID", value: `${data.id}`, inline: true },
      {
        name: "Scheduled",
        value: data.scheduled ? "Yes" : "No",
        inline: true,
      },
      {
        name: "Created At",
        value: new Date(data.created_at).toLocaleString(),
        inline: true,
      },
      {
        name: "Updated At",
        value: new Date(data.updated_at).toLocaleString(),
        inline: true,
      }
    )
    .setFooter({ text: `Speedtest ID: ${data.id}` });

  if (interaction.deferred || interaction.replied) {
    return interaction.editReply({
      content: "",
      embeds: [embed],
      files: [attachment],
    });
  } else {
    return interaction.reply({
      embeds: [embed],
      files: [attachment],
      flags: MessageFlags.Ephemeral,
    });
  }
}

module.exports = { handleFailedResultResponse };
