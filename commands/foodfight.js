const {
    SlashCommandBuilder
} = require("discord.js");
const { ORDER_CHANNEL_ID, randomElement } = require("../common.js");

const commandName = "foodfight";

const command = new SlashCommandBuilder()
    .setName(commandName)
    .setDescription("Throw food at another user")
    .addUserOption((opt) =>
        opt
            .setName("target")
            .setDescription("Who to throw it at")
            .setRequired(true),
    )
    .addStringOption((opt) =>
        opt.setName("food").setDescription("What to throw").setRequired(true),
    );

function renderResponses(target, food) {
    return [
        `You nailed ${target.username} with a flying ${food}!`,
        `You missed! ${target.username} dodged the ${food}.`,
        `The ${food} bounced off a wall and hit you instead.`,
        `${target.username} caught the ${food} and launched it back!`,
        `The ${food} turned out to be cursed. Chaos unfolds.`,
        `The ${food} exploded mid-air. Now everyone smells like despair.`,
        `${target.username} summoned a force field. Your ${food} is now airborne art.`,
        `You slipped on your own ${food}. Tragic.`,
        `The cafeteria goes silent as the ${food} hits the principal. Uh oh.`,
        `A hamster referee blows a tiny whistle. Illegal food throw!`,
        `${target.username} eats the ${food} mid-flight. Intimidating.`,
        `The ${food} ricochets, knocks over a tray, and starts a full-scale food war.`,
        `You hit ${target.username}, but the ${food} morphs into a chicken nugget and runs away.`,
        `The ${food} was alive. It bites back.`,
        `A portal opens where the ${food} lands. You hear ancient chewing noises from beyond.`,
        `A dramatic slow-mo replay shows you getting hit by your own ${food}. Ouch.`,
        `The ${food} shatters into glitter. Magical, but confusing.`,
        `${target.username} deflects the ${food} with a cafeteria tray like a seasoned warrior.`,
        `The lights flicker. A spectral chef appears. “Who disrespects the sacred ${food}?”`,
        `A hamster on a unicycle intercepts the ${food}, nods solemnly, and vanishes.`,
        `The ${food} screams as it flies. Why did it scream??`,
        `You launch the ${food}, but a gust of wind sends it into the ceiling fan. Shrapnel everywhere.`,
        `The ${food} turns into confetti and showers the room. Everyone claps awkwardly.`,
        `You throw the ${food}, but your sleeve rips off dramatically. Worth it.`,
        `${target.username} disappears in a puff of flour. The food lands in an empty chair.`,
        `You both pause as the ${food} transforms into a sentient jelly cube. It now lives here.`,
        `Your ${food} throw triggers a school-wide lockdown. Worth it?`,
        `The food bounces harmlessly off ${target.username}, but the emotional damage is permanent.`,
        `You hurl the ${food} with conviction—only to hit the beloved hamster statue. Silence.`,
        `You throw the ${food}, but it phases through reality and never lands.`,
        `The ${food} triggers a flashback sequence. ${target.username} weeps softly.`,
        `The ${food} hits a bystander who now demands a duel at dawn.`,
        `You summon all your strength and launch the ${food}—it gently lands in ${target.username}’s hand. Awkward.`,
        `The hamster appears, eats the ${food} mid-air, and glares at you. You’ve been judged.`,
        `You launch the ${food}, but it transforms into a tiny opera singer mid-flight.`,
        `The ${food} hits ${target.username}, who dramatically collapses like it’s Shakespeare.`,
        `The ${food} never existed. You threw your hopes and dreams instead.`,
        `You throw the ${food}, but your shoe goes with it. It’s chaos now.`,
        `${target.username} counters your ${food} with a spoonful of vengeance.`,
        `The ${food} spins in the air, lands in a perfect dish on the table. Nailed the plating.`,
        `Your ${food} hits a cursed mirror. There are now five of you, and all are annoyed.`,
        `The food fight pauses as the school's emergency bard begins narrating in rhyme.`,
        `You accidentally trigger a forbidden food combo. The room fills with fog.`,
        `The ${food} chooses violence, gains sentience, and joins the drama club.`,
    ]
}

function handle(client, interaction) {
    const { options, channelId } = interaction;

    const target = options.getUser("target");
    const food = options.getString("food").toLowerCase();

    if (channelId !== ORDER_CHANNEL_ID)
        return interaction.reply({
            content: "Tasting only allowed in the cafeteria.",
            ephemeral: true,
        });

    const responses = renderResponses(target, food);
    let random = randomElement(responses);

    return interaction.reply(random);
}

module.exports = {
    command,
    commandName,
    handle,
}
