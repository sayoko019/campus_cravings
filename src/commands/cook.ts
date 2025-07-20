import {
    ChatInputCommandInteraction,
    Client,
    SlashCommandBuilder
} from "discord.js";
import { recentOrders, recentCookedDishes, cursedIngredients, COOK_CHANNEL_ID, type CommandModule } from "../common.js";

const commandName = "cook";

const command = new SlashCommandBuilder()
    .setName(commandName)
    .setDescription("Cook a dish")
    .addStringOption((opt) =>
        opt.setName("food").setDescription("Name of the dish").setRequired(true),
    );

const permittedChannels = [COOK_CHANNEL_ID];

function handle(client: Client, interaction: ChatInputCommandInteraction) {
    const { options } = interaction;

    const food = options.getString("food")!.toLowerCase();
    let isCursed = cursedIngredients.find((word) => food.includes(word));
    if (isCursed) {
        return interaction.reply(
            `You tried to cook ${food}, and summoned a kitchen demon. It's loose now.`,
        );
    }
    const order = recentOrders.dequeue(food);

    if (!order) {
        return interaction.reply({
            content: "You don't have an active order for that dish.",
            ephemeral: true,
        });
    }

    const { food: cookedFood, userId, orderId } = order;

    recentCookedDishes.enqueue(cookedFood, userId, orderId);

    interaction.reply(
        `You successfully cooked the ordered dish: ${food}!`,
    );

    // let fails = [
    //     `${food} exploded in the oven. Fire is everywhere.`,
    //     `${food} is still frozen solid. A crime.`,
    //     `${food} was alive and bit you.`,
    //     `${food} just detonated. Everyone’s stunned.`,
    //     `${food} turned into goo. Weird goo.``You dropped ${food} and it vanished into a portal.`,
    //     `${food} caught fire, then caught *more* fire.`,
    //     `A cloud of smoke emerged from ${food} and whispered your secrets.`,
    //     `The ${food} insulted the chef. A brawl broke out.`,
    //     `${food} started screaming halfway through cooking.`,
    //     `The oven rejected ${food} entirely. It launched it back.`,
    //     `You blacked out. When you woke up, the ${food} was gone—and so was your shadow.`,
    //     `The ${food} summoned a second ${food}. Now they’re fighting.`,
    //     `The kitchen lights flickered and the ${food} whispered, "Run."`,
    //     `The ${food} turned into sentient slime and escaped.`,
    //     `You cooked ${food} too long. It gained consciousness and is furious.`,
    //     `A rift opened above the stove. The ${food} is gone, but something else is watching.`,
    //     `You sneezed mid-recipe. Now the ${food} is part ghost.`,
    //     `The ${food} rejected its own ingredients and exploded into confetti.`,
    //     `Your cookbook burst into flames as soon as you touched the ${food}.`,
    //     `Cooking ${food} triggered a minor earthquake. The hamster is NOT happy.`,
    //     `The kitchen floor turned into jelly. ${food} sank instantly.`,
    // ];
    // let randomFail = fails[Math.floor(Math.random() * fails.length)];
}

export const commandModule: CommandModule = {
    commandName,
    command,
    permittedChannels,
    handle,
};
