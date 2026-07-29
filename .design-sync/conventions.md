## Building with Paris

Paris (Slingshot's design system) styles via **component props + CSS variables** — it is NOT a utility-class framework. There are no `bg-*`/`p-*`/`flex` classes to apply; never invent class names. Style in two ways:

**1. Configure components through their props** — each carries its own design language. Examples (always confirm against the bound `.d.ts` / `.prompt.md`):
- `<Button kind="primary|secondary|tertiary" size="large|medium|small|xs" shape="pill">`
- `<Callout variant="positive|negative|warning|default">`, `<Tag>`, `<Card>` (elevation variants)
- Typography is a component, not raw CSS: `<Text kind="displayLarge|headingLarge|bodyMedium|…" as="h1" weight="bold">` — `kind` is a typography style name. Prefer `<Text>` over hand-styling text.

Read `components/<group>/<Name>/<Name>.prompt.md` (usage + variants) and `<Name>.d.ts` (typed props with JSDoc) before composing — they are the contract.

**2. For your own layout glue, use Paris design tokens (CSS custom properties)** already present in the loaded `styles.css`. Reference them directly in `style={{…}}` or CSS:
- Color: `var(--pte-new-colors-contentPrimary)`, `…-contentSecondary`, `…-contentLink`, `…-backgroundPrimary`, `…-borderMedium`; raw palette `var(--pte-new-tokens-colors-grey500)`.
- Stacking: `var(--pte-new-layers-overlay)` (also `dropdown`, `popover`, `menu`, `sticky`).
- From JS, `window.Paris.pvar('new.colors.contentPrimary')` returns the same `var(--pte-…)` string.
- Paris ships **no spacing scale** — use plain px/rem for gaps and padding.

**Root wrapper:** mount into an element with `className="paris-container"` — components use container queries keyed to it. No React provider is needed; theming is pure CSS variables and the bound `styles.css` is already light-themed (it also carries the global preflight reset). To re-theme at runtime: `window.Paris.injectTheme(window.Paris.DarkTheme)`.

**Form inputs** (`Input`, `Select`, `Combobox`, `TextArea`) compose inside `<Field label description>` for consistent label / description / error handling.

```jsx
const { Field, Input, Button } = window.Paris;
ReactDOM.createRoot(document.getElementById('ds-root')).render(
  <div className="paris-container" style={{ display: 'grid', gap: 16, maxWidth: 360 }}>
    <Field label="Email" description="We'll never share it.">
      <Input placeholder="you@example.com" />
    </Field>
    <Button kind="primary" size="large">Submit</Button>
  </div>
);
```

**Truth lives in:** the loaded `styles.css` (its `@import` closure = component styles + theme tokens + fonts + preflight) and each component's `.prompt.md` + `.d.ts`.
