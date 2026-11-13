import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(Flip, ScrollTrigger);

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const scrollProgress = document.querySelector("[data-scroll-progress]");

if (scrollProgress instanceof HTMLElement) {
    let updateScheduled = false;

    function updateScrollProgress() {
        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollableHeight > 0
            ? Math.min(Math.max(window.scrollY / scrollableHeight, 0), 1)
            : 0;

        scrollProgress.style.transform = `scaleX(${progress})`;
        scrollProgress.setAttribute("aria-valuenow", String(Math.round(progress * 100)));
        updateScheduled = false;
    }

    function scheduleProgressUpdate() {
        if (updateScheduled) return;
        updateScheduled = true;
        window.requestAnimationFrame(updateScrollProgress);
    }

    window.addEventListener("scroll", scheduleProgressUpdate, { passive: true });
    window.addEventListener("resize", scheduleProgressUpdate, { passive: true });
    window.addEventListener("load", scheduleProgressUpdate, { once: true });
    updateScrollProgress();
}

const themeToggle = document.querySelector("[data-theme-toggle]");

if (themeToggle instanceof HTMLButtonElement) {
    const savedTheme = localStorage.getItem("theme");
    const initialTheme = savedTheme === "light" ? "light" : "dark";

    function updateTheme(theme) {
        document.documentElement.dataset.theme = theme;
        themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
        themeToggle.textContent = theme === "dark" ? "Light mode" : "Dark mode";
    }

    updateTheme(initialTheme);

    themeToggle.addEventListener("click", () => {
        const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
        localStorage.setItem("theme", nextTheme);
        updateTheme(nextTheme);

        if (!prefersReducedMotion.matches) {
            gsap.to(themeToggle, {
                rotation: "+=360",
                duration: 0.6,
                ease: "power2.inOut",
            });
        }
    });
}

const pageElements = gsap.utils.toArray(
    ".site-header .logo, .site-header nav a, .site-header .header-actions button, .hero > *",
);

if (!prefersReducedMotion.matches && pageElements.length > 0) {
    gsap.from(pageElements, {
        y: 30,
        autoAlpha: 0,
        duration: 0.4,
        stagger: { amount: 1.2, from: "start" },
        ease: "power2.out",
        clearProps: "all",
    });
}

function animateOnScroll(targets, trigger, options = {}) {
    if (prefersReducedMotion.matches || document.querySelectorAll(targets).length === 0) {
        return;
    }

    gsap.from(targets, {
        y: 30,
        autoAlpha: 0,
        duration: 0.55,
        stagger: 0.15,
        ease: "power2.out",
        clearProps: "all",
        scrollTrigger: {
            trigger,
            start: "top 82%",
            toggleActions: "play none none reverse",
        },
        ...options,
    });
}

animateOnScroll("#services > h2", "#services", { stagger: 0 });
animateOnScroll(".service", ".services");
animateOnScroll("#process > h2, .process-step", "#process");
animateOnScroll("#faq > h2, .faq-item", "#faq");
animateOnScroll("#contact > *", "#contact");

document.querySelector("[data-refresh-page]")?.addEventListener("click", () => {
    window.location.reload();
});

const letsTalk = document.querySelector(".hero-cta, #letsTalk");

if (letsTalk instanceof HTMLElement) {
    letsTalk.addEventListener("click", () => {
        if (!prefersReducedMotion.matches) {
            gsap.to(letsTalk, {
                rotation: "+=360",
                duration: 0.8,
                ease: "power2.inOut",
            });
        }
    });
}

const contactMessage = document.getElementById("contactMessage");

if (contactMessage) {
    contactMessage.addEventListener("click", (event) => {
        if (event.target instanceof Element && event.target.closest("a")) {
            return;
        }

        if (prefersReducedMotion.matches) {
            contactMessage.classList.toggle("contact-highlight");
            return;
        }

        const state = Flip.getState(contactMessage);
        contactMessage.classList.toggle("contact-highlight");
        Flip.from(state, {
            duration: 0.6,
            ease: "power2.inOut",
            absolute: true,
        });
    });
}

