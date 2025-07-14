const foodQueueMapSize = 10;

const ORDER_CHANNEL_ID = "1392337668100198430";
const COOK_CHANNEL_ID = "1392344681085403267";

// Cursed ingredients
const cursedIngredients = [
    "cockroach",
    "glass",
    "nails",
    "rat",
    "mold",
    "socks",
    "poison",
    "soap",
];

class FoodQueueMap {
    constructor() {
        this.orderNumber = 0;
        // a map from time to food and user ID
        this.orders = new Map();
    }

    enqueue(food, userId, orderId = null) {
        if (this.orders.size >= foodQueueMapSize) {
            // Remove the oldest order
            const oldestKey = this.orders.keys().next().value;
            this.orders.delete(oldestKey);
        }

        if (orderId === null) {
            orderId = this.orderNumber;
        } else if (this.orders.has(orderId)) {
            throw new Error(`Order ID ${orderId} already exists.`);
        }

        this.orders.set(orderId, { food, userId });
        this.orderNumber++;
        return this.orderNumber - 1;
    }

    dequeue(foodArg, userIdArg = null) {
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
const recentOrders = new FoodQueueMap();
// Enquing into recentDishes should explicitly provide the userId argument
const recentDishes = new FoodQueueMap();

function randomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

module.exports = {
    ORDER_CHANNEL_ID,
    COOK_CHANNEL_ID,
    cursedIngredients,
    recentOrders,
    recentDishes,
    randomElement,
}