import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// USDA FoodData Central API (free, no key required for basic usage)
const USDA_API_URL = "https://api.nal.usda.gov/fdc/v1/foods/search";
const USDA_API_KEY = "DEMO_KEY"; // Use demo key for basic searches

interface FoodSearchResult {
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
  source: 'usda' | 'custom';
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, pageSize = 25 } = await req.json();

    if (!query || query.trim().length < 2) {
      return new Response(JSON.stringify({ foods: [], total: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Search USDA FoodData Central
    const response = await fetch(
      `${USDA_API_URL}?api_key=${USDA_API_KEY}&query=${encodeURIComponent(query)}&pageSize=${pageSize}&dataType=Foundation,SR Legacy`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.ok) {
      throw new Error(`USDA API error: ${response.status}`);
    }

    const data = await response.json();

    const foods: FoodSearchResult[] = (data.foods || []).map((food: any) => {
      const nutrients = food.foodNutrients || [];
      
      const findNutrient = (name: string): number => {
        const nutrient = nutrients.find((n: any) => 
          n.nutrientName?.toLowerCase().includes(name.toLowerCase())
        );
        return nutrient?.value || 0;
      };

      return {
        id: food.fdcId?.toString() || Math.random().toString(),
        name: food.description || food.lowercaseDescription || "Unknown",
        category: food.foodCategory || "General",
        calories: Math.round(findNutrient("Energy")),
        protein: Math.round(findNutrient("Protein") * 10) / 10,
        carbs: Math.round(findNutrient("Carbohydrate") * 10) / 10,
        fats: Math.round(findNutrient("Total lipid") * 10) / 10,
        fiber: Math.round(findNutrient("Fiber") * 10) / 10,
        servingSize: "100g",
        servingWeight: 100,
        source: 'usda' as const,
      };
    });

    return new Response(
      JSON.stringify({ 
        foods: foods.filter(f => f.calories > 0),
        total: data.totalHits || foods.length,
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
