const appID = '8abcdb6dab7f453aacf4e5489c8526c0';
const topCurrencies = {
    "UAH": "🇺🇦",
    "USD": "🇺🇸",
    "EUR": "🇪🇺",
    "PLN": "🇵🇱",
    "GBP": "🇬🇧",
    "CHF": "🇨🇭",
    "CAD": "🇨🇦",
    "CNY": "🇨🇳",
    "TRY": "🇹🇷",
    "ILS": "🇮🇱",
    "BTC": "₿"
};

let lastAmount = null;

$(document).ready(function() {
    $('#currencyInput').on('input', function() {
        const input = $(this).val().toUpperCase();
        const matches = input.match(/(\d+\.?\d*)\s*([A-Z]{3})?/);
        if (matches) {
            lastAmount = matches[1];
            const currency = matches[2];
            if (currency && topCurrencies.hasOwnProperty(currency)) {
                $('#currencyDropdown').val(currency);
                convertCurrency(lastAmount, currency);
            } else {
                const dropdownCurrency = $('#currencyDropdown').val();
                convertCurrency(lastAmount, dropdownCurrency);
            }
        }
    });

    $('#currencyDropdown').on('change', function() {
        const dropdownCurrency = $(this).val();
        if (lastAmount) {
            convertCurrency(lastAmount, dropdownCurrency);
        } else {
            const input = $('#currencyInput').val().toUpperCase();
            const matches = input.match(/(\d+\.?\d*)/);
            if (matches) {
                lastAmount = matches[1];
                convertCurrency(lastAmount, dropdownCurrency);
            }
        }
    });
});

function convertCurrency(amount, fromCurrency) {
    $.getJSON(`https://openexchangerates.org/api/latest.json?app_id=${appID}`, function(data) {
        const rates = data.rates;
        const results = Object.keys(topCurrencies).map(currency => {
            const convertedAmount = amount * (rates[currency] / rates[fromCurrency]);
            const formattedAmount = formatNumber(convertedAmount.toFixed(2));
            return `
                <div class="currency-result">
                    ${formattedAmount} ${currency} ${topCurrencies[currency]}
                    <button class="copy-button" onclick="copyToClipboard('${formattedAmount}')"></button>
                </div>
            `;
        }).join('');
        $('#conversionResults').html(results);
        $('.results').show(); // Show the results div when there are results
    });
}

function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function copyToClipboard(text) {
    const tempInput = document.createElement('input');
    tempInput.style.position = 'absolute';
    tempInput.style.left = '-9999px';
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
}
