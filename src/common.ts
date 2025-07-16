import type { ButtonInteraction, ChatInputCommandInteraction, Client, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder, User } from "discord.js";

export interface CommandModule {
    commandName: string;
    command: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
    permittedChannels: string[];
    handle: (client: Client, interaction: ChatInputCommandInteraction) => void;
    onButtonInteraction?: (interaction: ButtonInteraction) => Promise<void>;
}

const foodQueueMapSize = 10;

export const ORDER_CHANNEL_ID = "1392337668100198430";
export const COOK_CHANNEL_ID = "1392344681085403267";

type OrderId = number;

// Cursed ingredients
export const cursedIngredients = [
    "cockroach",
    "glass",
    "nails",
    "rat",
    "mold",
    "socks",
    "poison",
    "soap",
] as const;

class FoodQueueMap {
    orderNumber: number;
    orders: Map<number, { food: string; userId: string }>;

    constructor() {
        this.orderNumber = 0;
        // a map from time to food and user ID
        this.orders = new Map();
    }

    enqueue(food: string, userId: User["id"], orderId: OrderId | null = null) {
        if (this.orders.size >= foodQueueMapSize) {
            // Remove the oldest order
            const oldestKey: OrderId = this.orders.keys().next().value!;
            this.orders.delete(oldestKey);
        }

        if (orderId === null) {
            orderId = this.orderNumber satisfies OrderId;
        } else if (this.orders.has(orderId)) {
            throw new Error(`Order ID ${orderId} already exists.`);
        }

        this.orders.set(orderId, { food, userId });
        this.orderNumber++;
        return this.orderNumber - 1;
    }

    dequeue(foodArg: string, userIdArg: User["id"] | null = null) {
        for (const [key, value] of this.orders.entries()) {
            if (value.food !== foodArg) continue;
            if (userIdArg !== null && value.userId !== userIdArg) continue;

            this.orders.delete(key);
            const { food, userId } = value;
            // technically, we could omit the food
            // because we already know it
            // but keeping it for consistency
            return { food, userId, orderId: key };
        }
        return null;
    }
}

// Enquing into recentOrders should omit the orderId argument
export const recentOrders = new FoodQueueMap();
// Enquing into recentDishes should explicitly provide the userId argument
export const recentDishes = new FoodQueueMap();

export function randomElement<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}
