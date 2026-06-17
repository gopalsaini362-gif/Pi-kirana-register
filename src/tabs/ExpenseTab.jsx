import React, { useState, useEffect } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import storageService from '../services/storageService'
import { format } from 'date-fns'
import '../styles/tabs.css'

export default function ExpenseTab() {
  const [expenses, setExpenses] = useState([])
  const [formData, setFormData] = useState({
    category: 'Rent',
    amount: 0,
    description: ''
  })

  useEffect(() => {
    loadExpenses()
  }, [])

  const loadExpenses = () => {
    const data = storageService.getExpenses()
    setExpenses(data)
  }

  const handleAdd = () => {
    if (formData.amount <= 0) return
    storageService.addExpense(formData)
    setFormData({ category: 'Rent', amount: 0, description: '' })
    loadExpenses()
  }

  const handleDelete = (id) => {
    const filtered = expenses.filter(e => e.id !== id)
    storageService.saveExpenses(filtered)
    loadExpenses()
  }

  const todayExpenses = expenses.filter(e => {
    const today = new Date().toDateString()
    return new Date(e.timestamp).toDateString() === today
  })

  const todayTotal = todayExpenses.reduce((sum, e) => sum + e.amount, 0)
  const monthTotal = expenses.reduce((sum, e) => sum + e.amount, 0)

  return (
    <div className="tab-container">
      <h2>Expense Tracking</h2>

      <div className="stats-row">
        <div className="stat-card">
          <h4>Today's Expenses</h4>
          <p className="stat-value">₹{todayTotal.toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <h4>Month Total</h4>
          <p className="stat-value">₹{monthTotal.toFixed(2)}</p>
        </div>
      </div>

      <div className="form-container">
        <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
          <option value="Rent">Rent</option>
          <option value="Electricity">Electricity</option>
          <option value="Staff">Staff Salary</option>
          <option value="Utilities">Utilities</option>
          <option value="Other">Other</option>
        </select>
        <input type="number" placeholder="Amount (₹)" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })} />
        <input type="text" placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
        <button onClick={handleAdd} className="btn btn-primary"><Plus size={16} /> Add Expense</button>
      </div>

      <div className="expenses-list">
        {expenses.length === 0 ? (
          <p className="empty-message">No expenses recorded</p>
        ) : (
          expenses.map(expense => (
            <div key={expense.id} className="expense-item">
              <div>
                <strong>{expense.category}</strong>
                <p>{expense.description}</p>
                <small>{format(new Date(expense.timestamp), 'dd MMM yyyy HH:mm')}</small>
              </div>
              <div className="expense-amount">₹{expense.amount.toFixed(2)}</div>
              <button onClick={() => handleDelete(expense.id)} className="btn-icon delete"><Trash2 size={16} /></button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
