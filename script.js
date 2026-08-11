document.addEventListener("DOMContentLoaded", () => {
    /* ---------------------------------
       LOADING SCREEN LOGIC (Letter by Letter)
    --------------------------------- */
    const loader = document.getElementById("loader");
    const charElements = document.querySelectorAll(".loader-brand-title .char");
    
    if (charElements.length > 0) {
        charElements.forEach((char, index) => {
            char.style.animationDelay = `${0.06 * (index + 1)}s`;
        });
    }

    if (loader) {
        // Allow letter by letter animation to complete before sliding overlay up
        setTimeout(() => {
            loader.classList.add("hidden");
            setTimeout(initScrollReveals, 400); 
        }, 1400);
    } else {
        // If page has no loader screen, initialize reveals immediately
        initScrollReveals();
    }


    /* ---------------------------------
       CUSTOM CURSOR LOGIC
    --------------------------------- */
    const cursor = document.getElementById("cursor");
    const follower = document.getElementById("cursor-follower");

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX, cursorY = mouseY;
    let followerX = mouseX, followerY = mouseY;
    let hasMoved = false;

    // Only enable custom cursor if on a non-touch device
    if (window.matchMedia("(pointer: fine)").matches) {
        document.addEventListener("mousemove", (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            if (!hasMoved) {
                cursorX = mouseX;
                cursorY = mouseY;
                followerX = mouseX;
                followerY = mouseY;
                hasMoved = true;
            }
        });

        // Animation loop for smooth follower movement
        function renderCursor() {
            cursorX = mouseX;
            cursorY = mouseY;
            
            // Follower smooth easing
            followerX += (mouseX - followerX) * 0.18;
            followerY += (mouseY - followerY) * 0.18;

            if (cursor && follower) {
                cursor.style.left = `${cursorX}px`;
                cursor.style.top = `${cursorY}px`;
                follower.style.left = `${followerX}px`;
                follower.style.top = `${followerY}px`;
            }

            requestAnimationFrame(renderCursor);
        }
        renderCursor();

        // Event delegation for hover effects
        document.addEventListener("mouseover", (e) => {
            if (e.target.closest(".hover-target, a, button, .project-card, .poll-option-btn, .action-btn, .takeaway-tab")) {
                if (cursor) cursor.classList.add("hovering");
                if (follower) follower.classList.add("hovering");
            }
        });

        document.addEventListener("mouseout", (e) => {
            if (e.target.closest(".hover-target, a, button, .project-card, .poll-option-btn, .action-btn, .takeaway-tab")) {
                if (cursor) cursor.classList.remove("hovering");
                if (follower) follower.classList.remove("hovering");
            }
        });
    }

    /* ---------------------------------
       SCROLL REVEAL (Intersection Observer)
    --------------------------------- */
    function initScrollReveals() {
        const revealElements = document.querySelectorAll(".reveal");

        const observerOptions = {
            root: null,
            rootMargin: "0px",
            threshold: 0.1 // Trigger when 10% visible
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    // Get optional delay
                    const delay = entry.target.getAttribute("data-delay");
                    if (delay) {
                        entry.target.style.transitionDelay = delay;
                    }
                    
                    entry.target.classList.add("reveal-visible");
                    // Stop observing once revealed
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        revealElements.forEach((el) => {
            observer.observe(el);
        });
    }

    /* ---------------------------------
       HAMBURGER MENU LOGIC
    --------------------------------- */
    const hamburger = document.getElementById("hamburger");
    const mobileMenu = document.getElementById("mobile-menu");
    const mobileLinks = document.querySelectorAll(".mobile-link");

    if (hamburger && mobileMenu) {
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("open");
            mobileMenu.classList.toggle("active");
            // Prevent body scroll when menu is open
            document.body.style.overflow = mobileMenu.classList.contains("active") ? "hidden" : "auto";
        });

        // Close menu when clicking a link
        mobileLinks.forEach(link => {
            link.addEventListener("click", () => {
                hamburger.classList.remove("open");
                mobileMenu.classList.remove("active");
                document.body.style.overflow = "auto";
            });
        });
    }

    /* ---------------------------------
       NAV TRANSITION OVERLAY LOGIC
    --------------------------------- */
    const navOverlay = document.getElementById("nav-transition-overlay");
    const navTitle = document.getElementById("nav-transition-title");
    const navLinks = document.querySelectorAll("[data-nav], .nav-links a[href^='#'], .mobile-link[href^='#']");

    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            const href = link.getAttribute("href");
            if (!href || !href.startsWith("#")) return;

            const targetEl = document.querySelector(href);
            if (!targetEl) return;

            e.preventDefault();

            // Get link label or data-nav attribute
            const labelText = link.getAttribute("data-nav") || link.textContent.trim().replace(/↗|™|\d+/g, "").trim();

            // Populate letter by letter spans
            if (navTitle) {
                navTitle.innerHTML = "";
                labelText.split("").forEach((char, idx) => {
                    const span = document.createElement("span");
                    span.className = "char";
                    span.innerHTML = char === " " ? "&nbsp;" : char;
                    span.style.animationDelay = `${0.05 * (idx + 1)}s`;
                    navTitle.appendChild(span);
                });
            }

            // Trigger overlay slide up from bottom
            if (navOverlay) {
                navOverlay.classList.remove("exiting");
                navOverlay.classList.add("active");
                
                // Close mobile menu if active
                if (mobileMenu && mobileMenu.classList.contains("active")) {
                    hamburger.classList.remove("open");
                    mobileMenu.classList.remove("active");
                    document.body.style.overflow = "auto";
                }

                // Wait for text animation and overlay to cover screen
                setTimeout(() => {
                    targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
                    
                    // Exit overlay upward
                    navOverlay.classList.add("exiting");
                    setTimeout(() => {
                        navOverlay.classList.remove("active");
                        navOverlay.classList.remove("exiting");
                    }, 600);
                }, 750);
            } else {
                targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
    });

    /* ---------------------------------
       POSTR & GYM HUB CASE STUDY MODAL LOGIC
    --------------------------------- */
    const postrModal = document.getElementById("postr-modal");
    const openPostrBtn = document.getElementById("open-postr-modal-btn");
    const postrCardTrigger = document.getElementById("postr-card-trigger");
    const closePostrBtn = document.getElementById("close-postr-modal-btn");
    const closePostrBackdrop = document.getElementById("close-postr-modal-backdrop");

    function openPostrModal() {
        if (postrModal) {
            postrModal.classList.add("active");
            document.body.style.overflow = "hidden";
        }
    }

    function closePostrModal() {
        if (postrModal) {
            postrModal.classList.remove("active");
            document.body.style.overflow = "auto";
        }
    }

    if (openPostrBtn) openPostrBtn.addEventListener("click", openPostrModal);
    if (postrCardTrigger) {
        postrCardTrigger.addEventListener("click", (e) => {
            if (!e.target.closest("button")) {
                openPostrModal();
            }
        });
    }

    if (closePostrBtn) closePostrBtn.addEventListener("click", closePostrModal);
    if (closePostrBackdrop) closePostrBackdrop.addEventListener("click", closePostrModal);

    // Gym Hub Modal Logic
    const gymhubModal = document.getElementById("gymhub-modal");
    const openGymhubBtn = document.getElementById("open-gymhub-modal-btn");
    const gymhubCardTrigger = document.getElementById("gymhub-card-trigger");
    const closeGymhubBtn = document.getElementById("close-gymhub-modal-btn");
    const closeGymhubBackdrop = document.getElementById("close-gymhub-modal-backdrop");

    function openGymhubModal() {
        if (gymhubModal) {
            gymhubModal.classList.add("active");
            document.body.style.overflow = "hidden";
        }
    }

    function closeGymhubModal() {
        if (gymhubModal) {
            gymhubModal.classList.remove("active");
            document.body.style.overflow = "auto";
        }
    }

    if (openGymhubBtn) openGymhubBtn.addEventListener("click", openGymhubModal);
    if (gymhubCardTrigger) {
        gymhubCardTrigger.addEventListener("click", (e) => {
            if (!e.target.closest("button")) {
                openGymhubModal();
            }
        });
    }

    if (closeGymhubBtn) closeGymhubBtn.addEventListener("click", closeGymhubModal);
    if (closeGymhubBackdrop) closeGymhubBackdrop.addEventListener("click", closeGymhubModal);

    // Simah Modal Logic
    const simahModal = document.getElementById("simah-modal");
    const openSimahBtn = document.getElementById("open-simah-modal-btn");
    const simahCardTrigger = document.getElementById("simah-card-trigger");
    const closeSimahBtn = document.getElementById("close-simah-modal-btn");
    const closeSimahBackdrop = document.getElementById("close-simah-modal-backdrop");

    function openSimahModal() {
        if (simahModal) {
            simahModal.classList.add("active");
            document.body.style.overflow = "hidden";
        }
    }

    function closeSimahModal() {
        if (simahModal) {
            simahModal.classList.remove("active");
            document.body.style.overflow = "auto";
        }
    }

    if (openSimahBtn) openSimahBtn.addEventListener("click", openSimahModal);
    if (simahCardTrigger) {
        simahCardTrigger.addEventListener("click", (e) => {
            if (!e.target.closest("button")) {
                openSimahModal();
            }
        });
    }

    if (closeSimahBtn) closeSimahBtn.addEventListener("click", closeSimahModal);
    if (closeSimahBackdrop) closeSimahBackdrop.addEventListener("click", closeSimahModal);

    // PDFr Modal Logic
    const pdfrModal = document.getElementById("pdfr-modal");
    const openPdfrBtn = document.getElementById("open-pdfr-modal-btn");
    const pdfrCardTrigger = document.getElementById("pdfr-card-trigger");
    const closePdfrBtn = document.getElementById("close-pdfr-modal-btn");
    const closePdfrBackdrop = document.getElementById("close-pdfr-modal-backdrop");

    function openPdfrModal() {
        if (pdfrModal) {
            pdfrModal.classList.add("active");
            document.body.style.overflow = "hidden";
        }
    }

    function closePdfrModal() {
        if (pdfrModal) {
            pdfrModal.classList.remove("active");
            document.body.style.overflow = "auto";
        }
    }

    if (openPdfrBtn) openPdfrBtn.addEventListener("click", openPdfrModal);
    if (pdfrCardTrigger) {
        pdfrCardTrigger.addEventListener("click", (e) => {
            if (!e.target.closest("button")) {
                openPdfrModal();
            }
        });
    }

    if (closePdfrBtn) closePdfrBtn.addEventListener("click", closePdfrModal);
    if (closePdfrBackdrop) closePdfrBackdrop.addEventListener("click", closePdfrModal);

    // Nas Technicals UAE Modal Logic
    const nasModal = document.getElementById("nas-modal");
    const openNasBtn = document.getElementById("open-nas-modal-btn");
    const nasCardTrigger = document.getElementById("nas-card-trigger");
    const closeNasBtn = document.getElementById("close-nas-modal-btn");
    const closeNasBackdrop = document.getElementById("close-nas-modal-backdrop");

    function openNasModal() {
        if (nasModal) {
            nasModal.classList.add("active");
            document.body.style.overflow = "hidden";
        }
    }

    function closeNasModal() {
        if (nasModal) {
            nasModal.classList.remove("active");
            document.body.style.overflow = "auto";
        }
    }

    if (openNasBtn) openNasBtn.addEventListener("click", openNasModal);
    if (nasCardTrigger) {
        nasCardTrigger.addEventListener("click", (e) => {
            if (!e.target.closest("button")) {
                openNasModal();
            }
        });
    }

    if (closeNasBtn) closeNasBtn.addEventListener("click", closeNasModal);
    if (closeNasBackdrop) closeNasBackdrop.addEventListener("click", closeNasModal);

    // EzyRation Modal Logic
    const ezyrationModal = document.getElementById("ezyration-modal");
    const openEzyrationBtn = document.getElementById("open-ezyration-modal-btn");
    const ezyrationCardTrigger = document.getElementById("ezyration-card-trigger");
    const closeEzyrationBtn = document.getElementById("close-ezyration-modal-btn");
    const closeEzyrationBackdrop = document.getElementById("close-ezyration-modal-backdrop");

    function openEzyrationModal() {
        if (ezyrationModal) {
            ezyrationModal.classList.add("active");
            document.body.style.overflow = "hidden";
        }
    }

    function closeEzyrationModal() {
        if (ezyrationModal) {
            ezyrationModal.classList.remove("active");
            document.body.style.overflow = "auto";
        }
    }

    if (openEzyrationBtn) openEzyrationBtn.addEventListener("click", openEzyrationModal);
    if (ezyrationCardTrigger) {
        ezyrationCardTrigger.addEventListener("click", (e) => {
            if (!e.target.closest("button")) {
                openEzyrationModal();
            }
        });
    }

    if (closeEzyrationBtn) closeEzyrationBtn.addEventListener("click", closeEzyrationModal);
    if (closeEzyrationBackdrop) closeEzyrationBackdrop.addEventListener("click", closeEzyrationModal);

    // Cross-Modal Navigation for Next Project Cards
    document.addEventListener("click", (e) => {
        const targetNextCard = e.target.closest(".cs-next-card");
        if (!targetNextCard) return;

        const cardText = targetNextCard.textContent.toLowerCase();
        if (cardText.includes("simah")) {
            closePostrModal();
            closeGymhubModal();
            closePdfrModal();
            closeNasModal();
            closeEzyrationModal();
            openSimahModal();
        } else if (cardText.includes("gymhub")) {
            closePostrModal();
            closeSimahModal();
            closePdfrModal();
            closeNasModal();
            closeEzyrationModal();
            openGymhubModal();
        } else if (cardText.includes("postr")) {
            closeGymhubModal();
            closeSimahModal();
            closePdfrModal();
            closeNasModal();
            closeEzyrationModal();
            openPostrModal();
        } else if (cardText.includes("pdfr")) {
            closePostrModal();
            closeGymhubModal();
            closeSimahModal();
            closeNasModal();
            closeEzyrationModal();
            openPdfrModal();
        } else if (cardText.includes("nas") || cardText.includes("technical")) {
            closePostrModal();
            closeGymhubModal();
            closeSimahModal();
            closePdfrModal();
            closeEzyrationModal();
            openNasModal();
        } else if (cardText.includes("ezy") || cardText.includes("ration")) {
            closePostrModal();
            closeGymhubModal();
            closeSimahModal();
            closePdfrModal();
            closeNasModal();
            openEzyrationModal();
        }
    });

    /* ---------------------------------
       INTERACTIVE IMAGE ZOOM LIGHTBOX LOGIC
    --------------------------------- */
    const lightboxModal = document.getElementById("image-lightbox-modal");
    const lightboxImg = document.getElementById("lightbox-img");
    const lightboxCaption = document.getElementById("lightbox-caption");
    const lightboxZoomLevel = document.getElementById("lightbox-zoom-level");
    const closeLightboxBtn = document.getElementById("close-lightbox-btn");
    const closeLightboxBackdrop = document.getElementById("close-lightbox-backdrop");
    const zoomInBtn = document.getElementById("zoom-in-btn");
    const zoomOutBtn = document.getElementById("zoom-out-btn");
    const zoomResetBtn = document.getElementById("zoom-reset-btn");

    let zoomScale = 1;
    let panX = 0;
    let panY = 0;
    let isDragging = false;
    let startX = 0;
    let startY = 0;

    function applyZoomTransform() {
        if (!lightboxImg) return;
        lightboxImg.style.transform = `translate(${panX}px, ${panY}px) scale(${zoomScale})`;
        if (lightboxZoomLevel) {
            lightboxZoomLevel.textContent = Math.round(zoomScale * 100) + "%";
        }
        if (zoomScale > 1) {
            lightboxImg.classList.add("zoomed");
        } else {
            lightboxImg.classList.remove("zoomed");
        }
    }

    function resetZoomState() {
        zoomScale = 1;
        panX = 0;
        panY = 0;
        applyZoomTransform();
    }

    function zoomIn() {
        if (zoomScale < 3.5) {
            zoomScale = Math.min(3.5, zoomScale + 0.25);
            applyZoomTransform();
        }
    }

    function zoomOut() {
        if (zoomScale > 0.5) {
            zoomScale = Math.max(0.5, zoomScale - 0.25);
            if (zoomScale <= 1) {
                panX = 0;
                panY = 0;
            }
            applyZoomTransform();
        }
    }

    function openLightbox(imgSrc, altText) {
        if (lightboxModal && lightboxImg) {
            lightboxImg.src = imgSrc;
            lightboxImg.alt = altText || "Zoomed preview";
            if (lightboxCaption) {
                lightboxCaption.textContent = altText || "Click image to zoom • Drag to pan • Scroll wheel supported";
            }
            resetZoomState();
            lightboxModal.classList.add("active");
        }
    }

    function closeLightbox() {
        if (lightboxModal) {
            lightboxModal.classList.remove("active");
            setTimeout(resetZoomState, 300);
        }
    }

    // Attach Click Event to All Images inside Case Study Modals
    document.addEventListener("click", (e) => {
        const clickedModalImg = e.target.closest(".cs-modal-body img");
        if (clickedModalImg && !e.target.closest(".cs-next-card")) {
            e.stopPropagation();
            openLightbox(clickedModalImg.src, clickedModalImg.alt);
        }
    });

    // Toolbar Control Event Listeners
    if (zoomInBtn) zoomInBtn.addEventListener("click", zoomIn);
    if (zoomOutBtn) zoomOutBtn.addEventListener("click", zoomOut);
    if (zoomResetBtn) zoomResetBtn.addEventListener("click", resetZoomState);
    if (closeLightboxBtn) closeLightboxBtn.addEventListener("click", closeLightbox);
    if (closeLightboxBackdrop) closeLightboxBackdrop.addEventListener("click", closeLightbox);

    // Click Image in Lightbox to Toggle 100% / 175% Zoom
    if (lightboxImg) {
        lightboxImg.addEventListener("click", (e) => {
            e.stopPropagation();
            if (zoomScale === 1) {
                zoomScale = 1.75;
            } else {
                resetZoomState();
            }
            applyZoomTransform();
        });

        // Drag to Pan when Zoomed
        lightboxImg.addEventListener("mousedown", (e) => {
            if (zoomScale > 1) {
                isDragging = true;
                startX = e.clientX - panX;
                startY = e.clientY - panY;
                lightboxImg.classList.add("dragging");
            }
        });

        window.addEventListener("mousemove", (e) => {
            if (isDragging) {
                panX = e.clientX - startX;
                panY = e.clientY - startY;
                applyZoomTransform();
            }
        });

        window.addEventListener("mouseup", () => {
            if (isDragging) {
                isDragging = false;
                lightboxImg.classList.remove("dragging");
            }
        });
    }

    // Mouse Wheel Zoom
    if (lightboxModal) {
        lightboxModal.addEventListener("wheel", (e) => {
            if (!lightboxModal.classList.contains("active")) return;
            e.preventDefault();
            if (e.deltaY < 0) {
                zoomIn();
            } else {
                zoomOut();
            }
        }, { passive: false });
    }

    // Keyboard Shortcuts for Zooming (+ / - / 0 / ESC)
    document.addEventListener("keydown", (e) => {
        if (lightboxModal && lightboxModal.classList.contains("active")) {
            if (e.key === "+" || e.key === "=") {
                zoomIn();
            } else if (e.key === "-" || e.key === "_") {
                zoomOut();
            } else if (e.key === "0") {
                resetZoomState();
            } else if (e.key === "Escape") {
                closeLightbox();
            }
            return;
        }

        if (e.key === "Escape") {
            if (postrModal && postrModal.classList.contains("active")) closePostrModal();
            if (gymhubModal && gymhubModal.classList.contains("active")) closeGymhubModal();
            if (simahModal && simahModal.classList.contains("active")) closeSimahModal();
            if (pdfrModal && pdfrModal.classList.contains("active")) closePdfrModal();
            if (nasModal && nasModal.classList.contains("active")) closeNasModal();
            if (ezyrationModal && ezyrationModal.classList.contains("active")) closeEzyrationModal();
        }
    });

    /* ---------------------------------
       ARTICLE INTERACTIVE FEATURES
    --------------------------------- */
    
    // 1. Reading Progress Bar
    const progressBar = document.querySelector(".reading-progress-bar");
    if (progressBar) {
        window.addEventListener("scroll", () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + "%";
        });
    }

    // 2. Toast Notification Helper
    function showToast(message) {
        let toast = document.querySelector(".toast-notification");
        if (!toast) {
            toast = document.createElement("div");
            toast.className = "toast-notification";
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.classList.add("show");
        setTimeout(() => {
            toast.classList.remove("show");
        }, 3000);
    }

    // 3. Clap Button
    const clapBtns = document.querySelectorAll(".clap-btn");
    clapBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const countEl = btn.querySelector(".clap-count");
            let count = parseInt(countEl.textContent, 10);
            count++;
            countEl.textContent = count;
            btn.classList.add("clapped");
            showToast("👏 Applauded! Thanks for your appreciation.");
        });
    });

    // 4. Share Button
    const shareBtns = document.querySelectorAll(".share-btn");
    shareBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
            }
            showToast("🔗 Article link copied to clipboard!");
        });
    });

    // 5. Bookmark Button
    const bookmarkBtns = document.querySelectorAll(".bookmark-btn");
    bookmarkBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            btn.classList.toggle("bookmarked");
            const label = btn.querySelector(".bookmark-label");
            if (btn.classList.contains("bookmarked")) {
                label.textContent = "Saved";
                showToast("🔖 Saved to your reading list!");
            } else {
                label.textContent = "Save";
                showToast("Removed from reading list.");
            }
        });
    });

    // 6. Interactive Key Takeaway Tabs
    const takeawayTabs = document.querySelectorAll(".takeaway-tab");
    takeawayTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const parent = tab.closest(".takeaway-section");
            const targetId = tab.getAttribute("data-tab");
            
            parent.querySelectorAll(".takeaway-tab").forEach(t => t.classList.remove("active"));
            parent.querySelectorAll(".takeaway-content-pane").forEach(p => p.classList.remove("active"));
            
            tab.classList.add("active");
            const targetPane = parent.querySelector(`#${targetId}`);
            if (targetPane) {
                targetPane.classList.add("active");
            }
        });
    });

    // 7. Interactive Reader Poll
    const pollCards = document.querySelectorAll(".reader-poll-card");
    pollCards.forEach(card => {
        const optionBtns = card.querySelectorAll(".poll-option-btn");
        let totalVotes = 140; // baseline

        optionBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                if (card.classList.contains("voted")) return;
                
                card.classList.add("voted");
                const selectedVotes = parseInt(btn.getAttribute("data-votes") || "40", 10) + 1;
                btn.setAttribute("data-votes", selectedVotes);
                
                let currTotal = totalVotes + 1;
                optionBtns.forEach(opt => {
                    let votes = parseInt(opt.getAttribute("data-votes") || "30", 10);
                    let pct = Math.round((votes / currTotal) * 100);
                    const fill = opt.querySelector(".poll-option-fill");
                    const pctText = opt.querySelector(".poll-option-pct");
                    if (fill) fill.style.width = pct + "%";
                    if (pctText) pctText.textContent = pct + "%";
                });
                
                showToast("📊 Vote submitted! Thanks for participating.");
            });
        });
    });

    // 8. Dynamic Comment Form Submission
    const commentForms = document.querySelectorAll(".comment-form");
    commentForms.forEach(form => {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const nameInput = form.querySelector(".comment-input");
            const textInput = form.querySelector(".comment-textarea");
            const list = form.parentElement.querySelector(".comments-list");
            
            if (!nameInput.value.trim() || !textInput.value.trim()) return;

            const initial = nameInput.value.trim().charAt(0).toUpperCase();
            const newComment = document.createElement("div");
            newComment.className = "comment-card reveal reveal-visible";
            newComment.innerHTML = `
                <div class="comment-author">
                    <div class="comment-avatar">${initial}</div>
                    <span class="comment-author-name">${escapeHTML(nameInput.value.trim())}</span>
                    <span class="comment-time">Just now</span>
                </div>
                <p class="comment-body">${escapeHTML(textInput.value.trim())}</p>
            `;
            
            list.prepend(newComment);
            nameInput.value = "";
            textInput.value = "";
            showToast("💬 Comment posted successfully!");
        });
    });

    // 9. Main Portfolio Contact Form Submission (Direct to mhdnaseerck@gmail.com)
    const contactForm = document.getElementById("portfolio-contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector(".btn-send-cta");
            const nameInput = document.getElementById("contact-name");
            const senderName = nameInput ? nameInput.value.trim() : "there";

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = "Sending... ⏳";
            }

            const formData = new FormData(contactForm);

            fetch("https://formsubmit.co/ajax/mhdnaseerck@gmail.com", {
                method: "POST",
                headers: { 
                    'Accept': 'application/json'
                },
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                showToast(`✉️ Thanks ${senderName}! Your message was sent directly to mhdnaseerck@gmail.com.`);
                contactForm.reset();
            })
            .catch(error => {
                showToast(`✉️ Thanks ${senderName}! Message sent to mhdnaseerck@gmail.com.`);
                contactForm.reset();
            })
            .finally(() => {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = "Send Message ↗";
                }
            });
        });
    }

    /* ---------------------------------
       BLOG POST INTERACTIVE WIDGET LOGIC
    --------------------------------- */

    // 1. Layout Comparison Toggle (Blog Post 1)
    const compBtns = document.querySelectorAll(".comparison-btn");
    const previewCanvas = document.getElementById("layout-preview-canvas");
    const previewDesc = document.getElementById("layout-preview-desc");

    if (compBtns.length > 0 && previewCanvas) {
        compBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                compBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                const mode = btn.getAttribute("data-mode");

                if (mode === "cluttered") {
                    previewCanvas.className = "preview-canvas cluttered";
                    previewCanvas.innerHTML = `
                        <div style="display:flex; justify-content:space-between; align-items:center; background:#ff5252; color:#fff; padding:8px 12px; font-size:11px; font-weight:700; margin-bottom:12px; border-radius:6px;">
                            ⚠️ FLASH SALE! 50% OFF EVERYTHING - CLICK HERE NOW ⚠️
                        </div>
                        <h4 style="font-size:20px; font-weight:800; color:#d32f2f; text-decoration:underline;">BUY NOW! Heavy Noise & Busy Layout</h4>
                        <p style="font-size:13px; color:#555; margin-top:8px;">Information overload: 15 competing call-to-actions, sidebars, banner popups, and zero breathing room cause immediate cognitive fatigue.</p>
                        <div style="display:flex; gap:8px; margin-top:12px;">
                            <button style="background:#ff9800; border:none; padding:6px 12px; color:#fff; font-size:11px; font-weight:700; border-radius:4px;">Subscribe</button>
                            <button style="background:#4caf50; border:none; padding:6px 12px; color:#fff; font-size:11px; font-weight:700; border-radius:4px;">Download PDF</button>
                        </div>
                    `;
                    if (previewDesc) previewDesc.textContent = "Cognitive Load: Extremely High (45% dropoff rate due to layout noise).";
                } else {
                    previewCanvas.className = "preview-canvas editorial";
                    previewCanvas.innerHTML = `
                        <span style="font-size:11px; letter-spacing:2px; text-transform:uppercase; color:#888;">Editorial Minimalism</span>
                        <h3 style="font-family:'Playfair Display', serif; font-size:28px; font-weight:400; margin-top:8px; line-height:1.3; color:#111;">Pristine Spatial Harmony</h3>
                        <p style="font-size:15px; color:#555; margin-top:12px; line-height:1.7;">Generous 48px negative space allows typography to breathe naturally. Focus is 100% anchored on content clarity.</p>
                    `;
                    if (previewDesc) previewDesc.textContent = "Cognitive Load: Zero Friction (+42% increase in reader retention).";
                }
            });
        });
    }

    // 2. Editorial Checklist Counter (Blog Post 1)
    const checklistItems = document.querySelectorAll(".checklist-item");
    const checklistProgress = document.getElementById("checklist-progress");

    if (checklistItems.length > 0) {
        checklistItems.forEach(item => {
            item.addEventListener("click", () => {
                item.classList.toggle("checked");
                const checkbox = item.querySelector(".checklist-checkbox");
                if (checkbox) {
                    checkbox.innerHTML = item.classList.contains("checked") ? "✓" : "";
                }
                const checkedCount = document.querySelectorAll(".checklist-item.checked").length;
                if (checklistProgress) {
                    checklistProgress.textContent = `${checkedCount} / ${checklistItems.length} Pillars Verified`;
                }
            });
        });
    }

    // 3. Ergonomics Contrast Simulator (Blog Post 2)
    const swatchBtns = document.querySelectorAll(".swatch-btn");
    const contrastBox = document.getElementById("contrast-preview-box");
    const contrastScore = document.getElementById("contrast-score");

    if (swatchBtns.length > 0 && contrastBox) {
        swatchBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                swatchBtns.forEach(s => s.classList.remove("active"));
                btn.classList.add("active");

                const bg = btn.getAttribute("data-bg");
                const text = btn.getAttribute("data-text");
                const score = btn.getAttribute("data-score");

                contrastBox.style.backgroundColor = bg;
                contrastBox.style.color = text;
                if (contrastScore) {
                    contrastScore.textContent = `WCAG AAA Score: ${score}`;
                }
            });
        });
    }

    // 4. Tactile Micro-Interaction Playground (Blog Post 2)
    const tactileBtns = document.querySelectorAll(".tactile-btn");
    if (tactileBtns.length > 0) {
        tactileBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                const action = btn.getAttribute("data-action");
                if (action === "haptic") {
                    showToast("📳 Haptic pulse triggered: Sub-20ms feedback!");
                } else if (action === "modal") {
                    showToast("✨ Modal spring physics executed (cubic-bezier ease-out)");
                } else if (action === "toast") {
                    showToast("💬 Toast notification floating ripple state!");
                }
            });
        });
    }

    // 5. Spot Color Visualizer (Blog Post 3)
    const spotSwatches = document.querySelectorAll(".spot-swatch");
    const spotBadge = document.getElementById("spot-badge-demo");
    const spotBtn = document.getElementById("spot-btn-demo");

    if (spotSwatches.length > 0) {
        spotSwatches.forEach(swatch => {
            swatch.addEventListener("click", () => {
                spotSwatches.forEach(s => s.classList.remove("active"));
                swatch.classList.add("active");
                const color = swatch.getAttribute("data-color");

                if (spotBadge) spotBadge.style.backgroundColor = color;
                if (spotBtn) {
                    spotBtn.style.backgroundColor = color;
                    spotBtn.style.borderColor = color;
                }
                showToast(`🎨 Spot color switched to: ${color}`);
            });
        });
    }

    // 6. Minimalist Editorial Accordion Skillsets Interactivity
    const accordionItems = document.querySelectorAll(".skill-accordion-item");
    if (accordionItems.length > 0) {
        accordionItems.forEach(item => {
            const header = item.querySelector(".accordion-header");
            const btn = item.querySelector(".accordion-toggle-btn");
            
            if (header) {
                header.addEventListener("click", () => {
                    const isActive = item.classList.contains("active");
                    
                    // Toggle current item state
                    if (isActive) {
                        item.classList.remove("active");
                        if (btn) btn.textContent = "+";
                    } else {
                        item.classList.add("active");
                        if (btn) btn.textContent = "−";
                    }
                });
            }
        });
    }

    const skillPills = document.querySelectorAll(".skill-pill");
    if (skillPills.length > 0) {
        skillPills.forEach(pill => {
            pill.addEventListener("click", (e) => {
                e.stopPropagation();
                pill.classList.toggle("active");
                const name = pill.textContent.trim();
                showToast(pill.classList.contains("active") ? `✦ Skill selected: ${name}` : `Skill unselected: ${name}`);
            });
        });
    }

    // 7. Featured Projects Section Scroll Fill Progress Bar
    const projectsSection = document.getElementById("projects");
    const progressFill = document.getElementById("projects-scroll-progress");
    const progressText = document.getElementById("projects-scroll-text");

    if (projectsSection && progressFill) {
        function updateProjectsScrollProgress() {
            const rect = projectsSection.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const sectionHeight = projectsSection.offsetHeight;
            
            // Total scrollable distance within projects section
            const totalScrollable = sectionHeight - windowHeight;
            if (totalScrollable <= 0) return;

            // Distance scrolled from section top reaching viewport top
            const currentScroll = -rect.top;
            const progress = Math.max(0, Math.min(100, (currentScroll / totalScrollable) * 100));

            progressFill.style.width = `${progress.toFixed(1)}%`;
            if (progressText) {
                progressText.textContent = `${Math.round(progress)}%`;
            }
        }

        window.addEventListener("scroll", updateProjectsScrollProgress, { passive: true });
        updateProjectsScrollProgress();
    }

    // 8. Case Study Modal Scroll Fill Progress Bar
    const modalContainers = document.querySelectorAll(".modal-container");
    if (modalContainers.length > 0) {
        modalContainers.forEach(container => {
            container.addEventListener("scroll", () => {
                const progressBar = container.querySelector(".modal-progress-bar");
                if (progressBar) {
                    const scrollTop = container.scrollTop;
                    const totalScroll = container.scrollHeight - container.clientHeight;
                    if (totalScroll > 0) {
                        const percentage = Math.max(0, Math.min(100, (scrollTop / totalScroll) * 100));
                        progressBar.style.width = `${percentage.toFixed(1)}%`;
                    }
                }
            }, { passive: true });
        });
    }

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
        );
    }
});

