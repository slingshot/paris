// Ambient module declarations for CSS Modules, so the type emitter (tsc /
// vite-plugin-dts) and consumers can resolve `import styles from './X.module.scss'`
// without depending on Next.js's generated `next-env.d.ts`.
declare module '*.module.scss' {
    const classes: { readonly [key: string]: string };
    export default classes;
}

declare module '*.module.css' {
    const classes: { readonly [key: string]: string };
    export default classes;
}
