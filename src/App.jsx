import React, { useState, useEffect } from 'react'
import { BarChart3, ShoppingCart, DollarSign, Settings, TrendingUp } from 'lucide-react'
import StockTab from './tabs/StockTab'
import SalesTab from './tabs/SalesTab'
import ExpenseTab from './tabs/ExpenseTab'
import SummaryTab from './tabs/SummaryTab'
import SettingsTab from './tabs/SettingsTab'
import storageService from './services/storageService'
import CurrencyConverter from './components/CurrencyConverter'
import './App.css'

export default function App() {
  const [activeTab, setActiveTab] = useState('stock')
  const [settings, setSettings] = useState(storageService.getSettings())
  const [cartTotal, setCartTotal] = useState(0)

  useEffect(() => {
    // Sync settings across tabs
    const savedSettings = storageService.getSettings()
    setSettings(savedSettings)
  }, [])

  const handleSettingsUpdate = (newSettings) => {
    storageService.saveSettings(newSettings)
    setSettings(newSettings)
  }

  const tabs = [
    { id: 'stock', label: 'Stock', icon: BarChart3 },
    { id: 'sales', label: 'Sales', icon: ShoppingCart },
    { id: 'expense', label: 'Expense', icon: DollarSign },
    { id: 'summary', label: 'Summary', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]

  return (
    <div className="app-container">
      <div className="app-content">
        {/* Header */}
        <div className="app-header">
          <div className="header-top">
            <h1>{settings.shopName}</h1>
            <div className="header-subtitle">Pi Network Kirana Register</div>
          </div>
          <CurrencyConverter />
        </div>

        {/* Tabs Navigation */}
        <div className="tabs-navigation">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={20} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'stock' && <StockTab shopName={settings.shopName} />}
          {activeTab === 'sales' && <SalesTab shopName={settings.shopName} onCartUpdate={setCartTotal} />}
          {activeTab === 'expense' && <ExpenseTab />}
          {activeTab === 'summary' && <SummaryTab />}
          {activeTab === 'settings' && (
            <SettingsTab 
              settings={settings} 
              onUpdate={handleSettingsUpdate}
            />
          )}
        </div>
      </div>
    </div>
  )
}
