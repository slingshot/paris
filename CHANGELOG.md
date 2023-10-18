# paris

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
