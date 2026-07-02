export class InvalidTimeWindowError extends Error {
    constructor(window: string | number) {
      super(`Invalid time window: ${window}`);
      this.name = "InvalidTimeWindowError";
    }
  }

