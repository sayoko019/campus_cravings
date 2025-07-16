import type { ChatInputCommandInteraction, ButtonInteraction, Client, User, InteractionReplyOptions } from "discord.js";
import type { Recipe } from "./recipe.ts";

import {
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} from "discord.js";
import { recipeBook } from "./recipe.js";
import { COOK_CHANNEL_ID, type CommandModule } from "../../common.js";

const commandName = "recipe";

const command = new SlashCommandBuilder()
    .setName(commandName)
    .setDescription("Show a recipe with navigation buttons.");

const permittedChannels = [COOK_CHANNEL_ID];

type ViewedState = {
    id: "browsing_recipies";
    recipeIndex: number;
    recipe: Recipe;
} | {
    id: "learning_recipe_details";
    recipeIndex: number;
    recipe: Recipe;
};

let viewedStates: Map<User["id"], ViewedState> = new Map();

async function handleBrowsingRecipes(interaction: ChatInputCommandInteraction | ButtonInteraction, viewedState: Extract<ViewedState, { id: "browsing_recipies" }>) {
    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("recipe_prev")
            .setLabel("Previous Recipe")
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId("recipe_learn")
            .setLabel("Learn More")
            .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
            .setCustomId("recipe_next")
            .setLabel("Next Recipe")
            .setStyle(ButtonStyle.Primary),
    );

    const payload = {
        content: `Wanna see the recipe for ${viewedState.recipe.name}?`
            + `\n\n${viewedState.recipe.description}`,
        components: [row] as any,
    };

    if (interaction.isChatInputCommand()) {
        await interaction.reply(payload);
        return;
    }
    if (interaction.isButton()) {
        await interaction.update(payload);
        return;
    }
}

async function handle(client: Client, interaction: ChatInputCommandInteraction) {
    const { user } = interaction;

    if (!viewedStates.has(user.id)) {
        const recipeIndex = 0 as const;
        const recipe = recipeBook[recipeIndex] satisfies Recipe;
        const viewedState: ViewedState = {
            id: "browsing_recipies",
            recipeIndex,
            recipe,
        };
        viewedStates.set(user.id, viewedState);
    }

    // TODO: handle updating the message ID if the previous message was deleted
    // of if it was sent long ago

    const viewedState: ViewedState = viewedStates.get(user.id)!;

    if (viewedState.id === "browsing_recipies") {
        return handleBrowsingRecipes(interaction, viewedState);
    }
}

async function handleRecipeTransition(interaction: ButtonInteraction, delta: -1 | 1) {
    const userId = interaction.user.id;

    if (!viewedStates.has(userId)) {
        return interaction.reply(`Type \`/${commandName}\` to start browsing recipes too!`);
    }

    const viewedState = viewedStates.get(userId)!;

    if (viewedState.id !== "browsing_recipies") {
        return interaction.reply({
            content: "You are not currently browsing recipes.",
            ephemeral: true,
        });
    }

    viewedState.recipeIndex = (viewedState.recipeIndex + delta + recipeBook.length) % recipeBook.length;
    viewedState.recipe = recipeBook[viewedState.recipeIndex] satisfies Recipe;
    viewedStates.set(userId, viewedState);

    handleBrowsingRecipes(interaction, viewedState);
}

async function handlePreviousRecipe(interaction: ButtonInteraction) {
    await handleRecipeTransition(interaction, -1);
}

async function handleNextRecipe(interaction: ButtonInteraction) {
    await handleRecipeTransition(interaction, 1);
}

function buildRecipeDetailsMessageContent(recipe: Recipe): string {
    const title = `# ${recipe.name}`;
    const description = `**Description:** ${recipe.description}`;
    const origin = `**Origin:** ${recipe.origin}`;
    const steps_intro = `You can cook this dish in ${recipe.steps.length} steps.`;

    return [title, "", description, origin, "", steps_intro].join("\n");
}

async function updateMessageWithRecipe(interaction: ButtonInteraction, viewedState: Extract<ViewedState, { id: "learning_recipe_details" }>,) {
    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("back_to_recipes")
            .setLabel("Back to Recipes")
            .setStyle(ButtonStyle.Primary)
    );

    const payload = {
        content: buildRecipeDetailsMessageContent(viewedState.recipe),
        components: [row] as any,
    };

    await interaction.update(payload);
}

async function handleLearnMore(interaction: ButtonInteraction) {
    const userId = interaction.user.id;

    if (!viewedStates.has(userId)) {
        return interaction.reply(`Type \`/${commandName}\` to start browsing recipes too!`);
    }

    let viewedState = viewedStates.get(userId)!;

    if (viewedState.id !== "browsing_recipies") {
        return interaction.reply({
            content: "You are not currently browsing recipes.",
            ephemeral: true,
        });
    }

    viewedState = {
        id: "learning_recipe_details",
        recipeIndex: viewedState.recipeIndex,
        recipe: viewedState.recipe,
    };
    viewedStates.set(userId, viewedState);

    await updateMessageWithRecipe(interaction, viewedState);
}

async function handleBackToRecipes(interaction: ButtonInteraction) {
    const userId = interaction.user.id;

    if (!viewedStates.has(userId)) {
        return interaction.reply(`Type \`/${commandName}\` to start browsing recipes too!`);
    }

    let viewedState = viewedStates.get(userId)!;

    if (viewedState.id !== "learning_recipe_details") {
        return interaction.reply({
            content: "You are not currently viewing recipe details.",
            ephemeral: true,
        });
    }

    viewedState = {
        id: "browsing_recipies",
        recipeIndex: viewedState.recipeIndex,
        recipe: viewedState.recipe,
    };
    viewedStates.set(userId, viewedState);

    await handleBrowsingRecipes(interaction, viewedState);
}

async function onButtonInteraction(interaction: ButtonInteraction) {
    switch (interaction.customId) {
        case "recipe_prev":
            await handlePreviousRecipe(interaction);
            return;
        case "recipe_learn":
            await handleLearnMore(interaction);
            return;
        case "recipe_next":
            await handleNextRecipe(interaction);
            return;
        case "back_to_recipes":
            await handleBackToRecipes(interaction);
            return;

    }
}

export const commandModule = {
    commandName,
    command,
    permittedChannels,
    handle,
    onButtonInteraction,
} satisfies CommandModule;
