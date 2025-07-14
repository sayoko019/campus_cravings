const {
    SlashCommandBuilder
} = require("discord.js");
const { ORDER_CHANNEL_ID, cursedIngredients, randomElement } = require("../common.js");

const commandName = "taste";

const command = new SlashCommandBuilder()
    .setName(commandName)
    .setDescription("Taste test a dish")
    .addStringOption((opt) =>
        opt.setName("food").setDescription("Dish to taste").setRequired(true),
    );

function tasteBadResponses(food) {
    return [
        `${food}? You just made Gordon Ramsay retire.`,
        `This ${food} is so raw it just tried to cross the road.`,
        `I've seen better seasoning on cardboard.`,
        `This tastes like betrayal and wet socks.`,
        `Are you sure this wasn't a science experiment?`,
        `Congratulations, you've created disappointment on a plate.`,
        `The flavor escaped. It ran for its life.`,
        `This ${food} is so bland I questioned reality.`,
        `If chaos had a taste, it would be this.`,
        `You nuked it. Not in the microwave—like, full-on nuclear.`,
        `Even the hamster spat it out. And he eats drywall.`,
        `This isn't food, it's a cry for help.`,
        `The texture? Like licking regret.`,
        `You just microwaved sadness and called it ${food}.`,
        `This dish filed a complaint against you.`,
        `The smell alone caused the kitchen lights to flicker.`,
        `You’ve seasoned this with pure confusion.`,
        `Gordon Ramsay screamed in his sleep, and he doesn’t know why.`,
        `You turned a recipe into a war crime.`,
        `This ${food} triggered a smoke detector in another server.`,
    ]
}

function tasteGoodResponses(food) {
    return [
        `This ${food} brought tears to my eyes. Good tears.`,
        `Gordon Ramsay just nodded in approval. Silently. Respectfully.`,
        `You've cooked divinity itself.`,
        `The flavor punched me in the face—and I said thank you.`,
        `I could taste your soul in this. It's delicious.`,
        `The hamster is doing a standing ovation with a tiny fork.`,
        `This dish slaps harder than finals week.`,
        `If flavor were a superpower, you’d be unstoppable.`,
        `Your ancestors are proud. And a little scared.`,
        `The oven wept with joy after this masterpiece.`,
        `This ${food} just made five angels high-five.`,
        `This is what dreams taste like.`,
        `Chef’s kiss. No notes. Absolute banger.`,
        `I ascended mid-bite.`,
        `Even the cursed ingredients bowed to you.`,
        `This belongs in a museum. Or a cult.`,
        `Your cooking restored balance to the foodiverse.`,
        `Gordon Ramsay? Speechless. And that never happens.`,
        `It’s so good, the kitchen ghost reincarnated to taste it again.`,
        `Ten out of ten. Eleven if we ignore food safety laws.`,
    ]
}

function handle(client, interaction) {
    const { options, channelId } = interaction;

    const food = options.getString("food").toLowerCase();

    if (channelId !== ORDER_CHANNEL_ID)
        return interaction.reply({
            content: "Tasting only allowed in the cafeteria.",
            ephemeral: true,
        });


    let isCursed = cursedIngredients.find((word) => food.includes(word));
    if (isCursed)
        return interaction.reply(`${food}? You just made Gordon Ramsay retire.`);

    const tasteFunction = Math.random() < 0.5 ? tasteGoodResponses : tasteBadResponses;

    let responses = tasteFunction(food);
    let line = randomElement(responses);
    return interaction.reply(line);
}

module.exports = {
    command,
    commandName,
    handle,
}