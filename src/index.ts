import type { SlashCommandBuilder, Interaction } from "discord.js";
import type { CommandModule } from "./common";

import {
  Client,
  GatewayIntentBits,
  Events,
  REST,
  Routes,
  Collection,
} from "discord.js";

import { systemModule as inventorySystem } from "./systems/inventory/index.js";

import { commandModule as order } from "./commands/order.js";
import { commandModule as cook } from "./commands/cook.js";
import { commandModule as eat } from "./commands/eat.js";
import { commandModule as taste } from "./commands/taste.js";
import { commandModule as specials } from "./commands/specials.js";
import { commandModule as foodfight } from "./commands/foodfight.js";
import { commandModule as serve } from "./commands/serve.js";
import { commandModule as inspect } from "./commands/inspect.js";
import { commandModule as clean } from "./commands/clean.js";
import { commandModule as recipebook } from "./commands/recipe/index.js";

import { commandModule as inventory } from "./systems/inventory/commands/inventory.js";

const commandModules = [order, cook, eat, taste, specials, foodfight, serve, inspect, clean, recipebook, inventory] satisfies CommandModule[];

import * as dotenv from "dotenv";

dotenv.config();

interface ClientWithCommands extends Client {
  commands: Collection<string, any>
}

console.log("Loaded token from .env:", process.env.TOKEN);
// NEU Diner Bot - index.js
const client: ClientWithCommands = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
}) as ClientWithCommands;

// Debug: Check if token is loading
console.log("Token loaded:", process.env.TOKEN ? "[REDACTED]" : "MISSING");

// Command setup
const commands = commandModules.map((mod) => mod.command);

client.commands = new Collection();
commands.forEach((cmd) => client.commands.set(cmd.name, cmd));

client.once(Events.ClientReady, async () => {
  try {
    await inventorySystem.onStart();
  } catch (error) {
    console.error("Error during inventory system startup:", error);
    process.exit(1);
  }

  const rest = new REST({ version: "10" }).setToken(process.env.TOKEN!);
  try {
    await rest.put(Routes.applicationCommands(client.user!.id), {
      body: commands,
    });
    console.log("Commands registered. Bot is ready.");
  } catch (e) {
    console.error(e);
  }
});

client.on(Events.InteractionCreate, async (interaction: Interaction) => {
  if (interaction.isButton()) {
    await recipebook.onButtonInteraction(interaction);
  }
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

async function gracefulShutdown() {
  console.log("Shutting down gracefully...");
  await inventorySystem.onStop();
  process.exit(0);
}

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

// ✅ Final line — use the token from .env properly!
client.login(process.env.TOKEN);
