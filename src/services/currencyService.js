import axios from 'axios'

const COINGECKO_API = 'https://api.coingecko.com/api/v3'

// Cache for exchange rates
let rateCache = {
  lastUpdated: 0,
  rates: {}
}

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export const currencyService = {
  // Get real-time exchange rates from CoinGecko
  async getExchangeRates() {
    try {
      const now = Date.now()
      
      // Return cached rates if still fresh
      if (rateCache.lastUpdated && now - rateCache.lastUpdated < CACHE_DURATION) {
        return rateCache.rates
      }

      // Fetch USDT price in INR
      const response = await axios.get(`${COINGECKO_API}/simple/price`, {
        params: {
          ids: 'tether,pi-network',
          vs_currencies: 'inr,usd',
          include_market_cap: false,
          include_24hr_vol: false,
          include_last_updated_at: true
        }
      })

      const data = response.data

      // USDT rates
      const usdtInInr = data.tether?.inr || 83
      const usdtInUsd = data.tether?.usd || 1

      // Pi Network rates (fallback values if not available)
      const piInInr = data['pi-network']?.inr || 150
      const piInUsd = data['pi-network']?.usd || 1.8

      const rates = {
        usdtToInr: usdtInInr,
        usdtToUsd: usdtInUsd,
        piToInr: piInInr,
        piToUsd: piInUsd,
        inrToUsd: 1 / 83,
        usdToInr: 83,
        timestamp: now
      }

      // Update cache
      rateCache = {
        lastUpdated: now,
        rates
      }

      return rates
    } catch (error) {
      console.error('Error fetching exchange rates:', error)
      
      // Return cached rates even if expired, or fallback rates
      if (rateCache.rates && Object.keys(rateCache.rates).length > 0) {
        return rateCache.rates
      }

      // Fallback rates
      return {
        usdtToInr: 83,
        usdtToUsd: 1,
        piToInr: 150,
        piToUsd: 1.8,
        inrToUsd: 1 / 83,
        usdToInr: 83,
        timestamp: Date.now()
      }
    }
  },

  // Convert currency
  async convertCurrency(amount, fromCurrency, toCurrency) {
    const rates = await this.getExchangeRates()

    if (fromCurrency === toCurrency) {
      return amount
    }

    const conversions = {
      'USD_TO_INR': amount * rates.usdToInr,
      'INR_TO_USD': amount * rates.inrToUsd,
      'USDT_TO_INR': amount * rates.usdtToInr,
      'INR_TO_USDT': amount / rates.usdtToInr,
      'USDT_TO_PI': amount / rates.piToUsd,
      'PI_TO_USDT': amount * rates.piToUsd,
      'INR_TO_PI': amount / rates.piToInr,
      'PI_TO_INR': amount * rates.piToInr,
      'USD_TO_USDT': amount,
      'USDT_TO_USD': amount,
    }

    const key = `${fromCurrency}_TO_${toCurrency}`
    return conversions[key] || amount
  },

  // Format currency display
  formatCurrency(amount, currency) {
    const formattedAmount = parseFloat(amount).toFixed(2)
    
    const symbols = {
      'INR': '₹',
      'USD': '$',
      'USDT': 'USDT',
      'PI': 'π'
    }

    return `${symbols[currency] || currency} ${formattedAmount}`
  },

  // Get display name for currency
  getCurrencyDisplay(currency) {
    const displays = {
      'INR': 'Indian Rupee (₹)',
      'USD': 'US Dollar ($)',
      'USDT': 'Tether (USDT)',
      'PI': 'Pi Network (π)'
    }
    return displays[currency] || currency
  }
}

export default currencyService
