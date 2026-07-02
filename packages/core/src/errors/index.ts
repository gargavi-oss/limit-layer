export class LimitLayerError extends Error {
    constructor(message: string) {
      super(message);
  
      this.name = "LimitLayerError";
  
      Object.setPrototypeOf(this, new.target.prototype);
    }
  }
  
  export class InvalidTimeWindowError extends LimitLayerError {
    constructor(window: string | number) {
      super(`Invalid time window: ${window}`);
  
      this.name = "InvalidTimeWindowError";
    }
  }
  
  export class RuleNotFoundError extends LimitLayerError {
    constructor(rule: string) {
      super(`Rule not found: ${rule}`);
  
      this.name = "RuleNotFoundError";
    }
  }
  
  export class StorageError extends LimitLayerError {
    constructor(message: string) {
      super(message);
  
      this.name = "StorageError";
    }
  }
  
  export class AlgorithmError extends LimitLayerError {
    constructor(message: string) {
      super(message);
  
      this.name = "AlgorithmError";
    }
  }