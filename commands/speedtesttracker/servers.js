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
    .setName("servers")
    .setDescription("See available Ookla speedtest servers."),

  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const attachment = new AttachmentBuilder("assets/servers.png");

    await interaction.reply({
      content: "Fetching available Ookla speedtest servers ⏳",
      flags: MessageFlags.Ephemeral,
    });

    try {
      const response = await superagent
        .get(endpoints.getServers())
        .set("Authorization", `Bearer ${process.env.API_TOKEN}`)
        .set("Accept", "application/json");

      const servers = response.body?.data;

      const fields = Object.entries(servers)
        .slice(0, 25)
        .map(([id, server]) => {
          let details;
          if (typeof server === 'object' && server !== null) {
            details = `Name: ${server.name || 'N/A'}\nLocation: ${server.location || server.country || 'N/A'}\nHost: ${server.host || 'N/A'}`;
          } else {
            details = String(server);
          }

          return {
            name: `ID: ${id}`,
            value: details || 'No details available',
            inline: false,
          };
        });

      const embed = new EmbedBuilder()
        .setTitle("Available Ookla Speedtest Servers")
        .setColor("White")
        .setTimestamp()
        .setThumbnail("attachment://servers.png")
        .addFields(fields);

      return interaction.editReply({
        content: "",
        embeds: [embed],
        files: [attachment],
      });
    } catch (err) {
      if (err.status === 401 || err.response?.status === 401) {
        return handleUnauthenticatedResponse(interaction);
      }

      if (err.status === 403 || err.response?.status === 403) {
        return handleForbiddenResponse(interaction);
      }

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
