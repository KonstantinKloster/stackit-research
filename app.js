/**
 * STACKIT Research Hub - Interactive JavaScript
 * Modern, accessible, and performant
 */

(function() {
    'use strict';

    // ============================================
    // DOM Elements
    // ============================================
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const backToTop = document.getElementById('backToTop');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    // ============================================
    // Scroll Handler - Throttled
    // ============================================
    let scrollTimeout;
    let lastScrollY = window.scrollY;

    function handleScroll() {
        const scrollY = window.scrollY;

        // Navbar background
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Back to top button
        if (scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }

        // Update active nav link
        updateActiveNavLink(scrollY);

        lastScrollY = scrollY;
    }

    // Throttled scroll listener
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = window.requestAnimationFrame(handleScroll);
    }, { passive: true });

    // ============================================
    // Active Navigation Link
    // ============================================
    function updateActiveNavLink(scrollY) {
        const scrollPosition = scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                        link.style.color = 'var(--color-text-heading)';
                    } else {
                        link.style.color = '';
                    }
                });
            }
        });
    }

    // ============================================
    // Mobile Navigation Toggle
    // ============================================
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Close mobile menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // ============================================
    // Smooth Scroll for Anchor Links
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Update URL hash without jumping
                history.pushState(null, '', targetId);
            }
        });
    });

    // ============================================
    // Back to Top
    // ============================================
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ============================================
    // Intersection Observer for Animations
    // ============================================
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for fade-in animation
    document.querySelectorAll('.card, .service-card, .highlight-item, .summary-card').forEach(el => {
        el.classList.add('fade-in');
        fadeObserver.observe(el);
    });

    // ============================================
    // Table of Contents Generator (Optional)
    // ============================================
    function generateTOC() {
        const tocContainer = document.getElementById('toc');
        if (!tocContainer) return;

        const headings = document.querySelectorAll('section h2');
        const tocList = document.createElement('ul');
        tocList.className = 'toc-list';

        headings.forEach((heading, index) => {
            const section = heading.closest('section');
            if (!section) return;

            const sectionId = section.getAttribute('id');
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = `#${sectionId}`;
            a.textContent = heading.textContent;
            a.className = 'toc-link';
            a.dataset.section = sectionId;

            li.appendChild(a);
            tocList.appendChild(li);
        });

        tocContainer.appendChild(tocList);
    }

    // ============================================
    // Copy to Clipboard (for code blocks)
    // ============================================
    function initCopyButtons() {
        document.querySelectorAll('pre, .copyable').forEach(block => {
            const button = document.createElement('button');
            button.className = 'copy-button';
            button.innerHTML = '<i class="fas fa-copy"></i>';
            button.setAttribute('aria-label', 'Copy to clipboard');

            button.addEventListener('click', async () => {
                const text = block.textContent;
                try {
                    await navigator.clipboard.writeText(text);
                    button.innerHTML = '<i class="fas fa-check"></i>';
                    button.classList.add('copied');
                    setTimeout(() => {
                        button.innerHTML = '<i class="fas fa-copy"></i>';
                        button.classList.remove('copied');
                    }, 2000);
                } catch (err) {
                    console.error('Failed to copy:', err);
                }
            });

            if (block.tagName === 'PRE') {
                block.style.position = 'relative';
                block.appendChild(button);
            }
        });
    }

    // ============================================
    // Dark Mode Toggle (if needed in future)
    // ============================================
    function initDarkMode() {
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (!darkModeToggle) return;

        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedTheme = localStorage.getItem('theme');

        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            document.documentElement.classList.add('dark');
        }

        darkModeToggle.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark');
            localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
        });
    }

    // ============================================
    // Lazy Loading Images
    // ============================================
    function initLazyLoading() {
        const lazyImages = document.querySelectorAll('img[data-src]');

        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                });
            });

            lazyImages.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            lazyImages.forEach(img => {
                img.src = img.dataset.src;
            });
        }
    }

    // ============================================
    // Search Functionality (if search input exists)
    // ============================================
    function initSearch() {
        const searchInput = document.getElementById('searchInput');
        const searchResults = document.getElementById('searchResults');
        if (!searchInput) return;

        let searchIndex = [];

        // Build search index from content
        document.querySelectorAll('section').forEach(section => {
            const title = section.querySelector('h2')?.textContent || '';
            const content = section.textContent;
            const id = section.getAttribute('id');
            searchIndex.push({ title, content, id });
        });

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            if (query.length < 2) {
                searchResults.innerHTML = '';
                return;
            }

            const results = searchIndex.filter(item =>
                item.title.toLowerCase().includes(query) ||
                item.content.toLowerCase().includes(query)
            );

            displaySearchResults(results, query);
        });

        function displaySearchResults(results, query) {
            if (results.length === 0) {
                searchResults.innerHTML = '<p class="no-results">No results found</p>';
                return;
            }

            const html = results.map(result => `
                <a href="#${result.id}" class="search-result">
                    <strong>${highlightQuery(result.title, query)}</strong>
                    <p>${highlightQuery(result.content.substring(0, 150), query)}...</p>
                </a>
            `).join('');

            searchResults.innerHTML = html;
        }

        function highlightQuery(text, query) {
            const regex = new RegExp(`(${query})`, 'gi');
            return text.replace(regex, '<mark>$1</mark>');
        }
    }

    // ============================================
    // Keyboard Navigation
    // ============================================
    document.addEventListener('keydown', (e) => {
        // Escape to close mobile menu
        if (e.key === 'Escape' && navMenu?.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        }

        // / key to focus search
        if (e.key === '/' && document.activeElement.tagName !== 'INPUT') {
            e.preventDefault();
            const searchInput = document.getElementById('searchInput');
            if (searchInput) searchInput.focus();
        }
    });

    // ============================================
    // Print Handler
    // ============================================
    window.addEventListener('beforeprint', () => {
        document.body.classList.add('printing');
    });

    window.addEventListener('afterprint', () => {
        document.body.classList.remove('printing');
    });

    // ============================================
    // Performance: Preload Critical Resources
    // ============================================
    function preloadCriticalResources() {
        const criticalFonts = [
            'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap'
        ];

        criticalFonts.forEach(url => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = url;
            document.head.appendChild(link);
        });
    }

    // ============================================
    // Analytics (Privacy-friendly, no external scripts)
    // ============================================
    function trackEvent(eventName, data = {}) {
        // Simple local analytics - extend as needed
        const event = {
            name: eventName,
            timestamp: new Date().toISOString(),
            data: data
        };

        // Store in localStorage for debugging
        const events = JSON.parse(localStorage.getItem('stackit_events') || '[]');
        events.push(event);
        localStorage.setItem('stackit_events', JSON.stringify(events.slice(-100))); // Keep last 100

        console.log('Event tracked:', event);
    }

    // Track section views
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                trackEvent('section_view', { section: entry.target.id });
            }
        });
    }, { threshold: 0.5 });

    sections.forEach(section => sectionObserver.observe(section));

    // ============================================
    // Initialize Everything
    // ============================================
    function init() {
        handleScroll();
        generateTOC();
        initLazyLoading();
        initSearch();
        initDarkMode();
        
        // Track initial page load
        trackEvent('page_load', {
            path: window.location.pathname,
            referrer: document.referrer
        });

        console.log('✅ STACKIT Research Hub initialized');
    }

    // Run initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose some utilities globally for debugging
    window.StackitHub = {
        trackEvent,
        scrollToSection: (id) => {
            document.querySelector(`#${id}`)?.scrollIntoView({ behavior: 'smooth' });
        }
    };

})();