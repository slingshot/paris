# Paris

Paris is Slingshot's React design system. It's a collection of reusable components, design tokens, and guidelines that help us build consistent, accessible, and performant user interfaces.

Currently, Paris is provided as a set of *unbundled* `.tsx` components styled with SCSS modules. This means that you can import only the components you need, and you can use your own bundler to optimize your bundle size. As a result, Paris works best with frameworks like Next.js that have built-in support for SCSS modules.

## Getting started

First, install Paris and SASS in your project:

```bash
pnpm i @ssh/paris sass
# or
yarn add @ssh/paris sass
# or
npm i @ssh/paris sass
```

Map our types in your `.tsconfig.json` file (this is a temporary workaround that we'll fix soon):
```json
{
    "paths": {
        "@ssh/paris/*": ["./node_modules/@ssh/paris/src/stories/*"]
    }
}
```

That's it! You can now import any component from Paris:

```tsx
import { Button } from '@ssh/paris/button';

const App = () => (
    <Button>Click me</Button>
);
```
