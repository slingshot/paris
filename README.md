# Paris

Paris is Slingshot's React design system, meant to work universally across server and client components. It's a collection of reusable components, design tokens, and guidelines for building consistent, accessible, and performant user interfaces.

Currently, Paris is provided as a set of *unbundled* `.tsx` components styled with SCSS modules. This means that you can import only the components you need, and you can use your own bundler to optimize your bundle size. As a result, Paris works best with frameworks like Next.js that have built-in support for TypeScript and SCSS modules.

Paris 1.x styling is heavily inspired by Uber's [Base Web](https://baseweb.design), which we previously used in our production apps. We built Paris because to move away from Styletron and CSS-in-JS, since we're now largely working with React 18, RSC, and the Next.js `app` directory.

## Getting started

First, install Paris and SASS in your project:

```bash
pnpm i paris sass
# or
yarn add paris sass
# or
npm i paris sass
```

Map our types in your `.tsconfig.json` file (this is a temporary workaround that we'll fix soon):
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
