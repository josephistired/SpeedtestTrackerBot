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
const { handleFailedResult } = require("../../functions/handleFailedResult");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("run")
    .setDescription("Runs a speedtest"),
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    await interaction.reply({
      content: "Running speedtest... this may take a few seconds ⏳",
      flags: MessageFlags.Ephemeral,
    });

    const attachment = new AttachmentBuilder("assets/speedtest.png");
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    try {
      const startResponse = await superagent
        .post(endpoints.runSpeedTest())
        .set("Authorization", `Bearer ${process.env.API_TOKEN}`)
        .set("Accept", "application/json");

      const testId = startResponse.body?.data?.id;
      if (!testId) {
        return errorSend(
          {
            user: `${interaction.user.tag}`,
            command: `${interaction.commandName}`,
            time: `${Math.floor(Date.now() / 1000)}`,
            error: `Failed to start speedtest — no ID returned.`,
          },
          interaction
        );
      }

      let result = null;
      let attempts = 0;
      const maxAttempts = 20;

      while (attempts < maxAttempts) {
        attempts++;

        const resultResponse = await superagent
          .get(endpoints.getResultById(testId))
          .set("Authorization", `Bearer ${process.env.API_TOKEN}`)
          .set("Accept", "application/json");

        result = resultResponse.body?.data;

        if (result.status === "completed" || result.status === "failed") {
          break;
        }

        await delay(3000);
      }

      if (!result) {
        return errorSend(
          {
            user: `${interaction.user.tag}`,
            command: `${interaction.commandName}`,
            time: `${Math.floor(Date.now() / 1000)}`,
            error: `Speedtest did not complete in time. No result returned.`,
          },
          interaction
        );
      }

      // NEW: handle failed result like /result does
      if (result.status === "failed") {
        return handleFailedResult(result, interaction);
      }

      const embed = new EmbedBuilder()
        .setTitle(`Speedtest Result ID: ${result.id}`)
        .setColor("White")
        .setTimestamp()
        .setThumbnail("attachment://speedtest.png")
        .addFields(
          { name: "Ping", value: `${result.ping} ms`, inline: true },
          { name: "Download", value: result.download_bits_human, inline: true },
          { name: "Upload", value: result.upload_bits_human, inline: true },
          {
            name: "Jitter",
            value: `${result.data?.ping?.jitter ?? "N/A"} ms`,
            inline: true,
          },
          {
            name: "Packet Loss",
            value: `${result.data?.packetLoss ?? "N/A"}%`,
            inline: true,
          },
          { name: "ISP", value: result.data?.isp ?? "N/A", inline: true },
          {
            name: "Test Server",
            value: `${result.data?.server?.name ?? "N/A"} (${result.data?.server?.location ?? "N/A"})`,
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
        )
        .setFooter({ text: `Speedtest ID: ${result.id}` })
        .setURL(result.data?.result?.url);

      return interaction.editReply({
        content: "",
        embeds: [embed],
        files: [attachment],
      });
    } catch (err) {
      return errorSend(
        {
          user: `${interaction.user.tag}`,
          command: `${interaction.commandName}`,
          time: `${Math.floor(Date.now() / 1000)}`,
          error: `${err.message}`,
        },
        interaction
      );
    }
  },
};
