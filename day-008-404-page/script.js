// Eye tracking - pupils follow cursor
document.addEventListener('mousemove', (e) => {
  const pupils = document.querySelectorAll('.pupil');
  const potato = document.getElementById('potato');
  
  if (!potato) return;
  
  const potatoRect = potato.getBoundingClientRect();
  const potatoCenterX = potatoRect.left + potatoRect.width / 2;
  const potatoCenterY = potatoRect.top + potatoRect.height / 2;
  
  const angle = Math.atan2(e.clientY - potatoCenterY, e.clientX - potatoCenterX);
  const distance = 3;
  
  pupils.forEach(pupil => {
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    pupil.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
  });
});

// Create floating particles
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  
  const emojis = ['🥔', '🌱', '✨', '💫', '🍂'];
  const particleCount = 15;
  
  for (let i = 0; i < particleCount; i++) {
    setTimeout(() => {
      createParticle(container, emojis);
    }, i * 500);
  }
  
  // Continue creating particles
  setInterval(() => {
    createParticle(container, emojis);
  }, 2000);
}

function createParticle(container, emojis) {
  const particle = document.createElement('div');
  particle.className = 'particle';
  particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
  particle.style.left = Math.random() * 100 + '%';
  particle.style.animationDuration = (5 + Math.random() * 5) + 's';
  particle.style.animationDelay = Math.random() * 2 + 's';
  
  container.appendChild(particle);
  
  // Remove particle after animation
  setTimeout(() => {
    particle.remove();
  }, 12000);
}

// Navigation functions
function goHome() {
  // In a real app, this would navigate to home
  showToast('ホームページに移動します... 🏠');
  setTimeout(() => {
    window.location.href = '/';
  }, 1000);
}

function goBack() {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    showToast('履歴がありません。ホームに戻ります。');
    setTimeout(() => {
      window.location.href = '/';
    }, 1000);
  }
}

function search() {
  const input = document.getElementById('searchInput');
  const query = input.value.trim();
  
  if (query) {
    showToast(`「${query}」を検索中... 🔍`);
    // In a real app, this would navigate to search results
    setTimeout(() => {
      input.value = '';
    }, 1500);
  } else {
    showToast('検索キーワードを入力してください');
    input.focus();
  }
}

// Toast notification
function showToast(message) {
  // Remove existing toast
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
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 1rem 2rem;
    border-radius: 12px;
    font-size: 0.95rem;
    z-index: 1000;
    animation: toastIn 0.3s ease;
    backdrop-filter: blur(10px);
  `;
  
  // Add animation keyframes
  if (!document.getElementById('toast-styles')) {
    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.textContent = `
      @keyframes toastIn {
        from { opacity: 0; transform: translate(-50%, 20px); }
        to { opacity: 1; transform: translate(-50%, 0); }
      }
      @keyframes toastOut {
        from { opacity: 1; transform: translate(-50%, 0); }
        to { opacity: 0; transform: translate(-50%, -20px); }
      }
    `;
    document.head.appendChild(style);
  }
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'toastOut 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// Enter key for search
document.addEventListener('DOMContentLoaded', () => {
  createParticles();
  
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        search();
      }
    });
  }
  
  // Easter egg: click potato multiple times
  let clickCount = 0;
  const potato = document.getElementById('potato');
  if (potato) {
    potato.addEventListener('click', () => {
      clickCount++;
      if (clickCount >= 5) {
        showToast('🥔 ポテトパワー全開！ ✨');
        potato.style.animation = 'none';
        potato.offsetHeight; // Trigger reflow
        potato.style.animation = 'spin 0.5s ease';
        
        // Add spin animation
        if (!document.getElementById('spin-style')) {
          const style = document.createElement('style');
          style.id = 'spin-style';
          style.textContent = `
            @keyframes spin {
              from { transform: rotate(0deg) scale(1); }
              50% { transform: rotate(180deg) scale(1.2); }
              to { transform: rotate(360deg) scale(1); }
            }
          `;
          document.head.appendChild(style);
        }
        
        setTimeout(() => {
          potato.style.animation = 'float 3s ease-in-out infinite';
        }, 500);
        
        clickCount = 0;
      }
    });
  }
});

// Console easter egg
console.log('%c🥔 404 - Potato Not Found! 🥔', 'font-size: 24px; color: #c9a66b;');
console.log('%cLooking for something? Maybe try the search box!', 'font-size: 14px; color: #94a3b8;');
