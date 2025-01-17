FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

ENV BEARER_TOKEN=your_
ENV DISCORD_TOKEN=your_discord_bot_token
ENV DISCORD_ID=your_discord_account_id
ENV SERVER_IP=your_server_ip
ENV SERVER_PORT=your_server_port

CMD ["node", "src/index.js"]
