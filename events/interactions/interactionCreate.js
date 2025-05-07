const {
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  Collection,
  MessageFlags,
} = require("discord.js");

const { errorSend } = require("../../functions/error");
const { cooldownSend } = require("../../functions/cooldown");

module.exports = {
  name: "interactionCreate",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    const sent = parseInt(interaction.createdAt.getTime() / 1000, 10);
    const errorsArray = [];

    if (!process.env.SERVER_IP || !process.env.SERVER_PORT) {
      errorsArray.push(
        "Server IP or Port not loaded. Please check your .env file."
      );
    }

    if (command.developer && interaction.user.id !== process.env.DEVELOPERID)
      errorsArray.push(
        "Sorry, this command is only available to the person who set up this bot. Maybe you can convince them to run it for you!"
      );

    const { cooldowns } = client;
    if (!cooldowns.has(command.name)) {
      cooldowns.set(command.name, new Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = process.env.COMMAND_COOLDOWN * 1000 || 3 * 1000;

    if (interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      timestamps.set(interaction.user.id, now);
      setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
    } else {
      const expirationTime =
        timestamps.get(interaction.user.id) + cooldownAmount;

      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;

        cooldownSend(
          {
            left: `${timeLeft.toFixed(1)}`,
            user: `${interaction.member.user.tag}`,
            command: `${interaction.commandName}`,
            time: `${sent}`,
          },
          interaction
        );

        return;
      }
    }

    timestamps.set(interaction.user.id, now);
    setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

    if (errorsArray.length) {
      return errorSend(
        {
          user: `${interaction.user.username}`,
          command: `${interaction.commandName}`,
          error: `${errorsArray.join("\n")}`,
          time: `${parseInt(interaction.createdTimestamp / 1000, 10)}`,
        },
        interaction
      );
    }

    try {
      const subCommand = interaction.options.getSubcommand(false);
      if (subCommand) {
        const subCommandFile = client.subCommands.get(
          `${interaction.commandName}.${subCommand}`
        );
        if (!subCommandFile)
          return interaction.reply({
            content: "💤 Command Is Outdated.",
            flags: MessageFlags.Ephemeral,
          });
        subCommandFile.execute(interaction, client);
      } else command.execute(interaction, client);
    } catch (error) {
      return errorSend(
        {
          user: `${interaction.user.username}`,
          command: `${interaction.commandName}`,
          error: `${error}`,
          time: `${parseInt(interaction.createdTimestamp / 1000, 10)}`,
        },
        interaction
      );
    }
  },
};
