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

  // Renders the data source badge
  getDataSourceBadge(nutriLabel) {
    return nutriLabel.includes('USDA') 
      ? html`<span class="badge bg-info">🔬 USDA Food Data</span>` 
      : html`<span class="badge bg-secondary">📊 Food Data</span>`;
  }

  // Renders individual nutrition values with consistent styling
  nutritionItemTemplate(label, value) {
    const valueStr = String(value);
    const isNA = valueStr === 'N/A' || valueStr.includes('N/A');
    return html`
      <div class="col-md-6 mb-2">
        <small class="d-block text-muted">
          <strong>${label}:</strong> 
          <span class="${isNA ? 'text-secondary' : 'text-dark'}">${valueStr}</span>
        </small>
      </div>
    `;
  }

  // Creates a template for nutrition info display with USDA API structure
  nutritionTemplate(productData) {
    if (!productData) {
      return html`
        <div class="product-info mt-2 p-2 bg-light rounded">
          <small class="text-muted d-block">No product data available</small>
        </div>
      `;
    }

    const { nutriLabel, nutrition, productName } = productData;

    return html`
      <div class="product-info mt-2 p-3 bg-light rounded border-start border-info">
        <div class="mb-3">
          ${this.getDataSourceBadge(nutriLabel)}
          <small class="d-block text-muted mt-1">${nutriLabel}</small>
        </div>
        
        <small class="d-block text-muted mb-2">
          <strong>USDA Product:</strong> <em>${productName}</em>
        </small>
        
        <div class="row">
          ${this.nutritionItemTemplate('Energy', nutrition.energy)}
          ${this.nutritionItemTemplate('Protein', nutrition.protein)}
          ${this.nutritionItemTemplate('Carbohydrates', nutrition.carbs)}
          ${this.nutritionItemTemplate('Total Fat', nutrition.fat)}
        </div>
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