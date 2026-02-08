class Calculator {
  constructor() {
    this.expressionEl = document.getElementById('expression');
    this.resultEl = document.getElementById('result');
    this.currentValue = '0';
    this.previousValue = '';
    this.operator = null;
    this.shouldResetScreen = false;
    this.expression = '';
    
    this.init();
  }
  
  init() {
    // Button clicks
    document.querySelectorAll('.key').forEach(key => {
      key.addEventListener('click', () => this.handleKey(key));
    });
    
    // Keyboard support
    document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    
    // Potato easter egg
    document.querySelector('.potato-mascot').addEventListener('click', () => {
      this.resultEl.textContent = '🥔';
      setTimeout(() => {
        this.resultEl.textContent = this.currentValue;
      }, 500);
    });
  }
  
  handleKey(key) {
    const value = key.dataset.value;
    const action = key.dataset.action;
    
    if (value !== undefined) {
      this.inputNumber(value);
    } else if (action) {
      this.handleAction(action);
    }
    
    this.updateDisplay();
  }
  
  handleKeyboard(e) {
    const key = e.key;
    
    if (/[0-9]/.test(key)) {
      this.inputNumber(key);
    } else if (key === '.') {
      this.handleAction('decimal');
    } else if (key === '+') {
      this.handleAction('add');
    } else if (key === '-') {
      this.handleAction('subtract');
    } else if (key === '*') {
      this.handleAction('multiply');
    } else if (key === '/') {
      e.preventDefault();
      this.handleAction('divide');
    } else if (key === '%') {
      this.handleAction('percent');
    } else if (key === 'Enter' || key === '=') {
      this.handleAction('equals');
    } else if (key === 'Escape' || key === 'c' || key === 'C') {
      this.handleAction('clear');
    } else if (key === 'Backspace') {
      this.backspace();
    }
    
    this.updateDisplay();
  }
  
  inputNumber(num) {
    if (this.shouldResetScreen) {
      this.currentValue = num;
      this.shouldResetScreen = false;
    } else {
      if (this.currentValue === '0' && num !== '.') {
        this.currentValue = num;
      } else if (this.currentValue.length < 12) {
        this.currentValue += num;
      }
    }
  }
  
  handleAction(action) {
    switch (action) {
      case 'clear':
        this.clear();
        break;
      case 'toggle':
        this.toggleSign();
        break;
      case 'percent':
        this.percent();
        break;
      case 'decimal':
        this.addDecimal();
        break;
      case 'add':
      case 'subtract':
      case 'multiply':
      case 'divide':
        this.setOperator(action);
        break;
      case 'equals':
        this.calculate();
        break;
    }
  }
  
  clear() {
    this.currentValue = '0';
    this.previousValue = '';
    this.operator = null;
    this.expression = '';
    this.clearActiveOperator();
  }
  
  toggleSign() {
    if (this.currentValue !== '0') {
      this.currentValue = this.currentValue.startsWith('-') 
        ? this.currentValue.slice(1) 
        : '-' + this.currentValue;
    }
  }
  
  percent() {
    this.currentValue = String(parseFloat(this.currentValue) / 100);
  }
  
  addDecimal() {
    if (this.shouldResetScreen) {
      this.currentValue = '0.';
      this.shouldResetScreen = false;
      return;
    }
    if (!this.currentValue.includes('.')) {
      this.currentValue += '.';
    }
  }
  
  setOperator(op) {
    if (this.operator && !this.shouldResetScreen) {
      this.calculate();
    }
    
    this.previousValue = this.currentValue;
    this.operator = op;
    this.shouldResetScreen = true;
    
    const opSymbol = this.getOperatorSymbol(op);
    this.expression = `${this.formatNumber(this.previousValue)} ${opSymbol}`;
    
    this.setActiveOperator(op);
  }
  
  getOperatorSymbol(op) {
    const symbols = {
      add: '+',
      subtract: '−',
      multiply: '×',
      divide: '÷'
    };
    return symbols[op] || op;
  }
  
  calculate() {
    if (!this.operator || !this.previousValue) return;
    
    const prev = parseFloat(this.previousValue);
    const curr = parseFloat(this.currentValue);
    let result;
    
    switch (this.operator) {
      case 'add':
        result = prev + curr;
        break;
      case 'subtract':
        result = prev - curr;
        break;
      case 'multiply':
        result = prev * curr;
        break;
      case 'divide':
        result = curr === 0 ? 'Error' : prev / curr;
        break;
    }
    
    if (result === 'Error') {
      this.currentValue = 'Error';
    } else {
      // Round to avoid floating point issues
      result = Math.round(result * 1e10) / 1e10;
      this.currentValue = String(result);
    }
    
    this.expression = '';
    this.previousValue = '';
    this.operator = null;
    this.shouldResetScreen = true;
    this.clearActiveOperator();
  }
  
  backspace() {
    if (this.currentValue.length > 1) {
      this.currentValue = this.currentValue.slice(0, -1);
    } else {
      this.currentValue = '0';
    }
  }
  
  setActiveOperator(op) {
    this.clearActiveOperator();
    const opMap = {
      add: '+',
      subtract: '−',
      multiply: '×',
      divide: '÷'
    };
    const symbol = opMap[op];
    document.querySelectorAll('.key.operator').forEach(key => {
      if (key.textContent === symbol) {
        key.classList.add('active');
      }
    });
  }
  
  clearActiveOperator() {
    document.querySelectorAll('.key.operator').forEach(key => {
      key.classList.remove('active');
    });
  }
  
  formatNumber(numStr) {
    const num = parseFloat(numStr);
    if (isNaN(num)) return numStr;
    
    // Format with commas for display
    const parts = numStr.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }
  
  updateDisplay() {
    this.expressionEl.textContent = this.expression;
    
    let displayValue = this.currentValue;
    if (displayValue !== 'Error' && !isNaN(parseFloat(displayValue))) {
      displayValue = this.formatNumber(displayValue);
    }
    
    this.resultEl.textContent = displayValue;
    
    // Shrink text if too long
    if (displayValue.length > 10) {
      this.resultEl.classList.add('shrink');
    } else {
      this.resultEl.classList.remove('shrink');
    }
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  new Calculator();
});
