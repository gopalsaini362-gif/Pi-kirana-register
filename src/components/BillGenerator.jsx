import React, { useState, useEffect } from 'react'
import { FileText, Copy, Share2, Download, X } from 'lucide-react'
import currencyService from '../services/currencyService'
import { format } from 'date-fns'
import './BillGenerator.css'

export default function BillGenerator({ sale, shopName, onClose }) {
  const [rates, setRates] = useState(null)
  const [convertedAmounts, setConvertedAmounts] = useState(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    loadRates()
  }, [sale])

  const loadRates = async () => {
    try {
      const fetchedRates = await currencyService.getExchangeRates()
      setRates(fetchedRates)
      calculateConversions(fetchedRates)
    } catch (error) {
      console.error('Error loading rates:', error)
    }
  }

  const calculateConversions = async (ratesData) => {
    try {
      const inrAmount = sale.totalAmount
      const usdtAmount = await currencyService.convertCurrency(inrAmount, 'INR', 'USDT')
      const piAmount = await currencyService.convertCurrency(inrAmount, 'INR', 'PI')

      setConvertedAmounts({
        inr: inrAmount,
        usdt: usdtAmount,
        pi: piAmount
      })
    } catch (error) {
      console.error('Error calculating conversions:', error)
    }
  }

  const handleCopy = () => {
    const billText = generateBillText()
    navigator.clipboard.writeText(billText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = async () => {
    const billText = generateBillText()
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${shopName} - Bill`,
          text: billText
        })
      } catch (err) {
        console.error('Share failed:', err)
      }
    } else {
      handleCopy()
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const generateBillText = () => {
    let text = `
================================
   ${shopName}
   BILL RECEIPT
================================

Date & Time: ${format(new Date(sale.timestamp), 'dd/MM/yyyy HH:mm:ss')}
Bill ID: ${sale.id}

ITEMS:
${sale.items.map(item => 
  `${item.name}
  Qty: ${item.quantity} ${item.unit} @ ₹${item.price}/unit
  Amount: ₹${(item.quantity * item.price).toFixed(2)}`
).join('\n\n')}

--------------------------------
TOTAL BILL
--------------------------------

Amount in INR:  ₹${convertedAmounts?.inr?.toFixed(2)}
Amount in USDT: ${convertedAmounts?.usdt?.toFixed(4)} USDT
Amount in Pi:   ${convertedAmounts?.pi?.toFixed(4)} π

Current Rates:
1 USDT = ₹${rates?.usdtToInr?.toFixed(2)}
1 π = ₹${rates?.piToInr?.toFixed(2)}

================================
     Thank You! Visit Again
================================
    `
    return text
  }

  if (!convertedAmounts || !rates) {
    return (
      <div className="bill-modal">
        <div className="bill-content">
          <div className="loading">Loading bill...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="bill-modal">
      <div className="bill-content">
        <div className="bill-header">
          <h2>{shopName}</h2>
          <button onClick={onClose} className="btn-close">
            <X size={20} />
          </button>
        </div>

        <div className="bill-section">
          <h3>BILL RECEIPT</h3>
          <p className="bill-datetime">
            {format(new Date(sale.timestamp), 'dd/MM/yyyy HH:mm:ss')}
          </p>
          <p className="bill-id">Bill ID: #{sale.id}</p>
        </div>

        <div className="bill-items">
          <h4>Items Sold:</h4>
          <table className="items-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Unit</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {sale.items.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.unit}</td>
                  <td>₹{item.price.toFixed(2)}</td>
                  <td>₹{(item.quantity * item.price).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bill-totals">
          <div className="total-section">
            <h4>💵 Amount in INR</h4>
            <p className="amount">₹ {convertedAmounts.inr.toFixed(2)}</p>
          </div>

          <div className="total-section">
            <h4>🔗 Amount in USDT</h4>
            <p className="amount">{convertedAmounts.usdt.toFixed(4)} USDT</p>
          </div>

          <div className="total-section">
            <h4>π Amount in Pi Network</h4>
            <p className="amount">{convertedAmounts.pi.toFixed(4)} π</p>
          </div>
        </div>

        <div className="bill-rates">
          <h4>Exchange Rates:</h4>
          <p>1 USDT = ₹{rates.usdtToInr.toFixed(2)}</p>
          <p>1 π = ₹{rates.piToInr.toFixed(2)}</p>
        </div>

        <div className="bill-actions">
          <button onClick={handlePrint} className="btn btn-primary">
            <Download size={18} /> Print
          </button>
          <button onClick={handleCopy} className={`btn ${copied ? 'btn-success' : 'btn-secondary'}`}>
            <Copy size={18} /> {copied ? 'Copied!' : 'Copy'}
          </button>
          <button onClick={handleShare} className="btn btn-secondary">
            <Share2 size={18} /> Share
          </button>
        </div>
      </div>
    </div>
  )
}
