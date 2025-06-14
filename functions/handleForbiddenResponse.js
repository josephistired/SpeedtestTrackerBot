const { EmbedBuilder, AttachmentBuilder, MessageFlags } = require("discord.js");

async function handleForbiddenResponse(
  interaction,
  imagePath = "assets/error.png"
) {
  const attachment = new AttachmentBuilder(imagePath);
  const apiUrl = `http://${process.env.SERVER_IP}:${process.env.SERVER_PORT}/admin/api-tokens`;

  const embed = new EmbedBuilder()
    .setTitle("🚫 Access Forbidden")
    .setColor("Red")
    .setTimestamp()
    .setThumbnail("attachment://error.png")
    .setDescription(
      `Your API token does not have permission to access this endpoint.\n\n` +
        `Please verify that your token has the correct scopes and abilities under:\n` +
        `\`${apiUrl}\`.`
    )
    .addFields({
      name: "What to check",
      value:
        "• Ensure the token is active and not expired.\n" +
        "• Verify scopes: `results:read`, `speedtest:run`, `ookla:list-servers`\n" +
        "• Regenerate token if needed.",
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

module.exports = { handleForbiddenResponse };
