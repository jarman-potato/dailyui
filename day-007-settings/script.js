// Toggle handlers with haptic feedback simulation
document.querySelectorAll('.toggle input').forEach(toggle => {
  toggle.addEventListener('change', (e) => {
    const label = e.target.closest('.setting-item').querySelector('.setting-label').textContent;
    const state = e.target.checked ? 'enabled' : 'disabled';
    
    showToast(`${label} ${state}`);
    
    // Special handling for dark mode
    if (e.target.id === 'darkMode') {
      document.body.style.transition = 'background 0.3s, color 0.3s';
      // In a real app, this would toggle the theme
    }
  });
});

// Clickable setting items
document.querySelectorAll('.setting-item').forEach(item => {
  if (!item.querySelector('.toggle')) {
    item.addEventListener('click', () => {
      const label = item.querySelector('.setting-label')?.textContent;
      if (label) {
        if (label === 'Clear Data') {
          if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
            showToast('Data cleared 🗑️');
          }
        } else {
          showToast(`Opening ${label}...`);
        }
      }
    });
  }
});

// Back button
document.querySelector('.back-btn').addEventListener('click', () => {
  showToast('Going back... ←');
});

// Logout button
document.querySelector('.logout-btn').addEventListener('click', () => {
  if (confirm('Are you sure you want to log out?')) {
    showToast('Logging out... 👋');
  }
});

// Toast notification
function showToast(message) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 12px 24px;
    border-radius: 12px;
    font-size: 14px;
    z-index: 1000;
    animation: slideUp 0.3s ease;
    backdrop-filter: blur(10px);
  `;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideDown 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

// Add animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideUp {
    from { opacity: 0; transform: translate(-50%, 20px); }
    to { opacity: 1; transform: translate(-50%, 0); }
  }
  @keyframes slideDown {
    from { opacity: 1; transform: translate(-50%, 0); }
    to { opacity: 0; transform: translate(-50%, -20px); }
  }
`;
document.head.appendChild(style);

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    showToast('Going back... ←');
  }
});

console.log('🥔 Settings page loaded!');
