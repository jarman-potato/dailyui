/**
 * Daily UI #001 - Sign Up
 * Created by jarman-potato 🥔
 * 2026-02-03
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signupForm');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const togglePasswordBtn = document.querySelector('.toggle-password');
  const strengthBar = document.querySelector('.strength-bar');
  const submitBtn = document.querySelector('.submit-btn');
  const successMessage = document.getElementById('successMessage');

  // Toggle password visibility
  togglePasswordBtn.addEventListener('click', () => {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    togglePasswordBtn.setAttribute('aria-label', 
      type === 'password' ? 'パスワードを表示' : 'パスワードを隠す'
    );
  });

  // Password strength checker
  passwordInput.addEventListener('input', () => {
    const password = passwordInput.value;
    const strength = checkPasswordStrength(password);
    
    strengthBar.className = 'strength-bar';
    if (password.length > 0) {
      strengthBar.classList.add(strength);
    }
  });

  function checkPasswordStrength(password) {
    let score = 0;
    
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;
    
    if (score <= 2) return 'weak';
    if (score <= 4) return 'medium';
    return 'strong';
  }

  // Real-time validation
  function validateField(input, validator) {
    const errorSpan = input.closest('.form-group').querySelector('.error-message');
    const result = validator(input.value);
    
    input.classList.remove('error', 'valid');
    
    if (input.value === '') {
      errorSpan.textContent = '';
      return false;
    }
    
    if (result.valid) {
      input.classList.add('valid');
      errorSpan.textContent = '';
      return true;
    } else {
      input.classList.add('error');
      errorSpan.textContent = result.message;
      return false;
    }
  }

  const validators = {
    name: (value) => {
      if (value.trim().length < 2) {
        return { valid: false, message: '名前は2文字以上で入力してください' };
      }
      return { valid: true };
    },
    email: (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return { valid: false, message: '有効なメールアドレスを入力してください' };
      }
      return { valid: true };
    },
    password: (value) => {
      if (value.length < 8) {
        return { valid: false, message: 'パスワードは8文字以上で入力してください' };
      }
      return { valid: true };
    }
  };

  nameInput.addEventListener('blur', () => validateField(nameInput, validators.name));
  emailInput.addEventListener('blur', () => validateField(emailInput, validators.email));
  passwordInput.addEventListener('blur', () => validateField(passwordInput, validators.password));

  // Form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const isNameValid = validateField(nameInput, validators.name);
    const isEmailValid = validateField(emailInput, validators.email);
    const isPasswordValid = validateField(passwordInput, validators.password);
    
    if (!isNameValid || !isEmailValid || !isPasswordValid) {
      // Shake animation for invalid form
      form.style.animation = 'none';
      form.offsetHeight; // Trigger reflow
      form.style.animation = 'shake 0.5s ease-in-out';
      return;
    }
    
    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Show success message
    successMessage.classList.add('show');
    
    // Reset form after delay
    setTimeout(() => {
      form.reset();
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
      strengthBar.className = 'strength-bar';
      
      // Hide success after showing
      setTimeout(() => {
        successMessage.classList.remove('show');
      }, 3000);
    }, 500);
  });
});

// Add shake animation to stylesheet
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
  }
`;
document.head.appendChild(style);
