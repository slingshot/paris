# Paris

Paris is Slingshot's React design system, meant to work universally across server and client components. It's a collection of reusable components, design tokens, and guidelines for building consistent, accessible, and performant user interfaces.

Paris ships as **precompiled ESM** with extracted CSS and TypeScript declarations. Each component is a separate entry point, so you import only what you need and tree-shaking keeps your bundle small. Because it's prebuilt, Paris works out of the box in any modern React setup — Next.js (including the App Router and Server Components) and Vite React — with no special bundler configuration and no Sass toolchain required.

Paris 1.x styling is heavily inspired by Uber's [Base Web](https://baseweb.design), which we previously used in our production apps. We built Paris to move away from Styletron and CSS-in-JS, since we're now largely working with React 19, RSC, and the Next.js `app` directory.

<br />

## Getting started

First, install Paris in your project:

```bash
pnpm i paris
# or
yarn add paris
# or
npm i paris
```

Make sure your `tsconfig` module resolution is set to `nodenext`, `node16`, or `bundler` to support `paris` imports:

```json
{
    "compilerOptions": {
        "moduleResolution": "bundler"
    }
}
```

That's all the bundler setup required. Because Paris is prebuilt, there's **no `transpilePackages` to add and no `sass` dependency to install** — the component CSS is already extracted and auto-imported alongside each component. (If you're upgrading from an older Paris that required these, you can now remove them.)

Paris uses `pte` (our theming engine) for powering theming and initial styles through CSS variables. You can use `generateCSS` or `generateThemeInjection` from `paris/theme` to generate the CSS variables and inject them into your app through either a `style` or `script` tag in your document head respectively. Either method supports SSR and server components, since the initial theme is static.

Additionally, you need to import the precompiled static global styles from `paris/theme/global.css`.

Paris also relies on CSS Container Queries for responsive changes on certain elements, like the Tabs component when `kind = auto`. Adding the Google polyfill for Container Queries is recommended to ensure legacy browser support:

```tsx
// Use the `Script` component instead in Next.js
<script src="https://cdn.jsdelivr.net/npm/container-query-polyfill@1/dist/container-query-polyfill.modern.js" />
```

For example, with the Next.js 13 app directory, you can do all of this in your root `layout.tsx` file:

```tsx
// app/layout.tsx
import { generateCSS, generateThemeInjection, theme } from 'paris/theme';

// Import Paris's static global styling
import 'paris/theme/global.css';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <head>
            {/* Using a `style` tag (MUST have the id `pte-vars` and be in the document head) */}
            <style
                id="pte-vars"
                dangerouslySetInnerHTML={{
                    __html: generateCSS(theme),
                }}
            />

            {/* Or, use a `script` tag (can be located anywhere, should be loaded as early as possible to avoid an unstyled flash) */}
            <script
                dangerouslySetInnerHTML={{
                    __html: generateThemeInjection(theme),
                }}
            />
        </head>
        {/* Set the class "paris-container" to your root layout container */}
        <body className="paris-container">
            {children}
            <Script src="https://cdn.jsdelivr.net/npm/container-query-polyfill@1/dist/container-query-polyfill.modern.js" />
        </body>
        </html>
    );
}
```

That's it! You can now import any component from Paris:

```tsx
import { Button } from 'paris/button';

const App = () => (
    <Button>Click me</Button>
);
```

This works out of the box with Next.js (App Router and Server Components) and Vite React — components ship as compiled ESM with their styles already bundled, so no extra bundler or Sass configuration is needed.
