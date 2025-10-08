/**
 * Rate Limiter utility
 * Prevents brute force attacks by limiting the number of requests
 */

export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  
  constructor(
    private maxRequests: number = 10,
    private timeWindow: number = 60000 // 1 minute in milliseconds
  ) {}
  
  /**
   * Check if a request can be made for the given key
   * @param key - Identifier (e.g., email, IP address)
   * @returns True if request is allowed, false otherwise
   */
  canMakeRequest(key: string): boolean {
    const now = Date.now();
    const timestamps = this.requests.get(key) || [];
    
    // Remove timestamps outside the time window
    const validTimestamps = timestamps.filter(
      timestamp => now - timestamp < this.timeWindow
    );
    
    // Check if limit exceeded
    if (validTimestamps.length >= this.maxRequests) {
      return false;
    }
    
    // Add current timestamp
    validTimestamps.push(now);
    this.requests.set(key, validTimestamps);
    
    return true;
  }
  
  /**
   * Get time until next request is allowed
   * @param key - Identifier
   * @returns Time in milliseconds, or 0 if requests are allowed
   */
  getTimeUntilNextRequest(key: string): number {
    const timestamps = this.requests.get(key) || [];
    if (timestamps.length < this.maxRequests) {
      return 0;
    }
    
    const oldestTimestamp = Math.min(...timestamps);
    const timeElapsed = Date.now() - oldestTimestamp;
    
    return Math.max(0, this.timeWindow - timeElapsed);
  }
  
  /**
   * Reset the rate limit for a key
   * @param key - Identifier to reset
   */
  reset(key: string): void {
    this.requests.delete(key);
  }
  
  /**
   * Clear all rate limits
   */
  clearAll(): void {
    this.requests.clear();
  }
  
  /**
   * Get number of remaining requests
   * @param key - Identifier
   * @returns Number of requests remaining in the current window
   */
  getRemainingRequests(key: string): number {
    const now = Date.now();
    const timestamps = this.requests.get(key) || [];
    
    const validTimestamps = timestamps.filter(
      timestamp => now - timestamp < this.timeWindow
    );
    
    return Math.max(0, this.maxRequests - validTimestamps.length);
  }
}

export default RateLimiter;

