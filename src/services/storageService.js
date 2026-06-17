// Local storage management
const STORAGE_KEYS = {
  PRODUCTS: 'pi_kirana_products',
  SALES: 'pi_kirana_sales',
  EXPENSES: 'pi_kirana_expenses',
  SETTINGS: 'pi_kirana_settings',
}

const DEFAULT_SETTINGS = {
  shopName: 'My Kirana Store',
  lowStockThreshold: 5,
  primaryCurrency: 'INR',
  secondaryCurrency: 'USDT',
  billCurrency: 'USDT', // Default bill currency
  owner: 'Shop Owner'
}

const DEFAULT_PRODUCTS = [
  { id: 1, name: 'Aata', category: 'Grains', unit: 'kg', quantity: 20, buyingPrice: 30, sellingPrice: 50, inrPrice: 50, usdtPrice: 0.6 },
  { id: 2, name: 'Rice', category: 'Grains', unit: 'kg', quantity: 15, buyingPrice: 50, sellingPrice: 70, inrPrice: 70, usdtPrice: 0.85 },
  { id: 3, name: 'Dal', category: 'Pulses', unit: 'kg', quantity: 10, buyingPrice: 80, sellingPrice: 120, inrPrice: 120, usdtPrice: 1.45 },
  { id: 4, name: 'Oil', category: 'Oils', unit: 'liter', quantity: 5, buyingPrice: 150, sellingPrice: 200, inrPrice: 200, usdtPrice: 2.4 },
  { id: 5, name: 'Sugar', category: 'Sweeteners', unit: 'kg', quantity: 8, buyingPrice: 40, sellingPrice: 60, inrPrice: 60, usdtPrice: 0.72 },
  { id: 6, name: 'Salt', category: 'Condiments', unit: 'kg', quantity: 12, buyingPrice: 10, sellingPrice: 20, inrPrice: 20, usdtPrice: 0.24 },
  { id: 7, name: 'Tea Leaves', category: 'Beverages', unit: 'kg', quantity: 3, buyingPrice: 300, sellingPrice: 450, inrPrice: 450, usdtPrice: 5.4 },
  { id: 8, name: 'Coffee', category: 'Beverages', unit: 'kg', quantity: 2, buyingPrice: 400, sellingPrice: 600, inrPrice: 600, usdtPrice: 7.2 }
]

export const storageService = {
  // Products
  getProducts() {
    const products = localStorage.getItem(STORAGE_KEYS.PRODUCTS)
    return products ? JSON.parse(products) : DEFAULT_PRODUCTS
  },

  saveProducts(products) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products))
  },

  addProduct(product) {
    const products = this.getProducts()
    const newProduct = {
      ...product,
      id: Math.max(...products.map(p => p.id), 0) + 1
    }
    products.push(newProduct)
    this.saveProducts(products)
    return newProduct
  },

  updateProduct(id, updatedProduct) {
    const products = this.getProducts()
    const index = products.findIndex(p => p.id === id)
    if (index !== -1) {
      products[index] = { ...products[index], ...updatedProduct }
      this.saveProducts(products)
    }
    return products[index]
  },

  deleteProduct(id) {
    const products = this.getProducts()
    const filtered = products.filter(p => p.id !== id)
    this.saveProducts(filtered)
  },

  // Sales
  getSales() {
    const sales = localStorage.getItem(STORAGE_KEYS.SALES)
    return sales ? JSON.parse(sales) : []
  },

  saveSales(sales) {
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales))
  },

  addSale(sale) {
    const sales = this.getSales()
    sales.push({
      ...sale,
      id: Date.now(),
      timestamp: new Date().toISOString()
    })
    this.saveSales(sales)
    return sales[sales.length - 1]
  },

  // Expenses
  getExpenses() {
    const expenses = localStorage.getItem(STORAGE_KEYS.EXPENSES)
    return expenses ? JSON.parse(expenses) : []
  },

  saveExpenses(expenses) {
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses))
  },

  addExpense(expense) {
    const expenses = this.getExpenses()
    expenses.push({
      ...expense,
      id: Date.now(),
      timestamp: new Date().toISOString()
    })
    this.saveExpenses(expenses)
    return expenses[expenses.length - 1]
  },

  // Settings
  getSettings() {
    const settings = localStorage.getItem(STORAGE_KEYS.SETTINGS)
    return settings ? { ...DEFAULT_SETTINGS, ...JSON.parse(settings) } : DEFAULT_SETTINGS
  },

  saveSettings(settings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings))
  },

  // Clear all data
  clearAllData() {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key))
  }
}

export default storageService
