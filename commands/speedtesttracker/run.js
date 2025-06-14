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
  handleFailedResultResponse,
} = require("../../functions/handleFailedResultResponse");
const {
  handleUnauthenticatedResponse,
} = require("../../functions/handleUnauthenticatedResponse");
const {
  handleForbiddenResponse,
} = require("../../functions/handleForbiddenResponse");
const {
  handleValidationResponse,
} = require("../../functions/handleValidationResponse");
const {
  handleNotFoundResponse,
} = require("../../functions/handleNotFoundResponse");

module.exports = {
  developer: true,
  data: new SlashCommandBuilder()
    .setName("run")
    .setDescription("Runs a speedtest")
    .addStringOption((option) =>
      option
        .setName("server_id")
        .setDescription("Provide an Ookla speedtest server ID")
    ),
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const server_id = interaction.options.getString("server_id");
    const attachment = new AttachmentBuilder("assets/speedtest.png");
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    await interaction.reply({
      content: server_id
        ? `Running speedtest on server ID: ${server_id}, this may take a few seconds ⏳`
        : `Running speedtest, this may take a few seconds ⏳`,
      flags: MessageFlags.Ephemeral,
    });

    try {
      const startResponse = await superagent
        .post(endpoints.runSpeedTest())
        .set("Authorization", `Bearer ${process.env.API_TOKEN}`)
        .set("Accept", "application/json")
        .query(server_id ? { server_id } : {});

      const testId = startResponse.body?.data?.id;
      if (!testId) {
        return errorSend(
          {
            user: interaction.user.tag,
            command: interaction.commandName,
            time: `${Math.floor(Date.now() / 1000)}`,
            error: "Failed to start speedtest — no ID returned.",
          },
          interaction
        );
      }

      let result = null;
      let attempts = 0;
      const maxAttempts = 25;

      while (attempts < maxAttempts) {
        attempts++;
        const resultResponse = await superagent
          .get(endpoints.getResultById(testId))
          .set("Authorization", `Bearer ${process.env.API_TOKEN}`)
          .set("Accept", "application/json");

        result = resultResponse.body?.data;
        if (result?.status === "completed" || result?.status === "failed")
          break;
        await delay(3000);
      }

      if (!result) {
        return errorSend(
          {
            user: interaction.user.tag,
            command: interaction.commandName,
            time: `${Math.floor(Date.now() / 1000)}`,
            error: "Speedtest did not complete in time. No result returned.",
          },
          interaction
        );
      }

      if (result.status === "failed") {
        return handleFailedResultResponse(result, interaction);
      }

      const embed = new EmbedBuilder()
        .setTitle(`Speedtest Result ID: ${result.id}`)
        .setColor("White")
        .setTimestamp()
        .setThumbnail("attachment://speedtest.png")
        .addFields(
          {
            name: "Ping",
            value: result.ping != null ? `${result.ping} ms` : "N/A",
            inline: true,
          },
          {
            name: "Download",
            value: result.download_bits_human ?? "N/A",
            inline: true,
          },
          {
            name: "Upload",
            value: result.upload_bits_human ?? "N/A",
            inline: true,
          },
          {
            name: "Jitter",
            value:
              result.data?.ping?.jitter != null
                ? `${result.data.ping.jitter} ms`
                : "N/A",
            inline: true,
          },
          {
            name: "Packet Loss",
            value:
              result.data?.packetLoss != null
                ? `${result.data.packetLoss}%`
                : "N/A",
            inline: true,
          },
          { name: "ISP", value: result.data?.isp ?? "N/A", inline: true },
          {
            name: "Test Server",
            value: result.data?.server
              ? `${result.data.server.name} (${result.data.server.location})`
              : "N/A",
            inline: true,
          },
          {
            name: "Scheduled",
            value: result.scheduled ? "Yes" : "No",
            inline: true,
          },
          {
            name: "Created At",
            value: new Date(result.created_at).toLocaleString(),
            inline: true,
          },
          {
            name: "Updated At",
            value: new Date(result.updated_at).toLocaleString(),
            inline: true,
          }
        );

      return interaction.editReply({
        content: "",
        embeds: [embed],
        files: [attachment],
      });
    } catch (err) {
      if (err.status === 401 || err.response?.status) {
        return handleUnauthenticatedResponse(interaction);
      }

      if (err.status === 403 || err.response?.status) {
        return handleForbiddenResponse(interaction);
      }

      if (err.status === 422 || err.response?.status) {
        return handleValidationResponse(interaction);
      }

      if (err.status === 404 || err.response?.status) {
        return handleNotFoundResponse(interaction);
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
