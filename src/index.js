require("dotenv").config();

const client = require("./discordClient");
const { Collection } = require("discord.js");

process.on("unhandledRejection", (reason, p) => {
  console.error("Unhandled Rejection at:", p, "Reason:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

client.events = new Collection();
client.commands = new Collection();
client.subCommands = new Collection();
client.cooldowns = new Collection();

const { loadEvents } = require("../utils/eventLoader");
loadEvents(client);

client.login(process.env.DISCORD_TOKEN);
