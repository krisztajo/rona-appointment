// No-op timers shim to avoid assigning to read-only globals in Cloudflare Workers
export const setImmediate = undefined;
export const clearImmediate = () => {};
