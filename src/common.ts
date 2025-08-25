import type { ButtonInteraction, ChatInputCommandInteraction, Client, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder, User } from "discord.js";

export interface CommandModule {
    commandName: string;
    command: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
    permittedChannels: string[];
    handle: (client: Client, interaction: ChatInputCommandInteraction) => void;
    onButtonInteraction?: (interaction: ButtonInteraction) => Promise<void>;
}

export interface SystemModule {
    onStart: () => Promise<void>;
    onStop: () => Promise<void>;
}

const foodQueueMapSize = 10;

export const ORDER_CHANNEL_ID = "1392337668100198430";
export const COOK_CHANNEL_ID = "1392344681085403267";

export type OrderId = number;

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

export type FoodQueueItemBase = {
    food: string;
    designatedUserId: User["id"];
};

class FoodQueueMap<ProviderExtension = { providerId?: User["id"] }> {
    orderNumber: number;
    items: Map<number, FoodQueueItemBase & ProviderExtension>;

    constructor() {
        this.orderNumber = 0;
        // a map from time to food and user ID
        this.items = new Map();
    }

    enqueue(
        food: string,
        designatedUserId: User["id"],
        providerExtension: ProviderExtension,
        orderIdArg: OrderId | null = null,
    ) {
        let orderId: OrderId;

        if (orderIdArg === null) {
            orderId = this.orderNumber satisfies OrderId;
        } else if (this.items.has(orderIdArg)) {
            throw new Error(`Order ID ${orderIdArg} already exists.`);
        } else {
            orderId = orderIdArg;
        }

        if (this.items.size >= foodQueueMapSize) {
            // Remove the oldest order
            const oldestKey: OrderId = this.items.keys().next().value!;
            this.items.delete(oldestKey);
        }

        this.items.set(orderId, { food, designatedUserId, ...providerExtension });
        this.orderNumber++;
        return this.orderNumber - 1;
    }

    dequeue(
        filter: (orderId: OrderId, item: FoodQueueItemBase) => boolean,
        options: { reverse?: boolean } = {},
    ): (FoodQueueItemBase & ProviderExtension & { orderId: OrderId }) | null {
        let iter;

        if (!options.reverse) {
            iter = this.items.entries();
        } else {
            iter = Array.from(this.items.entries()).reverse();
        }

        for (const [orderId, item] of iter satisfies Iterable<[OrderId, FoodQueueItemBase & ProviderExtension]>) {
            if (!filter(orderId, item)) continue;

            this.items.delete(orderId);
            const { food, designatedUserId: userId } = item;

            // technically, we could omit the food
            // because we already know it
            // but keeping it for consistency

            let base: FoodQueueItemBase = { food: item.food, designatedUserId: item.designatedUserId };
            let providerExtension: ProviderExtension;

            if ("providerId" in item) {
                providerExtension = { providerId: item.providerId as User["id"] } as ProviderExtension;
            } else {
                providerExtension = {} as ProviderExtension;
            }

            const obj: FoodQueueItemBase & ProviderExtension & { orderId: OrderId } = { ...base, ...providerExtension, orderId };
            return obj;
        }
        return null;
    }
}

export const recentOrders = new FoodQueueMap<{}>();
export const recentCookedDishes = new FoodQueueMap<{
    providerId?: User["id"];
}>();
export const recentServedDishes = new FoodQueueMap<
    { providerId?: User["id"]; }
>();
export const recentEatenDishes = new FoodQueueMap<
    { providerId?: User["id"]; }
>();

export function randomElement<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}
