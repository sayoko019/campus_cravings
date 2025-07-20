import { ChatInputCommandInteraction, Client, SlashCommandBuilder } from "discord.js";
import { CommandModule, ORDER_CHANNEL_ID, recentServedDishes } from "../common.js";

const commandName = "eat";
const command = new SlashCommandBuilder()
    .setName(commandName)
    .setDescription("Eat a served dish")
    .addStringOption((opt) =>
        opt.setName("food").setDescription("Name of the dish").setRequired(true),
    );

function handle(client: Client, interaction: ChatInputCommandInteraction) {
    const { options, user } = interaction;

    const food: string = options.getString("food")!.toLowerCase();
    const servedDish = recentServedDishes.dequeue(food, user.id);

    if (!servedDish) {
        return interaction.reply({
            content: "You don't have an active order for that dish.",
            ephemeral: true,
        });
    }

    interaction.reply(
        `You have successfully eaten the served dish: ${food}!`,
    );
}

const permittedChannels = [ORDER_CHANNEL_ID];

export const commandModule: CommandModule = {
    commandName,
    command,
    permittedChannels,
    handle,
};
