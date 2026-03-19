const authRoutes = require('./authRoutes');
const roleRoutes = require('./roleRoutes');
const userRoutes = require('./userRoutes');
const employeeRoutes = require('./employeeRoutes');
const tableRoutes = require('./tableRoutes');
const menuCategoryRoutes = require('./menuCategoryRoutes');
const menuItemRoutes = require('./menuItemRoutes');
const menuItemIngredientRoutes = require('./menuItemIngredientRoutes');
const orderRoutes = require('./orderRoutes');
const orderItemRoutes = require('./orderItemRoutes');
const ingredientRoutes = require('./ingredientRoutes');
const supplierRoutes = require('./supplierRoutes');
const inventoryRoutes = require('./inventoryRoutes');
const inventoryTransactionRoutes = require('./inventoryTransactionRoutes');
const paymentRoutes = require('./paymentRoutes');
const reportRoutes = require('./reportRoutes');

const setupRoutes = (app) => {
  // Auth
  app.use('/api/auth', authRoutes);

  // Roles
  app.use('/api/roles', roleRoutes);

  // Users
  app.use('/api/users', userRoutes);

  // Employees
  app.use('/api/employees', employeeRoutes);

  // Tables
  app.use('/api/tables', tableRoutes);

  // Menu Categories
  app.use('/api/menu-categories', menuCategoryRoutes);

  // Menu Items
  app.use('/api/menu-items', menuItemRoutes);

  // Menu Item Ingredients (for direct update/delete)
  app.use('/api/menu-item-ingredients', menuItemIngredientRoutes);

  // Orders
  app.use('/api/orders', orderRoutes);

  // Order Items (for direct update/delete)
  app.use('/api/order-items', orderItemRoutes);

  // Ingredients
  app.use('/api/ingredients', ingredientRoutes);

  // Suppliers
  app.use('/api/suppliers', supplierRoutes);

  // Inventory
  app.use('/api/inventory', inventoryRoutes);

  // Inventory Transactions
  app.use('/api/inventory-transactions', inventoryTransactionRoutes);

  // Payments
  app.use('/api/payments', paymentRoutes);

  // Reports
  app.use('/api/reports', reportRoutes);
};

module.exports = setupRoutes;
