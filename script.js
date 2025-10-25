document.addEventListener('DOMContentLoaded', () => {
            gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

            // --- Dynamic Event Details ---
            const festivitiesContainer = document.querySelector('#utsav .grid');
            const events = [
                { name: 'Haldi', date: 'Monday, 20th Nov 2025', time: '10:00 AM onwards', bgColor: 'bg-saffron', calendar: { title: 'Raj & Priya - Haldi Ceremony', date: '2025-11-20T10:00:00', duration: 120 } },
                { name: 'Mehendi', date: 'Monday, 20th Nov 2025', time: '06:00 PM onwards', bgColor: 'bg-emerald', calendar: { title: 'Raj & Priya - Mehendi Ceremony', date: '2025-11-20T18:00:00', duration: 180 } },
                { name: 'Sangeet', date: 'Tuesday, 21st Nov 2025', time: '07:00 PM onwards', bgColor: 'bg-blue-500', calendar: { title: 'Raj & Priya - Sangeet Ceremony', date: '2025-11-21T19:00:00', duration: 240 } },
                { name: 'Wedding', date: 'Wednesday, 22nd Nov 2025', time: '05:00 PM onwards', bgColor: 'bg-red-500', calendar: { title: 'Raj & Priya - Wedding Ceremony', date: '2025-11-22T17:00:00', duration: 300 } },
                { name: 'Reception', date: 'Wednesday, 22nd Nov 2025', time: '08:00 PM onwards', bgColor: 'bg-purple-500', calendar: { title: 'Raj & Priya - Reception', date: '2025-11-22T20:00:00', duration: 240 } }
            ];

            if (festivitiesContainer) {
                festivitiesContainer.innerHTML = ''; // Clear existing static content
                events.forEach(event => {
                    const eventCard = `
                        <div class="card-3d ${event.bgColor} bg-opacity-20 border border-gold p-6 rounded-lg text-center">
                            <h3 class="text-3xl text-gold mb-2 font-calligraphy">${event.name}</h3>
                            <p class="text-lg">${event.date}</p>
                            <p>${event.time}</p>
                            <button class="add-to-calendar-btn mt-4 bg-gold text-maroon px-4 py-2 rounded-full text-sm" data-event='${JSON.stringify(event.calendar)}'>Add to Calendar</button>
                        </div>
                    `;
                    festivitiesContainer.innerHTML += eventCard;
                });
            }



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
                tl.to("#open-invitation", { opacity: 0, duration: 0.5, y: 30, ease: 'power2.in' })
                  .to("#left-door", { x: '-100%', duration: 2, ease: 'power3.inOut' })
                  .to("#right-door", { x: '100%', duration: 2, ease: 'power3.inOut' }, "<")
                  .to("#main-content", { opacity: 1, duration: 1.5 }, "-=0.5")
                  .from("#aamantran > *", { opacity: 0, y: 40, stagger: 0.25, duration: 1.2, ease: 'power2.out' }, "-=1");
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
                // Initial state for scroll-in view
                gsap.from(item, {
                    opacity: 0,
                    scale: 0.95,
                    y: 30,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: item,
                        scroller: galleryContainer,
                        horizontal: true,
                        start: 'left 95%',
                        toggleActions: 'play none none none',
                    }
                });

                // Parallax for background
                gsap.to(item, {
                    backgroundPosition: "50% -50px",
                    ease: "none",
                    scrollTrigger: {
                        trigger: item,
                        scroller: galleryContainer,
                        horizontal: true,
                        start: "left right",
                        end: "right left",
                        scrub: true
                    }
                });

                // 3D Tilt Effect on Hover
                item.addEventListener('mousemove', (e) => {
                    const { left, top, width, height } = item.getBoundingClientRect();
                    const x = e.clientX - left;
                    const y = e.clientY - top;
                    const rotateX = gsap.utils.mapRange(0, height, -15, 15)(y);
                    const rotateY = gsap.utils.mapRange(0, width, 15, -15)(x);

                    gsap.to(item, {
                        rotationX: rotateX,
                        rotationY: rotateY,
                        transformPerspective: 1000,
                        ease: 'power1.out',
                        duration: 0.5
                    });
                });

                item.addEventListener('mouseleave', () => {
                    gsap.to(item, {
                        rotationX: 0,
                        rotationY: 0,
                        ease: 'elastic.out(1, 0.5)',
                        duration: 1
                    });
                });
            });

            // Choreographed Scroll-Triggered Animations
            const sections = document.querySelectorAll('section');

            sections.forEach((section, i) => {
                if (i === 0) return; // Skip the first section (Aamantran) as it's handled by the curtain opening

                const timeline = gsap.timeline({
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 80%',
                        toggleActions: 'play none none none'
                    }
                });

                const sectionTitle = section.querySelector('h2');
                const sectionContent = section.querySelectorAll('*:not(h2):not(.ornate-divider)');

                if (sectionTitle) {
                    timeline.from(sectionTitle, {
                        opacity: 0,
                        y: 40, // Reduced y offset for subtlety
                        duration: 1.2,
                        ease: 'power3.out'
                    });
                }

                if (section.id === 'utsav') {
                    const cards = section.querySelectorAll('.card-3d');
                    timeline.from(cards, {
                        opacity: 0,
                        y: 40,
                        scale: 0.95,
                        rotationY: -20,
                        duration: 1,
                        stagger: 0.2,
                        ease: 'power3.out'
                    }, "-=0.8");
                } else if (section.id === 'venue') {
                    const paragraph = section.querySelector('p');
                    const map = section.querySelector('iframe');
                    timeline.from(paragraph, { opacity: 0, y: 30, duration: 1, ease: 'power3.out' }, "-=0.8")
                            .from(map, { opacity: 0, scale: 0.95, duration: 1.2, ease: 'power3.out' }, "-=0.6");
                } else if (section.id === 'prem-gatha') {
                    // The gallery items have their own scroll trigger, so we just animate the title.
                    // The main title animation is already handled.
                } else if (section.id === 'aashirwad') {
                    const blessingBox = section.querySelector('.mb-12');
                    const rsvpBox = section.querySelector('div:not(.mb-12)');
                     timeline.from(blessingBox, { opacity: 0, y: 40, duration: 1.2, ease: 'power3.out' }, "-=0.8")
                             .from(rsvpBox, { opacity: 0, y: 40, duration: 1.2, ease: 'power3.out' }, "-=0.9");
                } else {
                     if (sectionContent.length > 0) {
                        timeline.from(sectionContent, {
                            opacity: 0,
                            y: 30,
                            stagger: 0.2,
                            duration: 1,
                            ease: 'power3.out'
                        }, "-=0.8");
                    }
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

            // --- Micro-interactions and Visual Polish ---

            // 1. Enhanced Button Hovers
            const interactiveButtons = document.querySelectorAll('button, .venue-icon-link');
            interactiveButtons.forEach(button => {
                const tl = gsap.timeline({ paused: true });
                tl.to(button, {
                    y: -5, // Increased lift
                    scale: 1.08,
                    boxShadow: "0 12px 25px rgba(212, 175, 55, 0.4)", // Enhanced shadow
                    duration: 0.3,
                    ease: 'power2.out'
                });

                button.addEventListener('mouseenter', () => tl.play());
                button.addEventListener('mouseleave', () => {
                    tl.reverse();
                });

                button.addEventListener('mousedown', () => {
                    gsap.to(button, { scale: 0.98, y: -2, duration: 0.15, ease: 'power2.in' }); // Press down effect
                });
                button.addEventListener('mouseup', () => {
                    gsap.to(button, { scale: 1.08, y: -5, duration: 0.2, ease: 'power2.out' }); // Release effect
                });
            });

            // 2. Breathing Animation on Names
            const names = document.querySelectorAll('#aamantran h1.gold-text');
            gsap.to(names, {
                scale: 1.02, // More subtle scaling
                duration: 3, // Slower, more graceful duration
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true
            });


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

            // Initialize Particles.js
            particlesJS('particles-js', {
                "particles": {
                    "number": {
                        "value": 80,
                        "density": {
                            "enable": true,
                            "value_area": 800
                        }
                    },
                    "color": {
                        "value": "#ffd700"
                    },
                    "shape": {
                        "type": "circle",
                        "stroke": {
                            "width": 0,
                            "color": "#000000"
                        },
                    },
                    "opacity": {
                        "value": 0.5,
                        "random": true,
                        "anim": {
                            "enable": true,
                            "speed": 1,
                            "opacity_min": 0.1,
                            "sync": false
                        }
                    },
                    "size": {
                        "value": 3,
                        "random": true,
                        "anim": {
                            "enable": false,
                        }
                    },
                    "line_linked": {
                        "enable": false,
                    },
                    "move": {
                        "enable": true,
                        "speed": 1,
                        "direction": "none",
                        "random": true,
                        "straight": false,
                        "out_mode": "out",
                        "bounce": false,
                    }
                },
                "interactivity": {
                    "detect_on": "canvas",
                    "events": {
                        "onhover": {
                            "enable": false,
                        },
                        "onclick": {
                            "enable": false,
                        },
                        "resize": true
                    }
                },
                "retina_detect": true
            });
        });