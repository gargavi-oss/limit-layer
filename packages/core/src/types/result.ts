export interface DecisionResult {
    allowed: boolean;
    remaining: number;
    limit: number;
    retryAfter: number;
    resetAt: number;
}