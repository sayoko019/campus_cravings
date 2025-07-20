import { User } from "discord.js";
import { Recipe } from "./recipe";

export type ViewedState = {
    id: "browsing_recipies";
    recipeIndex: number;
    recipe: Recipe;
} | {
    id: "learning_recipe_details";
    recipeIndex: number;
    recipe: Recipe;
} | {
    id: "performing_cooking_step";
    recipeIndex: number;
    recipe: Recipe;
    stepIndex: number;
    step: Recipe["steps"][number];
    total_steps: number;
};

export let viewedStates: Map<User["id"], ViewedState> = new Map();
