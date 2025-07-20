type Shift<A extends Array<any>> =
  ((...args: A) => void) extends ((...args: [A[0], ...infer R]) => void) ? R : never;

type GrowExpRev<A extends Array<any>, N extends number, P extends Array<Array<any>>> = A['length'] extends N ? A : {
  0: GrowExpRev<[...A, ...P[0]], N, P>,
  1: GrowExpRev<A, N, Shift<P>>
}[[...A, ...P[0]][N] extends undefined ? 0 : 1];

type GrowExp<A extends Array<any>, N extends number, P extends Array<Array<any>>> = A['length'] extends N ? A : {
  0: GrowExp<[...A, ...A], N, [A, ...P]>,
  1: GrowExpRev<A, N, P>
}[[...A, ...A][N] extends undefined ? 0 : 1];

export type FixedSizeArray<T, N extends number> = N extends 0 ? [] : N extends 1 ? [T] : GrowExp<[T, T], N, [[T]]>;

interface GenRecipe<ItemId> {
  name: string;
  itemId: ItemId;
  origin: string;
  description: string;
  steps: string[];
}

// ValidationRecipe type exists only to ensure that the recipeBook is valid
// However, in the rest of the codebase, it's better to type ItemId as a union type
// of item IDs, so we use FoodItemId instead.
type ValidationRecipe = GenRecipe<string>;
export type Recipe = GenRecipe<FoodItemId>;

export const recipeBookSize = 107 as const;

export const recipeBook = [
  {
    "name": "nasi lemak",
    "itemId": "nasi_lemak",
    "origin": "Malaysia",
    "description": "Fragrant coconut rice with sambal, anchovies, peanuts, egg, and cucumber.",
    "steps": [
      "Wash and soak the rice.",
      "Cook rice with coconut milk and pandan leaf.",
      "Fry anchovies until crispy.",
      "Boil an egg and slice cucumber.",
      "Serve with sambal and peanuts."
    ]
  },
  {
    "name": "ratatouille",
    "itemId": "ratatouille",
    "origin": "France",
    "description": "A stewed vegetable dish traditionally from Provence.",
    "steps": [
      "Slice eggplant, zucchini, and bell peppers.",
      "Sauté onions and garlic.",
      "Layer vegetables with tomato sauce.",
      "Bake until tender.",
      "Garnish with herbs."
    ]
  },
  {
    "name": "jollof rice",
    "itemId": "jollof_rice",
    "origin": "West Africa",
    "description": "Spicy tomato rice cooked with peppers, onions, and meat.",
    "steps": [
      "Blend tomatoes, peppers, and onions.",
      "Sauté in oil with seasoning.",
      "Add rice and stock.",
      "Simmer until cooked.",
      "Serve with grilled chicken."
    ]
  },
  {
    "name": "pad thai",
    "itemId": "pad_thai",
    "origin": "Thailand",
    "description": "Stir-fried rice noodles with shrimp, tofu, egg, and peanuts.",
    "steps": [
      "Soak rice noodles.",
      "Sauté garlic, tofu, and shrimp.",
      "Add egg and scramble.",
      "Toss in noodles with sauce.",
      "Top with peanuts and lime."
    ]
  },
  {
    "name": "pierogi",
    "itemId": "pierogi",
    "origin": "Poland",
    "description": "Dumplings stuffed with potato, cheese, or meat.",
    "steps": [
      "Make and roll out dough.",
      "Prepare filling (e.g., mashed potato).",
      "Fill and seal dumplings.",
      "Boil until they float.",
      "Pan-fry if desired."
    ]
  },
  {
    "name": "arepas",
    "itemId": "arepas",
    "origin": "Venezuela/Colombia",
    "description": "Cornmeal patties often filled with cheese, meat, or avocado.",
    "steps": [
      "Mix cornmeal with water and salt.",
      "Form into discs.",
      "Grill or fry until golden.",
      "Slice open and stuff."
    ]
  },
  {
    "name": "takoyaki",
    "itemId": "takoyaki",
    "origin": "Japan",
    "description": "Ball-shaped snack with octopus, batter, and toppings.",
    "steps": [
      "Prepare batter with dashi.",
      "Chop octopus and green onions.",
      "Fill pan molds with batter.",
      "Add octopus and flip.",
      "Serve with sauce and bonito flakes."
    ]
  },
  {
    "name": "goulash",
    "itemId": "goulash",
    "origin": "Hungary",
    "description": "Hearty beef stew with paprika.",
    "steps": [
      "Brown beef cubes.",
      "Sauté onions and garlic.",
      "Add paprika and tomatoes.",
      "Simmer with stock until tender.",
      "Serve with bread or noodles."
    ]
  },
  {
    "name": "ceviche",
    "itemId": "ceviche",
    "origin": "Peru",
    "description": "Raw fish cured in citrus juice with onions, chilies, and cilantro.",
    "steps": [
      "Chop fresh fish.",
      "Squeeze lime and lemon juice.",
      "Add sliced onion and chili.",
      "Let marinate 10–20 minutes.",
      "Top with cilantro and serve."
    ]
  },
  {
    "name": "fried insects",
    "itemId": "fried_insects",
    "origin": "Various",
    "description": "Crispy seasoned insects such as crickets or mealworms.",
    "steps": [
      "Clean and dry insects.",
      "Season with spices.",
      "Fry in hot oil.",
      "Serve with dipping sauce."
    ]
  },
  {
    "name": "kimchi fried rice",
    "itemId": "kimchi_fried_rice",
    "origin": "Korea",
    "description": "Fried rice with kimchi and egg.",
    "steps": [
      "Chop kimchi.",
      "Sauté with rice and garlic.",
      "Add gochujang and egg."
    ]
  },
  {
    "name": "biryani",
    "itemId": "biryani",
    "origin": "India",
    "description": "Spiced rice layered with meat.",
    "steps": [
      "Marinate meat.",
      "Cook basmati rice.",
      "Layer with spices.",
      "Steam until aromatic."
    ]
  },
  {
    "name": "empanadas",
    "itemId": "empanadas",
    "origin": "Latin America",
    "description": "Stuffed pastry turnovers.",
    "steps": [
      "Prepare dough.",
      "Make filling.",
      "Fill and seal.",
      "Bake or fry."
    ]
  },
  {
    "name": "pho",
    "itemId": "pho",
    "origin": "Vietnam",
    "description": "Beef noodle soup with herbs.",
    "steps": [
      "Boil bones for broth.",
      "Add spices.",
      "Cook rice noodles.",
      "Assemble with beef and herbs."
    ]
  },
  {
    "name": "beef stroganoff",
    "itemId": "beef_stroganoff",
    "origin": "Russia",
    "description": "Beef in creamy mushroom sauce.",
    "steps": [
      "Sauté beef and onions.",
      "Add mushrooms.",
      "Stir in sour cream.",
      "Serve over noodles."
    ]
  },
  {
    "name": "laksa",
    "itemId": "laksa",
    "origin": "Malaysia/Singapore",
    "description": "Spicy coconut noodle soup.",
    "steps": [
      "Make laksa paste.",
      "Boil with coconut milk.",
      "Add noodles and toppings."
    ]
  },
  {
    "name": "tacos al pastor",
    "itemId": "tacos_al_pastor",
    "origin": "Mexico",
    "description": "Marinated pork tacos with pineapple.",
    "steps": [
      "Marinate pork.",
      "Grill on spit.",
      "Slice and serve on tortillas."
    ]
  },
  {
    "name": "chicken tikka masala",
    "itemId": "chicken_tikka_masala",
    "origin": "UK/India",
    "description": "Grilled chicken in tomato cream sauce.",
    "steps": [
      "Marinate and grill chicken.",
      "Simmer sauce.",
      "Combine and serve."
    ]
  },
  {
    "name": "okonomiyaki",
    "itemId": "okonomiyaki",
    "origin": "Japan",
    "description": "Savory cabbage pancake.",
    "steps": [
      "Mix batter with cabbage.",
      "Pan-fry.",
      "Top with mayo and sauce."
    ]
  },
  {
    "name": "poutine",
    "itemId": "poutine",
    "origin": "Canada",
    "description": "Fries with cheese curds and gravy.",
    "steps": [
      "Fry potatoes.",
      "Make gravy.",
      "Layer with cheese curds."
    ]
  },
  {
    "name": "moussaka",
    "itemId": "moussaka",
    "origin": "Greece",
    "description": "Baked dish with layers of eggplant, meat, and béchamel.",
    "steps": [
      "Slice and salt eggplant.",
      "Fry or grill the slices.",
      "Cook ground meat with tomato sauce.",
      "Layer eggplant and meat in a tray.",
      "Top with béchamel and bake until golden."
    ]
  },
  {
    "name": "baingan bharta",
    "itemId": "baingan_bharta",
    "origin": "India",
    "description": "Smoky mashed eggplant cooked with spices.",
    "steps": [
      "Roast eggplant until soft.",
      "Peel and mash the flesh.",
      "Sauté onions, garlic, and tomatoes.",
      "Add spices and mashed eggplant.",
      "Cook until flavors blend."
    ]
  },
  {
    "name": "bun cha",
    "itemId": "bun_cha",
    "origin": "Vietnam",
    "description": "Grilled pork with noodles, herbs, and dipping sauce.",
    "steps": [
      "Marinate pork in fish sauce and sugar.",
      "Grill pork until charred.",
      "Cook rice noodles.",
      "Prepare dipping sauce with vinegar, lime, and chili.",
      "Serve with herbs and noodles."
    ]
  },
  {
    "name": "ful medames",
    "itemId": "ful_medames",
    "origin": "Egypt",
    "description": "Mashed fava beans with olive oil, garlic, and lemon.",
    "steps": [
      "Soak and cook fava beans.",
      "Mash lightly with olive oil.",
      "Add garlic, lemon juice, and cumin.",
      "Serve with flatbread and boiled eggs."
    ]
  },
  {
    "name": "shakshuka",
    "itemId": "shakshuka",
    "origin": "Middle East/North Africa",
    "description": "Poached eggs in spicy tomato sauce.",
    "steps": [
      "Sauté onions and bell peppers.",
      "Add garlic, tomatoes, and spices.",
      "Simmer until thick.",
      "Crack eggs into the sauce.",
      "Cover and cook until eggs set."
    ]
  },
  {
    "name": "cassoulet",
    "itemId": "cassoulet",
    "origin": "France",
    "description": "Slow-cooked white bean stew with meat.",
    "steps": [
      "Soak white beans overnight.",
      "Brown sausages and duck or pork.",
      "Layer meat and beans in a pot.",
      "Add broth and aromatics.",
      "Bake slowly until rich and thick."
    ]
  },
  {
    "name": "katsudon",
    "itemId": "katsudon",
    "origin": "Japan",
    "description": "Pork cutlet served over rice with egg and onions.",
    "steps": [
      "Bread and fry pork cutlet.",
      "Sauté onions in broth.",
      "Add sliced cutlet and pour beaten egg.",
      "Simmer briefly until egg is just set.",
      "Serve over rice."
    ]
  },
  {
    "name": "ugali with sukuma wiki",
    "itemId": "ugali_with_sukuma_wiki",
    "origin": "Kenya",
    "description": "Maize porridge served with sautéed greens.",
    "steps": [
      "Boil water and add maize flour gradually.",
      "Stir continuously until thick.",
      "Sauté onions and tomatoes.",
      "Add chopped kale and cook until tender.",
      "Serve together."
    ]
  },
  {
    "name": "pastel de choclo",
    "itemId": "pastel_de_choclo",
    "origin": "Chile",
    "description": "Corn pie with meat and egg filling.",
    "steps": [
      "Cook ground meat with onions and spices.",
      "Blend corn with milk and basil.",
      "Layer meat, olives, and boiled eggs in a dish.",
      "Top with corn mixture.",
      "Bake until golden and set."
    ]
  },
  {
    "name": "rosti",
    "itemId": "rosti",
    "origin": "Switzerland",
    "description": "Crispy pan-fried grated potatoes.",
    "steps": [
      "Grate raw or parboiled potatoes.",
      "Squeeze out moisture.",
      "Season and press into a pan.",
      "Fry until crispy on both sides.",
      "Serve with sour cream or eggs."
    ]
  },
  {
    "name": "banh xeo",
    "itemId": "banh_xeo",
    "origin": "Vietnam",
    "description": "Savory crispy rice flour crepes with pork and shrimp.",
    "steps": [
      "Make batter with rice flour and turmeric.",
      "Sauté pork and shrimp with bean sprouts.",
      "Pour batter into hot pan.",
      "Cook until crispy.",
      "Fold and serve with herbs and dipping sauce."
    ]
  },
  {
    "name": "bobotie",
    "itemId": "bobotie",
    "origin": "South Africa",
    "description": "Baked curried meat casserole with egg topping.",
    "steps": [
      "Sauté onions and garlic with curry spices.",
      "Add minced meat and breadcrumbs.",
      "Place mixture in a dish.",
      "Pour egg and milk mixture on top.",
      "Bake until set and golden."
    ]
  },
  {
    "name": "pav bhaji",
    "itemId": "pav_bhaji",
    "origin": "India",
    "description": "Spiced mashed vegetable curry served with buttered bread rolls.",
    "steps": [
      "Boil mixed vegetables until soft.",
      "Mash and sauté with spices and tomatoes.",
      "Toast pav (bread rolls) with butter.",
      "Serve with chopped onions and lime."
    ]
  },
  {
    "name": "loco moco",
    "itemId": "loco_moco",
    "origin": "Hawaii, USA",
    "description": "Rice topped with burger patty, fried egg, and gravy.",
    "steps": [
      "Cook white rice.",
      "Pan-fry burger patty.",
      "Fry an egg sunny-side up.",
      "Make brown gravy.",
      "Assemble rice, patty, egg, and gravy in layers."
    ]
  },
  {
    "name": "zapiekanka",
    "itemId": "zapiekanka",
    "origin": "Poland",
    "description": "Open-faced toasted sandwich with mushrooms and cheese.",
    "steps": [
      "Slice a baguette lengthwise.",
      "Sauté mushrooms and onions.",
      "Top bread with mixture and grated cheese.",
      "Bake until melted and golden.",
      "Drizzle with ketchup and serve."
    ]
  },
  {
    "name": "bibimbap",
    "itemId": "bibimbap",
    "origin": "Korea",
    "description": "Mixed rice bowl with vegetables, meat, and egg.",
    "steps": [
      "Cook rice and prepare assorted veggies.",
      "Sauté meat with garlic and soy sauce.",
      "Fry an egg sunny-side up.",
      "Assemble rice bowl with toppings.",
      "Add gochujang and mix before eating."
    ]
  },
  {
    "name": "thieboudienne",
    "itemId": "thieboudienne",
    "origin": "Senegal",
    "description": "Spiced fish and rice stew with vegetables.",
    "steps": [
      "Marinate and fry fish.",
      "Sauté tomato paste with spices.",
      "Add vegetables and stock.",
      "Add rice and cook until absorbed.",
      "Serve with fish on top."
    ]
  },
  {
    "name": "karē raisu",
    "itemId": "karē_raisu",
    "origin": "Japan",
    "description": "Thick Japanese curry with vegetables and meat over rice.",
    "steps": [
      "Sauté onions, carrots, and potatoes.",
      "Add meat and brown.",
      "Pour in water and simmer.",
      "Stir in curry roux.",
      "Serve over white rice."
    ]
  },
  {
    "name": "cachapas",
    "itemId": "cachapas",
    "origin": "Venezuela",
    "description": "Sweet corn pancakes filled with cheese.",
    "steps": [
      "Blend fresh corn with milk and flour.",
      "Cook batter on a hot griddle.",
      "Add soft cheese in the center.",
      "Fold and serve warm."
    ]
  },
  {
    "name": "sarma",
    "itemId": "sarma",
    "origin": "Balkans",
    "description": "Cabbage rolls stuffed with meat and rice.",
    "steps": [
      "Blanch cabbage leaves.",
      "Mix ground meat, rice, and spices.",
      "Wrap filling in cabbage leaves.",
      "Layer in pot and simmer with tomato sauce."
    ]
  },
  {
    "name": "injera with doro wat",
    "itemId": "injera_with_doro_wat",
    "origin": "Ethiopia",
    "description": "Spongy flatbread served with spicy chicken stew.",
    "steps": [
      "Ferment teff flour batter for injera.",
      "Cook injera on a griddle.",
      "Sauté onions with berbere spice.",
      "Add chicken and simmer in sauce.",
      "Serve doro wat on injera."
    ]
  },
  {
    "name": "khao soi",
    "itemId": "khao_soi",
    "origin": "Thailand/Laos",
    "description": "Coconut curry noodle soup with crispy toppings.",
    "steps": [
      "Prepare curry base with coconut milk.",
      "Boil noodles and fry a portion for garnish.",
      "Simmer meat in curry soup.",
      "Assemble bowl with noodles, soup, and toppings."
    ]
  },
  {
    "name": "menemen",
    "itemId": "menemen",
    "origin": "Turkey",
    "description": "Scrambled eggs with tomatoes and peppers.",
    "steps": [
      "Sauté onions and green peppers.",
      "Add chopped tomatoes and cook down.",
      "Crack in eggs and stir gently.",
      "Season and cook until just set."
    ]
  },
  {
    "name": "bandeja paisa",
    "itemId": "bandeja_paisa",
    "origin": "Colombia",
    "description": "Hearty platter with beans, rice, meats, egg, and avocado.",
    "steps": [
      "Cook red beans with pork.",
      "Fry plantains, sausage, and pork belly.",
      "Prepare rice, arepa, and fried egg.",
      "Assemble everything on a large plate."
    ]
  },
  {
    "name": "khachapuri",
    "itemId": "khachapuri",
    "origin": "Georgia",
    "description": "Cheese-filled bread with egg yolk.",
    "steps": [
      "Prepare yeast dough and shape into boats.",
      "Fill with cheese mixture.",
      "Bake until golden, then add egg yolk and bake briefly.",
      "Serve hot and mix the yolk in."
    ]
  },
  {
    "name": "koshari",
    "itemId": "koshari",
    "origin": "Egypt",
    "description": "Layered dish with rice, lentils, pasta, and spicy tomato sauce.",
    "steps": [
      "Cook rice, lentils, and pasta separately.",
      "Make tangy tomato sauce with garlic and vinegar.",
      "Fry onions until crispy.",
      "Layer ingredients and top with sauce and onions."
    ]
  },
  {
    "name": "moqueca",
    "itemId": "moqueca",
    "origin": "Brazil",
    "description": "Fish stew with coconut milk and palm oil.",
    "steps": [
      "Marinate fish in lime juice and garlic.",
      "Layer onions, peppers, and tomatoes in a pot.",
      "Add fish, coconut milk, and palm oil.",
      "Simmer until fragrant and cooked through."
    ]
  },
  {
    "name": "arepas",
    "itemId": "arepas",
    "origin": "Venezuela",
    "description": "Cornmeal cakes filled with meats, cheese, or beans.",
    "steps": [
      "Mix cornmeal with water and salt.",
      "Form into patties and grill.",
      "Slice and fill with desired ingredients."
    ]
  },
  {
    "name": "colcannon",
    "itemId": "colcannon",
    "origin": "Ireland",
    "description": "Mashed potatoes with cabbage and onions.",
    "steps": [
      "Boil potatoes until soft.",
      "Sauté cabbage and onions.",
      "Mash everything together with butter."
    ]
  },
  {
    "name": "mie goreng",
    "itemId": "mie_goreng",
    "origin": "Indonesia",
    "description": "Stir-fried noodles with vegetables and protein.",
    "steps": [
      "Boil noodles and drain.",
      "Stir-fry garlic, veggies, and meat.",
      "Add noodles and sauce, toss to coat."
    ]
  },
  {
    "name": "raclette",
    "itemId": "raclette",
    "origin": "Switzerland",
    "description": "Melted cheese served over potatoes and pickles.",
    "steps": [
      "Melt raclette cheese.",
      "Boil or roast potatoes.",
      "Pour cheese over potatoes, serve with pickles and meat."
    ]
  },
  {
    "name": "jollof rice",
    "itemId": "jollof_rice",
    "origin": "West Africa",
    "description": "Spiced tomato-based rice dish.",
    "steps": [
      "Blend tomatoes and peppers.",
      "Sauté with spices and onions.",
      "Add rice and broth, simmer until cooked."
    ]
  },
  {
    "name": "doro wat",
    "itemId": "doro_wat",
    "origin": "Ethiopia",
    "description": "Spicy chicken stew with boiled eggs.",
    "steps": [
      "Sauté onions until dark.",
      "Add berbere and chicken.",
      "Simmer with boiled eggs until thick."
    ]
  },
  {
    "name": "fesenjan",
    "itemId": "fesenjan",
    "origin": "Iran",
    "description": "Pomegranate and walnut chicken stew.",
    "steps": [
      "Grind walnuts and toast lightly.",
      "Sear chicken and add to pot.",
      "Add pomegranate molasses, simmer until rich."
    ]
  },
  {
    "name": "kokoda",
    "itemId": "kokoda",
    "origin": "Fiji",
    "description": "Citrus-marinated raw fish with coconut.",
    "steps": [
      "Marinate fish in lemon or lime juice.",
      "Add chopped vegetables and coconut milk.",
      "Chill and serve cold."
    ]
  },
  {
    "name": "clam chowder",
    "itemId": "clam_chowder",
    "origin": "USA (New England)",
    "description": "Creamy soup with clams, potatoes, and bacon.",
    "steps": [
      "Sauté bacon and onions.",
      "Add potatoes and clam juice, simmer.",
      "Stir in clams and cream."
    ]
  },
  {
    "name": "beshbarmak",
    "itemId": "beshbarmak",
    "origin": "Kazakhstan",
    "description": "Boiled meat with pasta and onion sauce.",
    "steps": [
      "Boil lamb or beef until tender.",
      "Prepare wide noodles.",
      "Serve meat over noodles with onion broth."
    ]
  },
  {
    "name": "hoppers",
    "itemId": "hoppers",
    "origin": "Sri Lanka",
    "description": "Fermented rice pancakes with crispy edges.",
    "steps": [
      "Ferment rice flour batter overnight.",
      "Cook in curved pan to form bowl shape.",
      "Crack egg in center if desired."
    ]
  },
  {
    "name": "tamago kake gohan",
    "itemId": "tamago_kake_gohan",
    "origin": "Japan",
    "description": "Raw egg over hot rice with soy sauce.",
    "steps": [
      "Crack fresh egg over hot rice.",
      "Add soy sauce.",
      "Mix thoroughly and eat immediately."
    ]
  },
  {
    "name": "plov",
    "itemId": "plov",
    "origin": "Uzbekistan",
    "description": "Rice pilaf with meat and carrots.",
    "steps": [
      "Sear meat in oil.",
      "Add onions and carrots.",
      "Stir in rice and cook with broth."
    ]
  },
  {
    "name": "ceviche",
    "itemId": "ceviche",
    "origin": "Peru",
    "description": "Raw fish cured in citrus with onions and chili.",
    "steps": [
      "Dice fresh fish and marinate in lime juice.",
      "Add sliced onions and chili.",
      "Chill and serve with corn or sweet potato."
    ]
  },
  {
    "name": "frybread",
    "itemId": "frybread",
    "origin": "Native American",
    "description": "Fried flat dough served sweet or savory.",
    "steps": [
      "Mix flour, baking powder, and water.",
      "Flatten and fry until golden.",
      "Serve with honey or taco toppings."
    ]
  },
  {
    "name": "boerewors roll",
    "itemId": "boerewors_roll",
    "origin": "South Africa",
    "description": "Grilled sausage in a bun with sauces.",
    "steps": [
      "Grill boerewors sausage.",
      "Place in bun with tomato relish or chutney.",
      "Serve hot."
    ]
  },
  {
    "name": "okra soup",
    "itemId": "okra_soup",
    "origin": "Nigeria",
    "description": "Slimy stew made with okra and meats.",
    "steps": [
      "Chop okra finely.",
      "Cook with palm oil and meats.",
      "Simmer until thick and stretchy."
    ]
  },
  {
    "name": "gallo pinto",
    "itemId": "gallo_pinto",
    "origin": "Costa Rica",
    "description": "Stir-fried rice and beans with spices.",
    "steps": [
      "Cook rice and black beans.",
      "Sauté onions and peppers.",
      "Mix with beans and rice in a pan."
    ]
  },
  {
    "name": "curanto",
    "itemId": "curanto",
    "origin": "Chile",
    "description": "Seafood, meat, and vegetables cooked in an earth oven.",
    "steps": [
      "Layer ingredients on hot stones underground.",
      "Cover with leaves and earth.",
      "Let steam cook for hours."
    ]
  },
  {
    "name": "fried insects",
    "itemId": "fried_insects",
    "origin": "Thailand",
    "description": "Crispy bugs seasoned and deep-fried.",
    "steps": [
      "Clean insects thoroughly.",
      "Deep-fry until crispy.",
      "Season with salt or chili."
    ]
  },
  {
    "name": "shakshuka",
    "itemId": "shakshuka",
    "origin": "Tunisia",
    "description": "Poached eggs in spiced tomato sauce.",
    "steps": [
      "Sauté onions and peppers with spices.",
      "Add tomatoes and simmer.",
      "Crack eggs into sauce and cook until set."
    ]
  },
  {
    "name": "zhoug",
    "itemId": "zhoug",
    "origin": "Yemen",
    "description": "Spicy cilantro chili sauce.",
    "steps": [
      "Blend cilantro, chili, garlic, and spices.",
      "Add olive oil and lemon juice.",
      "Use as a condiment or dip."
    ]
  },
  {
    "name": "banitsa",
    "itemId": "banitsa",
    "origin": "Bulgaria",
    "description": "Layered pastry with egg and cheese filling.",
    "steps": [
      "Layer filo dough with cheese and egg mixture.",
      "Roll and spiral into baking dish.",
      "Bake until golden and crispy."
    ]
  },
  {
    "name": "caldo verde",
    "itemId": "caldo_verde",
    "origin": "Portugal",
    "description": "Potato and kale soup with sausage.",
    "steps": [
      "Boil potatoes and mash.",
      "Add sliced kale and chorizo.",
      "Simmer until flavors meld."
    ]
  },
  {
    "name": "brigadeiro",
    "itemId": "brigadeiro",
    "origin": "Brazil",
    "description": "Chocolate fudge truffles.",
    "steps": [
      "Cook condensed milk, cocoa, and butter.",
      "Cool mixture, roll into balls.",
      "Coat with chocolate sprinkles."
    ]
  },
  {
    "name": "burek",
    "itemId": "burek",
    "origin": "Bosnia",
    "description": "Savory pastry with meat or cheese filling.",
    "steps": [
      "Prepare filling of minced meat or cheese.",
      "Layer or roll in filo dough.",
      "Bake until crispy and golden."
    ]
  },
  {
    "name": "pozole",
    "itemId": "pozole",
    "origin": "Mexico",
    "description": "Hominy stew with pork and red chili broth.",
    "steps": [
      "Boil pork with garlic and onion.",
      "Blend chilies for broth.",
      "Combine with hominy and simmer."
    ]
  },
  {
    "name": "tteokbokki",
    "itemId": "tteokbokki",
    "origin": "Korea",
    "description": "Spicy rice cakes in gochujang sauce.",
    "steps": [
      "Boil rice cakes.",
      "Simmer in gochujang sauce with sugar and garlic.",
      "Add fish cake and scallions."
    ]
  },
  {
    "name": "avgolemono soup",
    "itemId": "avgolemono_soup",
    "origin": "Greece",
    "description": "Lemon chicken soup thickened with egg.",
    "steps": [
      "Boil chicken and rice.",
      "Whisk egg with lemon juice.",
      "Temper and stir into soup off heat."
    ]
  },
  {
    "name": "fufu",
    "itemId": "fufu",
    "origin": "West Africa",
    "description": "Starchy dough made from yam or cassava.",
    "steps": [
      "Boil and pound yam or cassava.",
      "Mash until smooth and stretchy.",
      "Serve with soup or stew."
    ]
  },
  {
    "name": "choripan",
    "itemId": "choripan",
    "origin": "Argentina",
    "description": "Grilled sausage sandwich with chimichurri.",
    "steps": [
      "Grill chorizo sausage.",
      "Place in crusty bread.",
      "Top with chimichurri sauce."
    ]
  },
  {
    "name": "smørrebrød",
    "itemId": "smørrebrød",
    "origin": "Denmark",
    "description": "Open-faced rye sandwiches with various toppings.",
    "steps": [
      "Spread butter on rye bread.",
      "Top with meats, fish, or cheese.",
      "Garnish with herbs or pickles."
    ]
  },
  {
    "name": "dum aloo",
    "itemId": "dum_aloo",
    "origin": "India",
    "description": "Potatoes simmered in spiced yogurt gravy.",
    "steps": [
      "Fry or boil baby potatoes.",
      "Prepare gravy with yogurt and spices.",
      "Simmer potatoes in sauce."
    ]
  },
  {
    "name": "patacones",
    "itemId": "patacones",
    "origin": "Colombia",
    "description": "Twice-fried green plantain discs.",
    "steps": [
      "Slice and fry plantains once.",
      "Smash flat and fry again.",
      "Sprinkle with salt and serve."
    ]
  },
  {
    "name": "feijoada",
    "itemId": "feijoada",
    "origin": "Brazil",
    "description": "Black bean stew with pork and sausage.",
    "steps": [
      "Soak and cook black beans.",
      "Add meats and simmer for hours.",
      "Serve with rice and orange slices."
    ]
  },
  {
    "name": "lahmacun",
    "itemId": "lahmacun",
    "origin": "Turkey",
    "description": "Thin flatbread topped with minced spiced meat.",
    "steps": [
      "Roll out dough into thin rounds.",
      "Spread meat mixture on top.",
      "Bake and serve with herbs and lemon."
    ]
  },
  {
    "name": "rendang",
    "itemId": "rendang",
    "origin": "Indonesia",
    "description": "Slow-cooked dry beef curry.",
    "steps": [
      "Blend spices and sauté.",
      "Add beef and coconut milk.",
      "Simmer until dry and caramelized."
    ]
  },
  {
    "name": "kaiserschmarrn",
    "itemId": "kaiserschmarrn",
    "origin": "Austria",
    "description": "Shredded caramelized pancake with fruit.",
    "steps": [
      "Make thick pancake batter.",
      "Cook and tear into pieces.",
      "Caramelize with sugar and serve with fruit."
    ]
  },
  {
    "name": "malva pudding",
    "itemId": "malva_pudding",
    "origin": "South Africa",
    "description": "Spongy caramel dessert with cream sauce.",
    "steps": [
      "Bake apricot sponge cake.",
      "Pour cream sauce over hot pudding.",
      "Serve warm with custard or ice cream."
    ]
  },
  {
    "name": "asam laksa",
    "itemId": "asam_laksa",
    "origin": "Malaysia",
    "description": "Tangy fish noodle soup with tamarind and herbs.",
    "steps": [
      "Boil fish and flake the meat.",
      "Simmer tamarind broth with spices and lemongrass.",
      "Add flaked fish and serve with noodles, mint, and pineapple."
    ]
  },
  {
    "name": "sunflower seed risotto",
    "itemId": "sunflower_seed_risotto",
    "origin": "Hamstoria",
    "description": "Creamy risotto made from soaked sunflower seeds and oats.",
    "steps": [
      "Soak sunflower seeds overnight.",
      "Simmer with oat milk and herbs until creamy.",
      "Top with shredded carrot and parsley."
    ]
  },
  {
    "name": "apple dandelion crisps",
    "itemId": "apple_dandelion_crisps",
    "origin": "Hamsterdam",
    "description": "Thinly sliced apples with dried dandelion petals and a hint of cinnamon.",
    "steps": [
      "Slice apples into thin rounds.",
      "Sprinkle with cinnamon and crushed dandelion petals.",
      "Dehydrate until crisp."
    ]
  },
  {
    "name": "millet loaf",
    "itemId": "millet_loaf",
    "origin": "Nestville",
    "description": "Savory loaf made from cooked millet, pumpkin, and herbs.",
    "steps": [
      "Cook millet and mash with pumpkin puree.",
      "Add herbs and shape into mini loaves.",
      "Bake until firm and golden."
    ]
  },
  {
    "name": "carrot hay tartlets",
    "itemId": "carrot_hay_tartlets",
    "origin": "Hamshire",
    "description": "Mini tartlets with grated carrot, timothy hay, and seed crust.",
    "steps": [
      "Make crust with crushed seeds and oat flour.",
      "Fill with grated carrot and chopped hay.",
      "Bake lightly until set."
    ]
  },
  {
    "name": "banana oat nibbles",
    "itemId": "banana_oat_nibbles",
    "origin": "Rodentia",
    "description": "No-bake treats made from banana, oats, and flaxseed.",
    "steps": [
      "Mash ripe banana.",
      "Mix with oats and ground flaxseed.",
      "Roll into tiny balls and chill."
    ]
  },
  {
    "name": "pea pod parfaits",
    "itemId": "pea_pod_parfaits",
    "origin": "Hamsterdam",
    "description": "Layered snack with mashed peas, corn, and alfalfa crumble.",
    "steps": [
      "Mash cooked peas.",
      "Layer with sweetcorn kernels.",
      "Top with crushed alfalfa pellets for crunch."
    ]
  },
  {
    "name": "broccoli leaf chips",
    "itemId": "broccoli_leaf_chips",
    "origin": "Burrowgundy",
    "description": "Crispy baked broccoli leaves seasoned with a pinch of dried basil.",
    "steps": [
      "Toss broccoli leaves with a touch of olive oil.",
      "Sprinkle basil.",
      "Bake until crisp and light."
    ]
  },
  {
    "name": "cucumber sesame stackers",
    "itemId": "cucumber_sesame_stackers",
    "origin": "Forage Fields",
    "description": "Thin cucumber slices stacked with sesame and apple slivers.",
    "steps": [
      "Slice cucumbers and apples.",
      "Stack in alternating layers.",
      "Sprinkle with sesame seeds and chill before serving."
    ]
  },
  {
    "name": "blueberry timothy biscuits",
    "itemId": "blueberry_timothy_biscuits",
    "origin": "Meadowshire",
    "description": "Soft treats baked with blueberries and timothy hay dust.",
    "steps": [
      "Mix mashed blueberries with flour and ground hay.",
      "Shape into small biscuits.",
      "Bake until firm but chewy."
    ]
  },
  {
    "name": "almond flax crunchers",
    "itemId": "almond_flax_crunchers",
    "origin": "Gnaw York",
    "description": "High-protein snack bars made with almonds, flaxseed, and oats.",
    "steps": [
      "Grind almonds and flaxseed.",
      "Mix with oats and a drop of honey.",
      "Press into pan and chill until firm."
    ]
  },
  {
    "name": "chia pudding delight",
    "itemId": "chia_pudding_delight",
    "origin": "Hammywood",
    "description": "Tiny chia seed pudding made with almond milk and diced strawberries.",
    "steps": [
      "Soak chia seeds in almond milk overnight.",
      "Stir in strawberry bits.",
      "Chill and serve in tiny leaf cups."
    ]
  },
  {
    "name": "spinach oat quichelets",
    "itemId": "spinach_oat_quichelets",
    "origin": "Leafridge",
    "description": "Mini quiches made from oats, spinach, and ground sunflower seeds.",
    "steps": [
      "Create crust from oats and seeds.",
      "Fill with steamed spinach mash.",
      "Bake gently until edges firm."
    ]
  },
  {
    "name": "beetroot nibble rolls",
    "itemId": "beetroot_nibble_rolls",
    "origin": "The Burrow Bistro",
    "description": "Sweet beetroot and apple mash rolled in lettuce leaves.",
    "steps": [
      "Mash cooked beetroot with apple.",
      "Spoon onto fresh lettuce leaves.",
      "Roll and chill before serving."
    ]
  },
  {
    "name": "parsnip hay fritters",
    "itemId": "parsnip_hay_fritters",
    "origin": "Nibbleton",
    "description": "Shredded parsnip fritters with hay flakes and flaxmeal.",
    "steps": [
      "Grate parsnip and mix with flaxmeal.",
      "Add crushed hay flakes.",
      "Shape and lightly bake until golden."
    ]
  },
  {
    "name": "pumpkin seed granola",
    "itemId": "pumpkin_seed_granola",
    "origin": "Gnawthampton",
    "description": "Toasted seed mix with pumpkin chunks and dried cranberries.",
    "steps": [
      "Mix seeds, diced pumpkin, and cranberries.",
      "Toast lightly for crunch.",
      "Cool and store in bark boxes."
    ]
  },
  {
    "name": "pear leaf sandwiches",
    "itemId": "pear_leaf_sandwiches",
    "origin": "Hambridge Hollow",
    "description": "Thin pear slices layered with nut mash between dandelion leaves.",
    "steps": [
      "Slice ripe pear thinly.",
      "Spread mashed walnut between slices.",
      "Wrap gently in dandelion leaves."
    ]
  },
  {
    "name": "zucchini ribbon twists",
    "itemId": "zucchini_ribbon_twists",
    "origin": "Tunnelton",
    "description": "Raw zucchini ribbons twisted with basil and flax sprinkles.",
    "steps": [
      "Shave zucchini into ribbons.",
      "Toss with crushed basil and flaxseed.",
      "Chill and serve spiral-stacked."
    ]
  },
  {
    "name": "apple bark crackers",
    "itemId": "apple_bark_crackers",
    "origin": "Hamford Hills",
    "description": "Crunchy fruit crackers made with dried apple and bark dust.",
    "steps": [
      "Mix dried apple bits with oat and bark flour.",
      "Press flat and bake until crispy.",
      "Break into shard-shaped treats."
    ]
  },
  {
    "name": "radish petal salad",
    "itemId": "radish_petal_salad",
    "origin": "Squeaktown Grove",
    "description": "Fresh salad of radish petals, carrot shreds, and clover sprouts.",
    "steps": [
      "Peel radish into petals.",
      "Add shredded carrot and clover.",
      "Toss with a drop of apple cider."
    ]
  },
  {
    "name": "hazelnut berrybundles",
    "itemId": "hazelnut_berrybundles",
    "origin": "Whiskerville",
    "description": "Mini bundles of crushed hazelnuts and berries in mint leaves.",
    "steps": [
      "Crush hazelnuts and berries together.",
      "Spoon into mint leaves.",
      "Fold into tiny wraps and serve chilled."
    ]
  }
] as const satisfies FixedSizeArray<ValidationRecipe, typeof recipeBookSize>;

export type FoodItemId = (typeof recipeBook)[number]["itemId"];
