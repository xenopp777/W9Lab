// Edited by Zoie D 4/23/26

import { html, render } from 'lit-html';

/* ========== View ========== */

export class GroceryView {
  constructor() {
    this.app = document.querySelector('.grocery-list');
    this.form = document.querySelector('.grocery-form');
    this.itemNameInput = document.getElementById('itemName');
    this.quantityInput = document.getElementById('quantity');
  }

  get itemName() {
    return this.itemNameInput.value.trim();
  }

  get quantity() {
    return this.quantityInput.value.trim();
  }

  resetForm() {
    this.form.reset();
  }

  // Renders a nutrition score badge based on the score grade
  getNutriScoreBadgeClass(nutriScore) {
    const scoreMap = {
      'A': 'bg-success',
      'B': 'bg-info',
      'C': 'bg-warning',
      'D': 'bg-danger',
      'E': 'bg-danger'
    };
    return scoreMap[nutriScore] || 'bg-secondary';
  }

  // Creates a template for nutrition info display
  nutritionTemplate(productData) {
    if (!productData) {
      return html`<small class="text-muted">No product data available</small>`;
    }

    const { nutriScore, nutriLabel, nutrition, productName } = productData;
    const badgeClass = this.getNutriScoreBadgeClass(nutriScore);

    return html`
      <div class="product-info mt-2 p-2 bg-light rounded">
        <div class="mb-2">
          <span class="badge ${badgeClass} me-2">Nutri-Score: ${nutriScore}</span>
          <small class="text-muted">${nutriLabel}</small>
        </div>
        <small class="d-block text-muted mb-1"><strong>Product:</strong> ${productName}</small>
        <small class="d-block text-muted">
          <strong>Per 100g:</strong> Energy: ${nutrition.energy} kcal | 
          Protein: ${nutrition.protein}g | 
          Carbs: ${nutrition.carbs}g | 
          Fat: ${nutrition.fat}g
        </small>
      </div>
    `;
  }

  // Creates a template for a single grocery item
  groceryItemTemplate(grocery, index) {
    return html`
      <div class="list-group-item d-flex justify-content-between align-items-start" data-index="${index}">
        <div class="flex-grow-1">
          <h5 class="mb-1">${grocery.itemName}</h5>
          <small class="text-muted">Quantity: ${grocery.quantity}</small>
          ${this.nutritionTemplate(grocery.productData)}
        </div>
        <button name="deleteGrocery" type="button" class="btn btn-danger btn-sm ms-2" aria-label="Delete item">
          <i class="bi-trash"></i>
        </button>
      </div>
    `;
  }

  displayGroceries(groceries) {
    const items = groceries.map((grocery, index) => this.groceryItemTemplate(grocery, index));
    const template = html`${items}`;
    render(template, this.app);
  }

  onAddGrocery(handler) {
    this.form.addEventListener('submit', (event) => {
      event.preventDefault();

      if (!this.form.checkValidity()) {
        this.form.reportValidity();
        return;
      }

      handler(this.itemName, this.quantity);
      this.resetForm();
    });
  }

  onDeleteGrocery(handler) {
    this.app.addEventListener('click', (event) => {
      const deleteButton = event.target.closest('button[name="deleteGrocery"]');
      if (!deleteButton) {
        return;
      }

      const itemEl = deleteButton.closest('[data-index]');
      const index = parseInt(itemEl.getAttribute('data-index'), 10);
      handler(index);
    });
  }
}