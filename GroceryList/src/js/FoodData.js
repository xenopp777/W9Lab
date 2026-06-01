// Edited by Zoie D with help from copilot
// Refactored to use USDA Food Data Central API

const USDA_FDC_API = '/fdc/fdc/v1/foods/search';
const API_KEY = import.meta.env.VITE_USDA_API_KEY;

export async function searchFoodFacts(searchQuery) {
  try {
    if (!searchQuery || searchQuery.trim() === '') {
      return null;
    }

    if (!API_KEY) {
      console.warn('Missing VITE_USDA_API_KEY in environment');
      return null;
    }

    const url = `${USDA_FDC_API}?api_key=${encodeURIComponent(API_KEY)}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: searchQuery.trim(),
        pageSize: 1
      })
    });

    if (!response.ok) {
      console.error('USDA API Error:', response.status);
      return null;
    }

    const data = await response.json();

    // Check for results
    if (!Array.isArray(data.foods) || data.foods.length === 0) {
      console.warn(`No foods found for: ${searchQuery}`);
      return null;
    }

    const food = data.foods[0];
    const nutrients = food.foodNutrients || [];

    // Helper function to find nutrient value
    const getNutrient = (nutrientName) => {
      const nutrient = nutrients.find(n => 
        n.nutrientName && n.nutrientName.toLowerCase().includes(nutrientName.toLowerCase())
      );
      return nutrient?.value ? Math.round(nutrient.value * 10) / 10 : 'N/A';
    };

    return {
      productName: food.description || searchQuery,
      nutriScore: 'N/A', // USDA API doesn't provide Nutri-Score
      nutriLabel: `USDA Food ID: ${food.fdcId}`,
      imageUrl: null, // USDA API doesn't provide images
      nutrition: {
        energy: getNutrient('energy') + ' kcal',
        protein: getNutrient('protein') + ' g',
        carbs: getNutrient('carbohydrate') + ' g',
        fat: getNutrient('total lipid') + ' g'
      }
    };
  } catch (error) {
    console.error('Error fetching from USDA FDC API:', error);
    return null;
  }
}