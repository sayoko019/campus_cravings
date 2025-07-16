import type { ChatInputCommandInteraction, Client } from "discord.js";
import type { CommandModule } from "../common";

import {
    SlashCommandBuilder
} from "discord.js";
import { ORDER_CHANNEL_ID, randomElement } from "../common.js";

const commandName = "specials";

const command = new SlashCommandBuilder()
    .setName(commandName)
    .setDescription("See today's random special");

const permittedChannels = [ORDER_CHANNEL_ID];

const specials = [
    "Creamy mushroom pasta",
    "Beetle-shell brittle",
    "Cinnamon-scorched noodles",
    "Frozen pickle parfait",
    "Cactus milk custard",
    "Burnt citrus jelly",
    "Raspberry gravy fries",
    "Lime-salted shadow chips",
    "Butter-smoked onions",
    "Soy-glazed nettle toast",
    "Pine needle biscotti",
    "Amber-coated leek pops",
    "Coconut curry fog",
    "Yuzu-swirled tar balls",
    "Black garlic cheesecake",
    "Fermented melon kabobs",
    "Dirt-dusted tofu cubes",
    "Crispy algae crepes",
    "Ginger root brittle",
    "Iridescent egg yolk spheres",
    "Mold-ripened berry loaf",
    "Moonberry ramen",
    "Candied radish sticks",
    "Charcoal-dusted melon bites",
    "Savory licorice dumplings",
    "Rosemary waffle nachos",
    "Spicy cactus pudding",
    "Lavender onion dip",
    "Toasted sea foam crisps",
    "Velvet beet gazpacho",
    "Glitter-glazed brussels sprouts",
    "Zesty fern fritters",
    "Marshmallow bone broth",
    "Grilled ghost pepper pineapple",
    "Cloudberry meatballs",
    "Tarragon jelly toast",
    "Wheatgrass lava cake",
    "Wasabi oat crumble",
    "Pickle whipped cream pie",
    "Miso cotton candy",
    "Fried dandelion stems",
    "Slime-mint risotto",
    "Molasses kale cookies",
    "Sizzling citrus bark",
    "Licorice eggplant stacks",
    "Herb-stuffed plum skins",
    "Sun-dried turnip loaf",
    "Tofu thunder nuggets",
    "Spore-spiced spaghetti",
    "Fennel sugar noodles",
    "Ash-dusted carrot slabs",
    "Molten beet tart",
    "Garlic-swirled ice cream",
    "Crunchy moss lasagna",
    "Starlight onion rings",
    "Frosted mushroom nuggets",
    "Chili-dipped marshmallows",
    "Pickled plum foam",
    "Crystalized basil wafers",
    "Charred banana gnocchi",
    "Sage-sprinkled jelly cubes",
    "Roasted sunflower seed lasagna",
    "Banana peel curry",
    "Maple-glazed haystack",
    "Midnight mushroom risotto",
    "Hamster kibble brûlée",
    "Fizzy nectarine soup",
    "Wasabi jelly pancakes",
    "Baked acorn pockets",
    "Cheddar-scented air puffs",
    "Nut butter sashimi",
    "Spicy tofu tacos",
    "Charred corn salad",
    "Truffle fries",
    "Pickled moon pears",
    "Sulfur-glazed eggplant",
    "Candied cactus ribs",
    "Ghost pepper gelato",
    "Charcoal-dusted melon cubes",
    "Blue cheese lava cake",
    "Fermented strawberry stew",
    "Cursed clove spaghetti",
    "Static-charged ramen",
    "Ink-soaked corn fritters",
    "Stuffed pumkin",
];

const secretMenu = [
    "Liquid moonlight",
    "Phoenix egg omelet",
    "Haunted tiramisu",
    "Ethereal cotton candy",
    "Glowing eel soup",
];

function handle(client: Client, interaction: ChatInputCommandInteraction) {
    let chosen = randomElement(specials);
    let secret =
        Math.random() < 0.05
            ? ` Secret Menu: ${randomElement(secretMenu)}`
            : "";
    return interaction.reply(`Today’s special: ${chosen}.${secret}`);
}

export const commandModule: CommandModule = {
    commandName,
    command,
    permittedChannels,
    handle,
};
