// Add hover animation to icons
document.querySelectorAll('.icon').forEach(icon => {
  icon.addEventListener('mouseenter', () => {
    const potato = icon.querySelector('.potato-icon');
    if (potato) {
      potato.style.animation = 'bounce 0.5s ease';
    }
  });
  
  icon.addEventListener('mouseleave', () => {
    const potato = icon.querySelector('.potato-icon');
    if (potato) {
      potato.style.animation = '';
    }
  });
});

// Add bounce animation
const style = document.createElement('style');
style.textContent = `
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }
`;
document.head.appendChild(style);

// Click to copy color info
document.querySelectorAll('.icon-card').forEach(card => {
  card.addEventListener('click', () => {
    const label = card.querySelector('.label').textContent;
    
    // Show toast
    const toast = document.createElement('div');
    toast.textContent = `${label} icon selected! 🥔`;
    toast.style.cssText = `
      position: fixed;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 14px;
      z-index: 1000;
      animation: fadeIn 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.animation = 'fadeOut 0.3s ease forwards';
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  });
});

// Add fade animations
const fadeStyle = document.createElement('style');
fadeStyle.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translate(-50%, 20px); }
    to { opacity: 1; transform: translate(-50%, 0); }
  }
  @keyframes fadeOut {
    from { opacity: 1; transform: translate(-50%, 0); }
    to { opacity: 0; transform: translate(-50%, -20px); }
  }
`;
document.head.appendChild(fadeStyle);

console.log('🥔 Potato AI App Icons loaded!');
