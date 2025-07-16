const {
    SlashCommandBuilder
} = require("discord.js");
const { ORDER_CHANNEL_ID, randomElement } = require("../common");

const commandName = "clean";

const command = new SlashCommandBuilder()
    .setName(commandName)
    .setDescription("Clean up the kitchen (or try to)");

const permittedChannels = [ORDER_CHANNEL_ID];

const cleanCommandResponses = [
    `You scrub the counter. A sentient blob hisses and retreats.`,
    `The sink is cleaner now. The void under it remains.`,
    `You swept the floor. You found... someone’s soul?`,
    `You cleaned up. The hamster chef nods in approval.`,
    `Soap and bleach applied. Cursed essence lingers anyway.`,
    `You wiped the walls. They whispered secrets back.`,
    `The mop disintegrated. That's... not ideal.`,
    `You vacuumed the crumbs. They screamed.`,
    `Cleaning complete. Kitchen no longer sentient. Probably.`,
    `You sprayed disinfectant. It fizzled and ran away.`,
];

function handle(client, interaction) {
    const result = randomElement(cleanCommandResponses);
    return interaction.reply(result);
}

module.exports = {
    commandName,
    command,
    permittedChannels,
    handle,
};