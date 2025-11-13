// Smooth Scroll
document.querySelectorAll('.smooth-scroll').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href') || '';
        if (href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                window.scrollTo({ top: target.offsetTop - 110, behavior: 'smooth' });
            }
        }
    });
});

// Intersection Observer untuk memantau elemen
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
        else entry.target.classList.remove('visible');
    });
});

// Amati semua elemen <section>
document.querySelectorAll('section').forEach((section) => observer.observe(section));


// --- FAQ handling (supports two markups) ---
// Markup A (site-wide):
// <div class="faq"> <button class="faq-question">...</button> <div class="faq-answer">...</div> </div>
// Markup B (faq page):
// <button class="faq-toggle">Question <i class="fas"></i></button>
// <div class="faq-answer hidden">Answer</div>

function closeAllFaqAnswers(exceptAnswer) {
    // For Markup A: close by removing .open and resetting maxHeight
    document.querySelectorAll('.faq-answer').forEach(a => {
        if (a === exceptAnswer) return;
        // two modes: hidden class (markup B) or open class (markup A)
        a.classList.add('hidden');
        a.classList.remove('open');
        a.style.maxHeight = '0px';
    });
    // reset icons for markup A (.faq-icon) and markup B (i.fas)
    document.querySelectorAll('.faq-icon').forEach(ic => ic.textContent = '+');
    document.querySelectorAll('.faq-toggle i.fas').forEach(i => i.style.transform = '');
}

function toggleFaqMarkupA(button) {
    const faq = button.closest('.faq');
    if (!faq) return;
    const answer = faq.querySelector('.faq-answer');
    const icon = faq.querySelector('.faq-icon');
    if (!answer) return;

    const isOpen = answer.classList.contains('open');
    closeAllFaqAnswers(answer);
    if (isOpen) {
        answer.classList.remove('open');
        answer.style.maxHeight = '0px';
        if (icon) icon.textContent = '+';
        button.setAttribute('aria-expanded', 'false');
    } else {
        answer.classList.add('open');
        answer.classList.remove('hidden');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        if (icon) icon.textContent = '-';
        button.setAttribute('aria-expanded', 'true');
    }
}

function toggleFaqMarkupB(toggleBtn) {
    const answer = toggleBtn.nextElementSibling;
    if (!answer || !answer.classList) return;
    const isHidden = answer.classList.contains('hidden');
    closeAllFaqAnswers(answer);
    if (isHidden) {
        answer.classList.remove('hidden');
        const icon = toggleBtn.querySelector('i.fas');
        if (icon) icon.style.transform = 'rotate(180deg)';
        toggleBtn.setAttribute('aria-expanded', 'true');
    } else {
        answer.classList.add('hidden');
        const icon = toggleBtn.querySelector('i.fas');
        if (icon) icon.style.transform = '';
        toggleBtn.setAttribute('aria-expanded', 'false');
    }
}

// Delegated click handler
document.addEventListener('click', (e) => {
    const toggleBtn = e.target.closest && e.target.closest('.faq-toggle');
    if (toggleBtn) {
        toggleFaqMarkupB(toggleBtn);
        return;
    }
    const faqBtn = e.target.closest && e.target.closest('.faq-question');
    if (faqBtn) {
        toggleFaqMarkupA(faqBtn);
    }
});

// Keyboard support (Enter / Space) for accessibility
document.addEventListener('keydown', (e) => {
    const active = document.activeElement;
    if (!active) return;
    if ((e.key === 'Enter' || e.key === ' ') && active.classList) {
        if (active.classList.contains('faq-toggle')) {
            e.preventDefault();
            toggleFaqMarkupB(active);
        } else if (active.classList.contains('faq-question')) {
            e.preventDefault();
            toggleFaqMarkupA(active);
        }
    }
});


// Muat footer.html ke dalam div #footer
fetch('footer.html')
    .then(response => response.text())
    .then(data => { document.getElementById('footer').innerHTML = data; })
    .catch(error => console.error('Gagal memuat footer:', error));

// Unified FAQ handling: supports two markups
// 1) Page-wide `.faq` blocks with `.faq-question` (uses .faq-answer/open)
// 2) faq/index.html which uses `.faq-toggle` buttons and toggles `.hidden` on the next sibling

// Helper to close all .faq answers (markup type 1)
function closeAllFaqAnswers(except = null) {
    document.querySelectorAll('.faq').forEach(otherFaq => {
        if (otherFaq === except) return;
        const otherAnswer = otherFaq.querySelector('.faq-answer');
        const otherIcon = otherFaq.querySelector('.faq-icon');
        const otherBtn = otherFaq.querySelector('.faq-question');
        if (otherAnswer) {
            otherAnswer.classList.remove('open');
            otherAnswer.style.maxHeight = '0px';
        }
        if (otherIcon) otherIcon.textContent = '+';
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
    });
}

function handleFaqQuestionButton(btn) {
    if (!btn) return;
    const faq = btn.closest('.faq');
    if (!faq) return;
    const answer = faq.querySelector('.faq-answer');
    const icon = faq.querySelector('.faq-icon');
    if (!answer) return;

    const isOpen = answer.classList.contains('open');
    // close others
    closeAllFaqAnswers(faq);


    // Event delegation for FAQ interactions (supports both markup styles)
    document.addEventListener('click', (e) => {
        // Type 2: faq/index.html markup: .faq-toggle button with nextElementSibling .faq-answer (which uses 'hidden')
        const toggleBtn = e.target.closest && e.target.closest('.faq-toggle');
        if (toggleBtn) {
            const answer = toggleBtn.nextElementSibling;
            if (answer && answer.classList && answer.classList.contains('faq-answer')) {
                const isHidden = answer.classList.contains('hidden');
                // close others (type-2)
                document.querySelectorAll('.faq-answer').forEach(a => {
                    if (a !== answer) a.classList.add('hidden');
                });
                // toggle current
                if (isHidden) {
                    answer.classList.remove('hidden');
                    const icon = toggleBtn.querySelector('i.fas');
                    if (icon) icon.style.transform = 'rotate(180deg)';
                    toggleBtn.setAttribute('aria-expanded', 'true');
                } else {
                    answer.classList.add('hidden');
                    const icon = toggleBtn.querySelector('i.fas');
                    if (icon) icon.style.transform = '';
                    toggleBtn.setAttribute('aria-expanded', 'false');
                }
            }
            return;
        }

        // Type 1: site-wide .faq / .faq-question
        const btn = e.target.closest && e.target.closest('.faq-question');
        if (btn) {
            handleFaqQuestionButton(btn);
        }
    });

    // Keyboard support (Enter / Space)
    document.addEventListener('keydown', (e) => {
        const active = document.activeElement;
        if (!active) return;
        if ((e.key === 'Enter' || e.key === ' ') && active.classList && (active.classList.contains('faq-question') || active.classList.contains('faq-toggle'))) {
            e.preventDefault();
            if (active.classList.contains('faq-toggle')) {
                active.click();
            } else {
                handleFaqQuestionButton(active);
            }
        }
    });
};

// Amati semua elemen <section>
document.querySelectorAll('section').forEach((section) => {
    observer.observe(section);
});




// Muat footer.html ke dalam div #footer
fetch('footer.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('footer').innerHTML = data;
    })
    .catch(error => console.error('Gagal memuat footer:', error));


