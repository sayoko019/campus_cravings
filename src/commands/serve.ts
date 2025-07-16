import { ChannelType, ChatInputCommandInteraction, Client, SlashCommandBuilder, User, type Channel } from "discord.js";
import { recentDishes, COOK_CHANNEL_ID, ORDER_CHANNEL_ID, type CommandModule } from "../common.js";

const commandName = "serve";

const command = new SlashCommandBuilder()
    .setName(commandName)
    .setDescription("Serve a dish to someone")
    .addUserOption((opt) =>
        opt.setName("target").setDescription("Who you're serving").setRequired(true),
    )
    .addStringOption((opt) =>
        opt.setName("food").setDescription("What you're serving").setRequired(true),
    );

const permittedChannels = [COOK_CHANNEL_ID];

function handle(client: Client, interaction: ChatInputCommandInteraction) {
    const { options, channelId } = interaction;

    const target: User = options.getUser("target")!;
    const food: string = options.getString("food")!;

    if (channelId !== COOK_CHANNEL_ID)
        return interaction.reply({
            content: "Serving food only allowed from the kitchen.",
            ephemeral: true,
        });

    const order = recentDishes.dequeue(food, target.id);

    if (!order) {
        return interaction.reply({
            content: `You don't have an active dish for ${target.username} with that name.`,
            ephemeral: true,
        });
    }

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
