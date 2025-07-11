const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  AttachmentBuilder,
  MessageFlags,
} = require("discord.js");
const superagent = require("superagent");
const { endpoints } = require("../../constants/endpoints");
const { errorSend } = require("../../functions/error");
const {
  handleUnauthenticatedResponse,
} = require("../../functions/handleUnauthenticatedResponse");
const {
  handleForbiddenResponse,
} = require("../../functions/handleForbiddenResponse");

module.exports = {
  developer: true,
  data: new SlashCommandBuilder()
    .setName("stats")
    .setDescription("View overall speedtest statistics from Speedtest Tracker"),
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    await interaction.reply({
      content: "Fetching speedtest stats... ⏳",
      flags: MessageFlags.Ephemeral,
    });

    const attachment = new AttachmentBuilder("assets/stats.png");

    try {
      const response = await superagent
        .get(endpoints.getStats())
        .set("Authorization", `Bearer ${process.env.API_TOKEN}`)
        .set("Accept", "application/json");

      const data = response.body?.data;
      if (!data) {
        return errorSend(
          {
            user: interaction.user.tag,
            command: interaction.commandName,
            time: `${Math.floor(Date.now() / 1000)}`,
            error: "No data received from the /stats endpoint.",
          },
          interaction
        );
      }

      const embed = new EmbedBuilder()
        .setTitle("Speedtest Stats")
        .setColor("White")
        .setTimestamp()
        .setThumbnail("attachment://stats.png")
        .addFields(
          { name: "Total Tests", value: `${data.total_results}`, inline: true },
          { name: "\u200B", value: "\u200B", inline: true },
          {
            name: "Ping (ms)",
            value: `Avg: ${data.ping.avg}\nMin: ${data.ping.min}\nMax: ${data.ping.max}`,
            inline: true,
          },
          {
            name: "Download",
            value: `Avg: ${data.download.avg_bits_human}\nMin: ${data.download.min_bits_human}\nMax: ${data.download.max_bits_human}`,
            inline: true,
          },
          {
            name: "Upload",
            value: `Avg: ${data.upload.avg_bits_human}\nMin: ${data.upload.min_bits_human}\nMax: ${data.upload.max_bits_human}`,
            inline: true,
          }
        );

      return interaction.editReply({
        content: "",
        embeds: [embed],
        files: [attachment],
      });
    } catch (err) {
      if (err.status === 401 || err.response?.status === 401) {
        return handleUnauthenticatedResponse(interaction);
      }

      if (err.status === 422 || err.response?.status === 422) {
        return handleValidationResponse(interaction);
      }

      return errorSend(
        {
          user: interaction.user.tag,
          command: interaction.commandName,
          time: `${Math.floor(Date.now() / 1000)}`,
          error: err.message,
        },
        interaction
      );
    }
  },
};
