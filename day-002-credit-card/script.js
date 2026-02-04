/**
 * Day 002 - Credit Card Checkout | DailyUI
 * by jarman-potato 🥔
 * 
 * Features:
 * - Real-time card preview
 * - Card number formatting (spaces every 4 digits)
 * - Card type detection (Visa, Mastercard, Amex, Discover)
 * - Expiry date formatting (MM/YY)
 * - Basic validation
 * - Smooth animations
 */

// DOM Elements
const cardNumber = document.getElementById('cardNumber');
const cardName = document.getElementById('cardName');
const expiry = document.getElementById('expiry');
const cvv = document.getElementById('cvv');
const cardType = document.getElementById('cardType');
const form = document.getElementById('checkoutForm');

// Preview Elements
const previewNumber = document.getElementById('previewNumber');
const previewName = document.getElementById('previewName');
const previewExpiry = document.getElementById('previewExpiry');
const cardElement = document.querySelector('.card');
const cardLogo = document.querySelector('.card-logo');

// Card Type Detection Patterns
const cardPatterns = {
    visa: /^4/,
    mastercard: /^5[1-5]/,
    amex: /^3[47]/,
    discover: /^6(?:011|5)/,
    jcb: /^35/,
    diners: /^3(?:0[0-5]|[68])/
};

const cardEmojis = {
    visa: '💳',
    mastercard: '💳',
    amex: '💳',
    discover: '💳',
    jcb: '💳',
    diners: '💳',
    unknown: ''
};

const cardNames = {
    visa: 'VISA',
    mastercard: 'MASTERCARD',
    amex: 'AMEX',
    discover: 'DISCOVER',
    jcb: 'JCB',
    diners: 'DINERS',
    unknown: 'CARD'
};

// Detect Card Type
function detectCardType(number) {
    const cleanNumber = number.replace(/\s/g, '');
    for (const [type, pattern] of Object.entries(cardPatterns)) {
        if (pattern.test(cleanNumber)) {
            return type;
        }
    }
    return 'unknown';
}

// Format Card Number (add spaces)
function formatCardNumber(value) {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
        parts.push(match.substring(i, i + 4));
    }
    
    return parts.length ? parts.join(' ') : value.replace(/[^0-9]/gi, '');
}

// Format Expiry Date
function formatExpiry(value) {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
        return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
}

// Update Card Preview
function updatePreview() {
    // Update number
    const number = cardNumber.value || '';
    const formatted = number || '•••• •••• •••• ••••';
    previewNumber.textContent = formatted.padEnd(19, ' ').replace(/(\s{4})/g, '$1 ').trim() || '•••• •••• •••• ••••';
    
    // Update name
    previewName.textContent = cardName.value.toUpperCase() || 'YOUR NAME';
    
    // Update expiry
    previewExpiry.textContent = expiry.value || 'MM/YY';
    
    // Update card type
    const type = detectCardType(number);
    cardType.textContent = cardEmojis[type];
    cardLogo.textContent = cardNames[type];
    
    // Change card gradient based on type
    updateCardStyle(type);
}

// Update Card Style based on Type
function updateCardStyle(type) {
    const gradients = {
        visa: 'linear-gradient(135deg, #1a1f71 0%, #00579f 100%)',
        mastercard: 'linear-gradient(135deg, #eb001b 0%, #f79e1b 100%)',
        amex: 'linear-gradient(135deg, #006fcf 0%, #00a1e0 100%)',
        discover: 'linear-gradient(135deg, #ff6000 0%, #ffb300 100%)',
        jcb: 'linear-gradient(135deg, #0066a1 0%, #00a550 100%)',
        diners: 'linear-gradient(135deg, #004c97 0%, #0066b2 100%)',
        unknown: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
    };
    
    cardElement.style.background = gradients[type] || gradients.unknown;
}

// Validate Card Number (Luhn Algorithm)
function validateCardNumber(number) {
    const cleanNumber = number.replace(/\s/g, '');
    if (cleanNumber.length < 13 || cleanNumber.length > 19) return false;
    
    let sum = 0;
    let isEven = false;
    
    for (let i = cleanNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cleanNumber[i], 10);
        
        if (isEven) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }
        
        sum += digit;
        isEven = !isEven;
    }
    
    return sum % 10 === 0;
}

// Validate Expiry
function validateExpiry(value) {
    const parts = value.split('/');
    if (parts.length !== 2) return false;
    
    const month = parseInt(parts[0], 10);
    const year = parseInt('20' + parts[1], 10);
    
    if (month < 1 || month > 12) return false;
    
    const now = new Date();
    const expDate = new Date(year, month);
    
    return expDate > now;
}

// Event Listeners

// Card Number Input
cardNumber.addEventListener('input', (e) => {
    e.target.value = formatCardNumber(e.target.value);
    updatePreview();
    
    // Validate
    const isValid = validateCardNumber(e.target.value);
    e.target.classList.toggle('valid', isValid && e.target.value.length >= 16);
    e.target.classList.toggle('invalid', !isValid && e.target.value.length >= 16);
});

// Card Name Input
cardName.addEventListener('input', () => {
    updatePreview();
});

// Expiry Input
expiry.addEventListener('input', (e) => {
    e.target.value = formatExpiry(e.target.value);
    updatePreview();
    
    // Validate
    if (e.target.value.length === 5) {
        const isValid = validateExpiry(e.target.value);
        e.target.classList.toggle('valid', isValid);
        e.target.classList.toggle('invalid', !isValid);
    }
});

// CVV Input - Show card back hint
cvv.addEventListener('focus', () => {
    // Could add card flip animation here
    cardElement.style.transform = 'scale(0.95)';
});

cvv.addEventListener('blur', () => {
    cardElement.style.transform = 'scale(1)';
});

cvv.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
    
    // Validate CVV length
    const type = detectCardType(cardNumber.value);
    const expectedLength = type === 'amex' ? 4 : 3;
    
    e.target.classList.toggle('valid', e.target.value.length === expectedLength);
    e.target.classList.toggle('invalid', e.target.value.length > 0 && e.target.value.length !== expectedLength);
});

// Form Submit
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Validate all fields
    const isCardValid = validateCardNumber(cardNumber.value);
    const isExpiryValid = validateExpiry(expiry.value);
    const isNameValid = cardName.value.trim().length > 0;
    const isCvvValid = cvv.value.length >= 3;
    
    if (isCardValid && isExpiryValid && isNameValid && isCvvValid) {
        // Success animation
        const button = form.querySelector('.pay-button');
        button.classList.add('success');
        button.querySelector('.button-text').textContent = 'Payment Successful';
        button.querySelector('.button-icon').textContent = '✓';
        
        // Reset after 3 seconds (demo)
        setTimeout(() => {
            button.classList.remove('success');
            button.querySelector('.button-text').textContent = 'Pay $104.00';
            button.querySelector('.button-icon').textContent = '→';
        }, 3000);
    } else {
        // Shake animation for invalid fields
        if (!isCardValid) cardNumber.classList.add('invalid');
        if (!isExpiryValid) expiry.classList.add('invalid');
        if (!isNameValid) cardName.classList.add('invalid');
        if (!isCvvValid) cvv.classList.add('invalid');
    }
});

// Initialize
updatePreview();

// Add some demo card numbers for testing (hover tooltip would be nice)
console.log('🥔 DailyUI Day 002 - Credit Card Checkout');
console.log('Test cards: 4111 1111 1111 1111 (Visa), 5500 0000 0000 0004 (MC)');
