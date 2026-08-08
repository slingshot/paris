---
"paris": patch
---

Bump `ts-deepmerge` from `^6.2.1` to `^8.0.0` to resolve a prototype method override DoS advisory (GHSA / Dependabot, moderate). v8 extends the merge deny-list beyond `__proto__`/`constructor`/`prototype` to also skip inherited method names such as `toString` and `valueOf`, and drops its default export in favour of a named one (the internal theme import was updated accordingly). `LightTheme` and `DarkTheme` output is unchanged; as a side effect of v8's deep-clone behaviour the two themes no longer share nested subtree object references.
