import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface FoodItem {
  id: string;
  name: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  servingSize: string;
  servingWeight: number;
  source: 'usda';
}

// Comprehensive USDA-accurate food database (per 100g)
const FOOD_DATABASE: FoodItem[] = [
  // Eggs
  { id: "egg-whole", name: "Egg, whole, raw", category: "Eggs", calories: 143, protein: 12.6, carbs: 0.7, fats: 9.5, fiber: 0, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "egg-boiled", name: "Egg, boiled", category: "Eggs", calories: 155, protein: 12.6, carbs: 1.1, fats: 10.6, fiber: 0, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "egg-fried", name: "Egg, fried", category: "Eggs", calories: 196, protein: 13.6, carbs: 0.8, fats: 15, fiber: 0, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "egg-scrambled", name: "Egg, scrambled", category: "Eggs", calories: 149, protein: 10.2, carbs: 2.2, fats: 11, fiber: 0, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "egg-white", name: "Egg white, raw", category: "Eggs", calories: 52, protein: 10.9, carbs: 0.7, fats: 0.2, fiber: 0, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "egg-yolk", name: "Egg yolk, raw", category: "Eggs", calories: 322, protein: 15.9, carbs: 3.6, fats: 26.5, fiber: 0, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "egg-omelette", name: "Omelette", category: "Eggs", calories: 154, protein: 10.6, carbs: 0.6, fats: 12, fiber: 0, servingSize: "100g", servingWeight: 100, source: "usda" },
  
  // Chicken
  { id: "chicken-breast", name: "Chicken breast, cooked", category: "Poultry", calories: 165, protein: 31, carbs: 0, fats: 3.6, fiber: 0, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "chicken-thigh", name: "Chicken thigh, cooked", category: "Poultry", calories: 209, protein: 26, carbs: 0, fats: 10.9, fiber: 0, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "chicken-wing", name: "Chicken wing, cooked", category: "Poultry", calories: 203, protein: 30.5, carbs: 0, fats: 8.1, fiber: 0, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "chicken-drumstick", name: "Chicken drumstick, cooked", category: "Poultry", calories: 172, protein: 28.3, carbs: 0, fats: 5.7, fiber: 0, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "chicken-grilled", name: "Chicken, grilled", category: "Poultry", calories: 165, protein: 31, carbs: 0, fats: 3.6, fiber: 0, servingSize: "100g", servingWeight: 100, source: "usda" },
  
  // Beef
  { id: "beef-ground", name: "Beef, ground, cooked", category: "Beef", calories: 250, protein: 26, carbs: 0, fats: 15, fiber: 0, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "beef-steak", name: "Beef steak, cooked", category: "Beef", calories: 271, protein: 26, carbs: 0, fats: 18, fiber: 0, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "beef-roast", name: "Beef roast, cooked", category: "Beef", calories: 217, protein: 26.4, carbs: 0, fats: 11.8, fiber: 0, servingSize: "100g", servingWeight: 100, source: "usda" },
  
  // Fish & Seafood
  { id: "salmon", name: "Salmon, cooked", category: "Seafood", calories: 208, protein: 20, carbs: 0, fats: 13, fiber: 0, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "tuna", name: "Tuna, cooked", category: "Seafood", calories: 132, protein: 28.2, carbs: 0, fats: 1.3, fiber: 0, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "tuna-canned", name: "Tuna, canned in water", category: "Seafood", calories: 116, protein: 25.5, carbs: 0, fats: 0.8, fiber: 0, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "shrimp", name: "Shrimp, cooked", category: "Seafood", calories: 99, protein: 24, carbs: 0.2, fats: 0.3, fiber: 0, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "tilapia", name: "Tilapia, cooked", category: "Seafood", calories: 128, protein: 26, carbs: 0, fats: 2.7, fiber: 0, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "cod", name: "Cod, cooked", category: "Seafood", calories: 105, protein: 23, carbs: 0, fats: 0.9, fiber: 0, servingSize: "100g", servingWeight: 100, source: "usda" },
  
  // Rice & Grains
  { id: "rice-white", name: "Rice, white, cooked", category: "Grains", calories: 130, protein: 2.7, carbs: 28.2, fats: 0.3, fiber: 0.4, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "rice-brown", name: "Rice, brown, cooked", category: "Grains", calories: 112, protein: 2.6, carbs: 23.5, fats: 0.9, fiber: 1.8, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "quinoa", name: "Quinoa, cooked", category: "Grains", calories: 120, protein: 4.4, carbs: 21.3, fats: 1.9, fiber: 2.8, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "oats", name: "Oats, cooked", category: "Grains", calories: 71, protein: 2.5, carbs: 12, fats: 1.5, fiber: 1.7, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "oatmeal", name: "Oatmeal, cooked", category: "Grains", calories: 71, protein: 2.5, carbs: 12, fats: 1.5, fiber: 1.7, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "pasta", name: "Pasta, cooked", category: "Grains", calories: 131, protein: 5, carbs: 25, fats: 1.1, fiber: 1.8, servingSize: "100g", servingWeight: 100, source: "usda" },
  
  // Bread
  { id: "bread-white", name: "Bread, white", category: "Bread", calories: 265, protein: 9, carbs: 49, fats: 3.2, fiber: 2.7, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "bread-whole-wheat", name: "Bread, whole wheat", category: "Bread", calories: 247, protein: 13, carbs: 41, fats: 3.4, fiber: 7, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "roti", name: "Roti / Chapati", category: "Bread", calories: 297, protein: 9.8, carbs: 50, fats: 6.8, fiber: 4, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "naan", name: "Naan bread", category: "Bread", calories: 290, protein: 9.6, carbs: 48, fats: 6.5, fiber: 2.1, servingSize: "100g", servingWeight: 100, source: "usda" },
  
  // Fruits
  { id: "apple", name: "Apple, raw", category: "Fruits", calories: 52, protein: 0.3, carbs: 14, fats: 0.2, fiber: 2.4, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "banana", name: "Banana, raw", category: "Fruits", calories: 89, protein: 1.1, carbs: 23, fats: 0.3, fiber: 2.6, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "orange", name: "Orange, raw", category: "Fruits", calories: 47, protein: 0.9, carbs: 12, fats: 0.1, fiber: 2.4, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "mango", name: "Mango, raw", category: "Fruits", calories: 60, protein: 0.8, carbs: 15, fats: 0.4, fiber: 1.6, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "grapes", name: "Grapes, raw", category: "Fruits", calories: 69, protein: 0.7, carbs: 18, fats: 0.2, fiber: 0.9, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "strawberry", name: "Strawberries, raw", category: "Fruits", calories: 32, protein: 0.7, carbs: 7.7, fats: 0.3, fiber: 2, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "blueberry", name: "Blueberries, raw", category: "Fruits", calories: 57, protein: 0.7, carbs: 14.5, fats: 0.3, fiber: 2.4, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "watermelon", name: "Watermelon, raw", category: "Fruits", calories: 30, protein: 0.6, carbs: 7.6, fats: 0.2, fiber: 0.4, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "pineapple", name: "Pineapple, raw", category: "Fruits", calories: 50, protein: 0.5, carbs: 13, fats: 0.1, fiber: 1.4, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "papaya", name: "Papaya, raw", category: "Fruits", calories: 43, protein: 0.5, carbs: 11, fats: 0.3, fiber: 1.7, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "avocado", name: "Avocado, raw", category: "Fruits", calories: 160, protein: 2, carbs: 8.5, fats: 15, fiber: 6.7, servingSize: "100g", servingWeight: 100, source: "usda" },
  
  // Vegetables
  { id: "potato", name: "Potato, boiled", category: "Vegetables", calories: 87, protein: 1.9, carbs: 20, fats: 0.1, fiber: 1.8, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "sweet-potato", name: "Sweet potato, cooked", category: "Vegetables", calories: 86, protein: 1.6, carbs: 20, fats: 0.1, fiber: 3, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "broccoli", name: "Broccoli, cooked", category: "Vegetables", calories: 35, protein: 2.4, carbs: 7.2, fats: 0.4, fiber: 3.3, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "spinach", name: "Spinach, raw", category: "Vegetables", calories: 23, protein: 2.9, carbs: 3.6, fats: 0.4, fiber: 2.2, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "carrot", name: "Carrot, raw", category: "Vegetables", calories: 41, protein: 0.9, carbs: 10, fats: 0.2, fiber: 2.8, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "tomato", name: "Tomato, raw", category: "Vegetables", calories: 18, protein: 0.9, carbs: 3.9, fats: 0.2, fiber: 1.2, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "cucumber", name: "Cucumber, raw", category: "Vegetables", calories: 15, protein: 0.7, carbs: 3.6, fats: 0.1, fiber: 0.5, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "onion", name: "Onion, raw", category: "Vegetables", calories: 40, protein: 1.1, carbs: 9.3, fats: 0.1, fiber: 1.7, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "cabbage", name: "Cabbage, raw", category: "Vegetables", calories: 25, protein: 1.3, carbs: 5.8, fats: 0.1, fiber: 2.5, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "cauliflower", name: "Cauliflower, cooked", category: "Vegetables", calories: 23, protein: 1.8, carbs: 4.1, fats: 0.5, fiber: 2.3, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "bell-pepper", name: "Bell pepper, raw", category: "Vegetables", calories: 31, protein: 1, carbs: 6, fats: 0.3, fiber: 2.1, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "mushroom", name: "Mushrooms, raw", category: "Vegetables", calories: 22, protein: 3.1, carbs: 3.3, fats: 0.3, fiber: 1, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "lettuce", name: "Lettuce, raw", category: "Vegetables", calories: 15, protein: 1.4, carbs: 2.9, fats: 0.2, fiber: 1.3, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "corn", name: "Corn, cooked", category: "Vegetables", calories: 96, protein: 3.4, carbs: 21, fats: 1.5, fiber: 2.4, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "peas", name: "Green peas, cooked", category: "Vegetables", calories: 84, protein: 5.4, carbs: 16, fats: 0.2, fiber: 5.5, servingSize: "100g", servingWeight: 100, source: "usda" },
  
  // Dairy
  { id: "milk-whole", name: "Milk, whole", category: "Dairy", calories: 61, protein: 3.2, carbs: 4.8, fats: 3.3, fiber: 0, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "milk-skim", name: "Milk, skim", category: "Dairy", calories: 34, protein: 3.4, carbs: 5, fats: 0.1, fiber: 0, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "yogurt", name: "Yogurt, plain", category: "Dairy", calories: 61, protein: 3.5, carbs: 4.7, fats: 3.3, fiber: 0, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "greek-yogurt", name: "Greek yogurt, plain", category: "Dairy", calories: 97, protein: 9, carbs: 3.6, fats: 5, fiber: 0, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "cheese-cheddar", name: "Cheese, cheddar", category: "Dairy", calories: 403, protein: 23, carbs: 3.4, fats: 33, fiber: 0, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "paneer", name: "Paneer", category: "Dairy", calories: 265, protein: 18.3, carbs: 1.2, fats: 20.8, fiber: 0, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "cottage-cheese", name: "Cottage cheese", category: "Dairy", calories: 98, protein: 11, carbs: 3.4, fats: 4.3, fiber: 0, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "butter", name: "Butter", category: "Dairy", calories: 717, protein: 0.9, carbs: 0.1, fats: 81, fiber: 0, servingSize: "100g", servingWeight: 100, source: "usda" },
  
  // Legumes
  { id: "chickpeas", name: "Chickpeas, cooked", category: "Legumes", calories: 164, protein: 8.9, carbs: 27, fats: 2.6, fiber: 7.6, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "lentils", name: "Lentils, cooked", category: "Legumes", calories: 116, protein: 9, carbs: 20, fats: 0.4, fiber: 7.9, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "kidney-beans", name: "Kidney beans, cooked", category: "Legumes", calories: 127, protein: 8.7, carbs: 23, fats: 0.5, fiber: 6.4, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "black-beans", name: "Black beans, cooked", category: "Legumes", calories: 132, protein: 8.9, carbs: 24, fats: 0.5, fiber: 8.7, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "dal", name: "Dal (lentil curry)", category: "Legumes", calories: 116, protein: 9, carbs: 20, fats: 0.4, fiber: 7.9, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "tofu", name: "Tofu, firm", category: "Legumes", calories: 144, protein: 17, carbs: 3, fats: 8.7, fiber: 2.3, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "soybean", name: "Soybeans, cooked", category: "Legumes", calories: 173, protein: 16.6, carbs: 9.9, fats: 9, fiber: 6, servingSize: "100g", servingWeight: 100, source: "usda" },
  
  // Nuts & Seeds
  { id: "almonds", name: "Almonds", category: "Nuts", calories: 579, protein: 21, carbs: 22, fats: 50, fiber: 12.5, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "peanuts", name: "Peanuts", category: "Nuts", calories: 567, protein: 26, carbs: 16, fats: 49, fiber: 8.5, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "peanut-butter", name: "Peanut butter", category: "Nuts", calories: 588, protein: 25, carbs: 20, fats: 50, fiber: 6, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "walnuts", name: "Walnuts", category: "Nuts", calories: 654, protein: 15, carbs: 14, fats: 65, fiber: 6.7, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "cashews", name: "Cashews", category: "Nuts", calories: 553, protein: 18, carbs: 30, fats: 44, fiber: 3.3, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "chia-seeds", name: "Chia seeds", category: "Seeds", calories: 486, protein: 17, carbs: 42, fats: 31, fiber: 34, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "flax-seeds", name: "Flax seeds", category: "Seeds", calories: 534, protein: 18, carbs: 29, fats: 42, fiber: 27, servingSize: "100g", servingWeight: 100, source: "usda" },
  
  // Protein Supplements
  { id: "whey-protein", name: "Whey protein powder", category: "Supplements", calories: 400, protein: 80, carbs: 10, fats: 5, fiber: 0, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "casein-protein", name: "Casein protein powder", category: "Supplements", calories: 370, protein: 75, carbs: 8, fats: 4, fiber: 0, servingSize: "100g", servingWeight: 100, source: "usda" },
  
  // Popular Indian Foods
  { id: "biryani-chicken", name: "Chicken Biryani", category: "Indian", calories: 200, protein: 10, carbs: 25, fats: 7, fiber: 1, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "butter-chicken", name: "Butter Chicken", category: "Indian", calories: 210, protein: 14, carbs: 8, fats: 14, fiber: 1, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "samosa", name: "Samosa", category: "Indian", calories: 262, protein: 5, carbs: 32, fats: 13, fiber: 3, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "dosa", name: "Dosa", category: "Indian", calories: 168, protein: 3.9, carbs: 29, fats: 4.3, fiber: 1.5, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "idli", name: "Idli", category: "Indian", calories: 77, protein: 2, carbs: 15, fats: 0.5, fiber: 0.5, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "paratha", name: "Paratha", category: "Indian", calories: 260, protein: 5.6, carbs: 36, fats: 10, fiber: 2.5, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "rajma", name: "Rajma (Kidney bean curry)", category: "Indian", calories: 140, protein: 8, carbs: 22, fats: 2.5, fiber: 6, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "palak-paneer", name: "Palak Paneer", category: "Indian", calories: 175, protein: 9, carbs: 6, fats: 13, fiber: 2, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "chole", name: "Chole (Chickpea curry)", category: "Indian", calories: 165, protein: 8, carbs: 25, fats: 4, fiber: 7, servingSize: "100g", servingWeight: 100, source: "usda" },
  
  // Common Fast Foods
  { id: "pizza", name: "Pizza, cheese", category: "Fast Food", calories: 266, protein: 11, carbs: 33, fats: 10, fiber: 2.3, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "burger", name: "Hamburger", category: "Fast Food", calories: 295, protein: 17, carbs: 24, fats: 14, fiber: 1.3, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "french-fries", name: "French fries", category: "Fast Food", calories: 312, protein: 3.4, carbs: 41, fats: 15, fiber: 3.8, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "fried-chicken", name: "Fried chicken", category: "Fast Food", calories: 246, protein: 17, carbs: 10, fats: 15, fiber: 0.5, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "hotdog", name: "Hot dog", category: "Fast Food", calories: 290, protein: 10, carbs: 24, fats: 17, fiber: 1, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "sandwich", name: "Sandwich, ham and cheese", category: "Fast Food", calories: 250, protein: 12, carbs: 26, fats: 11, fiber: 1.5, servingSize: "100g", servingWeight: 100, source: "usda" },
  
  // Beverages
  { id: "coffee-black", name: "Coffee, black", category: "Beverages", calories: 2, protein: 0.3, carbs: 0, fats: 0, fiber: 0, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "coffee-latte", name: "Coffee, latte", category: "Beverages", calories: 56, protein: 3, carbs: 5, fats: 2.5, fiber: 0, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "tea", name: "Tea, plain", category: "Beverages", calories: 1, protein: 0, carbs: 0.3, fats: 0, fiber: 0, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "chai", name: "Chai (Indian tea with milk)", category: "Beverages", calories: 40, protein: 1.5, carbs: 5, fats: 1.5, fiber: 0, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "orange-juice", name: "Orange juice", category: "Beverages", calories: 45, protein: 0.7, carbs: 10, fats: 0.2, fiber: 0.2, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "apple-juice", name: "Apple juice", category: "Beverages", calories: 46, protein: 0.1, carbs: 11, fats: 0.1, fiber: 0.1, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "coconut-water", name: "Coconut water", category: "Beverages", calories: 19, protein: 0.7, carbs: 3.7, fats: 0.2, fiber: 1.1, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "protein-shake", name: "Protein shake", category: "Beverages", calories: 113, protein: 20, carbs: 5, fats: 1.5, fiber: 0.5, servingSize: "100g", servingWeight: 100, source: "usda" },
  
  // Healthy oils
  { id: "olive-oil", name: "Olive oil", category: "Oils", calories: 884, protein: 0, carbs: 0, fats: 100, fiber: 0, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "coconut-oil", name: "Coconut oil", category: "Oils", calories: 862, protein: 0, carbs: 0, fats: 100, fiber: 0, servingSize: "100g", servingWeight: 100, source: "usda" },
  
  // Honey & Sweeteners
  { id: "honey", name: "Honey", category: "Sweeteners", calories: 304, protein: 0.3, carbs: 82, fats: 0, fiber: 0.2, servingSize: "100g", servingWeight: 100, source: "usda" },
  { id: "sugar", name: "Sugar, white", category: "Sweeteners", calories: 387, protein: 0, carbs: 100, fats: 0, fiber: 0, servingSize: "100g", servingWeight: 100, source: "usda" },
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();

    if (!query || query.trim().length < 2) {
      return new Response(JSON.stringify({ foods: [], total: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const searchTerm = query.toLowerCase().trim();
    console.log("Searching for:", searchTerm);

    // Find best matching food
    const matches = FOOD_DATABASE.filter(food => {
      const name = food.name.toLowerCase();
      const category = food.category.toLowerCase();
      
      // Exact word match or contains search term
      return name.includes(searchTerm) || 
             category.includes(searchTerm) ||
             searchTerm.split(' ').every((word: string) => name.includes(word));
    });

    // Sort by relevance (exact match first, then by name length)
    matches.sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      
      // Exact match gets priority
      if (aName === searchTerm) return -1;
      if (bName === searchTerm) return 1;
      
      // Starts with search term
      if (aName.startsWith(searchTerm) && !bName.startsWith(searchTerm)) return -1;
      if (bName.startsWith(searchTerm) && !aName.startsWith(searchTerm)) return 1;
      
      // Shorter names typically more relevant
      return aName.length - bName.length;
    });

    // Return only the best match
    const bestMatch = matches.length > 0 ? [matches[0]] : [];

    console.log("Found match:", bestMatch.length > 0 ? bestMatch[0].name : "No match");

    return new Response(
      JSON.stringify({ 
        foods: bestMatch,
        total: bestMatch.length,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error searching foods:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Failed to search foods",
        foods: [],
        total: 0,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
