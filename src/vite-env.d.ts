/// <reference types="vite/client" />
/// <reference types="vite-imagetools/client" />

// vite-imagetools transcoded image imports — declare each query suffix used in the app.
// TS module wildcards allow only one '*' per pattern, so we declare per-suffix.
declare module "*?format=webp&w=800&quality=82" { const src: string; export default src; }
declare module "*?format=webp&w=900&quality=78" { const src: string; export default src; }
declare module "*?format=webp&w=1000&quality=78" { const src: string; export default src; }
declare module "*?format=webp&w=1200&quality=78" { const src: string; export default src; }
declare module "*?format=webp&w=1600&quality=78" { const src: string; export default src; }
declare module "*?format=webp&w=1800&quality=78" { const src: string; export default src; }
declare module "*?format=webp&w=1800&quality=80" { const src: string; export default src; }
