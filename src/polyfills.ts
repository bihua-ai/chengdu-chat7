// Polyfill for Matrix SDK's global requirement
if (typeof global === 'undefined') {
  (window as any).global = window;
}