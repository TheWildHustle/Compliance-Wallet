// Helper function to fetch data from a URL
async function fetchData(url, method = 'GET', data = null) {
    const headers = {
        'Content-Type': 'application/json',
        'X-API-Key': 'dc478748127e4682a0704de9dcf3eed3' // Example API Key
    };

    const response = await fetch(url, {
        method,
        headers,
        body: data ? JSON.stringify(data) : null
    });
    return response.json();
}

// Get bitcoin price and update UI
async function getBitcoinPrice() {
    const data = await fetchData('https://api.coinbase.com/v2/prices/BTC-USD/spot');
    const price = data.data.amount;
    document.getElementById('price').textContent = `$${Number(price).toLocaleString()}`;
}

// Get wallet balance and update UI
async function getLnbitsBalance() {
    const data = await fetchData('https://legend.lnbits.com/api/v1/wallet');
    const balance = data.balance / 1000; // Convert to satoshis
    document.getElementById('balance').textContent = `${balance.toLocaleString()} sats`;
}

// Show or hide invoice input areas
function toggleDisplay(elementId) {
    const element = document.getElementById(elementId);
    element.style.display = element.style.display === 'block' ? 'none' : 'block';
}

// Event listeners for Send and Receive buttons
document.getElementById('sendBtn').addEventListener('click', () => {
    toggleDisplay('pasteInvoice');
    document.querySelector('.invoiceToPay').value = ''; // Reset input
});

document.getElementById('receiveBtn').addEventListener('click', () => {
    toggleDisplay('createInvoice');
    document.querySelector('.amountOfNewInvoice').value = ''; // Reset input
});

// Create a new invoice
async function createInvoice(amount) {
    const data = {
        out: false,
        amount,
        memo: 'LNBits'
    };
    const response = await fetchData('https://legend.lnbits.com/api/v1/payments', 'POST', data);
    const invoice = response.payment_request;
    document.getElementById('createInvoice').insertAdjacentHTML('beforeend', `<p>${invoice}</p>`);
}

// Submit an invoice for payment
async function submitInvoiceToPay(invoice) {
    if (!confirm(`Are you sure you want to pay this invoice? ${invoice}`)) return;

    const data = {
        out: true,
        bolt11: invoice
    };
    const response = await fetchData('https://legend.lnbits.com/api/v1/payments', 'POST', data);
    document.getElementById('pasteInvoice').insertAdjacentHTML('beforeend', `<p>${JSON.stringify(response)}</p>`);
}

// Initialize the application
async function initializeApp() {
    await getBitcoinPrice();
    await getLnbitsBalance();
}

// Call initializeApp to set everything in motion
initializeApp();
