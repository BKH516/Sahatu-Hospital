/**
 * Encryption utilities for securing sensitive data
 * Uses AES encryption with CryptoJS
 */
import CryptoJS from 'crypto-js';

// Get encryption key from environment variables
// In production, this should be a strong, random key
const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'default-key-change-in-production';

/**
 * Utility functions for encrypting and decrypting data
 */
export const EncryptionUtils = {
  /**
   * Encrypt a string using AES encryption
   * @param text - The plain text to encrypt
   * @returns Encrypted string
   */
  encrypt: (text: string): string => {
    try {
      return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
    } catch (error) {
      // Encryption error
      throw new Error('Failed to encrypt data');
    }
  },
  
  /**
   * Decrypt an encrypted string
   * @param ciphertext - The encrypted text
   * @returns Decrypted plain text
   */
  decrypt: (ciphertext: string): string => {
    try {
      const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      
      if (!decrypted) {
        throw new Error('Decryption failed - invalid key or corrupted data');
      }
      
      return decrypted;
    } catch (error) {
      // Decryption error
      throw new Error('Failed to decrypt data');
    }
  }
};

export default EncryptionUtils;

