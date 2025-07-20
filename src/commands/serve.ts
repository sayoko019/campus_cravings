import { ChannelType, ChatInputCommandInteraction, Client, SlashCommandBuilder, User, type Channel } from "discord.js";
import { recentDishes, COOK_CHANNEL_ID, ORDER_CHANNEL_ID, type CommandModule } from "../common.js";
import { getInventory, InventoryItemData, tryExpendItem } from "../systems/inventory/index.js";

const commandName = "serve";

type FoodSource = "inventory" | "kitchen";

const command = new SlashCommandBuilder()
    .setName(commandName)
    .setDescription("Serve a dish to someone")
    .addUserOption((opt) =>
        opt.setName("target").setDescription("Who you're serving").setRequired(true),
    )
    .addStringOption((opt) =>
        opt.setName("food").setDescription("What you're serving").setRequired(true),
    )
    .addStringOption((opt) =>
        opt
            .setName("source")
            .setChoices([{
                name: "inventory",
                value: "inventory",
            }, {
                name: "kitchen",
                value: "kitchen",
            }])
            .setDescription(
                "From where you're getting the food."
                // + "The food cooked with the `/cook` command is available in the kitchen.\n"
                // + "The food cooked with the `/recipe` command is available in the inventory.\n\n"
                // + "If you don't specify, the kitchen will be used by default.",
            ));

const permittedChannels = [COOK_CHANNEL_ID];

function handle(client: Client, interaction: ChatInputCommandInteraction) {
    const { options, channelId, user } = interaction;

    const target: User = options.getUser("target")!;
    const food: string = options.getString("food")!;
    const source: FoodSource = (options.getString("source") || "kitchen") as FoodSource;

    if (channelId !== COOK_CHANNEL_ID)
        return interaction.reply({
            content: "Serving food only allowed from the kitchen.",
            ephemeral: true,
        });

    if (source === "kitchen") {
        const order = recentDishes.dequeue(food, target.id);

        if (!order) {
            return interaction.reply({
                content: `You don't have an active dish for ${target.username} with that name.`,
                ephemeral: true,
            });
        }
    } else if (source === "inventory") {
        const hasExpended: boolean = tryExpendItem(user.id, item => item.name.toLowerCase() === food.toLowerCase(), 1);
        if (!hasExpended) {
            return interaction.reply({
                content: `You don't have ${food} in your inventory.`,
                ephemeral: true,
            });
        }
    };

    interaction.reply(
        `You served ${target.username} a plate of ${food}. They look... concerned.`,
    );

    const cafeteriaChannel: Channel = client.channels.cache.get(ORDER_CHANNEL_ID)!;

    if (cafeteriaChannel.type !== ChannelType.GuildText) {
        console.error("Cafeteria channel is not a text channel.");
        return interaction.followUp({
            content: "Error: Cafeteria channel is not a text channel.",
            ephemeral: true,
        });
    }

    cafeteriaChannel.send(`<@${target.id}>, your order of ${food} has been served!`);
}

export const commandModule: CommandModule = {
    commandName,
    command,
    permittedChannels,
    handle,
};
