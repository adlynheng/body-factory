# `components/ui/` — design-system primitives

Wrapped, app-styled primitives built on the design tokens (`styles/theme.css`)
and, where interaction is involved, on headless primitives (Base UI).

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
- Never import Base UI primitives directly in feature code — wrap them here.

**Base UI** (`@base-ui-components/react`, pinned to `1.0.0-rc.0`)

- Per-component subpath imports, then compound parts:
  `import { Switch } from '@base-ui-components/react/switch'` → `<Switch.Root>` /
  `<Switch.Thumb>`. `ToggleGroup` (array `value`, `multiple` for multi-select)
  pairs with `Toggle` items. `Popover`/`Dialog` use `Portal > Positioner > Popup`
  (Popover) / `Portal > Backdrop + Popup` (Dialog).
- State is exposed as boolean data-attributes — style with Tailwind
  `data-checked:` / `data-unchecked:` / `data-pressed:` / `data-invalid:` /
  `data-disabled:` (not Radix's `data-[state=…]`).
- Composition is via the **`render` prop** (a ReactElement or function), not
  Radix's `asChild`/Slot — e.g. `<Toolbar.Button render={<Button />} />`,
  `<Dialog.Trigger render={<Button />} />`. Base UI merges its behavior/props
  onto the rendered element.
- `Field` works **standalone** (no `Form` ancestor required); a `Form` only adds
  submit-level validation coordination. This is why `TextField` can be a proper
  field and still be droppable inline — the reason we moved off Radix (whose
  `Form.Control` throws without `Form.Root`).
- Base UI supplies **behavior only**; all appearance comes from our tokens.
- Base UI has no Button/Badge/Card primitive — those are plain semantic HTML +
  `cva` here, which is correct. Reach for Base UI only when a primitive has real
  interaction (open/close, selection, keyboard, focus management, validation).

Feature/domain components that _compose_ these primitives live in `features/`.
