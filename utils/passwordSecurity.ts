/**
 * Password security utilities
 * Validates and checks password strength
 */

export interface PasswordStrength {
  score: number; // 0-5
  feedback: string[];
  isStrong: boolean;
}

export class PasswordSecurity {
  // Common passwords to avoid (Arabic and English)
  private static commonPasswords = [
    'password', '123456', '12345678', 'qwerty', 'abc123',
    'password123', '111111', '123123', 'admin', 'letmein',
    'welcome', '1234567890', 'password1', 'qwerty123',
    'مرحبا', 'كلمةالمرور', 'ادمن'
  ];
  
  /**
   * Check the strength of a password
   * @param password - The password to check
   * @returns PasswordStrength object with score and feedback
   */
  static checkStrength(password: string): PasswordStrength {
    const feedback: string[] = [];
    let score = 0;
    
    // Length check (minimum 8 characters) - مخفف من 12 إلى 8
    if (password.length >= 8) {
      score++;
      if (password.length >= 12) {
        score++; // نقطة إضافية للطول الأكبر
      }
    } else {
      feedback.push('يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل');
    }
    
    // Uppercase letters (optional but recommended)
    if (/[A-Z]/.test(password)) {
      score++;
    } else {
      feedback.push('يُفضل أن تحتوي على حرف كبير (A-Z)');
    }
    
    // Lowercase letters
    if (/[a-z]/.test(password)) {
      score++;
    } else {
      feedback.push('يجب أن تحتوي على حرف صغير (a-z)');
    }
    
    // Numbers
    if (/\d/.test(password)) {
      score++;
    } else {
      feedback.push('يجب أن تحتوي على رقم (0-9)');
    }
    
    // Special characters or uppercase (one of them is enough)
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) || /[A-Z]/.test(password)) {
      score++;
    }
    
    // Check for common passwords
    const lowerPassword = password.toLowerCase();
    if (this.commonPasswords.some(common => lowerPassword.includes(common))) {
      score = Math.max(0, score - 1);
      feedback.push('كلمة المرور شائعة، حاول استخدام كلمة أكثر تعقيداً');
    }
    
    // Check for character repetition (warning only)
    if (/(.)\1{3,}/.test(password)) {
      feedback.push('تجنب تكرار نفس الحرف أكثر من 3 مرات');
    }
    
    return {
      score,
      feedback,
      isStrong: score >= 4 && password.length >= 8
    };
  }
  
  /**
   * Validate if password meets minimum requirements
   * @param password - The password to validate
   * @returns True if password is strong enough
   */
  static isValid(password: string): boolean {
    const strength = this.checkStrength(password);
    return strength.score >= 3 && password.length >= 8; // At least 3 points and 8 characters
  }
  
  /**
   * Get a human-readable strength label
   * @param score - The password strength score (0-6)
   * @returns Label in Arabic
   */
  static getStrengthLabel(score: number): string {
    if (score <= 1) return 'ضعيفة جداً';
    if (score <= 2) return 'ضعيفة';
    if (score <= 3) return 'مقبولة';
    if (score <= 4) return 'جيدة';
    if (score <= 5) return 'قوية';
    return 'قوية جداً';
  }
  
  /**
   * Generate a strong password
   * @param length - The length of the password (default: 16)
   * @returns A strong random password
   */
  static generateStrongPassword(length: number = 16): string {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const all = uppercase + lowercase + numbers + special;
    
    let password = '';
    
    // Ensure at least one of each type
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += special[Math.floor(Math.random() * special.length)];
    
    // Fill the rest randomly
    for (let i = password.length; i < length; i++) {
      password += all[Math.floor(Math.random() * all.length)];
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }
}

export default PasswordSecurity;

