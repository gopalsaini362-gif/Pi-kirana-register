import React, { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Search } from 'lucide-react'
import storageService from '../services/storageService'
import '../styles/tabs.css'

export default function StockTab({ shopName }) {
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    category: 'Grains',
    unit: 'kg',
    quantity: 0,
    buyingPrice: 0,
    sellingPrice: 0
  })

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = () => {
    const data = storageService.getProducts()
    setProducts(data)
  }

  const handleAdd = () => {
    if (editingId) {
      storageService.updateProduct(editingId, formData)
      setEditingId(null)
    } else {
      storageService.addProduct(formData)
    }
    setFormData({
      name: '',
      category: 'Grains',
      unit: 'kg',
      quantity: 0,
      buyingPrice: 0,
      sellingPrice: 0
    })
    setShowForm(false)
    loadProducts()
  }

  const handleEdit = (product) => {
    setFormData(product)
    setEditingId(product.id)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (confirm('Delete this product?')) {
      storageService.deleteProduct(id)
      loadProducts()
    }
  }

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="tab-container">
      <h2>Stock Management</h2>

      <div className="search-bar">
        <Search size={18} />
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <button onClick={() => { setShowForm(!showForm); setEditingId(null); }} className="btn btn-primary">
        <Plus size={18} /> Add Product
      </button>

      {showForm && (
        <div className="form-container">
          <input
            type="text"
            placeholder="Product Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
            <option value="Grains">Grains</option>
            <option value="Pulses">Pulses</option>
            <option value="Oils">Oils</option>
            <option value="Condiments">Condiments</option>
            <option value="Beverages">Beverages</option>
          </select>
          <input type="text" placeholder="Unit" value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })} />
          <input type="number" placeholder="Quantity" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) })} />
          <input type="number" placeholder="Buying Price (₹)" value={formData.buyingPrice} onChange={(e) => setFormData({ ...formData, buyingPrice: parseFloat(e.target.value) })} />
          <input type="number" placeholder="Selling Price (₹)" value={formData.sellingPrice} onChange={(e) => setFormData({ ...formData, sellingPrice: parseFloat(e.target.value) })} />
          <button onClick={handleAdd} className="btn btn-success">Save Product</button>
        </div>
      )}

      <div className="products-grid">
        {filteredProducts.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-header">
              <h3>{product.name}</h3>
              <span className={`stock-badge ${product.quantity === 0 ? 'out' : product.quantity <= 5 ? 'low' : 'good'}`}>
                {product.quantity} {product.unit}
              </span>
            </div>
            <p className="category">{product.category}</p>
            <div className="price-info">
              <div>Buy: ₹{product.buyingPrice}</div>
              <div>Sell: ₹{product.sellingPrice}</div>
            </div>
            <div className="product-actions">
              <button onClick={() => handleEdit(product)} className="btn-icon"><Edit2 size={16} /></button>
              <button onClick={() => handleDelete(product.id)} className="btn-icon delete"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
