/**
 * CSRF Protection utilities
 * Generates and validates CSRF tokens to prevent Cross-Site Request Forgery attacks
 */

export class CSRFProtection {
  private static readonly tokenKey = 'csrf_token';
  
  /**
   * Generate a new CSRF token
   * @returns The generated token
   */
  static generateToken(): string {
    // Use crypto.randomUUID() for secure random token generation
    const token = crypto.randomUUID();
    sessionStorage.setItem(this.tokenKey, token);
    return token;
  }
  
  /**
   * Get the current CSRF token, or generate a new one if it doesn't exist
   * @returns The CSRF token
   */
  static getToken(): string | null {
    let token = sessionStorage.getItem(this.tokenKey);
    
    if (!token) {
      token = this.generateToken();
    }
    
    return token;
  }
  
  /**
   * Validate a CSRF token
   * @param token - The token to validate
   * @returns True if the token is valid, false otherwise
   */
  static validateToken(token: string): boolean {
    const storedToken = sessionStorage.getItem(this.tokenKey);
    return token === storedToken;
  }
  
  /**
   * Clear the CSRF token
   */
  static clearToken(): void {
    sessionStorage.removeItem(this.tokenKey);
  }
  
  /**
   * Refresh the CSRF token (generate a new one)
   * @returns The new token
   */
  static refreshToken(): string {
    this.clearToken();
    return this.generateToken();
  }
}

export default CSRFProtection;

