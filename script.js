class ClubLoulou {
    constructor() {
        this.currentLanguage = 'fr';
        this.memberCount = 1;
        this.init();
    }

    init() {
        this.setupThemeToggle();
        this.setupLanguageToggle();
        this.setupRegistrationForm();
        this.setupModal();
        this.updateMemberCount();
        
        // Initialize theme based on user preference
        const savedTheme = localStorage.getItem('club-loulou-theme');
        if (savedTheme) {
            document.body.setAttribute('data-theme', savedTheme);
        } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.body.setAttribute('data-theme', 'dark');
        }

        // Initialize language based on browser preference
        const browserLang = navigator.language.startsWith('en') ? 'en' : 'fr';
        const savedLang = localStorage.getItem('club-loulou-language') || browserLang;
        this.setLanguage(savedLang);
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.body.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.body.setAttribute('data-theme', newTheme);
            localStorage.setItem('club-loulou-theme', newTheme);
            
            // Add a fun animation
            themeToggle.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                themeToggle.style.transform = 'rotate(0deg)';
            }, 300);
        });
    }

    setupLanguageToggle() {
        const languageSelect = document.getElementById('language-select');
        languageSelect.addEventListener('change', (e) => {
            this.setLanguage(e.target.value);
        });
    }

    setLanguage(lang) {
        this.currentLanguage = lang;
        document.documentElement.lang = lang;
        document.getElementById('language-select').value = lang;
        localStorage.setItem('club-loulou-language', lang);
        
        // Update all translatable elements
        const elements = document.querySelectorAll('[data-fr][data-en]');
        elements.forEach(element => {
            const text = element.getAttribute(`data-${lang}`);
            if (text) {
                if (element.tagName === 'INPUT' && element.type === 'submit') {
                    element.value = text;
                } else {
                    element.textContent = text;
                }
            }
        });

        // Update page title
        const titles = {
            fr: "Club Loulou - Exclusivement pour Louis et Louise",
            en: "Club Loulou - Exclusively for Louis and Louise"
        };
        document.title = titles[lang];
    }

    setupRegistrationForm() {
        const form = document.getElementById('registration-form');
        const firstNameInput = document.getElementById('firstName');
        const nameError = document.getElementById('name-error');

        // Real-time name validation
        firstNameInput.addEventListener('input', () => {
            this.validateName(firstNameInput.value);
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegistration(form);
        });
    }

    validateName(name) {
        const nameError = document.getElementById('name-error');
        const trimmedName = name.trim().toLowerCase();
        
        const validNames = ['louis', 'louise'];
        const isValid = validNames.some(validName => 
            trimmedName === validName || 
            trimmedName.startsWith(validName + ' ') ||
            trimmedName.startsWith(validName + '-')
        );

        if (name && !isValid) {
            const errorMessages = {
                fr: "Désolé, seuls les prénoms Louis et Louise sont acceptés !",
                en: "Sorry, only the names Louis and Louise are accepted!"
            };
            nameError.textContent = errorMessages[this.currentLanguage];
            nameError.style.display = 'block';
            return false;
        } else {
            nameError.textContent = '';
            nameError.style.display = 'none';
            return true;
        }
    }

    handleRegistration(form) {
        const formData = new FormData(form);
        const firstName = formData.get('firstName');
        const lastName = formData.get('lastName');
        const email = formData.get('email');
        const birthYear = formData.get('birthYear');

        // Validate name one more time
        if (!this.validateName(firstName)) {
            return;
        }

        // Simulate registration process
        this.showLoadingState();
        
        setTimeout(() => {
            this.hideLoadingState();
            this.showSuccessModal(firstName);
            this.incrementMemberCount();
            form.reset();
        }, 2000);
    }

    showLoadingState() {
        const submitBtn = document.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';
        
        const loadingTexts = {
            fr: "Inscription en cours...",
            en: "Registration in progress..."
        };
        
        submitBtn.textContent = loadingTexts[this.currentLanguage];
        submitBtn.setAttribute('data-original-text', originalText);
    }

    hideLoadingState() {
        const submitBtn = document.querySelector('.submit-btn');
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        submitBtn.textContent = submitBtn.getAttribute('data-original-text');
    }

    setupModal() {
        const modal = document.getElementById('success-modal');
        const closeBtn = document.querySelector('.close');

        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    showSuccessModal(firstName) {
        const modal = document.getElementById('success-modal');
        const successMessage = document.getElementById('success-message');
        
        const messages = {
            fr: `Félicitations ${firstName} ! Bienvenue dans le Club Loulou ! Vous êtes maintenant un membre officiel.`,
            en: `Congratulations ${firstName}! Welcome to Club Loulou! You are now an official member.`
        };
        
        successMessage.textContent = messages[this.currentLanguage];
        modal.style.display = 'block';

        // Add confetti effect
        this.createConfetti();
    }

    createConfetti() {
        const colors = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#ef4444'];
        const confettiCount = 50;

        for (let i = 0; i < confettiCount; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.style.position = 'fixed';
                confetti.style.left = Math.random() * 100 + 'vw';
                confetti.style.top = '-10px';
                confetti.style.width = '10px';
                confetti.style.height = '10px';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.borderRadius = '50%';
                confetti.style.pointerEvents = 'none';
                confetti.style.zIndex = '9999';
                confetti.style.animation = `confettiFall ${2 + Math.random() * 3}s linear forwards`;
                
                document.body.appendChild(confetti);
                
                setTimeout(() => {
                    confetti.remove();
                }, 5000);
            }, i * 50);
        }
    }

    incrementMemberCount() {
        this.memberCount++;
        this.updateMemberCount();
        localStorage.setItem('club-loulou-members', this.memberCount.toString());
    }

    updateMemberCount() {
        const memberCountElement = document.getElementById('member-count');
        const savedCount = localStorage.getItem('club-loulou-members');
        if (savedCount) {
            this.memberCount = parseInt(savedCount);
        }
        
        // Animate the counter
        this.animateCounter(memberCountElement, this.memberCount);
    }

    animateCounter(element, targetValue) {
        const startValue = parseInt(element.textContent.replace(/,/g, '')) || 0;
        const duration = 1000;
        const startTime = performance.now();

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const currentValue = Math.floor(startValue + (targetValue - startValue) * progress);
            element.textContent = currentValue.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };

        requestAnimationFrame(updateCounter);
    }
}

// Add confetti animation CSS
const confettiStyle = document.createElement('style');
confettiStyle.textContent = `
    @keyframes confettiFall {
        0% {
            transform: translateY(-10px) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(confettiStyle);

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ClubLoulou();
});

// Add some fun easter eggs
document.addEventListener('keydown', (e) => {
    // Konami code: ↑↑↓↓←→←→BA
    const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    window.konamiPosition = window.konamiPosition || 0;
    
    if (e.keyCode === konamiCode[window.konamiPosition]) {
        window.konamiPosition++;
        if (window.konamiPosition === konamiCode.length) {
            // Easter egg: Make all Louis and Louise dance
            document.body.style.animation = 'shake 0.5s infinite';
            setTimeout(() => {
                document.body.style.animation = '';
            }, 3000);
            window.konamiPosition = 0;
        }
    } else {
        window.konamiPosition = 0;
    }
});

// Add shake animation
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px) rotate(-1deg); }
        75% { transform: translateX(5px) rotate(1deg); }
    }
`;
document.head.appendChild(shakeStyle);