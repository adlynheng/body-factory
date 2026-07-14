import { IconContext, type IconProps } from '@phosphor-icons/react'
import type { ReactNode } from 'react'
import { iconRegistry, type IconName } from './registry'

export interface IconOwnProps extends Omit<IconProps, 'ref'> {
  /** Semantic role name from the icon registry. */
  name: IconName
}

/**
 * Renders a registry glyph by its semantic role. Inherits size/weight/color
 * from the nearest `IconProvider` (or the ambient text color via `1em`) unless
 * overridden per-instance.
 */
export function Icon({ name, ...props }: IconOwnProps): ReactNode {
  const Glyph = iconRegistry[name]
  return <Glyph {...props} />
}

/**
 * App-wide icon defaults. Wraps Phosphor's IconContext so we set weight/size in
 * one place instead of per call site. `size="1em"` lets icons scale with the
 * surrounding font-size; `color="currentColor"` makes them inherit text color.
 */
export function IconProvider({ children }: { children: ReactNode }): ReactNode {
  return (
    <IconContext.Provider
      value={{ size: '1em', weight: 'regular', color: 'currentColor', mirrored: false }}
    >
      {children}
    </IconContext.Provider>
  )
}
