const Fly = require('flyio/dist/npm/wx')
const fly = new Fly()

/*
  q: ${from}_${to}
*/
const currency = currencyConverter => fly.get('http://free.currencyconverterapi.com/api/v5/convert', {
  q: currencyConverter,
  compact: 'y'
})

const tendency = ({baseCurrency, quoteCurrency, startDate, endDate}) => fly.get('https://www.oanda.com/fx-for-business/historical-rates/api/data/update/', {
  source: 'OANDA',
  adjustment: '0',
  period: 'daily',
  price: 'bid',
  view: 'graph',
  base_currency: baseCurrency,
  quote_currency_0: quoteCurrency,
  start_date: startDate,
  end_date: endDate
})

export const api = {
  fly,
  currency,
  tendency
}
