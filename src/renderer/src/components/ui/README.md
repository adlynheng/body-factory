# `components/ui/` — design-system primitives

Wrapped, app-styled primitives built on the design tokens (`styles/theme.css`)
and, where interaction is involved, on headless primitives (Radix).

**Rules**

- Only design-system primitives live here — nothing feature-specific.
- Each primitive gets its own folder colocating the component, its `cva`
  variants, and derived types:

  ```
  ui/
    Button/
      Button.tsx      # component + cva variants + VariantProps types
      index.ts        # barrel export
  ```

- Style with token utilities (`bg-surface-card`, `text-text-secondary`,
  `rounded-card`), never raw hex/px.
- Compose classes with `cn()` from `lib/utils.ts`.
- Never import Radix primitives directly in feature code — wrap them here.

**Radix**

- We use the **unified `radix-ui` package** (not `@radix-ui/themes`, which is a
  styled kit and was removed): `import { Switch, ToggleGroup } from 'radix-ui'`,
  then `<Switch.Root>` / `<Switch.Thumb>` etc.
- Radix supplies **behavior only**; all appearance comes from our tokens.
- Radix has no Button/Badge/Card primitive — those are plain semantic HTML +
  `cva` here, which is correct. Reach for Radix only when a primitive has real
  interaction (open/close, selection, keyboard, focus management).

Feature/domain components that _compose_ these primitives live in `features/`.
