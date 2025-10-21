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

            // Phase 5: Interactive "Snap-to-Center" Gallery
            gsap.registerPlugin(Draggable, InertiaPlugin);

            const galleryContainer = document.querySelector(".horizontal-scroll-container");
            const galleryItems = gsap.utils.toArray(".gallery-item");
            const galleryWidth = galleryContainer.offsetWidth;
            const itemWidth = galleryItems[0].offsetWidth;
            const totalWidth = itemWidth * galleryItems.length;

            // Set the container to the total width of all items
            gsap.set(galleryContainer, { width: totalWidth });

            function centerImage(index) {
                gsap.to(galleryContainer, {
                    x: -index * itemWidth + (galleryWidth - itemWidth) / 2,
                    duration: 0.8,
                    ease: 'power3.inOut'
                });

                // Add active state to the centered image
                galleryItems.forEach((item, i) => {
                    gsap.to(item, {
                        scale: i === index ? 1.05 : 0.95,
                        filter: i === index ? 'brightness(1.1)' : 'brightness(0.8)',
                        duration: 0.5,
                        ease: 'power2.out'
                    });
                });
            }

            Draggable.create(galleryContainer, {
                type: "x",
                bounds: {
                    minX: -(totalWidth - galleryWidth),
                    maxX: 0
                },
                inertia: true,
                snap: {
                    x: function(endValue) {
                        // Snap to the center of the closest image
                        return Math.round(endValue / itemWidth) * itemWidth;
                    }
                },
                onDragEnd: function() {
                    let currentIndex = Math.round(this.x / -itemWidth);
                    centerImage(currentIndex);
                }
            });

            // Initially center the first image
            centerImage(0);

            // Choreographed Scroll-Triggered Animations for a Cinematic Feel
            const sections = document.querySelectorAll('section');

            sections.forEach((section, i) => {
                if (i === 0) return; // Skip the first section (Aamantran)

                const timeline = gsap.timeline({
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 85%', // Start a bit earlier
                        end: 'bottom 40%',
                        toggleActions: 'play none none reverse' // Reverse animation on scroll up
                    }
                });

                const sectionTitle = section.querySelector('h2');

                if (sectionTitle) {
                    // Animate title with a more refined effect
                    timeline.from(sectionTitle, {
                        opacity: 0,
                        y: 50,
                        skewY: 5,
                        duration: 1.5,
                        ease: 'power4.out'
                    });
                }

                const ornateDivider = section.previousElementSibling;
                if (ornateDivider && ornateDivider.classList.contains('ornate-divider')) {
                     timeline.from(ornateDivider, {
                        opacity: 0,
                        width: "20%",
                        duration: 1.5,
                        ease: 'power4.out'
                    }, "-=1.2");
                }


                if (section.id === 'utsav') {
                    const cards = section.querySelectorAll('.card-3d');
                    // Staggered card animation, like they are being dealt
                    timeline.from(cards, {
                        opacity: 0,
                        y: 60,
                        rotationX: -10,
                        rotationY: 20,
                        scale: 0.9,
                        duration: 1.2,
                        stagger: {
                            each: 0.2,
                            from: "start"
                        },
                        ease: 'power4.out'
                    }, "-=1"); // Overlap with title animation
                } else if (section.id === 'venue') {
                    const paragraph = section.querySelector('p');
                    const map = section.querySelector('iframe');
                    // Animate paragraph and map with different directions
                    timeline.from(paragraph, { opacity: 0, x: -50, duration: 1.2, ease: 'power4.out' }, "-=1")
                            .from(map, { opacity: 0, scale: 0.8, duration: 1.5, ease: 'elastic.out(1, 0.75)' }, "-=0.9");
                } else if (section.id === 'prem-gatha') {
                    // Title is handled above. Gallery has its own logic.
                } else if (section.id === 'aashirwad') {
                    const blessingTitle = section.querySelector('.mb-12 h3');
                    const blessingTextarea = section.querySelector('textarea');
                    const blessingButton = section.querySelector('#submit-blessing');
                    const rsvpTitle = section.querySelector('div:not(.mb-12) h3');
                    const rsvpButtons = section.querySelectorAll('.rsvp-button');

                    // Animate blessings and RSVP sections with more detail
                    timeline.from([blessingTitle, blessingTextarea, blessingButton], {
                        opacity: 0,
                        y: 30,
                        stagger: 0.2,
                        duration: 1,
                        ease: 'power3.out'
                    }, "-=1")
                    .from(rsvpTitle, { opacity: 0, y:30, duration: 1, ease: 'power3.out'}, "-=0.5")
                    .from(rsvpButtons, {
                        opacity: 0,
                        scale: 0.5,
                        stagger: 0.2,
                        duration: 0.8,
                        ease: 'back.out(1.7)'
                    }, "-=0.7");
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

            // 1. Enhanced Button Hovers with Lift and Press effect
            const interactiveButtons = document.querySelectorAll('button, .venue-icon-link');
            interactiveButtons.forEach(button => {
                const tl = gsap.timeline({ paused: true });
                tl.to(button, {
                    y: -3,
                    scale: 1.05,
                    boxShadow: "0 8px 15px rgba(212, 175, 55, 0.3)",
                    duration: 0.3,
                    ease: 'power2.out'
                });

                button.addEventListener('mouseenter', () => tl.play());
                button.addEventListener('mouseleave', () => tl.reverse());

                button.addEventListener('mousedown', () => {
                    gsap.to(button, { scale: 0.95, y: 0, duration: 0.15, ease: 'power2.in' });
                });
                button.addEventListener('mouseup', () => {
                    gsap.to(button, { scale: 1.05, y: -3, duration: 0.2, ease: 'power2.out' });
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
            savedBlessings.forEach(b => displayBlessing(b.text, b.date, false));

            const savedRSVP = localStorage.getItem('weddingRSVP');
            if(savedRSVP) {
                updateRSVPUI(savedRSVP);
            }

            function displayBlessing(text, date, animate = false) {
                const blessingEl = document.createElement('div');
                blessingEl.className = 'bg-maroon p-4 rounded-lg border border-gold border-opacity-30';
                blessingEl.innerHTML = `<p>"${text}"</p><small class="text-gray-400">${date}</small>`;

                // Add to the top of the list
                blessingsDisplay.prepend(blessingEl);

                // Animate the new blessing
                if (animate) {
                    gsap.from(blessingEl, {
                        opacity: 0,
                        y: -50,
                        duration: 1,
                        ease: 'power4.out'
                    });
                }
            }

            submitBlessing.addEventListener('click', () => {
                const text = blessingText.value.trim();
                if (text) {
                    const date = new Date().toLocaleString();
                    // Pass true to animate the new blessing
                    displayBlessing(text, date, true);

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

            // Ambient Music Player
            const music = document.getElementById('ambient-music');
            const musicToggle = document.getElementById('music-toggle');
            const musicIcon = musicToggle.querySelector('i');

            musicToggle.addEventListener('click', () => {
                if (music.paused) {
                    music.play();
                    musicIcon.classList.remove('fa-volume-mute');
                    musicIcon.classList.add('fa-volume-up');
                } else {
                    music.pause();
                    musicIcon.classList.remove('fa-volume-up');
                    musicIcon.classList.add('fa-volume-mute');
                }
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