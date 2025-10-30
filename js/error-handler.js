// Error handler for resource loading failures
(function() {
    'use strict';
    
    // Schedule helper to avoid layout thrash on the main thread
    function schedule(fn) {
        if (typeof window.requestIdleCallback === 'function') {
            return window.requestIdleCallback(fn, { timeout: 500 });
        }
        return window.requestAnimationFrame(function() {
            setTimeout(fn, 0);
        });
    }

    // Handle CSS loading errors (scheduled)
    function handleCSSError() {
        schedule(function() {
            const fallbackCSS = document.createElement('link');
            fallbackCSS.rel = 'stylesheet';
            fallbackCSS.href = '/css/fallback.css';
            document.head.appendChild(fallbackCSS);
        });
    }
    
    // Handle Google Fonts loading errors (scheduled)
    function handleFontError() {
        schedule(function() {
            const style = document.createElement('style');
            style.textContent = `
                body, * {
                    font-family: 'Segoe UI', 'Tahoma', 'Arial', system-ui, sans-serif !important;
                }
            `;
            document.head.appendChild(style);
        });
    }
    
    // Monitor for resource loading errors
    window.addEventListener('error', function(e) {
        if (e.target.tagName === 'LINK' && e.target.rel === 'stylesheet') {
            if (e.target.href.includes('fonts.googleapis.com')) {
                handleFontError();
            } else {
                handleCSSError();
            }
        }
    }, true);
    
    // Check if fonts are loaded after a timeout (scheduled to idle)
    setTimeout(function() {
        schedule(function() {
            if (!document.fonts || !document.fonts.check('1em Cairo')) {
                handleFontError();
            }
        });
    }, 3000);
    
    // Handle network errors
    window.addEventListener('unhandledrejection', function(e) {
        if (e.reason && e.reason.message && e.reason.message.includes('ERR_CONNECTION_TIMED_OUT')) {
            handleFontError();
            handleCSSError();
        }
    });
    
})();
