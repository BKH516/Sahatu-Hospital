// Error handler for resource loading failures
(function() {
    'use strict';
    
    // Handle CSS loading errors
    function handleCSSError() {
        console.warn('CSS loading failed, applying fallback styles');
        const fallbackCSS = document.createElement('link');
        fallbackCSS.rel = 'stylesheet';
        fallbackCSS.href = '/css/fallback.css';
        document.head.appendChild(fallbackCSS);
    }
    
    // Handle Google Fonts loading errors
    function handleFontError() {
        console.warn('Google Fonts loading failed, using system fonts');
        const style = document.createElement('style');
        style.textContent = `
            body, * {
                font-family: 'Segoe UI', 'Tahoma', 'Arial', system-ui, sans-serif !important;
            }
        `;
        document.head.appendChild(style);
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
    
    // Check if fonts are loaded after a timeout
    setTimeout(function() {
        if (!document.fonts || !document.fonts.check('1em Cairo')) {
            console.warn('Cairo font not loaded, applying fallback');
            handleFontError();
        }
    }, 3000);
    
    // Handle network errors
    window.addEventListener('unhandledrejection', function(e) {
        if (e.reason && e.reason.message && e.reason.message.includes('ERR_CONNECTION_TIMED_OUT')) {
            console.warn('Network timeout detected, applying fallback resources');
            handleFontError();
            handleCSSError();
        }
    });
    
})();
