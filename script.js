document.addEventListener('DOMContentLoaded', () => {
            gsap.registerPlugin(ScrollTrigger);

            // Phase 1: Loader
            window.addEventListener('load', () => {
                gsap.to("#loader", {
                    opacity: 0,
                    duration: 1,
                    onComplete: () => {
                        document.getElementById('loader').style.display = 'none';
                    }
                });
            });

            // Phase 2: Unveiling
            const openButton = document.getElementById('open-invitation');
            openButton.addEventListener('click', () => {
                const tl = gsap.timeline({
                    onComplete: () => {
                        // Hide the curtain after animation to allow clicks
                        document.getElementById('curtain').style.display = 'none';
                    }
                });
                tl.to("#open-invitation", { opacity: 0, duration: 0.5, y: 20 })
                  .to("#left-door", { x: '-100%', duration: 1.5, ease: 'power2.inOut' })
                  .to("#right-door", { x: '100%', duration: 1.5, ease: 'power2.inOut' }, "-=1.5")
                  .to("#main-content", { opacity: 1, duration: 1 })
                  .from("#aamantran > *", { opacity: 0, y: 30, stagger: 0.2, duration: 1 }, "-=0.5");
            });

            // Scroll Prompt Animation
            gsap.to("#scroll-prompt", {
                opacity: 0,
                scrollTrigger: {
                    trigger: "#aamantran",
                    start: "top top",
                    end: "bottom top",
                    scrub: true
                }
            });

            // Phase 4: Card Hover
            // This is handled by CSS :hover pseudo-class for simplicity.

            // Phase 5: Parallax Gallery & Scroll Animation
            const galleryContainer = document.querySelector(".horizontal-scroll-container");
            const galleryItems = gsap.utils.toArray(".gallery-item");

            galleryItems.forEach(item => {
                // Entrance animation for each item
                gsap.from(item, {
                    opacity: 0,
                    y: 50,
                    scale: 0.9,
                    duration: 1,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: item,
                        scroller: galleryContainer, // Specify the scroller
                        horizontal: true, // Enable horizontal scrolling trigger
                        start: 'left 90%', // Trigger when the left of the item hits 90% of the container width
                        toggleActions: 'play none none none',
                    }
                });

                // Parallax for background (remains the same)
                gsap.to(item, {
                    backgroundPosition: "50% -50px",
                    ease: "none",
                    scrollTrigger: {
                        trigger: item,
                        scroller: galleryContainer,
                        horizontal: true,
                        start: "left right", // Starts when the left of the item hits the right of the scroller
                        end: "right left", // Ends when the right of the item hits the left of the scroller
                        scrub: true
                    }
                });
            });

            // Fade in sections on scroll
            gsap.utils.toArray('section').forEach((section, i) => {
                if (i > 0) { // Skip the first section
                    gsap.from(section, {
                        opacity: 0,
                        y: 50,
                        duration: 1,
                        scrollTrigger: {
                            trigger: section,
                            start: 'top 80%',
                            toggleActions: 'play none none none'
                        }
                    });
                }
            });

            // Countdown Timer
            const weddingDate = new Date("2025-11-22T17:00:00").getTime();
            const countdownInterval = setInterval(() => {
                const now = new Date().getTime();
                const distance = weddingDate - now;

                if (distance < 0) {
                    clearInterval(countdownInterval);
                    document.getElementById("countdown").innerHTML = "<h2 class='text-3xl text-gold font-bold'>The wedding ceremony is happening now!</h2>";
                    return;
                }

                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                document.getElementById("days").innerText = days;
                document.getElementById("hours").innerText = hours;
                document.getElementById("minutes").innerText = minutes;
                document.getElementById("seconds").innerText = seconds;
            }, 1000);

            // Add to Calendar functionality
            document.querySelectorAll('.add-to-calendar-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const eventDetails = JSON.parse(e.target.dataset.event);
                    const startDate = new Date(eventDetails.date);
                    const endDate = new Date(startDate.getTime() + eventDetails.duration * 60000);

                    const formatDate = (date) => date.toISOString().replace(/-|:|\.\d\d\d/g, '');

                    const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventDetails.title)}&dates=${formatDate(startDate)}/${formatDate(endDate)}&details=${encodeURIComponent("Join us for the beautiful wedding celebration of Raj & Priya.")}&location=${encodeURIComponent("Jaypee Palace Hotel & Convention Centre, Agra, Uttar Pradesh, India")}`;

                    window.open(googleCalendarUrl, '_blank');
                });
            });

            // Phase 6: Blessings & RSVP
            const blessingText = document.getElementById('blessing-text');
            const submitBlessing = document.getElementById('submit-blessing');
            const blessingsDisplay = document.getElementById('blessings-display');
            const rsvpButtons = document.querySelectorAll('.rsvp-button');
            const rsvpFeedback = document.getElementById('rsvp-feedback');

            // Load from localStorage
            const savedBlessings = JSON.parse(localStorage.getItem('weddingBlessings')) || [];
            savedBlessings.forEach(b => displayBlessing(b.text, b.date));

            const savedRSVP = localStorage.getItem('weddingRSVP');
            if(savedRSVP) {
                updateRSVPUI(savedRSVP);
            }

            function displayBlessing(text, date) {
                const blessingEl = document.createElement('div');
                blessingEl.className = 'bg-maroon p-4 rounded-lg border border-gold border-opacity-30';
                blessingEl.innerHTML = `<p>"${text}"</p><small class="text-gray-400">${date}</small>`;
                blessingsDisplay.prepend(blessingEl);
            }

            submitBlessing.addEventListener('click', () => {
                const text = blessingText.value.trim();
                if (text) {
                    const date = new Date().toLocaleString();
                    displayBlessing(text, date);

                    const currentBlessings = JSON.parse(localStorage.getItem('weddingBlessings')) || [];
                    currentBlessings.push({ text, date });
                    localStorage.setItem('weddingBlessings', JSON.stringify(currentBlessings));

                    blessingText.value = '';
                }
            });

            function updateRSVPUI(status) {
                rsvpButtons.forEach(btn => {
                    if(btn.dataset.rsvp === status) {
                        btn.classList.add('bg-gold', 'text-maroon');
                        btn.classList.remove('bg-transparent', 'text-gold');
                    } else {
                        btn.classList.remove('bg-gold', 'text-maroon');
                        btn.classList.add('bg-transparent', 'text-gold');
                    }
                });
                 if (status === 'attending') {
                    rsvpFeedback.textContent = "We eagerly await your presence!";
                } else {
                    rsvpFeedback.textContent = "You will be missed!";
                }
            }

            rsvpButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    const clickedButton = e.currentTarget;
                    const rsvpStatus = clickedButton.dataset.rsvp;

                    // GSAP Animation for feedback
                    gsap.to(clickedButton, {
                        scale: 1.1,
                        duration: 0.2,
                        yoyo: true,
                        repeat: 1,
                        ease: 'power1.inOut',
                        onComplete: () => {
                            localStorage.setItem('weddingRSVP', rsvpStatus);
                            updateRSVPUI(rsvpStatus);

                            const phoneNumber = "917355556366";
                            const message = rsvpStatus === 'attending'
                                ? "I am delighted to confirm my attendance at your wedding!"
                                : "I regret that I won't be able to attend, but I send my warmest wishes.";

                            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
                            window.open(whatsappUrl, '_blank');
                        }
                    });
                });
            });
        });