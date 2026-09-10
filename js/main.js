document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. Mobile Navigation & Sticky Header
       ========================================================================== */
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navbar = document.querySelector('.navbar');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
            navbar.style.padding = '0.5rem 0';
        } else {
            navbar.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
            navbar.style.padding = '1rem 0';
        }
    });

    /* ==========================================================================
       2. Animated Counters (Intersection Observer)
       ========================================================================== */
    const counters = document.querySelectorAll('.counter');
    const speed = 200;

    const animateCounters = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute('data-target');
                
                const updateCount = () => {
                    const count = +counter.innerText;
                    const inc = target / speed;

                    if (count < target) {
                        counter.innerText = Math.ceil(count + inc);
                        setTimeout(updateCount, 15);
                    } else {
                        counter.innerText = target.toLocaleString() + "+";
                    }
                };
                updateCount();
                observer.unobserve(counter);
            }
        });
    };

    const counterObserver = new IntersectionObserver(animateCounters, { threshold: 0.5 });
    counters.forEach(counter => counterObserver.observe(counter));

    /* ==========================================================================
       3. Animal Category Filtering
       ========================================================================== */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const animalCards = document.querySelectorAll('.animal-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            animalCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                    // Trigger reflow for animation
                    setTimeout(() => card.style.opacity = '1', 10);
                } else {
                    card.style.opacity = '0';
                    setTimeout(() => card.style.display = 'none', 300);
                }
            });
        });
    });

    /* ==========================================================================
       4. FAQ Accordion
       ========================================================================== */
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all
            faqItems.forEach(i => i.classList.remove('active'));
            
            // Open clicked if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    /* ==========================================================================
       5. Donation Logic (Mock Payment & LocalStorage)
       ========================================================================== */
    const amountBtns = document.querySelectorAll('.amount-btn');
    const customAmountInput = document.getElementById('custom-amount');
    const donationForm = document.getElementById('donation-form');

    let selectedAmount = 0;

    if (amountBtns.length > 0) {
        amountBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                amountBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                selectedAmount = btn.getAttribute('data-amount');
                if (customAmountInput) customAmountInput.value = '';
            });
        });
    }

    if (customAmountInput) {
        customAmountInput.addEventListener('input', (e) => {
            amountBtns.forEach(b => b.classList.remove('active'));
            selectedAmount = e.target.value;
        });
    }

    if (donationForm) {
        donationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const finalAmount = customAmountInput && customAmountInput.value ? customAmountInput.value : selectedAmount;
            
            if (!finalAmount || finalAmount <= 0) {
                alert('Please select or enter a valid donation amount.');
                return;
            }

            const donorName = document.getElementById('full-name').value;
            const purpose = document.getElementById('donation-purpose').value;

            const donationData = {
                id: 'DON-' + Math.floor(Math.random() * 100000),
                name: donorName,
                amount: finalAmount,
                purpose: purpose,
                date: new Date().toLocaleDateString()
            };

            // Save to Mock Database (LocalStorage)
            let donations = JSON.parse(localStorage.getItem('rescueDonations')) || [];
            donations.push(donationData);
            localStorage.setItem('rescueDonations', JSON.stringify(donations));

            alert(`Thank you, ${donorName}! Your mock donation of INR ${finalAmount} has been processed successfully. Redirecting to dashboard...`);
            window.location.href = 'dashboard.html';
        });
    }

    /* ==========================================================================
       6. Dashboard Logic (Load LocalStorage Data)
       ========================================================================== */
    const donationTableBody = document.getElementById('donation-history-body');
    const totalDonatedElem = document.getElementById('total-donated');

    if (donationTableBody && totalDonatedElem) {
        const donations = JSON.parse(localStorage.getItem('rescueDonations')) || [];
        let total = 0;

        if (donations.length === 0) {
            donationTableBody.innerHTML = '<tr><td colspan="4" class="text-center">No donations found yet. Be the first to help!</td></tr>';
        } else {
            donations.forEach(don => {
                total += parseFloat(don.amount);
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${don.id}</td>
                    <td>${don.date}</td>
                    <td>${don.purpose}</td>
                    <td class="text-primary" style="font-weight:bold;">INR ${don.amount}</td>
                `;
                donationTableBody.appendChild(tr);
            });
        }
        totalDonatedElem.innerText = `INR ${total.toLocaleString()}`;
    }

    /* ==========================================================================
       7. Emergency Rescue Form Demo
       ========================================================================== */
    const emergencyForm = document.getElementById('emergency-form');
    if (emergencyForm) {
        emergencyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const rescueId = 'RES-' + Math.floor(Math.random() * 100000);
            alert(`Emergency reported successfully! Our team is reviewing it. Reference ID: ${rescueId}`);
            emergencyForm.reset();
        });
    }
});