const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  AttachmentBuilder,
} = require("discord.js");
const superagent = require("superagent");
const { endpoints } = require("../../constants/endpoints");
const { errorSend } = require("../../functions/error");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("latest")
    .setDescription("Get the latest speedtest result."),

  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const attachment = new AttachmentBuilder("assets/speedtest.png");
    let response;

    try {
      response = await superagent.get(endpoints.getLatest());

      if (response.body.message !== "ok") {
        return errorSend(
          {
            user: `${interaction.user.tag}`,
            command: `${interaction.commandName}`,
            time: `${Math.floor(Date.now() / 1000)}`,
            error: `Failed to fetch the latest speedtest data: ${response.body.message}`,
          },
          interaction
        );
      }

      const data = response.body.data;

      const embed = new EmbedBuilder()
        .setTitle("Latest Speedtest Result")
        .setURL(data.url)
        .setColor("White")
        .setTimestamp()
        .setThumbnail("attachment://speedtest.png")
        .addFields(
          { name: "Ping", value: `${data.ping} ms`, inline: true },
          { name: "Download", value: `${data.download} Mbps`, inline: true },
          { name: "Upload", value: `${data.upload} Mbps`, inline: true },
          { name: "Server", value: data.server_name, inline: true },
          { name: "Server Host", value: data.server_host, inline: true },
          {
            name: "Scheduled",
            value: data.scheduled ? "Yes" : "No",
            inline: true,
          },
          { name: "Failed", value: data.failed ? "Yes" : "No", inline: true },
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

      interaction.reply({
        embeds: [embed],
        files: [attachment],
        ephemeral: true,
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
