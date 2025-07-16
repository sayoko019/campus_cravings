const {
    SlashCommandBuilder
} = require("discord.js");
const { COOK_CHANNEL_ID, randomElement } = require("../common");

const commandName = "inspect";

const command = new SlashCommandBuilder()
    .setName(commandName)
    .setDescription("Inspect a dish for quality")
    .addStringOption((opt) =>
        opt.setName("food").setDescription("Dish to inspect").setRequired(true),
    );

const permittedChannels = [COOK_CHANNEL_ID];

function renderResponses(food) {
    return [
        `${food} looks... edible. Maybe.`,
        `There's definitely something moving in the ${food}.`,
        `${food} passes inspection—barely.`,
        `${food}? That's not even legal in most countries.`,
        `The inspector fainted. Congrats.`,
    ];
}

function handle(client, interaction) {
    const food = interaction.options.getString("food");

    const responses = renderResponses(food);

    const response = randomElement(responses);

    return interaction.reply(response);
}

module.exports = {
    commandName,
    command,
    permittedChannels,
    handle,
};
