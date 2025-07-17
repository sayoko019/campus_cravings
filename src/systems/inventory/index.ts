import path from "path";
import { fileURLToPath } from "url";
import { User } from "discord.js";
import { ItemID } from "./item_id";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inventoryFile: string = path.join(__dirname, "..", "..", "..", "data", "inventory.json");
import { readFile, writeFile } from "fs/promises";
import { SystemModule } from "../../common";

export type ItemKind = "recipe-cooked-food";

export type InventoryItemData = {
    itemId: ItemID;
    itemKind: ItemKind;
    isUnique: boolean;
    quantity: number;
    name: string;
    description: string;
};

let inventories: Map<User["id"], InventoryItemData[]> = new Map();

async function onStart() {
    await loadInventories();
}

async function onStop() {
    await saveInventories();
}

async function loadInventories() {
    let data: string;

    try {
        data = await readFile(inventoryFile, "utf-8");
    } catch (error) {
        console.log("Inventory file not found, falling back to creating a new one.");
        inventories = new Map();
        return;
    }

    try {
        const json = JSON.parse(data);
        inventories = new Map(Object.entries(json));
    } catch {
        console.error("Invalid JSON in inventory file.");
        process.exit(1);
    }
}

async function saveInventories() {
    try {
        const json = Object.fromEntries(inventories);
        await writeFile(inventoryFile, JSON.stringify(json, null, 2), "utf-8");
    } catch (error) {
        console.error("Error saving inventories:", error);
    }
}

export function getInventory(userId: User["id"]): InventoryItemData[] {
    return inventories.get(userId) || [];
}

export function grantItem(userId: User["id"], inventoryItemData: InventoryItemData) {
    if (!inventories.has(userId)) {
        inventories.set(userId, []);
    }
    const userInventory: InventoryItemData[] = inventories.get(userId)!;

    if (inventoryItemData.isUnique) {
        userInventory.push(inventoryItemData);
        inventories.set(userId, userInventory);
        return;
    }

    const existingItemIndex = userInventory.findIndex(item => item.itemId === inventoryItemData.itemId);

    if (existingItemIndex !== -1) {
        userInventory[existingItemIndex].quantity += inventoryItemData.quantity;
    } else {
        userInventory.push(inventoryItemData);
    }
}

export function tryExpendItem(userId: User["id"], itemId: ItemID, quantity: number = 1): boolean {
    if (!inventories.has(userId)) return false;
    const userInventory: InventoryItemData[] = inventories.get(userId)!;

    const itemIndex = userInventory.findIndex(item => item.itemId === itemId);
    if (itemIndex === -1 || userInventory[itemIndex].quantity < quantity) return false;

    userInventory[itemIndex].quantity -= quantity;
    if (userInventory[itemIndex].quantity == 0) {
        userInventory.splice(itemIndex, 1);
    }
    inventories.set(userId, userInventory);
    return true;
}

export const systemModule: SystemModule = {
    onStart,
    onStop,
};
