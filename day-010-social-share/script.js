/**
 * Day 010 - Social Share
 * DailyUI Challenge
 * Made with 🥔 by jarman-potato
 */

class SocialShare {
    constructor() {
        // Elements
        this.shareBtn = document.getElementById('shareBtn');
        this.modalOverlay = document.getElementById('modalOverlay');
        this.modal = document.getElementById('shareModal');
        this.closeBtn = document.getElementById('closeModal');
        this.copyBtn = document.getElementById('copyBtn');
        this.copyToast = document.getElementById('copyToast');
        this.confettiContainer = document.getElementById('confettiContainer');
        this.shareOptions = document.querySelectorAll('.share-option');

        // Share data
        this.shareData = {
            title: 'The Art of Being a Potato 🥔',
            text: 'Discover why potatoes make the best UI designers!',
            url: window.location.href
        };

        // Bind events
        this.init();
    }

    init() {
        // Open modal
        this.shareBtn.addEventListener('click', () => this.openModal());

        // Close modal
        this.closeBtn.addEventListener('click', () => this.closeModal());
        this.modalOverlay.addEventListener('click', (e) => {
            if (e.target === this.modalOverlay) {
                this.closeModal();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modalOverlay.classList.contains('active')) {
                this.closeModal();
            }
        });

        // Share options click handlers
        this.shareOptions.forEach(option => {
            option.addEventListener('click', () => {
                const platform = option.dataset.platform;
                this.share(platform);
            });
        });

        // Try native share API first on mobile
        if (navigator.share) {
            this.shareBtn.addEventListener('click', async (e) => {
                if (window.innerWidth <= 768) {
                    e.stopPropagation();
                    try {
                        await navigator.share(this.shareData);
                        this.celebrate();
                    } catch (err) {
                        // User cancelled or error, fall back to modal
                        if (err.name !== 'AbortError') {
                            this.openModal();
                        }
                    }
                }
            }, { capture: true });
        }
    }

    openModal() {
        this.modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus first share option for accessibility
        setTimeout(() => {
            this.shareOptions[0].focus();
        }, 300);

        // Add entrance animation to options
        this.shareOptions.forEach((option, index) => {
            option.style.opacity = '0';
            option.style.transform = 'translateY(20px)';
            setTimeout(() => {
                option.style.transition = 'all 0.3s ease';
                option.style.opacity = '1';
                option.style.transform = 'translateY(0)';
            }, 100 + (index * 50));
        });
    }

    closeModal() {
        this.modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    share(platform) {
        const { title, text, url } = this.shareData;
        const encodedTitle = encodeURIComponent(title);
        const encodedText = encodeURIComponent(text);
        const encodedUrl = encodeURIComponent(url);

        const shareUrls = {
            twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
            reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
            email: `mailto:?subject=${encodedTitle}&body=${encodedText}%0A%0A${encodedUrl}`
        };

        if (platform === 'copy') {
            this.copyToClipboard();
        } else if (shareUrls[platform]) {
            // Animate the button
            const button = document.querySelector(`[data-platform="${platform}"]`);
            button.style.transform = 'scale(0.9)';
            setTimeout(() => {
                button.style.transform = '';
            }, 150);

            // Open share URL
            window.open(shareUrls[platform], '_blank', 'width=600,height=400,noopener,noreferrer');
            
            // Celebrate!
            this.celebrate();
            
            // Close modal after a short delay
            setTimeout(() => {
                this.closeModal();
            }, 500);
        }
    }

    async copyToClipboard() {
        try {
            await navigator.clipboard.writeText(this.shareData.url);
            this.showCopyToast();
            this.celebrate();
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = this.shareData.url;
            textArea.style.position = 'fixed';
            textArea.style.left = '-9999px';
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                this.showCopyToast();
                this.celebrate();
            } catch (e) {
                console.error('Failed to copy:', e);
            }
            document.body.removeChild(textArea);
        }
    }

    showCopyToast() {
        this.copyToast.classList.add('show');
        setTimeout(() => {
            this.copyToast.classList.remove('show');
        }, 2500);
    }

    celebrate() {
        // Create confetti explosion!
        const colors = ['#8B5CF6', '#F59E0B', '#10B981', '#EF4444', '#3B82F6', '#EC4899'];
        const shapes = ['circle', 'square', 'triangle'];
        
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                this.createConfetti(colors, shapes);
            }, i * 20);
        }
    }

    createConfetti(colors, shapes) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        
        const color = colors[Math.floor(Math.random() * colors.length)];
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        const left = Math.random() * 100;
        const size = Math.random() * 8 + 6;
        const duration = Math.random() * 2 + 2;

        confetti.style.left = `${left}%`;
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        confetti.style.background = color;
        confetti.style.animationDuration = `${duration}s`;

        // Different shapes
        if (shape === 'circle') {
            confetti.style.borderRadius = '50%';
        } else if (shape === 'triangle') {
            confetti.style.background = 'transparent';
            confetti.style.borderLeft = `${size/2}px solid transparent`;
            confetti.style.borderRight = `${size/2}px solid transparent`;
            confetti.style.borderBottom = `${size}px solid ${color}`;
        }

        this.confettiContainer.appendChild(confetti);

        // Remove after animation
        setTimeout(() => {
            confetti.remove();
        }, duration * 1000);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new SocialShare();
});

// Easter egg: Konami code triggers mega confetti
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        // MEGA CELEBRATION! 🎉
        const socialShare = new SocialShare();
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                socialShare.celebrate();
            }, i * 200);
        }
    }
});

console.log('🥔 Day 010: Social Share loaded!');
console.log('💡 Tip: Try the Konami code for a surprise! ↑↑↓↓←→←→BA');
