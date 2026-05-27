/// <reference types="vite/client" />
/// <reference types="vite-imagetools/client" />

// vite-imagetools: any query containing &format= or ?format= returns a URL string.
declare module "*&format=webp*" { const src: string; export default src; }
declare module "*?format=webp*" { const src: string; export default src; }
declare module "*&format=avif*" { const src: string; export default src; }
declare module "*?format=avif*" { const src: string; export default src; }
declare module "*&as=srcset*" { const srcset: string; export default srcset; }
declare module "*?as=srcset*" { const srcset: string; export default srcset; }
