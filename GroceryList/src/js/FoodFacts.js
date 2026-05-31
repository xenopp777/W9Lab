// Edited by Zoie D with help from copilot

const FOOD_FACTS_API = 'https://world.openfoodfacts.net/api/v2/search';

export async function searchFoodFacts(searchQuery) {
  try {
    if (!searchQuery || searchQuery.trim() === '') {
      return null;
    }

    const params = new URLSearchParams({
      q: searchQuery.trim(),
      page_size: 1,
      fields: 'product_name,nutriscore_grade,nutri_score_grade,nutri_score_label,image_url,nutriments'
    });

    const url = `${FOOD_FACTS_API}?${params}`;
    const response = await fetch(url);

    if (!response.ok) {
      console.error('API Error:', response.status);
      return null;
    }

    const data = await response.json();

    // Checks for results
    if (!Array.isArray(data.products) || data.products.length === 0) {
      console.warn(`No products found for: ${searchQuery}`);
      return null;
    }

    const product = data.products[0];
    const nutriments = product.nutriments || {};
    const nutriScore = product.nutriscore_grade ?? product.nutri_score_grade ?? 'N/A';

    return {
      productName: product.product_name || searchQuery,
      nutriScore,
      nutriLabel: product.nutri_score_label || (nutriScore !== 'N/A' ? `Grade ${String(nutriScore).toUpperCase()}` : 'No data'),
      imageUrl: product.image_url || null,
      nutrition: {
        energy: nutriments['energy-kcal_100g'] ?? nutriments.energy_kcal_100g ?? nutriments['energy_100g'] ?? 'N/A',
        protein: nutriments.proteins_100g ?? nutriments['proteins_100g'] ?? 'N/A',
        carbs: nutriments.carbohydrates_100g ?? nutriments['carbohydrates_100g'] ?? 'N/A',
        fat: nutriments.fat_100g ?? nutriments['fat_100g'] ?? 'N/A'
      }
    };
  } catch (error) {
    console.error('Error fetching from OpenFoodFacts API:', error);
    return null;
  }
}