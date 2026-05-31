/*  This application simulates an electronic grocery list. Users can add and delete
    items from the list. The list of items is stored in browser local storage
    so items persist between sessions.
*/

// Edited by Zoie D 4/23/26

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../css/styles.css';
import { GroceryModel } from './model.js';
import { GroceryView } from './view.js';
import { GroceryController } from './controller.js';

/* ========== Init ========== */

document.addEventListener('DOMContentLoaded', () => {
  new GroceryController(new GroceryModel(), new GroceryView());
});