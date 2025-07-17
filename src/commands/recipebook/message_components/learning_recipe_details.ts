import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle } from "discord.js";
import { Recipe } from "../recipe";
import { ViewedState, viewedStates } from "../viewed_states.js";
import { commandName } from "../index.js";
import { handleBrowsingRecipes } from "./browsing_recipies.js";
import { handlePerformingCookingStep } from "./perfoming_cooking_step/index.js";

function buildRecipeDetailsMessageContent(recipe: Recipe): string {
    const title = `# ${recipe.name}`;
    const description = `**Description:** ${recipe.description}`;
    const origin = `**Origin:** ${recipe.origin}`;
    const steps_intro = `You can cook this dish in ${recipe.steps.length} steps.`;

    return [title, "", description, origin, "", steps_intro].join("\n");
}

export async function updateMessageWithRecipe(interaction: ButtonInteraction, viewedState: Extract<ViewedState, { id: "learning_recipe_details" }>,) {
    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("back_to_recipes")
            .setLabel("Back to Recipes")
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId("start_cooking_recipe")
            .setLabel("Start Cooking")
            .setStyle(ButtonStyle.Success),
    );

    const payload = {
        content: buildRecipeDetailsMessageContent(viewedState.recipe),
        components: [row] as any,
    };

    await interaction.update(payload);
}

export async function handleBackToRecipes(interaction: ButtonInteraction) {
    const userId = interaction.user.id;

    if (!viewedStates.has(userId)) {
        return interaction.reply(`Type \`/${commandName}\` to start browsing recipes too!`);
    }

    let viewedState: ViewedState = viewedStates.get(userId)!;

    if (!["learning_recipe_details", "performing_cooking_step"].includes(viewedState.id)) {
        return interaction.reply({
            content: "You are not currently viewing recipe details.",
            ephemeral: true,
        });
    }

    viewedState = {
        id: "browsing_recipies",
        recipeIndex: viewedState.recipeIndex,
        recipe: viewedState.recipe,
    } satisfies ViewedState;
    viewedStates.set(userId, viewedState);

    await handleBrowsingRecipes(interaction, viewedState);
}

export async function handleStartCookingRecipe(interaction: ButtonInteraction) {
    const userId = interaction.user.id;

    if (!viewedStates.has(userId)) {
        return interaction.reply(`Type \`/${commandName}\` to start browsing recipes too!`);
    }

    let viewedState: ViewedState = viewedStates.get(userId)!;

    if (viewedState.id !== "learning_recipe_details") {
        return interaction.reply({
            content: "You are not currently viewing recipe details.",
            ephemeral: true,
        });
    }

    viewedState = {
        id: "performing_cooking_step",
        recipeIndex: viewedState.recipeIndex,
        recipe: viewedState.recipe,
        stepIndex: 0,
        step: viewedState.recipe.steps[0],
        total_steps: viewedState.recipe.steps.length,
    } satisfies ViewedState;
    viewedStates.set(userId, viewedState);

    await handlePerformingCookingStep(interaction, viewedState);
}
