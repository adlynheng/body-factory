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

Feature/domain components that _compose_ these primitives live in `features/`.
