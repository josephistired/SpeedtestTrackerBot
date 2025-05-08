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
  developer: true,
  data: new SlashCommandBuilder()
    .setName("latest")
    .setDescription("Get the latest speedtest result."),
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const attachment = new AttachmentBuilder("assets/speedtest.png");

    try {
      const response = await superagent
        .get(endpoints.getLatest())
        .set("Authorization", `Bearer ${process.env.API_TOKEN}`)
        .set("Accept", "application/json");

      const data = response.body?.data;
      if (!data) {
        return errorSend(
          {
            user: `${interaction.user.tag}`,
            command: `${interaction.commandName}`,
            time: `${Math.floor(Date.now() / 1000)}`,
            error: "No speedtest data found in response.",
          },
          interaction
        );
      }

      if (data.status === "failed") {
        return handleFailedResult(data, interaction);
      } 

      const embed = new EmbedBuilder()
        .setTitle("Latest Speedtest Result")
        .setColor("White")
        .setTimestamp()
        .setThumbnail("attachment://speedtest.png")
        .addFields(
          { name: "Ping", value: `${data.ping} ms`, inline: true },
          { name: "Download", value: data.download_bits_human, inline: true },
          { name: "Upload", value: data.upload_bits_human, inline: true },
          {
            name: "Jitter",
            value: `${data.data.ping.jitter} ms`,
            inline: true,
          },
          {
            name: "Packet Loss",
            value: `${data.data.packetLoss}%`,
            inline: true,
          },
          { name: "ISP", value: data.data.isp, inline: true },
          {
            name: "Test Server",
            value: `${data.data.server.name} (${data.data.server.location})`,
            inline: true,
          },
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
        .setURL(data.data.result.url)
        .setFooter({ text: `Speedtest ID: ${data.id}` });

      interaction.reply({
        embeds: [embed],
        files: [attachment],
        flags: MessageFlags.Ephemeral,
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
