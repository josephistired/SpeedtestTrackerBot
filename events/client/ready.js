const { loadCommands } = require("../../utils/commandLoader");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    await loadCommands(client);

    client.user.setActivity(
      `Repo - https://github.com/josephistired/SpeedtestTrackerBot`
    );

    console.log(`\n==============================`);
    console.log(`Client logged in as: ${client.user.username}`);

    if (process.env.SERVER_IP && process.env.SERVER_PORT) {
      console.log(
        `Client using API at: ${process.env.SERVER_IP}:${process.env.SERVER_PORT}`
      );
    } else {
      console.log("Server IP or Port not loaded. Please check your .env file.");
    }

    console.log(`==============================\n`);
  },
};
