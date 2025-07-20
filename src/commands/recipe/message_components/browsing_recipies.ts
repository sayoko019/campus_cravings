import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ChatInputCommandInteraction } from "discord.js";
import { ViewedState, viewedStates } from "../viewed_states.js";
import { commandName } from "../index.js";
import { Recipe, recipeBook } from "../recipe.js";
import { updateMessageWithRecipe } from "./learning_recipe_details.js";

export function defaultBrowsingRecipesViewedState(): ViewedState {
    return {
        id: "browsing_recipies",
        recipeIndex: 0,
        recipe: recipeBook[0] satisfies Recipe,
    };
}

export async function handleBrowsingRecipes(interaction: ChatInputCommandInteraction | ButtonInteraction, viewedState: Extract<ViewedState, { id: "browsing_recipies" }>) {
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

export async function handlePreviousRecipe(interaction: ButtonInteraction) {
    await handleRecipeTransition(interaction, -1);
}

export async function handleNextRecipe(interaction: ButtonInteraction) {
    await handleRecipeTransition(interaction, 1);
}

export async function handleLearnMore(interaction: ButtonInteraction) {
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
