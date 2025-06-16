const { EmbedBuilder, AttachmentBuilder, MessageFlags } = require("discord.js");

async function handleNotFoundResponse(
  interaction,
  imagePath = "assets/error.png"
) {
  const {
    EmbedBuilder,
    AttachmentBuilder,
    MessageFlags,
  } = require("discord.js");
  const attachment = new AttachmentBuilder(imagePath);

  const embed = new EmbedBuilder()
    .setTitle("❓ Not Found")
    .setColor("Red")
    .setTimestamp()
    .setThumbnail("attachment://error.png")
    .setDescription(
      "No data was found for your request. This may mean:\n" +
        "• The specific ID you provided does not exist.\n" +
        "• No speedtests have been run yet (so /latest has nothing to show).\n\n" +
        "Please verify your inputs or run a speedtest and try again."
    )
    .addFields({
      name: "Next Steps",
      value:
        "• Use `/result <id>` with a known valid ID.\n" +
        "• If you’re using `/latest`, trigger a test in Speedtest Tracker first or by using `/run`.\n" +
        "• Check your Speedtest Tracker dashboard for recent entries.",
    });

  if (interaction.deferred || interaction.replied) {
    return interaction.editReply({
      content: "",
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

module.exports = { handleNotFoundResponse };
