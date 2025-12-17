# Paris

Paris is Slingshot's React design system, meant to work universally across server and client components. It's a collection of reusable components, design tokens, and guidelines for building consistent, accessible, and performant user interfaces.

Paris ships as pre-compiled ESM JavaScript with TypeScript declarations (`.d.ts`) and compiled CSS modules. No special bundler configuration is required.

Paris styling is heavily inspired by Uber's [Base Web](https://baseweb.design), which we previously used in our production apps. We built Paris to move away from Styletron and CSS-in-JS, since we're now largely working with React 18, RSC, and the Next.js `app` directory.

<br />

## Getting started

First, install Paris in your project:

```bash
pnpm add paris
# or
yarn add paris
# or
npm install paris
```

Paris uses `pte` (our theming engine) for powering theming and initial styles through CSS variables. You can use `generateCSS` or `generateThemeInjection` from `paris/theme` to generate the CSS variables and inject them into your app through either a `style` or `script` tag in your document head respectively. Either method supports SSR and server components, since the initial theme is static.

Additionally, you need to import the static global styles from `paris/theme/global.css`.

Paris also relies on CSS Container Queries for responsive changes on certain elements, like the Tabs component when `kind = auto`. Adding the Google polyfill for Container Queries is recommended to ensure legacy browser support:

```tsx
// Use the `Script` component instead in Next.js
<script src="https://cdn.jsdelivr.net/npm/container-query-polyfill@1/dist/container-query-polyfill.modern.js" />
```

For example, with the Next.js app directory, you can do all of this in your root `layout.tsx` file:

```tsx
// app/layout.tsx
import { generateCSS, theme } from 'paris/theme';

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
            {/* Inject theme CSS variables */}
            <style
                id="pte-vars"
                dangerouslySetInnerHTML={{
                    __html: generateCSS(theme),
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

No special bundler configuration is needed - Paris ships pre-compiled and works with any React 18+ project.
