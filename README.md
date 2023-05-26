# Paris

Paris is Slingshot's React design system, meant to work universally across server and client components. It's a collection of reusable components, design tokens, and guidelines for building consistent, accessible, and performant user interfaces.

Currently, Paris is provided as a set of *unbundled* `.tsx` components styled with SCSS modules. This means that you can import only the components you need, and you can use your own bundler to optimize your bundle size. As a result, Paris works best with frameworks like Next.js that have built-in support for TypeScript and SCSS modules.

Paris 1.x styling is heavily inspired by Uber's [Base Web](https://baseweb.design), which we previously used in our production apps. We built Paris because to move away from Styletron and CSS-in-JS, since we're now largely working with React 18, RSC, and the Next.js `app` directory.

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

You'll need to tell your bundler to transpile files from Paris. This is easy in Next.js 13.1+ with the `transpilePackages` option in `next.config.js`:

```js
// next.config.js
module.exports = {
    // ...
    transpilePackages: ['paris'],
};
```

For older versions of Next.js, you can use a plugin like [next-transpile-modules](https://www.npmjs.com/package/next-transpile-modules). Instructions for other bundlers are coming soon.

You'll need to configure your bundler to support Sass/SCSS and SCSS modules. In Next.js, support for SCSS modules is built-in and can be enabled by simply installing `sass` as a dependency.

Paris uses `pte` (our theming engine) for powering theming and initial styles through CSS variables. You can use `generateCSS` or `generateThemeInjection` from `paris/theme` to generate the CSS variables and inject them into your app through either a `style` or `script` tag in your document head respectively. Either method supports SSR and server components, since the initial theme is static.

Additionally, you need to import the static global styles from `paris/theme/global.scss`.

For example, with the Next.js 13 app directory, you can do all of this in your root `layout.tsx` file:

```tsx
// app/layout.tsx
import { generateCSS, generateThemeInjection, theme } from 'paris/theme';

// Import Paris's static global styling
import 'paris/theme/global.scss';

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
        <body className={inter.className}>{children}</body>
        </html>
    );
}
```

Finally, map our types in your `.tsconfig.json` file (this is a temporary workaround that we'll fix soon):

```json
{
    "paths": {
        "paris/*": ["./node_modules/paris/src/stories/*"]
    }
}
```

That's it! You can now import any component from Paris:

```tsx
import { Button } from 'paris/button';

const App = () => (
    <Button>Click me</Button>
);
```

This should work out of the box with Next.js, since it has built-in support for TypeScript and SCSS modules. If you're using another framework or bundler, you may need to configure it for generic SCSS support.
