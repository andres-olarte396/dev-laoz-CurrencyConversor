const fromCurrencySelect = document.getElementById('fromCurrency');
const toCurrencySelect = document.getElementById('toCurrency');

// Función para cargar las divisas
async function loadCurrencies() {
    const response = await fetch('https://open.er-api.com/v6/latest/USD');
    const data = await response.json();
    const currencies = Object.keys(data.rates);

    currencies.forEach(currency => {
        const optionFrom = document.createElement('option');
        optionFrom.value = currency;
        optionFrom.textContent = currency;
        fromCurrencySelect.appendChild(optionFrom);

        const optionTo = document.createElement('option');
        optionTo.value = currency;
        optionTo.textContent = currency;
        toCurrencySelect.appendChild(optionTo);
    });
}

// Función para convertir monedas
async function convertCurrency() {
    const amount = document.getElementById('amount').value;
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;
    const resultDiv = document.getElementById('result');

    if (!amount) {
        resultDiv.innerText = "Por favor, ingresa una cantidad.";
        resultDiv.classList.add('error');
        return;
    }

    const response = await fetch(`https://open.er-api.com/v6/latest/${fromCurrency}`);
    const data = await response.json();

    const rate = data.rates[toCurrency];
    const convertedAmount = (amount * rate).toFixed(2);

    resultDiv.innerText = `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`;
    resultDiv.classList.remove('error');
}

// Cargar las divisas al inicio
loadCurrencies();