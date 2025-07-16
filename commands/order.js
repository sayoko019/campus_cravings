const {
    SlashCommandBuilder
} = require("discord.js");
const { ORDER_CHANNEL_ID, cursedIngredients, recentOrders, randomElement } = require("../common.js");

const commandName = "order";

const command = new SlashCommandBuilder()
    .setName(commandName)
    .setDescription("Order any dish")
    .addStringOption((opt) =>
        opt.setName("food").setDescription("Name of the food").setRequired(true),
    );

const permittedChannels = [ORDER_CHANNEL_ID];

function cursedOrderResponses(food, orderId) {
    return [
        `That ${food} is a biohazard. Are you okay?`,
        `You ordered ${food}? Bold. And possibly fatal.`,
        `The kitchen staff took one look at your ${food} and fainted.`,
        `The ${food} is growling. Please stand back.`,
        `We don't serve ${food}… anymore. Not since The Incident.`,
        `The ${food} twitched. You've been warned.`,
        `You hear whispering from the ${food}. It knows your name.`,
        `A rat tried to escape your ${food} before we could serve it.`,
        `This ${food} is legally considered a threat.`,
        `Someone cried when they saw us cooking that ${food}.`,
        `You’ve awakened something with your ${food}… something ancient.`,
        `Even the dumpster rejected this ${food}. Brave of you.`,
    ]
}

function normalOrderResponses(food, orderId) {
    return [
        `Order received: ${food}. It’ll be ready when the kitchen stops screaming.`,
        `Coming right up: one slightly suspicious ${food}.`,
        `Got it. ${food} is now being aggressively assembled.`,
        `${food}? A classic choice. The hamster chef approves.`,
        `We’ll pretend we didn’t judge you for ordering ${food}.`,
        `The ${food} is in the fryer... and the fryer is on fire. Perfect.`,
        `Order noted. Kitchen's in denial but working on it.`,
        `${food}? We haven’t served that since 1842. Let’s go!`,
        `The ${food} has been plated, garnished, and slightly threatened.`,
        `Your ${food} is being prepared by our most dramatic chef.`,
        `The ${food} screamed but we told it to behave.`,
        `We've assigned a food therapist to your ${food}. It'll be ready soon.`,
    ]
}

function handle(client, interaction) {
    const { options, user } = interaction;

    const food = options.getString("food").toLowerCase();

    const orderId = recentOrders.enqueue(food, user.id);

    const isCursed = cursedIngredients.find((word) => food.includes(word));
    const responsesFunction = isCursed ? cursedOrderResponses : normalOrderResponses;
    const responseArray = responsesFunction(food, orderId);
    const response = randomElement(responseArray);

    return interaction.reply(response);
}

module.exports = {
    command,
    commandName,
    permittedChannels,
    handle,
}