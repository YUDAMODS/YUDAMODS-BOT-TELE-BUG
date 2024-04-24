#!/bin/bash

# Grant execute permission to main.sh
chmod +x main.sh

# Install dependencies
npm install telegraf axios cheerio fs gradient-string pino util node-telegram-bot-api node-fetch http2 colors fake-useragent child_process cloudscraper cluster crypto events express gradient-string http net randomstring requests tls url user-agents

# Run the bot
bash start.sh
