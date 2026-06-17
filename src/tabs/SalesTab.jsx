import React, { useState, useEffect } from 'react'
import { ShoppingCart, Plus, Trash2 } from 'lucide-react'
import storageService from '../services/storageService'
import BillGenerator from '../components/BillGenerator'
import currencyService from '../services/currencyService'
import '../styles/tabs.css'

export default function SalesTab({ shopName, onCartUpdate }) {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [showBill, setShowBill] = useState(false)
  const [lastSale, setLastSale] = useState(null)
  const [rates, setRates] = useState(null)

  useEffect(() => {
    loadProducts()
    loadRates()
  }, [])

  useEffect(() => {
    onCartUpdate(cart.length)
  }, [cart])

  const loadProducts = () => {
    const data = storageService.getProducts().filter(p => p.quantity > 0)
    setProducts(data)
  }

  const loadRates = async () => {
    const fetchedRates = await currencyService.getExchangeRates()
    setRates(fetchedRates)
  }

  const addToCart = () => {
    if (!selectedProduct || quantity <= 0) return
    if (quantity > selectedProduct.quantity) {
      alert('Not enough stock')
      return
    }

    const item = {
      id: Date.now(),
      ...selectedProduct,
      quantity
    }
    setCart([...cart, item])
    setQuantity(1)
  }

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id))
  }

  const checkout = () => {
    if (cart.length === 0) return

    const totalAmount = cart.reduce((sum, item) => sum + (item.quantity * item.sellingPrice), 0)
    const sale = {
      items: cart,
      totalAmount
    }

    // Update stock
    let updatedProducts = storageService.getProducts()
    cart.forEach(cartItem => {
      const product = updatedProducts.find(p => p.id === cartItem.id)
      if (product) product.quantity -= cartItem.quantity
    })
    storageService.saveProducts(updatedProducts)

    // Save sale
    storageService.addSale(sale)

    setLastSale(sale)
    setShowBill(true)
    setCart([])
    loadProducts()
  }

  const cartTotal = cart.reduce((sum, item) => sum + (item.quantity * item.sellingPrice), 0)

  return (
    <div className="tab-container">
      <h2>Point of Sale</h2>

      <div className="sales-container">
        <div className="product-selector">
          <h3>Select Product</h3>
          <select value={selectedProduct?.id || ''} onChange={(e) => {
            const product = products.find(p => p.id === parseInt(e.target.value))
            setSelectedProduct(product)
          }}>
            <option value="">Choose a product...</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} - Stock: {p.quantity} {p.unit}
              </option>
            ))}
          </select>

          {selectedProduct && (
            <div className="product-info">
              <p>Price: ₹{selectedProduct.sellingPrice}</p>
              <input
                type="number"
                min="1"
                max={selectedProduct.quantity}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                placeholder="Quantity"
              />
              <button onClick={addToCart} className="btn btn-primary">
                <Plus size={16} /> Add to Cart
              </button>
            </div>
          )}
        </div>

        <div className="cart-section">
          <h3>Shopping Cart</h3>
          {cart.length === 0 ? (
            <p className="empty-cart">Cart is empty</p>
          ) : (
            <>
              <div className="cart-items">
                {cart.map(item => (
                  <div key={item.id} className="cart-item">
                    <div>
                      <strong>{item.name}</strong>
                      <p>{item.quantity} x ₹{item.sellingPrice}</p>
                    </div>
                    <div className="item-total">₹{(item.quantity * item.sellingPrice).toFixed(2)}</div>
                    <button onClick={() => removeFromCart(item.id)} className="btn-icon delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="cart-total">
                <strong>Total: ₹{cartTotal.toFixed(2)}</strong>
              </div>
              <button onClick={checkout} className="btn btn-success">
                <ShoppingCart size={18} /> Checkout & Print Bill
              </button>
            </>
          )}
        </div>
      </div>

      {showBill && lastSale && (
        <BillGenerator
          sale={lastSale}
          shopName={shopName}
          onClose={() => setShowBill(false)}
        />
      )}
    </div>
  )
}
