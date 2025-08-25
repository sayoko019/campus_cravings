import { Channel, ChannelType, ChatInputCommandInteraction, Client, SlashCommandBuilder } from "discord.js";
import { CommandModule, COOK_CHANNEL_ID, ORDER_CHANNEL_ID, recentEatenDishes } from "../common.js";

const commandName = "feedback";
const command = new SlashCommandBuilder()
    .setName(commandName)
    .setDescription("Give the feedback about the recently eaten food")
    .addStringOption((opt) =>
        opt.setName("text")
            .setDescription("Your feedback about the food")
            .setRequired(true)
    );

const permittedChannels = [ORDER_CHANNEL_ID];

function handle(client: Client, interaction: ChatInputCommandInteraction) {
    const { options, user } = interaction;

    const text: string = options.getString("text")!.trim();

    const recentlyEatenDish = recentEatenDishes.dequeue((orderId, item) => item.designatedUserId === user.id, {
        reverse: true,
    });

    if (!recentlyEatenDish) {
        return interaction.reply({
            content: "You don't have the dishes for which you can give feedback.",
            ephemeral: true,
        });
    }

    interaction.reply(
        `You have successfully given the feedback on the served dish: ${recentlyEatenDish.food}!`,
    );

    const kitchenChannel: Channel = client.channels.cache.get(COOK_CHANNEL_ID)!;

    if (kitchenChannel.type !== ChannelType.GuildText) {
        console.error("Kitchen channel is not a text channel.");
        return interaction.followUp({
            content: "Error: Kitchen channel is not a text channel.",
            ephemeral: true,
        });
    }

    kitchenChannel.send(`<@${recentlyEatenDish.designatedUserId}>, the feedback on ${recentlyEatenDish.food} has been provided: ${text}`);
}

export const commandModule: CommandModule = {
    commandName,
    command,
    permittedChannels,
    handle,
};
