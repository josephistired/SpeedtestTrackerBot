const { EmbedBuilder, AttachmentBuilder, MessageFlags } = require("discord.js");

async function handleUnauthenticatedResponse(
  interaction,
  imagePath = "assets/error.png"
) {
  const attachment = new AttachmentBuilder(imagePath);
  const apiUrl = `http://${process.env.SERVER_IP}:${process.env.SERVER_PORT}/admin/api-tokens`;

  const embed = new EmbedBuilder()
    .setTitle("🔒 Unauthenticated")
    .setColor("Red")
    .setTimestamp()
    .setThumbnail("attachment://error.png")
    .setDescription(
      `Your API token is invalid. Please verify your \`API_TOKEN\` environment variable is correct and has not expired.\n\n` +
        `You can manage your tokens at: \`${apiUrl}\`.`
    )
    .addFields({
      name: "What to check",
      value:
        "• Make sure `API_TOKEN` matches a valid token from your Speedtest Tracker instance.\n" +
        "• Remove any extra whitespace around the token.\n" +
        "• Regenerate a new token if needed.",
    });

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

module.exports = { handleUnauthenticatedResponse };
