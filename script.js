const fromCurrencySelect = document.getElementById('fromCurrency')
const toCurrencySelect = document.getElementById('toCurrency')

const fromCurrencyResult = document.getElementById('fromCurrencyResult')
const toCurrencyResult = document.getElementById('toCurrencyResult')

// Función para cargar las divisas
async function loadCurrencies () {
  try {
    // Solicitar el JSON de las monedas
    const response = await fetch(
      'https://openexchangerates.org/api/currencies.json'
    )
    const currencies = await response.json()

    // Recorrer el JSON y agregar opciones al select
    for (const [code, name] of Object.entries(currencies)) {
      const option = document.createElement('option')
      option.value = code
      option.textContent = `${code} - ${name}`
      fromCurrencySelect.appendChild(option)

      const optionTo = document.createElement('option')
      optionTo.value = code
      optionTo.textContent = `${code} - ${name}`
      toCurrencySelect.appendChild(optionTo)
    }
    selectLocalCurrency()
  } catch (error) {
    console.error('Error al cargar las monedas:', error)
  }
}

function selectLocalCurrency () {
  // Obtener la configuración regional del navegador
  const locale = navigator.language || 'en-US' // Usa 'en-US' como predeterminado si no se puede detectar

  // Usar Intl.NumberFormat para detectar el formato de moneda
  const currencyFormatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD' // Se usará 'USD' como base inicialmente
  })

  // Obtener el código de la moneda local
  const localCurrencyCode = currencyFormatter.resolvedOptions().currency

  // Seleccionar la opción correspondiente en el select
  for (let option of fromCurrencySelect.options) {
    if (option.value === localCurrencyCode) {
      fromCurrencySelect.value = localCurrencyCode // Seleccionar la opción
      break // Salir del bucle una vez encontrada
    }
  }
}

function formatCurrency (currencyCode, value) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2
  })

  // Devolver el valor formateado
  return formatter.format(value)
}

// Función para convertir monedas
async function convertCurrency () {
  const amount = document.getElementById('amount').value
  const fromCurrency = fromCurrencySelect.value
  const toCurrency = toCurrencySelect.value
  const resultDiv = document.getElementById('result')

  if (!amount) {
    resultDiv.innerText = 'Por favor, ingresa una cantidad.'
    resultDiv.classList.add('error')
    return
  }

  const response = await fetch(
    `https://open.er-api.com/v6/latest/${fromCurrency}`
  )
  const data = await response.json()

  const rate = data.rates[toCurrency]
  const convertedAmount = (amount * rate).toFixed(2)

  fromCurrencyResult.innerText = formatCurrency(fromCurrency, amount)
  toCurrencyResult.innerText = formatCurrency(toCurrency, convertedAmount)

  resultDiv.innerHTML = ''
  resultDiv.classList.remove('error')
}

loadCurrencies();
convertCurrency();
