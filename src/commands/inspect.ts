import {
    ChatInputCommandInteraction,
    Client,
    SlashCommandBuilder
} from "discord.js";
import { COOK_CHANNEL_ID, randomElement, type CommandModule } from "../common.js";

const commandName = "inspect";

const command = new SlashCommandBuilder()
    .setName(commandName)
    .setDescription("Inspect a dish for quality")
    .addStringOption((opt) =>
        opt.setName("food").setDescription("Dish to inspect").setRequired(true),
    );

const permittedChannels = [COOK_CHANNEL_ID];

function renderResponses(food: string) {
    return [
        `${food} looks... edible. Maybe.`,
        `There's definitely something moving in the ${food}.`,
        `${food} passes inspection—barely.`,
        `${food}? That's not even legal in most countries.`,
        `The inspector fainted. Congrats.`,
    ];
}

function handle(client: Client, interaction: ChatInputCommandInteraction) {
    const food: string = interaction.options.getString("food")!;

    const responses = renderResponses(food);

    const response = randomElement(responses);

    return interaction.reply(response);
}

export const commandModule: CommandModule = {
    commandName,
    command,
    permittedChannels,
    handle,
};
