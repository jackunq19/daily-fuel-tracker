import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface DietPlanRequest {
  calories: number;
  goal: 'lose' | 'maintain' | 'gain';
  dietType: 'vegetarian' | 'non-vegetarian' | 'vegan' | 'keto' | 'high-protein';
  mealsPerDay: number;
  cuisinePreference: string[];
  allergies: string[];
  activityLevel: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { calories, goal, dietType, mealsPerDay, cuisinePreference, allergies, activityLevel } = 
      await req.json() as DietPlanRequest;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const macroDistribution = {
      lose: { protein: 35, carbs: 35, fats: 30 },
      maintain: { protein: 30, carbs: 45, fats: 25 },
      gain: { protein: 30, carbs: 50, fats: 20 },
    };

    const macros = macroDistribution[goal];
    const proteinGrams = Math.round((calories * macros.protein / 100) / 4);
    const carbsGrams = Math.round((calories * macros.carbs / 100) / 4);
    const fatsGrams = Math.round((calories * macros.fats / 100) / 9);

    const systemPrompt = `You are a professional nutritionist and dietitian. Generate a detailed, practical meal plan based on user requirements. 

CRITICAL RULES:
1. All meals must be realistic, everyday foods that can be easily prepared
2. Provide exact measurements in grams, cups, or pieces
3. Each meal must include exact calorie and macro breakdown
4. Total daily calories must match the target within 50 calories
5. Foods must be commonly available and not exotic
6. Consider the user's cultural food preferences
7. Avoid any listed allergies strictly
8. Make meals varied and appetizing

Respond ONLY with a valid JSON object in this exact format:
{
  "meals": [
    {
      "name": "Breakfast",
      "time": "8:00 AM",
      "foods": [
        {
          "item": "Food name",
          "quantity": "Amount with unit",
          "calories": number,
          "protein": number,
          "carbs": number,
          "fats": number
        }
      ],
      "totalCalories": number,
      "totalProtein": number,
      "totalCarbs": number,
      "totalFats": number
    }
  ],
  "dailyTotal": {
    "calories": number,
    "protein": number,
    "carbs": number,
    "fats": number
  },
  "tips": ["tip1", "tip2", "tip3"],
  "waterIntake": "amount in liters"
}`;

    const userPrompt = `Create a ${mealsPerDay}-meal diet plan for someone with these requirements:
- Daily calorie target: ${calories} kcal
- Goal: ${goal === 'lose' ? 'Weight loss' : goal === 'gain' ? 'Muscle gain' : 'Maintain weight'}
- Diet type: ${dietType}
- Target macros: Protein ${proteinGrams}g, Carbs ${carbsGrams}g, Fats ${fatsGrams}g
- Preferred cuisines: ${cuisinePreference.length > 0 ? cuisinePreference.join(', ') : 'Any'}
- Allergies/restrictions: ${allergies.length > 0 ? allergies.join(', ') : 'None'}
- Activity level: ${activityLevel}

Divide the ${calories} calories across ${mealsPerDay} meals appropriately. Breakfast and lunch should be larger meals.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No response from AI");
    }

    // Parse the JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid response format");
    }

    const mealPlan = JSON.parse(jsonMatch[0]);

    return new Response(JSON.stringify(mealPlan), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating diet plan:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Failed to generate diet plan" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
