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
    .setName("healthcheck")
    .setDescription("Check if Speedtest Tracker is running."),

  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const attachment = new AttachmentBuilder("assets/heart.png");
    let response;

    try {
      response = await superagent.get(endpoints.getHealthCheck());
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

    if (response && response.body.message === "Speedtest Tracker is running!") {
      const embed = new EmbedBuilder()
        .setTitle("Speedtest Tracker is running!")
        .setColor("Green")
        .setThumbnail("attachment://heart.png")
        .setTimestamp();

      return interaction.reply({
        embeds: [embed],
        files: [attachment],
        ephemeral: true,
      });
    } else {
      const embed = new EmbedBuilder()
        .setTitle("Speedtest Tracker is down!")
        .setColor("Red")
        .setThumbnail("attachment://heart.png")
        .setTimestamp();

      return interaction.reply({
        embeds: [embed],
        files: [attachment],
        ephemeral: true,
      });
    }
  },
};
