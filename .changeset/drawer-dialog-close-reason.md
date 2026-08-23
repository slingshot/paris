---
'paris': minor
---

`Drawer` and `Dialog` now report **why** they closed, and guarantee teardown.

`onClose` receives a second `details` argument carrying a `reason` of `'close-press'`, `'escape-key'`, `'backdrop-press'`, or `'imperative'`, so consumers can treat an incidental dismissal differently from a deliberate one — for example, keeping form state when a drawer is dismissed by Escape or a backdrop press, but resetting it when the close button is used:

```tsx
<Drawer
    isOpen={isOpen}
    onClose={() => setIsOpen(false)}
    onAfterClose={({ reason }) => {
        if (reason === 'escape-key' || reason === 'backdrop-press') return;
        form.reset(defaultValues);
    }}
>
```

Both components are fully controlled, so a close request can be blocked by simply not setting `isOpen` to `false` — useful for confirming an unsaved-changes discard before letting Escape close the panel.

`onAfterClose` now receives the same `details`, and is guaranteed to run exactly once per completed close. It still prefers the exit animation's completion, but also flushes on reopen, on unmount, and via a duration-based fallback, so an interrupted or skipped exit animation delays teardown rather than silently dropping it. `Dialog` gains `onAfterClose`, which it did not previously have.

Both changes are backwards compatible: existing `onClose` and `onAfterClose` handlers that ignore the new argument are unaffected.
