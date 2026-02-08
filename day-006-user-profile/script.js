// Tab switching
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    // Remove active from all tabs
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    
    // Add active to clicked tab
    tab.classList.add('active');
    const tabId = tab.dataset.tab;
    document.getElementById(tabId).classList.add('active');
  });
});

// Follow button toggle
const followBtn = document.querySelector('.btn.primary');
let isFollowing = false;

followBtn.addEventListener('click', () => {
  isFollowing = !isFollowing;
  followBtn.textContent = isFollowing ? 'Following ✓' : 'Follow';
  followBtn.style.background = isFollowing ? 'var(--card-hover)' : '';
  followBtn.style.color = isFollowing ? 'var(--text)' : '';
  
  // Update follower count
  const followerStat = document.querySelector('.stat-value');
  if (followerStat) {
    const current = followerStat.textContent;
    if (current === '1.2k') {
      followerStat.textContent = isFollowing ? '1.2k' : '1.2k';
    }
  }
  
  showToast(isFollowing ? 'Following jarman-potato! 🥔' : 'Unfollowed');
});

// Message button
document.querySelector('.btn.secondary').addEventListener('click', () => {
  showToast('Opening chat... 💬');
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

// Post card hover effects
document.querySelectorAll('.post-card, .project-card').forEach(card => {
  card.style.cursor = 'pointer';
  card.style.transition = 'transform 0.2s, box-shadow 0.2s';
  
  card.addEventListener('mouseenter', () => {
    card.style.transform = 'translateY(-2px)';
    card.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.boxShadow = '';
  });
});

console.log('🥔 User Profile loaded!');
