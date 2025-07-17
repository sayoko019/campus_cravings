import { ChatInputCommandInteraction, Client, SlashCommandBuilder, User } from "discord.js";
import { ORDER_CHANNEL_ID, COOK_CHANNEL_ID, type CommandModule } from "../../../common.js";
import { getInventory, InventoryItemData, ItemKind } from "../index.js";

const commandName = "inventory";

const command = new SlashCommandBuilder()
    .setName(commandName)
    .setDescription("View your inventory");

const permittedChannels = [ORDER_CHANNEL_ID, COOK_CHANNEL_ID];

function itemKindPropertyLabel(itemKind: ItemKind): string {
    if (itemKind === "recipe-cooked-food") {
        return "Recipe-Cooked Food";
    }
    return "Unknown Item Kind";
}

function buildItemDescription(item: InventoryItemData): string {
    const title = `## ${item.name}`;

    const description = `**Description**: ${item.description}`;
    const quantity = `**Quantity**: ${item.quantity}`;

    const propertyLabels: string[] = [
        item.isUnique ? "Unique (doesn't stack)" : "Stackable",
        itemKindPropertyLabel(item.itemKind),
    ];

    const properties = `**Properties**: ${propertyLabels.join(", ")}`;

    return [title, "", description, quantity, properties].join("\n");
}

function buildViewInventoryResponse(inventory: InventoryItemData[]): string {
    if (inventory.length === 0) {
        return "Your inventory is empty.";
    }

    const items = inventory.map(item => buildItemDescription(item)).join("\n");
    return `Your inventory:\n${items}`;
}

function handle(client: Client, interaction: ChatInputCommandInteraction) {
    const userId: User["id"] = interaction.user.id;
    const inventory: InventoryItemData[] = getInventory(userId);
    return interaction.reply(buildViewInventoryResponse(inventory));
}

export const commandModule: CommandModule = {
    commandName,
    command,
    permittedChannels,
    handle,
};
