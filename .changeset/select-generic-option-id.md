---
"paris": minor
---

Make `Select`, `Combobox`, and `AccordionSelect` generic over their option id type, in addition to the existing metadata type (`Option<T, Id>`). When `options` use literal ids, `value` and the selected option's `id` are typed as that union (autocomplete and narrowing). The id type parameter defaults to `string`, so existing usage and `string`-typed state are unaffected.
