// Edited by Zoie D 4/23/26

import { searchFoodFacts } from './FoodFacts.js';

/* ========== Controller ========== */

export class GroceryController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.model.subscribeGroceryListChanged(this.onGroceryListChanged);
    this.view.onAddGrocery(this.handleAddGrocery);
    this.view.onDeleteGrocery(this.handleDeleteGrocery);

    this.onGroceryListChanged(this.model.groceries);
  }

  onGroceryListChanged = (groceries) => {
    this.view.displayGroceries(groceries);
  };

  handleAddGrocery = async (itemName, quantity) => {
    this.model.addGrocery(itemName, quantity, null);
    const newIndex = this.model.groceries.length - 1;
    try {
      const productData = await searchFoodFacts(itemName);
      // Update the item with product data if found
      if (productData) {
        this.model.updateGroceryProductData(newIndex, productData);
      }
    } catch (error) {
      console.error('Error fetching product data:', error);
    }
  };

  handleDeleteGrocery = (index) => {
    this.model.deleteGrocery(index);
  };
}