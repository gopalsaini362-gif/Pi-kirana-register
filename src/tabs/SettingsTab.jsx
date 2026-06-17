import React, { useState } from 'react'
import { Save } from 'lucide-react'
import '../styles/tabs.css'

export default function SettingsTab({ settings, onUpdate }) {
  const [formData, setFormData] = useState(settings)

  const handleSave = () => {
    onUpdate(formData)
    alert('Settings saved successfully!')
  }

  return (
    <div className="tab-container">
      <h2>Settings</h2>

      <div className="form-container">
        <div className="form-group">
          <label>Shop Name</label>
          <input
            type="text"
            value={formData.shopName}
            onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Owner Name</label>
          <input
            type="text"
            value={formData.owner}
            onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Low Stock Threshold</label>
          <input
            type="number"
            value={formData.lowStockThreshold}
            onChange={(e) => setFormData({ ...formData, lowStockThreshold: parseInt(e.target.value) })}
          />
        </div>

        <div className="form-group">
          <label>Bill Currency</label>
          <select
            value={formData.billCurrency}
            onChange={(e) => setFormData({ ...formData, billCurrency: e.target.value })}
          >
            <option value="USDT">USDT (Tether)</option>
            <option value="PI">Pi Network</option>
            <option value="INR">Indian Rupee</option>
          </select>
        </div>

        <button onClick={handleSave} className="btn btn-primary">
          <Save size={18} /> Save Settings
        </button>
      </div>

      <div className="info-section">
        <h3>ℹ️ App Information</h3>
        <p><strong>Version:</strong> 1.0.0</p>
        <p><strong>Built for:</strong> Pi Network Kirana Stores</p>
        <p><strong>Exchange Rates:</strong> Real-time from CoinGecko API</p>
        <p><strong>Data Storage:</strong> Browser localStorage (Offline-first)</p>
      </div>
    </div>
  )
}
