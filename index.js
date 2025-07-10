require('dotenv').config();
console.log("Loaded token from .env:", process.env.TOKEN);
// NEU Diner Bot - index.js
const { Client, GatewayIntentBits, Events, REST, Routes, SlashCommandBuilder, Collection } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

// Debug: Check if token is loading
console.log('Token loaded:', process.env.TOKEN ? '[REDACTED]' : 'MISSING');

// Channel restrictions
const ORDER_CHANNEL_ID = '1392337668100198430';
const COOK_CHANNEL_ID = '1392344681085403267';

const recentOrders = new Map(); // Tracks last 10 ordered items

// Taste responses
const tasteGood = [
  "Absolutely divine. I'd eat this every day.",
  "You cooked with your soul — I'm speechless.",
  "Gordon Ramsay just fainted from joy.",
  "Exquisite. Michelin-star worthy.",
  "My tastebuds are crying happy tears.",
  "Bravo! This is actual magic.",
  "Heaven on a plate.",
  "I could kiss the chef. Almost.",
  "You’ve created art, not food.",
  "This might raise the dead in a good way.",
  "This is pure culinary wizardry.",
  "I’m ascending. This food is divine.",
  "You’ve unlocked a new flavor dimension.",
  "My ancestors just high-fived me.",
  "If joy had a taste, it’s this.",
  "So good it cured my existential dread.",
  "Every bite is a hug from the universe.",
  "I’d fight for this recipe.",
  "I cried. I wept. I cheered.",
  "You just fed my soul.",
  "Gordon Ramsay is trembling.",
  "Can I frame this taste in a museum?",
  "I'm calling the culinary Nobel committee.",
  "Did an angel cook this?",
  "I'm never eating anything else again.",
  "This dish makes reality better.",
  "I'm in a food coma of bliss.",
  "Legendary. Simply legendary.",
  "It tastes like a loving memory.",
  "I wish I could marry this flavor.",
  "This food gives me hope.",
  "If I die now, I’ll die happy.",
  "You’ve achieved edible perfection.",
  "I saw stars. Literal stars.",
  "How did you do this?!",
  "This should be illegal in a good way.",
  "My soul is doing cartwheels.",
  "A flavor explosion — in the best way.",
  "You made my tastebuds dance.",
  "I’m speechless. Just take a bow.",
  "You’ve redefined delicious.",
  "This could start a religion.",
  "Michelangelo would've painted this taste.",
  "You bent the laws of physics with flavor.",
  "Every molecule sings with joy.",
  "It's like eating poetry.",
  "You found flavor nirvana.",
  "The culinary gods salute you.",
  "Flavor enlightenment achieved.",
  "This is what dreams taste like."
];

const tasteBad = [
  "You call *that* food? Even a raccoon has standards.",
  "This dish is a war crime.",
  "My mouth just filed a lawsuit.",
  "I’ve tasted cardboard with more personality.",
  "This belongs in a cursed museum.",
  "The stove is suing you.",
  "It’s raw. Not in a cool way.",
  "Who hurt you? Because you hurt this food.",
  "Congratulations, you’ve summoned a demon.",
  "The smell alone knocked out three staff.",
  "I think this dish is sentient... and angry.",
  "My tastebuds are in therapy now.",
  "I just saw my life flash before my eyes.",
  "That wasn’t food. That was an experience... of pain.",
  "Why is it fizzing?",
  "This belongs in a dumpster fire.",
  "It’s both burnt and undercooked. Impressive.",
  "Even Gordon Ramsay wouldn’t roast this. Too easy.",
  "This dish gave me emotional damage.",
  "Did you cook this with spite?",
  "The health inspector resigned after tasting this.",
  "Is this revenge food?",
  "Even a cursed relic wouldn’t touch this.",
  "It tastes like regret.",
  "This gave me trust issues.",
  "I want my tastebuds replaced.",
  "I’ve met bad food, but this one bullies others.",
  "It melted the plate. That’s not normal.",
  "A culinary crime scene.",
  "This gave me a vision of the apocalypse.",
  "This food called my mom and apologized.",
  "How did you mess up water?",
  "I’d rather eat my homework.",
  "The seasoning is confusion.",
  "A toxic masterpiece.",
  "This dish bites back.",
  "My tongue is calling the police.",
  "I feel betrayed by this flavor.",
  "Even the trash rejected it.",
  "Unforgivable.",
  "This activated my fight-or-flight response.",
  "Tastes like a dare gone wrong.",
  "This food broke my spirit.",
  "It smells like lies.",
  "Not even a worm would eat this.",
  "I’m contacting culinary authorities.",
  "Why does it hum when I look at it?",
  "It tastes like sorrow and aluminum.",
  "This dish insulted my ancestors.",
  "Even the plate is trying to escape."
];

// Cursed ingredients
const cursedIngredients = ['cockroach', 'glass', 'nails', 'rat', 'mold', 'socks', 'poison', 'soap'];

// Command setup
const commands = [
  new SlashCommandBuilder().setName('order').setDescription('Order any dish').addStringOption(opt => opt.setName('food').setDescription('Name of the food').setRequired(true)),
  new SlashCommandBuilder().setName('cook').setDescription('Cook a dish').addStringOption(opt => opt.setName('food').setDescription('Name of the dish').setRequired(true)),
  new SlashCommandBuilder().setName('taste').setDescription('Taste test a dish').addStringOption(opt => opt.setName('food').setDescription('Dish to taste').setRequired(true)),
  new SlashCommandBuilder().setName('specials').setDescription("See today's random special"),
  new SlashCommandBuilder().setName('foodfight').setDescription('Throw food at another user').addUserOption(opt => opt.setName('target').setDescription('Who to throw it at').setRequired(true)).addStringOption(opt => opt.setName('food').setDescription('What to throw').setRequired(true)),
];

client.commands = new Collection();
commands.forEach(cmd => client.commands.set(cmd.name, cmd));

client.once(Events.ClientReady, async () => {
  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
  try {
    await rest.put(Routes.applicationCommands(client.user.id), { body: commands });
    console.log('Commands registered. Bot is ready.');
  } catch (e) {
    console.error(e);
  }
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName, options, channelId, user } = interaction;

  if (commandName === 'order') {
    const food = options.getString('food').toLowerCase();
    if (channelId !== ORDER_CHANNEL_ID) return interaction.reply({ content: 'Orders only allowed in the diner order channel.', ephemeral: true });
    recentOrders.set(food, user.id);
    if (recentOrders.size > 10) recentOrders.delete(recentOrders.keys().next().value);

   let cursed = cursedIngredients.find(word => food.includes(word));

  let response = cursed
    ? [
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
        `Even the dumpster rejected this ${food}. Brave of you.`
       ][Math.floor(Math.random() * 12)]
    :  [
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
        `We've assigned a food therapist to your ${food}. It'll be ready soon.`
      ][Math.floor(Math.random() * 12)];

  return interaction.reply(response);
}

  if (commandName === 'cook') {
    const food = options.getString('food').toLowerCase();
    if (channelId !== COOK_CHANNEL_ID) return interaction.reply({ content: 'Cooking only allowed in the kitchen channel.', ephemeral: true });
    let cursed = cursedIngredients.find(word => food.includes(word));
    if (cursed) {
      return interaction.reply(`You tried to cook ${food}, and summoned a kitchen demon. It's loose now.`);
    }
    if (recentOrders.has(food)) {
      recentOrders.delete(food);
      return interaction.reply(`You successfully cooked the ordered dish: ${food}!`);
    } else {
      let fails = [
        `${food} exploded in the oven. Fire is everywhere.`,
        `${food} is still frozen solid. A crime.`,
        `${food} was alive and bit you.`,
        `${food} just detonated. Everyone’s stunned.`,
        `${food} turned into goo. Weird goo.`
        `You dropped ${food} and it vanished into a portal.`,
       `${food} caught fire, then caught *more* fire.`,
        `A cloud of smoke emerged from ${food} and whispered your secrets.`,
       `The ${food} insulted the chef. A brawl broke out.`,
       `${food} started screaming halfway through cooking.`,
       `The oven rejected ${food} entirely. It launched it back.`,
       `You blacked out. When you woke up, the ${food} was gone—and so was your shadow.`, 
        `The ${food} summoned a second ${food}. Now they’re fighting.`,
       `The kitchen lights flickered and the ${food} whispered, "Run."`,
       `The ${food} turned into sentient slime and escaped.`,
       `You cooked ${food} too long. It gained consciousness and is furious.`,
       `A rift opened above the stove. The ${food} is gone, but something else is watching.`,
       `You sneezed mid-recipe. Now the ${food} is part ghost.`,
       `The ${food} rejected its own ingredients and exploded into confetti.`,
       `Your cookbook burst into flames as soon as you touched the ${food}.`,
       `Cooking ${food} triggered a minor earthquake. The hamster is NOT happy.`,
       `The kitchen floor turned into jelly. ${food} sank instantly.`
      ];
      let randomFail = fails[Math.floor(Math.random() * fails.length)];
      return interaction.reply(randomFail);
    }
  }

  if (commandName === 'taste') {
  const food = options.getString('food').toLowerCase();
  let cursed = cursedIngredients.find(word => food.includes(word));
  if (cursed) return interaction.reply(`${food}? You just made Gordon Ramsay retire.`);

  const tasteBad = [
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
    `This ${food} triggered a smoke detector in another server.`
  ];

  const tasteGood = [
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
    `Ten out of ten. Eleven if we ignore food safety laws.`
  ];

  let pool = Math.random() < 0.5 ? tasteGood : tasteBad;
  let line = pool[Math.floor(Math.random() * pool.length)];
  return interaction.reply(line);
}

  if (commandName === 'specials') {
    let specials = ["Creamy mushroom pasta", "Beetle-shell brittle", "Cinnamon-scorched noodles", "Frozen pickle parfait", "Cactus milk custard", "Burnt citrus jelly", "Raspberry gravy fries", "Lime-salted shadow chips", "Butter-smoked onions", "Soy-glazed nettle toast", "Pine needle biscotti", "Amber-coated leek pops", "Coconut curry fog", "Yuzu-swirled tar balls", "Black garlic cheesecake", "Fermented melon kabobs", "Dirt-dusted tofu cubes", "Crispy algae crepes", "Ginger root brittle", "Iridescent egg yolk spheres", "Mold-ripened berry loaf", 
   "Moonberry ramen", "Candied radish sticks", "Charcoal-dusted melon bites", "Savory licorice dumplings", "Rosemary waffle nachos", "Spicy cactus pudding", "Lavender onion dip", "Toasted sea foam crisps", "Velvet beet gazpacho", "Glitter-glazed brussels sprouts", "Zesty fern fritters", "Marshmallow bone broth", "Grilled ghost pepper pineapple", "Cloudberry meatballs", "Tarragon jelly toast", "Wheatgrass lava cake", "Wasabi oat crumble", "Pickle whipped cream pie", "Miso cotton candy", "Fried dandelion stems", "Slime-mint risotto", "Molasses kale cookies", 
   "Sizzling citrus bark", "Licorice eggplant stacks", "Herb-stuffed plum skins", "Sun-dried turnip loaf", "Tofu thunder nuggets", "Spore-spiced spaghetti", "Fennel sugar noodles", "Ash-dusted carrot slabs", 
   "Molten beet tart", "Garlic-swirled ice cream", "Crunchy moss lasagna", "Starlight onion rings", "Frosted mushroom nuggets", "Chili-dipped marshmallows", "Pickled plum foam", "Crystalized basil wafers", "Charred banana gnocchi", "Sage-sprinkled jelly cubes", 
   "Roasted sunflower seed lasagna", "Banana peel curry", "Maple-glazed haystack", "Midnight mushroom risotto", "Hamster kibble brûlée", "Fizzy nectarine soup", "Wasabi jelly pancakes", "Baked acorn pockets", "Cheddar-scented air puffs", "Nut butter sashimi", 
   "Spicy tofu tacos", "Charred corn salad", "Truffle fries", "Pickled moon pears", "Sulfur-glazed eggplant", "Candied cactus ribs", "Ghost pepper gelato", "Charcoal-dusted melon cubes", "Blue cheese lava cake", "Fermented strawberry stew", "Cursed clove spaghetti", "Static-charged ramen", "Ink-soaked corn fritters", 
   "Stuffed pumkin"];
    let secretMenu = ["Liquid moonlight", "Phoenix egg omelet", "Haunted tiramisu", "Ethereal cotton candy", "Glowing eel soup"];
    let chosen = specials[Math.floor(Math.random() * specials.length)];
    let secret = Math.random() < 0.05 ? ` Secret Menu: ${secretMenu[Math.floor(Math.random() * secretMenu.length)]}` : '';
    return interaction.reply(`Today’s special: ${chosen}.${secret}`);
  }

  if (commandName === 'foodfight') {
    const target = options.getUser('target');
    const food = options.getString('food').toLowerCase();
    let outcomes = [
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
      `The ${food} chooses violence, gains sentience, and joins the drama club.`  
];

    let random = outcomes[Math.floor(Math.random() * outcomes.length)];
    return interaction.reply(random);
  }

  if (commandName === 'serve') {
  const target = options.getUser('target');
  const food = options.getString('food');
  return interaction.reply(`You served ${target.username} a plate of ${food}. They look... concerned.`);
}

if (commandName === 'inspect') {
  const food = options.getString('food');
  const results = [
    `${food} looks... edible. Maybe.`,
    `There's definitely something moving in the ${food}.`,
    `${food} passes inspection—barely.`,
    `${food}? That's not even legal in most countries.`,
    `The inspector fainted. Congrats.`
  ];
  let response = results[Math.floor(Math.random() * results.length)];
  return interaction.reply(response);
}

if (commandName === 'clean') {
  const results = [
    `You scrub the counter. A sentient blob hisses and retreats.`,
    `The sink is cleaner now. The void under it remains.`,
    `You swept the floor. You found... someone’s soul?`,
    `You cleaned up. The hamster chef nods in approval.`,
    `Soap and bleach applied. Cursed essence lingers anyway.`
  ];
  let result = results[Math.floor(Math.random() * results.length)];
  return interaction.reply(result);
}

});

// ✅ Final line — use the token from .env properly!
client.login(process.env.TOKEN);