import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle } from "discord.js";
import { ViewedState, viewedStates } from "../../viewed_states.js";
import { grantItem, InventoryItemData } from "../../../../systems/inventory/index.js";

function finishCooking(interaction: ButtonInteraction, viewedState: Extract<ViewedState, { id: "performing_cooking_step" }>) {
    const userId = interaction.user.id;

    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("back_to_recipes")
            .setLabel("Finish")
            .setStyle(ButtonStyle.Success),
    );

    const payload = {
        content: `You have completed all cooking steps for ${viewedState.recipe.name}!\n\n You can find the cooked dish in your inventory.`,
        components: [row] as any,
    };

    const inventoryItemData: InventoryItemData = {
        itemId: viewedState.recipe.itemId,
        itemKind: "recipe-cooked-food",
        isUnique: true,
        quantity: 1,
        name: viewedState.recipe.name,
        description: viewedState.recipe.description,
    };

    grantItem(userId, inventoryItemData);

    interaction.update(payload);
}

export async function handleCookingStepNext(interaction: ButtonInteraction) {
    const userId = interaction.user.id;

    if (!viewedStates.has(userId)) {
        return interaction.reply(`Type \`/recipe\` to start browsing recipes too!`);
    }

    let viewedState: ViewedState = viewedStates.get(userId)!;

    if (viewedState.id !== "performing_cooking_step") {
        return interaction.reply({
            content: "You are not currently performing a cooking step.",
            ephemeral: true,
        });
    }

    if (viewedState.stepIndex >= viewedState.total_steps - 1) {
        return finishCooking(interaction, viewedState);
    }

    viewedState.stepIndex++;
    viewedState.step = viewedState.recipe.steps[viewedState.stepIndex];
    viewedStates.set(userId, viewedState);

    await handlePerformingCookingStep(interaction, viewedState);
}

function handleBasicCookingStep(interaction: ButtonInteraction, viewedState: Extract<ViewedState, { id: "performing_cooking_step", step: string }>) {
    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("cooking_step_next")
            .setLabel("Next Step")
            .setStyle(ButtonStyle.Success),
    );

    const payload = {
        content: `Cooking step ${viewedState.stepIndex + 1} out of ${viewedState.total_steps}:\n\n${viewedState.step}`,
        components: [row] as any,
    };

    interaction.update(payload)
}

export async function handlePerformingCookingStep(
    interaction: ButtonInteraction,
    viewedState: Extract<ViewedState, { id: "performing_cooking_step" }>,
) {
    if (typeof viewedState.step === "string") {
        return handleBasicCookingStep(interaction, viewedState);
    }
    // TODO: add more step types as needed, including those with mini-games
}