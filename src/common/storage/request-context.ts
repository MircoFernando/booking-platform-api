import { AsyncLocalStorage } from 'async_hooks';

//Creates an isolated context for each request that holds the RequestID
export const RequestContext = new AsyncLocalStorage<{ requestId: string }>();