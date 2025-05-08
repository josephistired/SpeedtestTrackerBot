# SpeedtestTrackerBot 🚄

SpeedtestTrackerBot is a local Discord bot that integrates with the [Speedtest Tracker API](https://github.com/alexjustesen/speedtest-tracker). It provides network performance insights directly in your server via slash commands.

## Features

- **/latest** — Fetch and display the latest speedtest result.  
- **/stats** — View aggregate statistics (average, min, max) for ping, download, and upload across all tests.  
- **/result [id]** — Retrieve a single test result by its numeric ID.  

## Prerequisites

- [Node.js](https://nodejs.org/)
- [Discord Bot](https://discord.com/developers/applications)
- [Discord Account ID](https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID#h_01HRSTXPS5H5D7JBY2QKKPVKNA)
- A system running an instance of [SpeedTest Tracker](https://github.com/alexjustesen/speedtest-tracker)
- Speedtest Tracker URL and port
- An API bearer token (generate under **/admin/api-tokens** in Speedtest Tracker)  

## Installation

1. **Clone the repo**  

   ```sh
   git clone https://github.com/josephistired/SpeedtestTrackerBot.git
   cd SpeedtestTrackerBot

2. **Install dependencies**

   ```sh
   npm install

3. Environment Variables
   
   Create a .env file in the project root with:

   ```env
   # Discord bot settings
   DISCORD_TOKEN=your_discord_bot_token
   DISCORD_ID=your_discord_application_id

   # Speedtest Tracker API settings
   SERVER_IP=your_speedtest_tracker_host_or_ip
   SERVER_PORT=your_speedtest_tracker_port
   API_TOKEN=your_speedtest_tracker_bearer_token

4. Start the bot

- For production (no auto-reload):
   
      ```sh
      npm start

 - For development (auto-reload on changes):

      ```sh
      npm run dev

## Usage
Once the bot is running and registered in your Discord server, use these slash commands:

Command	Description
/latest	Show the most recent speedtest, including ping, download, upload, jitter, packet loss, etc.
/stats	View overall stats: average, min, max of ping, download, upload, and total test count.
/result id	Retrieve details for a specific test by its ID.

## Deployment Options

# Docker
Run via Docker:

      ```sh
      docker run -d \
      --name speedtesttrackerbot \
      -e DISCORD_TOKEN=your_discord_bot_token \
      -e DISCORD_ID=your_discord_application_id \
      -e SERVER_IP=your_speedtest_tracker_host_or_ip \
      -e SERVER_PORT=your_speedtest_tracker_port \
      -e API_TOKEN=your_speedtest_tracker_bearer_token \
      josephistired/speedtesttrackerbot:latest
      ```

Or use a docker-compose.yml:

      ```sh
      version: '3.8'
      services:
      bot:
         image: josephistired/speedtesttrackerbot:latest
         environment:
            - DISCORD_TOKEN=your_discord_bot_token
            - DISCORD_ID=your_discord_application_id
            - SERVER_IP=your_speedtest_tracker_host_or_ip
            - SERVER_PORT=your_speedtest_tracker_port
            - API_TOKEN=your_speedtest_tracker_bearer_token
         restart: always
      ```

# Raspberry Pi / systemd Service

1. Copy service/speedtesttrackerbot.service to /etc/systemd/system/

2. Edit the service file, and replace the commented things.

3. Reload and start:

   ```sh
   sudo systemctl daemon-reload
   sudo systemctl enable --now speedtesttrackerbot

## Contributing
Contributions, issues, and feature requests are welcome! Please open a GitHub issue or submit a pull request.