import React, { useState, useEffect } from 'react'
import storageService from '../services/storageService'
import { format, startOfMonth, startOfWeek } from 'date-fns'
import '../styles/tabs.css'

export default function SummaryTab() {
  const [filter, setFilter] = useState('all')
  const [summary, setSummary] = useState(null)

  useEffect(() => {
    calculateSummary()
  }, [filter])

  const calculateSummary = () => {
    const sales = storageService.getSales()
    const expenses = storageService.getExpenses()
    const products = storageService.getProducts()

    let filteredSales = sales
    let filteredExpenses = expenses

    const now = new Date()

    if (filter === 'today') {
      const today = now.toDateString()
      filteredSales = sales.filter(s => new Date(s.timestamp).toDateString() === today)
      filteredExpenses = expenses.filter(e => new Date(e.timestamp).toDateString() === today)
    } else if (filter === 'week') {
      const weekStart = startOfWeek(now)
      filteredSales = sales.filter(s => new Date(s.timestamp) >= weekStart)
      filteredExpenses = expenses.filter(e => new Date(e.timestamp) >= weekStart)
    } else if (filter === 'month') {
      const monthStart = startOfMonth(now)
      filteredSales = sales.filter(s => new Date(s.timestamp) >= monthStart)
      filteredExpenses = expenses.filter(e => new Date(e.timestamp) >= monthStart)
    }

    const totalSales = filteredSales.reduce((sum, s) => sum + s.totalAmount, 0)
    const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0)
    const profit = totalSales - totalExpenses
    const stockValue = products.reduce((sum, p) => sum + (p.quantity * p.buyingPrice), 0)

    setSummary({
      totalSales,
      totalExpenses,
      profit,
      stockValue,
      salesCount: filteredSales.length,
      topItems: getTopItems(filteredSales)
    })
  }

  const getTopItems = (sales) => {
    const itemMap = {}
    sales.forEach(sale => {
      sale.items.forEach(item => {
        itemMap[item.name] = (itemMap[item.name] || 0) + item.quantity
      })
    })
    return Object.entries(itemMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
  }

  if (!summary) return <div>Loading...</div>

  return (
    <div className="tab-container">
      <h2>Business Summary</h2>

      <div className="filter-buttons">
        {['today', 'week', 'month', 'all'].map(f => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="summary-stats">
        <div className="stat-card large">
          <h4>Total Sales</h4>
          <p className="stat-value">₹{summary.totalSales.toFixed(2)}</p>
          <p className="stat-subtitle">{summary.salesCount} bills</p>
        </div>
        <div className="stat-card large">
          <h4>Total Expenses</h4>
          <p className="stat-value danger">₹{summary.totalExpenses.toFixed(2)}</p>
        </div>
        <div className="stat-card large">
          <h4>Net Profit</h4>
          <p className={`stat-value ${summary.profit >= 0 ? 'success' : 'danger'}`}>
            ₹{summary.profit.toFixed(2)}
          </p>
        </div>
        <div className="stat-card large">
          <h4>Stock Value</h4>
          <p className="stat-value">₹{summary.stockValue.toFixed(2)}</p>
        </div>
      </div>

      <h3>Top 5 Selling Items</h3>
      <div className="top-items">
        {summary.topItems.map((item, idx) => (
          <div key={idx} className="top-item">
            <span>{idx + 1}. {item[0]}</span>
            <span className="quantity">{item[1]} units</span>
          </div>
        ))}
      </div>
    </div>
  )
}
