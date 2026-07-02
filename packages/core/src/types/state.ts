export interface FixedWindowState {
    count: number;
    resetAt: number;
  }
  
  export interface SlidingWindowState {
    previous: number;
    current: number;
    resetAt: number;
  }
  
  export interface SlidingLogState {
    timestamps: number[];
  }
  
  export interface TokenBucketState {
    tokens: number;
    lastRefill: number;
  }
  
  export interface LeakyBucketState {
    water: number;
    lastLeak: number;
  }