import {
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  BarbellIcon,
  CalendarBlankIcon,
  CalendarDotsIcon,
  CaretDownIcon,
  CaretLeftIcon,
  CaretRightIcon,
  CaretUpIcon,
  ChartLineUpIcon,
  CheckIcon,
  ClockIcon,
  DotsThreeIcon,
  DropIcon,
  FireIcon,
  GaugeIcon,
  GearSixIcon,
  HeartIcon,
  HeartbeatIcon,
  HockeyIcon,
  HouseIcon,
  LightningIcon,
  LinkSimpleIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  MinusIcon,
  MoonIcon,
  MountainsIcon,
  NoteIcon,
  PathIcon,
  PencilIcon,
  PersonSimpleRunIcon,
  PlusIcon,
  RepeatIcon,
  RulerIcon,
  ScalesIcon,
  SparkleIcon,
  SunIcon,
  TimerIcon,
  TrashIcon,
  TrendUpIcon,
  WindIcon,
  XIcon,
  type Icon as PhosphorIcon
} from '@phosphor-icons/react'

/**
 * Semantic icon registry.
 *
 * Feature code references icons by ROLE (`<Icon name="run" />`), never by
 * importing a Phosphor glyph directly — same wrap-don't-expose rule we apply to
 * headless primitives. Swapping the glyph for a role is a one-line change here
 * and every call site updates. Keys are grouped by domain; add new roles as
 * screens need them rather than reaching for a raw Phosphor import.
 */
export const iconRegistry = {
  // Navigation
  overview: HouseIcon,
  calendar: CalendarBlankIcon,
  template: CalendarDotsIcon,
  trends: ChartLineUpIcon,
  settings: GearSixIcon,

  // Activity types (mirror the session-type registry)
  run: PersonSimpleRunIcon,
  gym: BarbellIcon,
  floorball: HockeyIcon,
  misc: SparkleIcon,

  // Metrics
  distance: PathIcon,
  pace: GaugeIcon,
  duration: TimerIcon,
  time: ClockIcon,
  heartRate: HeartbeatIcon,
  calories: FireIcon,
  power: LightningIcon,
  elevation: MountainsIcon,
  cadence: WindIcon,
  hydration: DropIcon,
  weight: ScalesIcon,
  length: RulerIcon,

  // Integrations
  evolt: ScalesIcon,
  health: HeartIcon,

  // UI chrome
  add: PlusIcon,
  minus: MinusIcon,
  close: XIcon,
  check: CheckIcon,
  edit: PencilIcon,
  delete: TrashIcon,
  more: DotsThreeIcon,
  search: MagnifyingGlassIcon,
  repeat: RepeatIcon,
  location: MapPinIcon,
  note: NoteIcon,
  link: LinkSimpleIcon,
  trend: TrendUpIcon,
  light: SunIcon,
  dark: MoonIcon,

  // Directional
  arrowLeft: ArrowLeftIcon,
  arrowRight: ArrowRightIcon,
  arrowUp: ArrowUpIcon,
  arrowDown: ArrowDownIcon,
  caretLeft: CaretLeftIcon,
  caretRight: CaretRightIcon,
  caretUp: CaretUpIcon,
  caretDown: CaretDownIcon
} satisfies Record<string, PhosphorIcon>

export type IconName = keyof typeof iconRegistry
