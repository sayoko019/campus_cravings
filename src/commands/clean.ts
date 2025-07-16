import { ChatInputCommandInteraction, Client, SlashCommandBuilder } from "discord.js";
import { ORDER_CHANNEL_ID, randomElement, type CommandModule } from "../common.js";

const commandName = "clean";

const command = new SlashCommandBuilder()
    .setName(commandName)
    .setDescription("Clean up the kitchen (or try to)");

const permittedChannels = [ORDER_CHANNEL_ID];

const cleanCommandResponses: string[] = [
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

function handle(client: Client, interaction: ChatInputCommandInteraction) {
    const result: string = randomElement(cleanCommandResponses);
    return interaction.reply(result);
}

export const commandModule: CommandModule = {
    commandName,
    command,
    permittedChannels,
    handle,
};
