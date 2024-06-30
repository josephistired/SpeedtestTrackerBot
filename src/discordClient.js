const { Client, GatewayIntentBits, Collection } = require("discord.js");
const { Guilds, GuildMessages } = GatewayIntentBits;

const client = new Client({
  intents: Guilds | GuildMessages,
});

module.exports = client;