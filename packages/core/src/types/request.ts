export interface LLRequest {
    method: string;
    path: string;
    ip: string;
    headers: Record<string, string>;
    query: Record<string, unknown>;
    body?: unknown;  
    user?: unknown;
}



