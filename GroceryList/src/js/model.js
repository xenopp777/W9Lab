// Edited by Zoie D 4/23/26

/* ========== Model ========== */

export class GroceryModel {
  constructor() {
    this.onGroceryListChanged = () => {};

    try {
      const savedGroceries = JSON.parse(localStorage.getItem('groceries'));

      if (Array.isArray(savedGroceries) && this.allValid(savedGroceries)) {
        this.groceries = savedGroceries;
      } else {
        this.groceries = [
          { itemName: 'Apples', quantity: '5', productData: null },
          { itemName: 'Milk', quantity: '1 gallon', productData: null }
        ];
      }
    } catch (e) {
      // Provide starter entries if local storage is empty/corrupt.
      this.groceries = [
        { itemName: 'Apples', quantity: '5', productData: null },
        { itemName: 'Milk', quantity: '1 gallon', productData: null }
      ];
    }
  }

  isValidItem(item) {
    return (
      typeof item === 'object' &&
      item !== null &&
      typeof item.itemName === 'string' &&
      typeof item.quantity === 'string'
    );
  }

  allValid(groceries) {
    for (let i = 0; i < groceries.length; i++) {
      if (!this.isValidItem(groceries[i])) {
        return false;
      }
    }
    return true;
  }

  commit(groceries) {
    this.groceries = groceries;

    try {
      localStorage.setItem('groceries', JSON.stringify(groceries));
    } catch (error) {
      console.warn('Could not save groceries to localStorage:', error);
    }

    this.onGroceryListChanged(groceries);
  }

  subscribeGroceryListChanged(callback) {
    this.onGroceryListChanged = callback;
  }

  addGrocery(itemName, quantity, productData = null) {
    const newGrocery = { itemName: itemName, quantity: quantity, productData: productData };
    this.commit([...this.groceries, newGrocery]);
  }

  deleteGrocery(index) {
    this.commit(this.groceries.filter((_, groceryIndex) => groceryIndex !== index));
  }

  updateGroceryProductData(index, productData) {
    const updatedGroceries = [...this.groceries];
    if (updatedGroceries[index]) {
      updatedGroceries[index].productData = productData;
      this.commit(updatedGroceries);
    }
  }
}