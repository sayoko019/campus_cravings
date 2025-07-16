const {
  Client,
  GatewayIntentBits,
  Events,
  REST,
  Routes,
  Collection,
} = require("discord.js");

const order = require("./commands/order.js");
const cook = require("./commands/cook.js");
const taste = require("./commands/taste.js");
const specials = require("./commands/specials.js");
const foodfight = require("./commands/foodfight.js");
const serve = require("./commands/serve.js");
const inspect = require("./commands/inspect.js");
const clean = require("./commands/clean.js");
const recipebook = require("./recipe.js");

const commandModules = [order, cook, taste, specials, foodfight, serve, inspect, clean];

require("dotenv").config();

console.log("Loaded token from .env:", process.env.TOKEN);
// NEU Diner Bot - index.js
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

// Debug: Check if token is loading
console.log("Token loaded:", process.env.TOKEN ? "[REDACTED]" : "MISSING");

// Command setup
const commands = commandModules.map((mod) => mod.command);

client.commands = new Collection();
commands.forEach((cmd) => client.commands.set(cmd.name, cmd));

client.once(Events.ClientReady, async () => {
  const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
  try {
    await rest.put(Routes.applicationCommands(client.user.id), {
      body: commands,
    });
    console.log("Commands registered. Bot is ready.");
  } catch (e) {
    console.error(e);
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName, channelId } = interaction;

  for (const commandModule of commandModules) {
    if (commandModule.commandName === commandName) {
      if (!commandModule.permittedChannels.includes(channelId)) {
        const channelMentions = commandModule.permittedChannels.map(
          (id) => `<#${id}>`
        );
        return interaction.reply({
          content: `This command can only be used in specific channels: ${channelMentions.join(", ")}`,
          ephemeral: true,
        });
      }
      commandModule.handle(client, interaction);
      return;
    }
  }
});

// ✅ Final line — use the token from .env properly!
client.login(process.env.TOKEN);
