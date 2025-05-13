/**
 * Circuit Breaker implementation for handling external service failures
 * 
 * This pattern prevents cascading failures by stopping calls to failing services
 * and allowing them time to recover.
 */

enum CircuitState {
  CLOSED, // Normal operation, requests pass through
  OPEN,   // Circuit is open, requests fail fast
  HALF_OPEN // Testing if the service has recovered
}

interface CircuitBreakerOptions {
  failureThreshold: number;      // Number of failures before opening
  resetTimeout: number;          // Time in ms before trying again (half-open)
  maxHalfOpenCalls: number;      // Max calls in half-open state
  monitorInterval?: number;      // Interval to check for expired timeouts
}

export class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failures: number = 0;
  private successfulHalfOpenCalls: number = 0;
  private halfOpenCalls: number = 0;
  private nextAttempt: number = Date.now();
  private readonly options: CircuitBreakerOptions;
  private monitorIntervalId: NodeJS.Timeout | null = null;
  private readonly name: string;
  
  constructor(name: string, options: Partial<CircuitBreakerOptions> = {}) {
    this.name = name;
    this.options = {
      failureThreshold: options.failureThreshold || 5,
      resetTimeout: options.resetTimeout || 30000, // 30 seconds
      maxHalfOpenCalls: options.maxHalfOpenCalls || 3,
      monitorInterval: options.monitorInterval || 5000 // 5 seconds
    };
    
    // Start monitoring for state transitions
    this.startMonitoring();
  }
  
  /**
   * Execute a function with circuit breaker protection
   * @param fn The function to execute
   * @returns The result of the function
   * @throws Error if the circuit is open or the function fails
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === CircuitState.OPEN) {
      if (Date.now() < this.nextAttempt) {
        throw new Error(`Circuit breaker for ${this.name} is open`);
      }
      
      // Transition to half-open state
      this.toHalfOpen();
    }
    
    if (this.state === CircuitState.HALF_OPEN) {
      if (this.halfOpenCalls >= this.options.maxHalfOpenCalls) {
        throw new Error(`Too many calls in half-open state for ${this.name}`);
      }
      this.halfOpenCalls++;
    }
    
    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  /**
   * Handle successful call
   */
  private onSuccess(): void {
    if (this.state === CircuitState.HALF_OPEN) {
      this.successfulHalfOpenCalls++;
      
      if (this.successfulHalfOpenCalls >= this.options.maxHalfOpenCalls) {
        this.toClosed();
      }
    } else if (this.state === CircuitState.CLOSED) {
      // Reset failures in closed state
      this.failures = 0;
    }
  }
  
  /**
   * Handle failed call
   */
  private onFailure(): void {
    if (this.state === CircuitState.HALF_OPEN) {
      this.toOpen();
    } else if (this.state === CircuitState.CLOSED) {
      this.failures++;
      
      if (this.failures >= this.options.failureThreshold) {
        this.toOpen();
      }
    }
  }
  
  /**
   * Transition to closed state
   */
  private toClosed(): void {
    console.log(`Circuit breaker for ${this.name} is now CLOSED`);
    this.state = CircuitState.CLOSED;
    this.failures = 0;
    this.successfulHalfOpenCalls = 0;
    this.halfOpenCalls = 0;
  }
  
  /**
   * Transition to open state
   */
  private toOpen(): void {
    console.log(`Circuit breaker for ${this.name} is now OPEN`);
    this.state = CircuitState.OPEN;
    this.nextAttempt = Date.now() + this.options.resetTimeout;
    this.successfulHalfOpenCalls = 0;
    this.halfOpenCalls = 0;
  }
  
  /**
   * Transition to half-open state
   */
  private toHalfOpen(): void {
    console.log(`Circuit breaker for ${this.name} is now HALF-OPEN`);
    this.state = CircuitState.HALF_OPEN;
    this.successfulHalfOpenCalls = 0;
    this.halfOpenCalls = 0;
  }
  
  /**
   * Start monitoring for state transitions
   */
  private startMonitoring(): void {
    if (this.monitorIntervalId) {
      clearInterval(this.monitorIntervalId);
    }
    
    this.monitorIntervalId = setInterval(() => {
      if (this.state === CircuitState.OPEN && Date.now() >= this.nextAttempt) {
        this.toHalfOpen();
      }
    }, this.options.monitorInterval);
  }
  
  /**
   * Stop monitoring
   */
  public stop(): void {
    if (this.monitorIntervalId) {
      clearInterval(this.monitorIntervalId);
      this.monitorIntervalId = null;
    }
  }
  
  /**
   * Get the current state of the circuit breaker
   */
  public getState(): string {
    return CircuitState[this.state];
  }
  
  /**
   * Force the circuit breaker to a specific state (for testing)
   */
  public forceState(state: CircuitState): void {
    this.state = state;
    if (state === CircuitState.OPEN) {
      this.nextAttempt = Date.now() + this.options.resetTimeout;
    }
  }
}
