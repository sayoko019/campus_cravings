import type { ChatInputCommandInteraction, ButtonInteraction, Client, User, InteractionReplyOptions } from "discord.js";
import {
    SlashCommandBuilder,
} from "discord.js";
import { COOK_CHANNEL_ID, type CommandModule } from "../../common.js";
import { ViewedState, viewedStates } from "./viewed_states.js";
import { defaultBrowsingRecipesViewedState, handleBrowsingRecipes, handleLearnMore, handleNextRecipe, handlePreviousRecipe } from "./message_components/browsing_recipies.js";
import { handleBackToRecipes } from "./message_components/learning_recipe_details.js";

const commandName = "recipe";

const command = new SlashCommandBuilder()
    .setName(commandName)
    .setDescription("Show a recipe with navigation buttons.");

const permittedChannels = [COOK_CHANNEL_ID];

async function handle(client: Client, interaction: ChatInputCommandInteraction) {
    const { user } = interaction;

    let viewedState: ViewedState;

    if (!viewedStates.has(user.id)) {
        viewedState = defaultBrowsingRecipesViewedState();
        viewedStates.set(user.id, viewedState);
    } else {
        viewedState = viewedStates.get(user.id)!;
    }

    if (viewedState.id === "browsing_recipies") {
        return handleBrowsingRecipes(interaction, viewedState);
    }
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
