import { ChatInputCommandInteraction, Client, SlashCommandBuilder, User } from "discord.js";
import { CommandModule, FoodQueueItemBase, ORDER_CHANNEL_ID, OrderId, recentEatenDishes, recentServedDishes } from "../common.js";

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
    const servedDish: FoodQueueItemBase & { providerId?: User["id"] } & { orderId: OrderId } | null = recentServedDishes.dequeue((orderId, item) => item.food === food && item.designatedUserId === user.id);

    if (!servedDish) {
        return interaction.reply({
            content: "No one served that dish to you.",
            ephemeral: true,
        });
    }

    recentEatenDishes.enqueue(servedDish.food, user.id, { providerId: servedDish.providerId }, servedDish.orderId);

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
