const { EmbedBuilder, AttachmentBuilder, MessageFlags } = require("discord.js");

async function handleValidationResponse(
  interaction,
  imagePath = "assets/error.png"
) {
  const attachment = new AttachmentBuilder(imagePath);
  const embed = new EmbedBuilder()
    .setTitle("⚠️ Validation Error")
    .setColor("Red")
    .setTimestamp()
    .setThumbnail("attachment://error.png")
    .setDescription(
      "Invalid input provided. Please ensure you’ve supplied a valid server ID."
    )
    .addFields({
      name: "Usage",
      value: "/speedtest <server_id> (e.g., /speedtest 58346)",
    })

  if (interaction.deferred || interaction.replied) {
    return interaction.editReply({
      embeds: [embed],
      files: [attachment],
    });
  }
  return interaction.reply({
    embeds: [embed],
    files: [attachment],
    flags: MessageFlags.Ephemeral,
  });
}

module.exports = { handleValidationResponse };
