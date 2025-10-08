/**
 * Sanitization utilities for XSS protection
 * Uses DOMPurify to clean user inputs
 */
import DOMPurify from 'dompurify';

/**
 * Utility functions for sanitizing user inputs
 */
export const SanitizationUtils = {
  /**
   * Sanitize HTML content - allows safe HTML tags
   * @param dirty - The potentially dangerous HTML string
   * @returns Sanitized HTML string
   */
  sanitizeHTML: (dirty: string): string => {
    return DOMPurify.sanitize(dirty, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
      ALLOWED_ATTR: ['href', 'target'],
    });
  },
  
  /**
   * Sanitize text - removes all HTML tags
   * @param text - The text to sanitize
   * @returns Plain text without any HTML
   */
  sanitizeText: (text: string): string => {
    return DOMPurify.sanitize(text, { ALLOWED_TAGS: [] });
  },
  
  /**
   * Sanitize email address
   * @param email - The email to sanitize
   * @returns Sanitized email in lowercase
   */
  sanitizeEmail: (email: string): string => {
    return email.toLowerCase().trim().replace(/[^\w@.-]/g, '');
  },
  
  /**
   * Sanitize phone number
   * @param phone - The phone number to sanitize
   * @returns Sanitized phone with only digits and +
   */
  sanitizePhone: (phone: string): string => {
    return phone.replace(/[^\d+]/g, '');
  },
  
  /**
   * Sanitize URL
   * @param url - The URL to sanitize
   * @returns Sanitized URL or empty string if invalid
   */
  sanitizeURL: (url: string): string => {
    try {
      const parsed = new URL(url);
      // Only allow https and http protocols
      if (!['https:', 'http:'].includes(parsed.protocol)) {
        return '';
      }
      return DOMPurify.sanitize(url);
    } catch {
      return '';
    }
  }
};

export default SanitizationUtils;

