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
    
    // Length check (minimum 12 characters)
    if (password.length >= 12) {
      score++;
    } else {
      feedback.push('يجب أن تحتوي كلمة المرور على 12 حرف على الأقل');
    }
    
    // Uppercase letters
    if (/[A-Z]/.test(password)) {
      score++;
    } else {
      feedback.push('يجب أن تحتوي على حرف كبير على الأقل (A-Z)');
    }
    
    // Lowercase letters
    if (/[a-z]/.test(password)) {
      score++;
    } else {
      feedback.push('يجب أن تحتوي على حرف صغير على الأقل (a-z)');
    }
    
    // Numbers
    if (/\d/.test(password)) {
      score++;
    } else {
      feedback.push('يجب أن تحتوي على رقم على الأقل (0-9)');
    }
    
    // Special characters
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      score++;
    } else {
      feedback.push('يجب أن تحتوي على رمز خاص على الأقل (!@#$%...)');
    }
    
    // Check for common passwords
    const lowerPassword = password.toLowerCase();
    if (this.commonPasswords.some(common => lowerPassword.includes(common))) {
      score = Math.max(0, score - 2);
      feedback.push('كلمة المرور شائعة جداً، استخدم كلمة مرور أكثر تعقيداً');
    }
    
    // Check for character repetition
    if (/(.)\1{2,}/.test(password)) {
      feedback.push('تجنب تكرار نفس الحرف أكثر من مرتين');
    }
    
    // Check for sequential characters
    if (/(012|123|234|345|456|567|678|789|abc|bcd|cde|def)/i.test(password)) {
      feedback.push('تجنب استخدام أحرف أو أرقام متسلسلة');
    }
    
    return {
      score,
      feedback,
      isStrong: score >= 5 && feedback.length === 0
    };
  }
  
  /**
   * Validate if password meets minimum requirements
   * @param password - The password to validate
   * @returns True if password is strong enough
   */
  static isValid(password: string): boolean {
    const strength = this.checkStrength(password);
    return strength.score >= 4; // At least 4 out of 5 requirements
  }
  
  /**
   * Get a human-readable strength label
   * @param score - The password strength score (0-5)
   * @returns Label in Arabic
   */
  static getStrengthLabel(score: number): string {
    if (score <= 1) return 'ضعيفة جداً';
    if (score <= 2) return 'ضعيفة';
    if (score <= 3) return 'متوسطة';
    if (score <= 4) return 'جيدة';
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

