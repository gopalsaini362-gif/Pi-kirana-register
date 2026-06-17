import React, { useState, useEffect } from 'react'
import { RefreshCw } from 'lucide-react'
import currencyService from '../services/currencyService'
import './CurrencyConverter.css'

export default function CurrencyConverter({ amount, fromCurrency = 'INR' }) {
  const [rates, setRates] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchRates()
  }, [])

  const fetchRates = async () => {
    setLoading(true)
    setError(null)
    try {
      const fetchedRates = await currencyService.getExchangeRates()
      setRates(fetchedRates)
    } catch (err) {
      setError('Failed to fetch rates')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const convertTo = async (toCurrency) => {
    try {
      return await currencyService.convertCurrency(amount, fromCurrency, toCurrency)
    } catch (err) {
      console.error('Conversion error:', err)
      return 0
    }
  }

  if (!rates) {
    return (
      <div className="currency-converter">
        <button onClick={fetchRates} disabled={loading} className="btn-refresh">
          <RefreshCw size={16} /> {loading ? 'Loading...' : 'Load Rates'}
        </button>
      </div>
    )
  }

  return (
    <div className="currency-converter">
      <div className="rates-display">
        <div className="rate-item">
          <span className="currency-label">INR to USDT</span>
          <span className="rate-value">1 USDT = ₹{rates.usdtToInr.toFixed(2)}</span>
        </div>
        <div className="rate-item">
          <span className="currency-label">Pi Network</span>
          <span className="rate-value">1 π = ₹{rates.piToInr.toFixed(2)}</span>
        </div>
        <button onClick={fetchRates} disabled={loading} className="btn-refresh-small">
          <RefreshCw size={14} />
        </button>
      </div>
    </div>
  )
}
