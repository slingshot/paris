# paris

## 0.9.1

### Patch Changes

- 525d2ff: feat: Add override props and make TextArea forward ref

## 0.9.0

### Minor Changes

- a8941e5: Tabs: color and styling updates, kind `full`, `barStyle` thick or thin, `backgroundStyle` with glass option
- ecd7deb: Theme: Revamped tokens and variables with updated structures, plus new materials and blurs
- a8941e5: Theme: updated “materials” variables, added accent glows to “lighting”
- a8941e5: Drawer: color and styling updates, new sizes `fullWithMargin` and `fullOnMobile` with tweaked `full` behavior, `bottomPanel` with glass material and removed padding, `additionalActions` available on paginated drawers, `overlayStyle` "greyed" renamed to "grey"
- a8941e5: Dialog: color and styling updates, `overlayStyle` with default `blur` and option `grey`
- a8941e5: Callout: color updates, default ArrowRight icon
- a8941e5: Tag: color and styling updates, `shape` prop for `square` variant with `icon`, `corners` prop for border and radius, planned`and`void`kinds,`colorLevel` to adjust color background
- a8941e5: Button: color updates, added `medium` size, `corners` prop for border-radius, removed `rounded` shape

### Patch Changes

- a8941e5: Accordion: color updates
- a8941e5: Styled Link: color updates
- a8941e5: Table: color and styling updates
- a8941e5: Toast: color updates
- a8941e5: Popover: color updates
- a8941e5: Checkbox: color updates
- a8941e5: Select: color and styling updates, fixed disabled states
- a8941e5: Menu: color updates
- a8941e5: TextArea: color updates, enhancer updates to match Input
- a8941e5: Card: color updates
- a8941e5: Avatar: color updates
- a8941e5: Combobox: color and styling updates
- a8941e5: Icon: `Check` and `ArrowRight`
- a8941e5: Input: color and styling updates, enhancer color states

## 0.8.22

### Patch Changes

- 0243ccb: fix(Field): Remove stopPropagation on Field component

## 0.8.21

### Patch Changes

- 5d2f644: Checkbox: fix label onClick
- 1476e89: Checkbox: default to `ParagraphXSmall` text styling for label when string is passed
- ed42d02: Button: honor passed `style` prop

## 0.8.20

### Patch Changes

- beb687f: Menu: add animations for menu items
- beb687f: Dropdowns: Light mode border style fixes

## 0.8.19

### Patch Changes

- 9ef8cb0: Menu: add z-index for MenuItems

## 0.8.18

### Patch Changes

- 3a29baf: Menu: update category
- e9d24cf: Icon: fix typings for `as` prop
- e9d24cf: StyledLink: fix typings for `as` prop
- 9b29f1d: Table: update docs to mention `cells` instead of `nodes` for `rowRenderFn`

## 0.8.17

### Patch Changes

- c1fd99a: feat(Tag): Add new Tag styling
- c1fd99a: feat: Update menu component to support new feature styling
- c1fd99a: chore: Update README typo
- c1fd99a: feat(Button): Add notification dot support

## 0.8.16

### Patch Changes

- 616d1e6: fix: Remove New Tag styling and add teal700

## 0.8.15

### Patch Changes

- 5e230d9: Add 'new' variant Tag

## 0.8.14

### Patch Changes

- effd11c: Adjust height of drawer header to design

## 0.8.13

### Patch Changes

- 74d5542: A bunch of minor changes and UI adjustments

## 0.8.12

### Patch Changes

- 9c1955b: Add emptyState render for Table when there are no rows to display

## 0.8.11

### Patch Changes

- 28104e0: feat(drawer): Make drawer overlay style default grey and adjust backgroundOverlayGrey color

## 0.8.10

### Patch Changes

- e9430ae: misc: Add maxHeight to Select dropdown, fix prop error, add menu to exports

## 0.8.9

### Patch Changes

- 0c812a0: input: Remove system end enhancer

## 0.8.8

### Patch Changes

- 568588a: menu: refactor and add documention

## 0.8.7

### Patch Changes

- c0ba653: feat: Add Menu component

## 0.8.6

### Patch Changes

- 64cf505: Use `dvh` instead of `vh` units

## 0.8.5

### Patch Changes

- 730f4ff: Checkbox: make label always clickable
- 0b20210: Select: use Transition div for parent positioning to avoid z-index issues
- 0b20210: Checkbox: revert temp z-index fix

## 0.8.4

### Patch Changes

- c0e8369: Checkbox: visual disabled state
- f3a8c6f: Checkbox: add `z-index: -1` to fix Select overlay bug

## 0.8.3

### Patch Changes

- 536f830: TextArea: default `rows` prop to 3

## 0.8.2

### Patch Changes

- 5206e66: Input, Select: `forwardRef`

## 0.8.1

### Patch Changes

- c3a5648: Allow for title in paginated drawer
- 963e618: Pagination: add `reset` function to reset the history state

## 0.8.0

### Minor Changes

- 9192ce2: Button: rename `hrefTarget` prop to `hreftarget` for React compatibility

### Patch Changes

- 30bb138: Accordion: allow uncontrolled state management

## 0.7.0

### Minor Changes

- 669cf98: `Avatar` component
- 669cf98: `Popover` component

### Patch Changes

- 669cf98: Icon: `Spinner`

## 0.6.1

### Patch Changes

- 5193149: Tabs: make controllable
- 2fd3be7: Drawer: bottom panel
- 8950299: Button: preset themes

## 0.6.0

### Minor Changes

- 0234060: StyledLink component
- 0234060: Accordion component
- 0234060: Avatar component
- 0234060: Toast component
- 516e8ec: Tag component

### Patch Changes

- 0234060: Callout component
- 516e8ec: Icon: Ellipsis icon
- 0234060: Various stylistic and positional fixes
- 516e8ec: Theme: `labelXXSmall` typography + `backgroundInverseWarning` color
- 516e8ec: Drawer: stylistic updates
- 8e959b8: Table: support `hideBelow` for `max-width` breakpoint hiding of columns
- 8e959b8: Tabs: add `compact` styling option

## 0.5.0

### Minor Changes

- 8de0fe5: Table component
- 73fb594: Tabs component

### Patch Changes

- 1f40b98: Text: add `!important` to ensure `weight` prop overrides other styles

## 0.4.5

### Patch Changes

- ecfd77e: Text: change fontWeights capitalizations

## 0.4.4

### Patch Changes

- fd52101: Explicitly define each component export in `package.json` for TypeScript support without needing a tsconfig update
- 94c847a: feat: Add weight and fontStyle props to Text component
- a90ddd3: Drawer: Add overlay greyed style option
  Field: Allow for custom label and description components to be passed as props

## 0.4.3

### Patch Changes

- 49f9ee4: Prop typing fixes

## 0.4.2

### Patch Changes

- 32e9050: Fix `Card` className prop

## 0.4.1

### Patch Changes

- 6d53d07: Separate `Tilt` from `Card`

## 0.4.0

### Minor Changes

- 0a23074: Allow rendering `Button`s as anchors by passing `href` prop
- 6e5ea2c: `Tilt` component
- 50ab5e3: `Icon` component for included icons
- 50ab5e3: `Drawer` component
- 6e5ea2c: `Card` component
- dcd9bb6: `Combobox` component
- 05903f0: `Checkbox` component
- b758949: `Dialog` component

### Patch Changes

- bbe60be: `Field` component for generic form fields with a label and description
- 50ab5e3: Drawer pagination
- bbe60be: Add label/description for Select
- 50ab5e3: Glassmorphic Dialog variant

## 0.3.0

### Minor Changes

- eef2375: `TextArea` component
- 2f6cd01: `Input` component
- eef2375: `Select` component

### Patch Changes

- b61e950: Use `clsx` for cleaner class names
- b61e950: Add `global.scss` file and update docs to reflect global styles import
- 16c9c3e: Update docs to specify transpile requirement
- 2f6cd01: Memoized enhancers
- 646fccf: Add `status` for `Input` for success/error styling
- b61e950: Have `Text` use the theme fontFamily instead of inheriting

## 0.2.2

### Patch Changes

- 0387f1d: Exclude unnecessary files from NPM package

## 0.2.1

### Patch Changes

- 9d791a6: Add more metadata to `package.json`

## 0.2.0

### Minor Changes

- 7b3a5fc: `Button` component
- d1630ec: `Text` component for typography and script for auto-generating typography CSS module + Storybook stories

### Patch Changes

- 4a3ecb1: Document tokens, update README and auto-import it to Welcome
- 6d358a4: Update proof-of-concept `Button` with `pte` theming
- 952ee38: Add `pte` for theming
- 3b46865: Circular colors on Tokens page
- 2059fea: Proper theme injection and updates across stories and docs
- 72875c5: Set up changesets & husky
