# SpeedtestTrackerBot 🚄

SpeedtestTrackerBot is a Discord bot that interacts with the [Speedtest Tracker](https://github.com/alexjustesen/speedtest-tracker), and it's API to provide various network performance metrics. This bot is designed to be run locally by the user.

## Features

- **Get Result**: Able to get a speedtestresult based on it's ID.
- **List result**: Able to list all speedtest results. **Able to sort, coming soon**™️
- **Latest Speedtest Results**: Get the latest speedtest results.

## Prerequisites

- [Node.js](https://nodejs.org/)
- [Discord Bot](https://discord.com/developers/applications)
- [Discord Account ID](https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID#h_01HRSTXPS5H5D7JBY2QKKPVKNA)
- A system running an instance of [SpeedTest Tracker](https://github.com/alexjustesen/speedtest-tracker)
- Speedtest Tracker URL and port
- A Bearer Token which can be generated at yourlocalistance/admin/api-tokens

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/josephistired/SpeedtestTrackerBot.git
   cd SpeedtestTrackerBot

2. Install the dependencies:

   ```sh
   npm install

## Windows 🪟
  
This bot was originally created to run on a Raspberry Pi that hosts my SpeedTracker instance, but it can also run on a Windows machine. Follow these steps to get the bot up and running on Windows.

1. Create a .env file in the root directory and add your Discord bot token, Discord account ID and Speedtest Tracker details:

   ```env
   BEARER_TOKEN=your_bearer_token
   DISCORD_TOKEN=your_discord_bot_token
   DISCORD_ID=your_discord_account_id
   SERVER_IP=your_server_ip
   SERVER_PORT=your_server_port

2. Simply run the bot.bat file located in the root directory!

## Raspberry Pi 🐧 | Running as a Service

Here's the cool setup! I have this bot running as a service on my Raspberry Pi. If you're a Raspberry Pi user, this should be a breeze (:

1. Copy the provided service file to the systemd directory:

   ```sh
   sudo cp service/speedtesttrackerbot.service /etc/systemd/system/speedtesttrackerbot.service

2. Edit the file at /etc/systemd/system/speedtesttrackerbot.service. 

   - Line 10; replace /path/to/your/project with the actual path to your bot's main file.
   - Line 13: replace /path/to/your/project with the actual path to your project directory.
   - Lines 17, 18, 19, 20, 21: Replace everything inside quotes with their respective values.
   - Lines 23: Make sure to replace with the correct user.

3. Reload systemd to apply changes:

   ```sh
   sudo systemctl daemon-reload

4. Enable and start the service:

   ```sh
   sudo systemctl start speedtesttrackerbot
   sudo systemctl enable speedtesttrackerbot

5. The bot should now be running as long as you followed the steps correctly (:

## Docker 🐋

You can run SpeedtestTrackerBot using Docker. Replace the placeholder values with your actual configuration.

- Option 1 - Docker Command

      docker run -d --name speedtesttrackerbot \
        -e BEARER_TOKEN=your_bearer_token
        -e DISCORD_TOKEN=your_discord_bot_token \
        -e DISCORD_ID=your_discord_account_id \
        -e SERVER_IP=your_server_ip \
        -e SERVER_PORT=your_server_port \
        josephistired/speedtesttrackerbot:latest

- Option 2 - docker-compose file.

      version: '3.8'
      
      services:
        speedtesttrackerbot:
          image: josephistired/speedtesttrackerbot:latest
          container_name: speedtesttrackerbot
          environment:
            - BEARER_TOKEN=your_bearer_token
            - DISCORD_TOKEN=your_discord_bot_token
            - DISCORD_ID=your_discord_account_id
            - SERVER_IP=your_server_ip
            - SERVER_PORT=your_server_port
          restart: always

## Usage 

Use the following commands in your Discord Server to interact with this bot:

- /healthcheck: Check if Speedtest Tracker is running.
- /latest: Get the latest speedtest results.

## Planned Updates

Thankfully, [V1](https://docs.speedtest-tracker.dev/api/v1) of the API for Speedtest Tracker has been released! I plan on updating this bot with new features once the owner of SpeedTest Tracker adds more routes to the API.

## Contributing
If you would like to contribute, please fork the repository and use a feature branch. Pull requests are welcome.
