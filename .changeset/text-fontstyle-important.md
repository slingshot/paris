---
"paris": patch
---

`<Text fontStyle="italic">` is now reliably italic. Mirror the pattern already
used by weight classes and apply `!important` to `.fontStyle-*` rules.
Without it, the per-kind typography classes (e.g. `.paragraphSmall { font-style: normal }`,
emitted when consumers define per-style `font-style` theme variables) win
over `.fontStyle-italic` and suppress italic on `<Text>` and anything that
delegates to it — notably `<Markdown>` rendering `<em>`.
